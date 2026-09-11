export const INITIAL_DOCTOR_PROFILE = {
  name: 'Dr. Sharma',
  fullName: 'Dr. S. Sharma',
  title: 'Veterinarian',
  role: 'Senior Veterinary Medical Officer',
  registrationNo: 'VCI-MP-4921',
  block: 'Sehore District & Rampur Cluster',
  phone: '+91 7562 224190',
  email: 'dr.sharma.vet@mp.gov.in',
  avatar: '/images/dr_sharma.jpg',
  stats: {
    animalsInJurisdiction: 24,
    treatedThisMonth: 18,
    activePatients: 12,
    scheduledVisits: 5
  }
};

export const INITIAL_DOCTOR_PATIENTS = [
  {
    id: 1,
    tag_id: 'TAG-8A21F3C2',
    name: 'Gauri',
    animal_type: 'Cow',
    age: 3.5,
    gender: 'Female',
    image: '/images/cow1.png',
    owner_name: 'Ram Kishan',
    owner_phone: '9876543210',
    village: 'Rampur',
    district: 'Sehore (MP)',
    distance: '2 km away',
    priority: 'High Priority',
    status: 'Needs Treatment',
    reported_at: '12 Sep 2024, 10:30 AM',
    reported_issue: 'Cow is not eating properly since 2 days. Looks weak and has lumps on the skin. Please check and suggest treatment.',
    images: [
      '/images/cow1.png',
      '/images/cow4.png'
    ],
    audio_note: {
      duration: '00:28',
      transcript: 'She is not eating and looks very dull since yesterday.'
    },
    location: {
      address: 'Rampur, Sehore (MP)',
      distance: '2 km away',
      latitude: 23.2031,
      longitude: 77.0844
    },
    previous_notes: 'Animal had mild skin infection earlier. Responded well to treatment.',
    scheduled_visit: {
      date: '14 Sep 2024',
      time: '10:00 AM',
      note: 'Priority case for Lumpy Skin evaluation. Carry Oxytetracycline and antiseptic dressing.'
    },
    medical_history: [
      { id: 'h1', date: '18 Aug 2024', title: 'Deworming', description: 'Routine deworming, Albendazole' },
      { id: 'h2', date: '05 Jun 2024', title: 'Fever Treatment', description: 'High fever, injection and antibiotics' },
      { id: 'h3', date: '12 Feb 2024', title: 'Regular Checkup', description: 'General health check, vaccinated' },
      { id: 'h4', date: '10 Nov 2023', title: 'Skin Infection', description: 'Treated with topical medication' }
    ]
  },
  {
    id: 2,
    tag_id: 'TAG-3D71E9F0',
    name: 'Rani',
    animal_type: 'Cow',
    age: 2.0,
    gender: 'Female',
    image: '/images/cow2.png',
    owner_name: 'Sita Bai',
    owner_phone: '9823456781',
    village: 'Kheda',
    district: 'Sehore (MP)',
    distance: '5 km away',
    priority: 'Moderate',
    status: 'Needs Treatment',
    reported_at: '12 Sep 2024, 08:45 AM',
    reported_issue: 'Mild fever and watery eyes after grazing in open rain.',
    images: ['/images/cow2.png'],
    audio_note: {
      duration: '00:15',
      transcript: 'Rani has watery discharge from eyes and slight shivering.'
    },
    location: {
      address: 'Sita Bai, Kheda (MP)',
      distance: '5 km away',
      latitude: 23.2145,
      longitude: 77.0982
    },
    previous_notes: 'Heifer received routine calcium supplements last month.',
    scheduled_visit: {
      date: '15 Sep 2024',
      time: '11:30 AM',
      note: 'Routine field visit to Kheda hamlet.'
    },
    medical_history: [
      { id: 'h5', date: '10 Aug 2024', title: 'Calcium Fortification', description: 'Administered liquid calcium' }
    ]
  },
  {
    id: 3,
    tag_id: 'TAG-1F92AB31',
    name: 'Lakshmi',
    animal_type: 'Buffalo',
    age: 4.0,
    gender: 'Female',
    image: '/images/buffalo.jpg',
    owner_name: 'Karan Singh',
    owner_phone: '9977112233',
    village: 'Rampur',
    district: 'Sehore (MP)',
    distance: '8 km away',
    priority: 'High Priority',
    status: 'Needs Treatment',
    reported_at: '11 Sep 2024, 04:20 PM',
    reported_issue: 'Sudden drop in daily milk yield; right rear quarter of udder is inflamed, warm and painful to touch.',
    images: ['/images/buffalo.jpg'],
    audio_note: {
      duration: '00:22',
      transcript: 'Milk has small clots and buffalo does not allow milking.'
    },
    location: {
      address: 'Karan Singh, Rampur (MP)',
      distance: '8 km away',
      latitude: 23.1950,
      longitude: 77.0720
    },
    previous_notes: 'Dewormed in July. Prime lactating buffalo.',
    scheduled_visit: {
      date: '14 Sep 2024',
      time: '02:00 PM',
      note: 'Suspected acute mastitis. Carry intramammary infusions and anti-inflammatories.'
    },
    medical_history: [
      { id: 'h6', date: '20 Jul 2024', title: 'Deworming & Minerals', description: 'Chelated mineral mixture' }
    ]
  },
  {
    id: 4,
    tag_id: 'TAG-5E76GH88',
    name: 'Moti',
    animal_type: 'Cow',
    age: 3.0,
    gender: 'Male',
    image: '/images/cow3.png',
    owner_name: 'Mohan Lal',
    owner_phone: '9134567890',
    village: 'Barkheda',
    district: 'Sehore (MP)',
    distance: '12 km away',
    priority: 'Follow-up',
    status: 'Follow-up',
    reported_at: '08 Sep 2024, 03:00 PM',
    reported_issue: 'Follow-up inspection for joint sprain healing and dressing change.',
    images: ['/images/cow3.png'],
    location: {
      address: 'Mohan Lal, Barkheda (MP)',
      distance: '12 km away',
      latitude: 23.1800,
      longitude: 77.0600
    },
    previous_notes: 'Hock joint sprain treated on 8 Sep. Rest advised.',
    scheduled_visit: {
      date: '16 Sep 2024',
      time: '09:30 AM',
      note: 'Inspect leg movement and joint mobility.'
    },
    medical_history: [
      { id: 'h7', date: '08 Sep 2024', title: 'Joint Sprain', description: 'Megludyne injection and pain balm' }
    ]
  },
  {
    id: 5,
    tag_id: 'TAG-7K29MN11',
    name: 'Chandni',
    animal_type: 'Cow',
    age: 4.5,
    gender: 'Female',
    image: '/images/cow4.png',
    owner_name: 'Meena Devi',
    owner_phone: '9898989898',
    village: 'Sehore',
    district: 'Sehore (MP)',
    distance: '15 km away',
    priority: 'Moderate',
    status: 'Needs Treatment',
    reported_at: '10 Sep 2024, 11:15 AM',
    reported_issue: 'Bloat and indigestion after eating green fodder too quickly.',
    images: ['/images/cow4.png'],
    location: {
      address: 'Meena Devi, Sehore (MP)',
      distance: '15 km away',
      latitude: 23.2100,
      longitude: 77.1000
    },
    previous_notes: 'Recurrent mild indigestion in monsoon.',
    scheduled_visit: {
      date: '17 Sep 2024',
      time: '04:00 PM',
      note: 'Carminative bolus administration.'
    },
    medical_history: [
      { id: 'h8', date: '15 Jan 2024', title: 'Tympanism', description: 'Tympol liquid administration' }
    ]
  }
];
