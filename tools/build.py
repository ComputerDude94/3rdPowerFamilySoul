#!/usr/bin/env python3
"""Builds the Cloudflare Worker (tools/out/worker.js) that serves the site.
Usage: python3 tools/build.py [--no-snapshot]
Env:   SITE_URL  public address of the site (default: the workers.dev address)
"""
import os, sys, json, base64, hashlib, subprocess, re, datetime
from zoneinfo import ZoneInfo
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(ROOT, 'tools', 'out'); os.makedirs(OUT, exist_ok=True)
os.chdir(ROOT)
SITE = os.environ.get('SITE_URL', 'https://3rd-power-family-soul.thetoptenfotography.workers.dev/')
OLD = 'https://3rd-power-family-soul.thetoptenfotography.workers.dev/'
USE_SNAP = '--no-snapshot' not in sys.argv and os.path.exists(os.path.join(OUT, 'snapshot.json'))

mt = {'.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8','.js':'application/javascript; charset=utf-8','.svg':'image/svg+xml','.txt':'text/plain; charset=utf-8','.xml':'application/xml','.png':'image/png','.jpg':'image/jpeg','.jpeg':'image/jpeg','.webp':'image/webp'}
files = ['index.html','styles.css','script.js','data.js','favicon.svg','apple-touch-icon.png','robots.txt','sitemap.xml','og-image.png']
site = {'/'+f: f for f in files}
for f in os.listdir('images'):
    if os.path.splitext(f)[1] in mt: site['/images/'+f] = 'images/'+f

band = json.loads(subprocess.check_output(['node','-e',"global.window={};require('./data.js');console.log(JSON.stringify(window.BAND))"]))
tz = ZoneInfo('America/New_York'); today = datetime.date.today().isoformat()

def events_jsonld():
    out = []
    for s in band['shows']:
        if s['date'] < today: continue
        st = datetime.datetime.fromisoformat(f"{s['date']}T{s['start']}").replace(tzinfo=tz)
        en = datetime.datetime.fromisoformat(f"{s['date']}T{s['end']}").replace(tzinfo=tz)
        addr = {"@type":"PostalAddress","addressRegion":"PA","addressCountry":"US"}
        if s.get('city'): addr["addressLocality"] = s['city'].split(',')[0].strip()
        if s.get('address'): addr["streetAddress"] = s['address'].split(',')[0].strip()
        out.append({"@context":"https://schema.org","@type":"MusicEvent","name":f"3rd Power Family Soul live at {s['venue']}",
            "description":"Live funk, soul, R&B, jazz, rock and disco dance band.",
            "startDate":st.isoformat(),"endDate":en.isoformat(),
            "eventStatus":"https://schema.org/EventScheduled","eventAttendanceMode":"https://schema.org/OfflineEventAttendanceMode",
            "location":{"@type":"Place","name":s['venue'],"address":addr},
            "image":[SITE+"og-image.png"],"url":SITE+"#shows",
            "performer":{"@type":"MusicGroup","name":"3rd Power Family Soul","url":SITE}})
    return out

def inject(html, id_, inner):
    pat = re.compile(r'(<(\w+)[^>]*\bid="%s"[^>]*>)(</\2>)' % re.escape(id_))
    return pat.sub(lambda m: m.group(1)+inner+m.group(3), html, count=1)

snap = json.load(open(os.path.join(OUT,'snapshot.json'))) if USE_SNAP else {}
ver = hashlib.sha1(b''.join(open(f,'rb').read() for f in ['styles.css','script.js','data.js'])).hexdigest()[:8]
m = {}
for p, f in site.items():
    ext = os.path.splitext(f)[1]; isbin = ext in ('.png','.jpg','.jpeg','.webp')
    if isbin: m[p] = {'t':mt[ext],'b':base64.b64encode(open(f,'rb').read()).decode(),'x':1}
    else:
        txt = open(f, encoding='utf-8').read().replace(OLD, SITE)
        if p == '/index.html':
            for a in ['styles.css','script.js','data.js']: txt = txt.replace(f'"{a}"', f'"{a}?v={ver}"')
            for id_, inner in snap.items(): txt = inject(txt, id_, inner)
            if snap: txt = txt.replace('id="story" class="story reveal" hidden','id="story" class="story reveal"')
            ev = '\n'.join(f'  <script type="application/ld+json">{json.dumps(e, ensure_ascii=False)}</script>' for e in events_jsonld())
            txt = txt.replace('</head>', ev + '\n</head>', 1)
        if p == '/sitemap.xml': txt = re.sub(r'<changefreq>', f'<lastmod>{today}</lastmod><changefreq>', txt, count=1)
        m[p] = {'t':mt[ext],'b':txt}
    if ext == '.css' or p in ('/script.js','/data.js'): m[p]['c'] = 'public, max-age=31536000, immutable'
    elif p == '/index.html': m[p]['c'] = 'no-cache'; m[p]['e'] = '"'+hashlib.sha1(m[p]['b'].encode()).hexdigest()[:16]+'"'
    elif p in ('/robots.txt','/sitemap.xml'): m[p]['c'] = 'public, max-age=3600'
    else: m[p]['c'] = 'public, max-age=86400'

nf = '<!DOCTYPE html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex"><title>Page not found | 3rd Power Family Soul</title><style>body{margin:0;min-height:100vh;display:grid;place-items:center;background:#0b0c10;color:#f3ede2;font-family:Georgia,serif;text-align:center}a{color:#c9a85c}h1{font-size:3rem;margin:0}p{color:#a8a396;font-family:system-ui,sans-serif}</style></head><body><div><h1>Off the setlist</h1><p>We couldn\'t find that page.</p><p><a href="/">Back to 3rd Power Family Soul</a></p></div></body></html>'
worker = 'const S='+json.dumps(m)+';\nconst NF='+json.dumps(nf)+r''';
const CSP="default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src https://fonts.gstatic.com; img-src 'self' data: https://i.ytimg.com; frame-src https://www.youtube-nocookie.com; connect-src 'self' https:; object-src 'none'; base-uri 'self'; form-action 'self'; frame-ancestors 'none'";
const H={"content-security-policy":CSP,"x-content-type-options":"nosniff","referrer-policy":"strict-origin-when-cross-origin","x-frame-options":"DENY","permissions-policy":"camera=(), microphone=(), geolocation=()","strict-transport-security":"max-age=31536000"};
export default{async fetch(r){let p=new URL(r.url).pathname;if(p==="/")p="/index.html";const f=S[p];
if(!f)return new Response(NF,{status:404,headers:{...H,"content-type":"text/html; charset=utf-8","cache-control":"no-cache"}});
const h={...H,"content-type":f.t,"cache-control":f.c};if(f.e)h.etag=f.e;
if(f.e&&r.headers.get("if-none-match")===f.e)return new Response(null,{status:304,headers:h});
const body=f.x?Uint8Array.from(atob(f.b),c=>c.charCodeAt(0)):f.b;
return new Response(body,{headers:h})}};'''
for n in ('worker.js','worker.mjs'): open(os.path.join(OUT,n),'w').write(worker)
print('built', 'with snapshot' if snap else 'no snapshot', '| events:', len(events_jsonld()), '| version', ver)
