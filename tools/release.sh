#!/usr/bin/env bash
# Build + prerender + deploy the site to Cloudflare Workers.
# Needs: CLOUDFLARE_ACCOUNT_ID (and CLOUDFLARE_API_TOKEN unless the environment injects it).
set -euo pipefail
cd "$(dirname "$0")/.."
rm -f tools/out/snapshot.json
python3 tools/build.py --no-snapshot
node tools/serve.mjs & SRV=$!; sleep 1.5
node tools/prerender.js http://localhost:8787/ tools/out/snapshot.json
kill $SRV
python3 tools/build.py
[ "${1:-}" = "--no-deploy" ] && { echo "built only (no deploy)"; exit 0; }
AUTH=(); [ -n "${CLOUDFLARE_API_TOKEN:-}" ] && AUTH=(-H "Authorization: Bearer $CLOUDFLARE_API_TOKEN")
curl -s -X PUT "https://api.cloudflare.com/client/v4/accounts/$CLOUDFLARE_ACCOUNT_ID/workers/scripts/3rd-power-family-soul" "${AUTH[@]}" \
  -F 'metadata={"main_module":"worker.js","compatibility_date":"2025-01-01"};type=application/json' \
  -F "worker.js=@tools/out/worker.js;filename=worker.js;type=application/javascript+module" | python3 -c "import sys,json;r=json.load(sys.stdin);print('deployed',r['success'],r.get('errors'))"
