// ============================================================
//  EDIT THIS FILE to update the website. No other file needs touching.
//  Everything marked PLACEHOLDER should be replaced with real info.
// ============================================================
window.BAND = {
  name: "3rd Power Family Soul",
  tagline: "Lancaster, PA's feel-good soul band",
  about:
    "3rd Power Family Soul is a high-energy, interactive cover band from Lancaster, PA. They play feel-good funk, soul, R&B, jazz, rock 'n' roll and disco — from Kool & the Gang and James Brown to Chaka Khan, Parliament Funkadelic and The Rolling Stones — with lively crowd participation and spirited performances. Regulars around Lancaster County, including Honey Brook's Concerts in the Park, Dirty Ol' Tavern, Stoner Grille and McCleary's Public House.",
  // Where booking requests are emailed. REPLACE with the band's real email.
  email: "booking@example.com" /* TODO: your message was cut off before the email — replace */,
  phone: "(717) 598-5441",
  facebook: "https://www.facebook.com/share/1FxFtpkFde/",
  facebook2: "https://www.facebook.com/share/1NRHupTZME/",
  // Optional: paste a Formspree/Getform URL here to receive bookings by form
  // instead of the visitor's email app. Leave "" to use email.
  formEndpoint: "",
  youtube: "https://www.youtube.com/results?search_query=3rd+Power+Family+Soul",
  artists: ["Kool & the Gang","James Brown","Chaka Khan","Parliament Funkadelic","The Rolling Stones"],
  genres: ["Funk","Soul","R&B","Jazz","Rock 'n' Roll","Disco"],
  eventTypes: [
    { icon: "♥", title: "Weddings", text: "Keep the dance floor full from the first dance to the last song." },
    { icon: "★", title: "Festivals & Parks", text: "Big, interactive crowd energy for community concerts and outdoor events." },
    { icon: "♪", title: "Bars & Venues", text: "A feel-good night of classic grooves your regulars will come back for." },
    { icon: "◆", title: "Private & Corporate", text: "Birthdays, anniversaries, fundraisers and company parties." }
  ],
  // EDIT these answers to match how the band really works.
  faq: [
    { q: "How far ahead should we book?", a: "As early as you can — green dates on the calendar are open, and weekends go first. Send a request and we'll confirm quickly." },
    { q: "Where do you play?", a: "Lancaster County and surrounding Pennsylvania communities. Playing farther out? Just ask." },
    { q: "What kind of music do you play?", a: "Funk, soul, R&B, jazz, rock 'n' roll and disco covers — Kool & the Gang, James Brown, Chaka Khan, Parliament Funkadelic, The Rolling Stones and more." },
    { q: "Can we request songs?", a: "Absolutely. Add requests in the booking form and we'll build the night around your crowd." }
  ],
  members: [
    { name: "Diane Yates", role: "Lead Vocals" },
    { name: "Efrem Yates", role: "Lead Guitar" },
    { name: "Mike Smith", role: "Bass Guitar (Founder)" },
    { name: "Bill Leporte", role: "Keyboards" },
    { name: "Derrick Wright", role: "Drums" }
  ],
  // Photos: drop image files in /images and list them here.
  // Entries starting with "images/placeholder" are stand-ins.
  photos: [
    { src: "images/placeholder-1.svg", alt: "Band portrait" },
    { src: "images/placeholder-2.svg", alt: "Live on stage" },
    { src: "images/placeholder-3.svg", alt: "Crowd dancing" },
    { src: "images/placeholder-4.svg", alt: "Group photo" },
    { src: "images/placeholder-5.svg", alt: "Backstage" },
    { src: "images/placeholder-6.svg", alt: "Soundcheck" }
  ],
  // Public shows — where to see them. Date format YYYY-MM-DD.
  shows: [
    { date: "2026-12-05", time: "8:00 PM", venue: "PLACEHOLDER Venue", city: "Lancaster, PA", note: "Public show" },
    { date: "2026-12-19", time: "9:00 PM", venue: "PLACEHOLDER Venue", city: "Lancaster, PA", note: "Holiday party" },
    { date: "2026-12-31", time: "9:30 PM", venue: "PLACEHOLDER Venue", city: "Lancaster, PA", note: "New Year's Eve" },
    { date: "2027-01-16", time: "8:00 PM", venue: "PLACEHOLDER Venue", city: "Lititz, PA", note: "Public show" }
  ],
  // Dates marked OPEN for booking. Any date not listed here or in shows
  // is treated as "ask us" (not shown as open).
  openDates: [
    "2026-11-28", "2026-12-12", "2026-12-26",
    "2027-01-02", "2027-01-09", "2027-01-23", "2027-01-30",
    "2027-02-06", "2027-02-13", "2027-02-20", "2027-02-27",
    "2027-03-06", "2027-03-13", "2027-03-20", "2027-03-27"
  ],
  // Dates already taken by private events (shown as "Booked", no details).
  bookedDates: ["2026-12-04", "2026-12-18", "2027-01-15"]
};
