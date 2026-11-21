// ============================================================
//  EDIT THIS FILE to update the website. No other file needs touching.
// ============================================================
window.BAND = {
  name: "3rd Power Family Soul",
  tagline: "The Ultimate Dance Band",
  slogan: "Let's dance! All the hits! All the time!",
  about:
    "3rd Power Family Soul is The Ultimate Dance Band — a high-energy, interactive group from Lancaster, PA playing funk, soul, R&B, jazz, rock 'n' roll and disco. All the hits, all the time, with lively crowd participation. Regulars around Lancaster County, including Dirty Ol' Tavern, Stoner Grille and Marion Court, plus community events and private parties.",
  email: "eyates717@comcast.net",
  phone: "(717) 598-5441",
  facebook: "https://www.facebook.com/share/1FxFtpkFde/",
  facebook2: "https://www.facebook.com/share/1NRHupTZME/",
  youtube: "https://www.youtube.com/results?search_query=3rd+Power+Family+Soul",
  // Booking requests are sent through FormSubmit.co to the band email (with a CC to the client). Set to "" to use the visitor's email app instead.
  formEndpoint: "https://formsubmit.co/ajax/eyates717@comcast.net",
  genres: ["Funk", "Soul", "R&B", "Jazz", "Rock 'n' Roll", "Disco"],
  eventTypes: [
    { icon: "♥", title: "Weddings", text: "Keep the dance floor full from the first dance to the last song." },
    { icon: "★", title: "Festivals & Parks", text: "Big, interactive crowd energy for community concerts and outdoor events." },
    { icon: "♪", title: "Bars & Venues", text: "A feel-good night of classic grooves your regulars will come back for." },
    { icon: "◆", title: "Private & Corporate", text: "Birthdays, anniversaries, fundraisers and company parties." }
  ],
  faq: [
    { q: "How far ahead should we book?", a: "As early as you can — green dates on the calendar are open, and weekends go first. Send a request and we'll confirm quickly." },
    { q: "Where do you play?", a: "Lancaster County and surrounding Pennsylvania communities. Playing farther out? Just ask." },
    { q: "What do you play?", a: "Dance-floor hits in funk, soul, R&B, jazz, rock 'n' roll and disco — check the song list above to see if your favorite is on it." },
    { q: "Can we request songs?", a: "Absolutely. Add requests in the booking form and we'll build the night around your crowd." }
  ],
  members: [
    { name: "Diane J. Yates", nick: "Mama'san", role: "Lead Vocals",
      bio: "Mama'san, a queen in her own right, delivers funky, soulful vocal riffs of R&B and soul while keeping the sultry, smooth sound of the ladies who came before her. It's no wonder the crowds love her: she electrifies the audience with crowd-pleasing lyrics and welcomes everyone into her world. She has been entertaining fans, friends and family for decades — the quintessential R&B and soul vocalist, laying the foundation for generations to come. Loyal and in charge.",
      quote: "" },
    { name: "Efrem Yates", nick: "", role: "Guitar & Background Vocals",
      bio: "Efrem has been bringing the chops and rhythm of the guitar groove to his fans for quite some time. Heavily influenced by the sounds of the '70s and '80s, his passion lets his syncopated rhythms and chops breathe life into the music, taking it to the next level when you least expect it.",
      quote: "There are no small parts, only great music." },
    { name: "Mike Smith", nick: "Blak N. Stein", role: "Bass & Vocals · Founder",
      bio: "Founder of 3rd Power Family Soul, Mike is an accomplished musician, composer and funk master. His lineage spans years of timeless passion passed down from his musical family. His first love was drums, which soon evolved into bass, heavily influenced by greats like Marcus Miller and Stanley Clarke. His brilliant style and uncompromising creativity invoke the sounds of an era that is as relevant today as it was then.",
      quote: "It's not a pastime, it's a way of life." },
    { name: "Derrick Wright", nick: "Biszbeatz", role: "Drums",
      bio: "BiszBeatz is definitely “on the one,” bringing that feel-good flavor that only lives deep in the pocket. It's not an exact science, but when it happens, everyone knows it. Teaming up with his bassist and choosing his moments, he gives the music a magical new groove — sustaining, inspiring and downright funky. His roots began in the Church of God in Christ (COGIC), where there was no shortage of talent, and he was greatly influenced by greats like Billy Cobham and Buddy Rich.",
      quote: "" },
    { name: "Bill Leporte", nick: "Dollar", role: "Keyboards",
      bio: "“Dollar Bill” is charismatic and energetic — a New York native with what it takes to rock the house.",
      quote: "" }
  ],
  // Songs the band plays (the site shows a search box so clients can check their favorites).
  songs: ["Shining Star","September","Celebration","Get Down On It","Ladies Night","Rock Steady","Good Times / Rapper's Delight","Angel","Clean Up Woman","Tonight Is the Night","Boogie Oogie Oogie","Use Me","I Know You Got Soul","What You Won't Do for Love","Disco Jazz","Got to Be Real","Freak Out","I'll Be Around","Easy","Brick House","I'm Coming Out","Bad Girls","Shame","My Girl","Just My Imagination","Can't Get Next to You","Shake","Outstanding","Funky Sensation","Always and Forever","Do Your Thang","The Big Payback","Soul Power / Sex Machine","Mr. Big Stuff","Golden","Somebody Else's Guy","A Real Mother for Ya","Get Down Tonight","Love Calls","Valerie","Inner City Blues","What's Going On","Ascension","Ain't No Stoppin' Us Now","Workin' Day and Night","Mary Jane","Miss You","Car Wash","Sweet Thing","Superstition","Just Be Thankful","I Can't Go for That"],
  songsNote: "3rd Power Family Soul does not own the rights to these songs.",
  // Community — shown in the "In Our Community" section.
  community: ["Sun Valley Campground — Narvon, PA", "AMVETS", "American Legion", "Lancaster City — Mayor Sorace", "Private parties & celebrations"],
  // VIDEOS: paste the 11-character YouTube ID (the part after youtu.be/). Add up to 3.
  videos: [
    { id: "YeJzHs0a6GE", title: "3rd Power Family Soul — live" },
    { id: "QvDGFPohmMw", title: "3rd Power Family Soul — live" }
  ],
  story: "3rd Power Family Soul was founded by bassist Mike Smith and brings together five musicians with one goal: get everybody on their feet. Diane Yates leads on vocals, Efrem Yates is on guitar, Bill Leporte is on keys and Derrick Wright keeps the groove on drums. Come say hello between sets — we love meeting the crowd.",
  signoff: "Diane, Efrem, Mike, Bill & Derrick",
  groupPhoto: "",
  photos: [
    { src: "images/band-wall.jpg", alt: "The five members of 3rd Power Family Soul posing together against a stone wall", w: 493, h: 405 },
    { src: "images/band-walking.jpg", alt: "3rd Power Family Soul walking toward the camera on a rooftop", w: 547, h: 365 }
  ],
  // SHOWS: date YYYY-MM-DD, start/end 24h, time = text shown, address optional (used for Directions).
  showLimit: 5, // how many upcoming shows to list before "Show all" (the calendar always shows every date)
  shows: [
    { date: "2026-12-12", start: "20:30", end: "22:45", time: "8:30 – 10:45 PM", venue: "Stoner Grille", city: "Lancaster, PA", address: "", note: "" },
    { date: "2027-01-22", start: "20:30", end: "23:00", time: "8:30 – 11:00 PM", venue: "Stoner Grille", city: "Lancaster, PA", address: "", note: "" },
    { date: "2027-03-05", start: "17:30", end: "21:00", time: "5:30 – 9:00 PM", venue: "Marion Court", city: "Lancaster, PA", address: "", note: "" },
    { date: "2027-03-27", start: "21:00", end: "23:00", time: "9:00 – 11:00 PM", venue: "Dirty Ol' Tavern", city: "Lancaster, PA", address: "917 S Prince St, Lancaster, PA", note: "" },
    { date: "2027-06-12", start: "20:30", end: "23:00", time: "8:30 – 11:00 PM", venue: "Stoner Grille", city: "Lancaster, PA", address: "", note: "" },
    { date: "2027-06-19", start: "18:00", end: "21:30", time: "6:00 – 9:30 PM", venue: "Marion Court", city: "Lancaster, PA", address: "", note: "" },
    { date: "2027-07-24", start: "21:00", end: "23:00", time: "9:00 – 11:00 PM", venue: "Dirty Ol' Tavern", city: "Lancaster, PA", address: "917 S Prince St, Lancaster, PA", note: "" },
    { date: "2027-09-18", start: "20:30", end: "23:00", time: "8:30 – 11:00 PM", venue: "Stoner Grille", city: "Lancaster, PA", address: "", note: "" },
    { date: "2027-10-23", start: "21:00", end: "23:00", time: "9:00 – 11:00 PM", venue: "Dirty Ol' Tavern", city: "Lancaster, PA", address: "917 S Prince St, Lancaster, PA", note: "" },
    { date: "2027-11-19", start: "17:30", end: "21:00", time: "5:30 – 9:00 PM", venue: "Marion Court", city: "Lancaster, PA", address: "", note: "" },
    { date: "2027-12-17", start: "20:30", end: "23:00", time: "8:30 – 11:00 PM", venue: "Stoner Grille", city: "Lancaster, PA", address: "", note: "" }
  ],
  openByDefault: true, // any future date that is not a show or in bookedDates can be requested
  openDates: [],
  bookedDates: [] // add private-event dates here as "YYYY-MM-DD" so they show as Booked
};
