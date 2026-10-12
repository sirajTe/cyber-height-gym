// Shared marketing content (sample placeholders — replace with the gym's real prices, trainers and copy).
module.exports = {
  heroSlides: [
    { image: 'photo-1534438327276-14e5300c3a48', program: 'strength-training', kicker: 'Strength floor' },
    { image: 'photo-1599058917212-d750089bc07e', program: 'functional-hiit', kicker: 'Functional zone' },
    { image: 'photo-1541534741688-6078c6bfb5c5', program: 'personal-training', kicker: '1-on-1 coaching' },
  ],

  stats: [
    { value: 1500, suffix: '+', label: 'Active Members' },
    { value: 12, suffix: '', label: 'Certified Coaches' },
    { value: 40, suffix: '+', label: 'Classes Every Week' },
    { value: 18, suffix: ' hrs', label: 'Open Daily' },
  ],

  whyUs: [
    { icon: 'users', title: 'Certified Coaches', text: 'Every trainer holds a recognised certification (ACE, ACSM, K11 or equivalent) and is on the floor to help — not just to sell PT.' },
    { icon: 'gym', title: 'Premium Equipment', text: 'Commercial-grade racks, platforms, dumbbells to 50 kg, plate-loaded machines and a full functional zone.' },
    { icon: 'clock', title: 'Open 5 AM – 11 PM', text: 'Train before work, at lunch or late at night. Sunday mornings too.' },
    { icon: 'trending', title: 'Progress Tracking', text: 'Free body-composition scans every month so you can see fat lost and muscle gained.' },
    { icon: 'cafe', title: 'Nutrition Support', text: 'Practical, Indian-diet nutrition plans from our in-house nutritionist.' },
    { icon: 'shield', title: 'Clean & Safe', text: 'Equipment sanitised hourly, filtered drinking water, CCTV and separate changing rooms with lockers.' },
  ],

  facilities: ['gym', 'jogging', 'sports', 'spa', 'kids', 'parking', 'power', 'security', 'cafe', 'locker', 'shower', 'music'],

  plans: [
    { name: 'Monthly', price: 2499, per: 'month', months: 1, note: 'No long-term commitment',
      features: ['Full gym floor & cardio access', 'Group classes (HIIT, Zumba, Yoga)', 'Fitness assessment on joining', 'Locker & shower access'] },
    { name: 'Quarterly', price: 6499, per: '3 months', months: 3, tag: 'Most popular', note: 'Save 13%',
      features: ['Everything in Monthly', '2 personal-training sessions', 'Monthly body-composition scan', 'Basic diet plan'] },
    { name: 'Half-Yearly', price: 10999, per: '6 months', months: 6, note: 'Save 27%',
      features: ['Everything in Quarterly', '4 personal-training sessions', 'Customised diet plan', '15 days freeze'] },
    { name: 'Annual', price: 17999, per: '12 months', months: 12, tag: 'Best value', note: 'Save 40%',
      features: ['Everything in Half-Yearly', '8 personal-training sessions', 'Quarterly nutrition review', '30 days freeze', '1 free guest pass / month'] },
  ],

  ptPacks: [
    { name: '12 Sessions', price: 9999, note: '₹833 / session · valid 6 weeks' },
    { name: '24 Sessions', price: 17999, note: '₹750 / session · valid 10 weeks' },
    { name: '36 Sessions', price: 23999, note: '₹667 / session · valid 14 weeks' },
  ],

  trainers: [
    { slug: 'arjun-rana', name: 'Arjun Rana', role: 'Head Coach — Strength', image: 'photo-1581009146145-b5ef050c2e1e', exp: 9,
      specialties: ['Powerlifting', 'Strength & hypertrophy', 'Kickboxing'], certs: 'ACE-CPT · Precision Nutrition L1',
      bio: 'National-level powerlifter who has coached 400+ members through their first deadlift and beyond.' },
    { slug: 'neha-kapoor', name: 'Neha Kapoor', role: 'Strength & Conditioning Coach', image: 'photo-1594381898411-846e7d193883', exp: 6,
      specialties: ['Women\'s strength', 'Functional training', 'Post-natal fitness'], certs: 'ACSM-CPT · Kettlebell L2',
      bio: 'Specialises in helping women lift with confidence, from first session to first pull-up.' },
    { slug: 'vikas-yadav', name: 'Vikas Yadav', role: 'HIIT & Transformation Coach', image: 'photo-1567013127542-490d757e51fc', exp: 7,
      specialties: ['Fat loss', 'HIIT', 'Athletic conditioning'], certs: 'K11 Certified · CrossFit L1',
      bio: 'Runs our 12-Week Weight Loss programme; known for high-energy classes and tough-love accountability.' },
    { slug: 'priya-sharma', name: 'Priya Sharma', role: 'Yoga & Mobility Coach', image: 'photo-1575052814086-f385e2e2ad1b', exp: 8,
      specialties: ['Hatha & vinyasa', 'Mobility', 'Injury recovery'], certs: 'RYT-500 · FRC Mobility Specialist',
      bio: 'Helps lifters, runners and desk workers move without pain through yoga and mobility work.' },
    { slug: 'simran-kaur', name: 'Simran Kaur', role: 'Group Fitness & Nutrition', image: 'photo-1532384748853-8f54a8f476e2', exp: 5,
      specialties: ['Zumba', 'Cardio', 'Indian-diet nutrition'], certs: 'Zumba Licensed Instructor · Diploma in Nutrition',
      bio: 'Brings the party to every Zumba class and builds practical meal plans members actually stick to.' },
    { slug: 'rahul-mehta', name: 'Rahul Mehta', role: 'Personal Trainer', image: 'photo-1597452485669-2c7bb5fef90d', exp: 4,
      specialties: ['Muscle gain', 'Beginners', 'Machine training'], certs: 'ACE-CPT',
      bio: 'Patient, detail-focused coach who makes the gym feel welcoming for first-timers.' },
  ],

  testimonials: [
    { name: 'Rohit Malhotra', program: '12-Week Weight Loss', role: 'Member since 2024', image: 'photo-1500648767791-00dcc994a43e',
      quote: 'Lost 14 kg in twelve weeks without giving up ghar ka khana. Vikas checked in every single week — the accountability made all the difference.' },
    { name: 'Ananya Singh', program: 'Strength Training', role: 'Member since 2023', image: 'photo-1494790108377-be9c29b29330',
      quote: 'I was scared of the weights section. Six months later I deadlift 80 kg. The coaches here actually teach you.' },
    { name: 'Sameer Kapoor', program: 'Functional & HIIT', role: 'Member since 2025', image: 'photo-1507003211169-0a1dd7228f2d',
      quote: 'The 6:30 AM HIIT batch is the best start to my day. Great energy, great people, and I\'m fitter at 42 than I was at 30.' },
    { name: 'Priya Nair', program: 'Yoga & Mobility', role: 'Member since 2024', image: 'photo-1438761681033-6461ffad8d80',
      quote: 'Years of back pain from desk work — gone. Priya\'s mobility sessions are worth the membership alone.' },
  ],

  transformations: [
    { name: 'Rohit, 34', result: '−14 kg', weeks: 12, program: '12-Week Weight Loss', image: 'photo-1571019613454-1cb2f99b2d8b' },
    { name: 'Ananya, 29', result: '80 kg deadlift', weeks: 26, program: 'Strength Training', image: 'photo-1574680096145-d05b474e2155' },
    { name: 'Karan, 41', result: '−9% body fat', weeks: 16, program: 'Personal Training', image: 'photo-1546483875-ad9014c88eba' },
  ],

  // Weekly timetable. program = programme slug, trainer = trainer slug.
  schedule: {
    Monday: [
      { time: '06:30', program: 'functional-hiit', trainer: 'vikas-yadav' },
      { time: '07:30', program: 'yoga', trainer: 'priya-sharma' },
      { time: '18:00', program: 'strength-training', trainer: 'arjun-rana' },
      { time: '19:00', program: 'zumba-dance-fitness', trainer: 'simran-kaur' },
      { time: '20:00', program: 'kickboxing', trainer: 'arjun-rana' },
    ],
    Tuesday: [
      { time: '06:30', program: 'strength-training', trainer: 'neha-kapoor' },
      { time: '07:30', program: 'zumba-dance-fitness', trainer: 'simran-kaur' },
      { time: '18:00', program: 'functional-hiit', trainer: 'vikas-yadav' },
      { time: '19:00', program: 'yoga', trainer: 'priya-sharma' },
    ],
    Wednesday: [
      { time: '06:30', program: 'functional-hiit', trainer: 'vikas-yadav' },
      { time: '07:30', program: 'yoga', trainer: 'priya-sharma' },
      { time: '18:00', program: 'strength-training', trainer: 'arjun-rana' },
      { time: '19:00', program: 'zumba-dance-fitness', trainer: 'simran-kaur' },
      { time: '20:00', program: 'kickboxing', trainer: 'arjun-rana' },
    ],
    Thursday: [
      { time: '06:30', program: 'strength-training', trainer: 'neha-kapoor' },
      { time: '07:30', program: 'zumba-dance-fitness', trainer: 'simran-kaur' },
      { time: '18:00', program: 'functional-hiit', trainer: 'vikas-yadav' },
      { time: '19:00', program: 'yoga', trainer: 'priya-sharma' },
    ],
    Friday: [
      { time: '06:30', program: 'functional-hiit', trainer: 'vikas-yadav' },
      { time: '07:30', program: 'yoga', trainer: 'priya-sharma' },
      { time: '18:00', program: 'strength-training', trainer: 'neha-kapoor' },
      { time: '19:00', program: 'zumba-dance-fitness', trainer: 'simran-kaur' },
    ],
    Saturday: [
      { time: '07:00', program: 'functional-hiit', trainer: 'vikas-yadav' },
      { time: '08:00', program: 'strength-training', trainer: 'arjun-rana' },
      { time: '09:00', program: 'yoga', trainer: 'priya-sharma' },
      { time: '17:00', program: 'kickboxing', trainer: 'arjun-rana' },
    ],
    Sunday: [
      { time: '08:00', program: 'yoga', trainer: 'priya-sharma' },
      { time: '09:00', program: 'zumba-dance-fitness', trainer: 'simran-kaur' },
    ],
  },

  timeline: [
    { year: '2020', title: 'Doors open', text: 'Cyber Heights Gym opens in Gurugram with a strength floor and a handful of founding members.' },
    { year: '2021', title: 'Group classes', text: 'Launched HIIT, Zumba and Yoga studios with a full weekly timetable.' },
    { year: '2023', title: 'Functional zone', text: 'Added turf, sleds, ropes and rigs for functional and athletic training.' },
    { year: '2024', title: 'Nutrition desk', text: 'In-house nutritionist and monthly body-composition scans for every member.' },
    { year: '2025', title: '1,500 members', text: 'Crossed 1,500 active members and 12 certified coaches.' },
  ],

  jobs: [
    { title: 'Personal Trainer', dept: 'Coaching', location: 'Gurugram', type: 'Full-time', exp: '2–5 years' },
    { title: 'Group Fitness Instructor (Zumba / HIIT)', dept: 'Coaching', location: 'Gurugram', type: 'Part-time', exp: '1–3 years' },
    { title: 'Membership Sales Executive', dept: 'Sales', location: 'Gurugram', type: 'Full-time', exp: '1–4 years' },
    { title: 'Front Desk Executive', dept: 'Operations', location: 'Gurugram', type: 'Full-time', exp: '0–2 years' },
  ],

  faqs: [
    { q: 'Is the free trial really free?', a: 'Yes. Book a free one-day trial, train with a coach and try any class on the timetable. No payment details needed.' },
    { q: 'Is there a joining or registration fee?', a: 'No joining fee on quarterly, half-yearly and annual plans. Monthly plans have a one-time ₹500 registration fee.' },
    { q: 'Can I freeze my membership?', a: 'Half-yearly plans include 15 days of freeze and annual plans 30 days — useful for travel or illness.' },
    { q: 'Do you have separate changing rooms and lockers?', a: 'Yes — separate men\'s and women\'s changing rooms with showers and lockers.' },
    { q: 'Is parking available?', a: 'Yes, free parking for members while they train.' },
    { q: 'Can I pay in instalments?', a: 'Annual and half-yearly plans can be paid in no-cost EMIs on most credit cards. Ask at the front desk.' },
  ],
};
