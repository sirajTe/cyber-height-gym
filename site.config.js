// Global site settings. Change the brand, contact details, hours and lead endpoint here.
// NOTE: phone, WhatsApp, email and address below are PLACEHOLDERS — replace them with the gym's real details.
module.exports = {
  name: 'Cyber Heights Gym',
  shortName: 'Cyber Heights',
  // Two-line wordmark shown next to the logo symbol
  logoTop: 'CYBER HEIGHTS',
  logoBottom: 'GYM',
  legalName: 'Cyber Heights Gym',
  tagline: 'Train harder. Rise higher.',
  city: 'Gurgaon',
  // Absolute production URL (no trailing slash) — used for canonical tags, sitemap and schema.
  url: 'https://www.cyberheightsgym.example',
  founded: 2020,
  phone: '+91 90000 00000',
  phoneRaw: '+919000000000',
  whatsapp: '919000000000', // country code + number, digits only
  email: 'hello@cyberheightsgym.example',
  careersEmail: 'careers@cyberheightsgym.example',
  // Opening hours — shown in the header strip, contact page, footer and LocalBusiness schema.
  hours: [
    { days: 'Mon – Sat', open: '05:00', close: '23:00', label: '5:00 AM – 11:00 PM', schemaDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'] },
    { days: 'Sunday', open: '07:00', close: '13:00', label: '7:00 AM – 1:00 PM', schemaDays: ['Sunday'] },
  ],
  offices: [
    { name: 'Cyber Heights Gym', address: 'Gurugram, Haryana', phone: '+91 90000 00000' },
  ],
  social: {
    instagram: 'https://instagram.com/',
    facebook: 'https://facebook.com/',
    youtube: 'https://youtube.com/',
  },
  // POST endpoint for every lead form — the FastAPI backend in /backend.
  // Override at build time: LEAD_ENDPOINT=https://api.yourdomain.com/api/leads npm run build
  // Set LEAD_ENDPOINT="" to fall back to saving leads in the browser's localStorage (offline demo).
  leadEndpoint: process.env.LEAD_ENDPOINT ?? 'http://localhost:8003/api/leads',
  // Seconds before the free-trial popup appears (also triggers on exit intent on desktop). Shows once per session.
  popupDelay: 20,
};
