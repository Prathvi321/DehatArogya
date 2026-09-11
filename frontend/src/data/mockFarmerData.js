export const INITIAL_USER_PROFILE = {
  name: 'Ram Kishan',
  phone: '9876543210',
  village: 'Rampur',
  district: 'Sehore',
  state: 'Madhya Pradesh',
  avatar: '/images/farmer_cow_hero.png',
  aadhar_last4: '5821',
  kisan_credit_card: 'KCC-MP-SEH-88210',
  total_registered: 5,
  total_concerns_raised: 4,
  active_concerns: 1
};

export const INITIAL_FARMER_ANIMALS = [
  {
    tag_id: 'TAG-8A21F3C2',
    name: 'Gauri',
    animal_type: 'Cow',
    breed: 'Gir Crossbred',
    gender: 'Female',
    age: 3.5,
    weight: '340 kg',
    owner_phone: '9876543210',
    owner_name: 'Ram Kishan',
    village: 'Rampur',
    district: 'Sehore (MP)',
    status: 'Needs Attention',
    image: '/images/cow1.png',
    registered_at: '2024-09-01T10:00:00Z',
    medical_history: [
      {
        id: 'med-1',
        case_id: 'CASE-2024-0912-01',
        date: '12 Sep 2024',
        time: '10:30 AM',
        title: 'Suspected Lumpy Skin Disease (LSD)',
        risk_level: 'High Risk',
        status: 'Treated',
        symptoms: 'Nodular lumps (2-5 cm) all over neck, trunk and udder; high fever (104.2 °F); severe lacrimation, nasal discharge and total loss of appetite for 2 days.',
        doctor_name: 'Dr. S. Sharma',
        doctor_title: 'Veterinary Officer, Sehore Block',
        doctor_phone: '+91 7562 224190',
        follow_up_date: '15 Sep 2024',
        treatment: 'Intensive supportive antibiotic therapy, anti-inflammatory injection, antiseptic wound spray and nutritional immune boosters.',
        vital_signs: {
          temperature: '104.2 °F (High Fever)',
          rumination: 'Depressed (1 movement / 2 min)',
          mucous_membrane: 'Congested',
          respiratory_rate: '34 breaths / min (Elevated)'
        },
        case_photos: [
          '/images/cow1.png',
          '/images/cow4.png'
        ],
        gps_location: {
          latitude: 23.2031,
          longitude: 77.0844,
          address: 'Plot 14, Rampur Village, Sehore District, MP'
        },
        prescription: [
          {
            name: 'Inj. Enrofloxacin 10%',
            dosage: '15 ml Intramuscular (IM)',
            frequency: 'Once daily for 3 consecutive days',
            instructions: 'Broad spectrum antimicrobial to check secondary bacterial pneumonia.'
          },
          {
            name: 'Inj. Melonex Plus (Meloxicam + Paracetamol)',
            dosage: '20 ml Intramuscular (IM)',
            frequency: 'Once daily for 2 days',
            instructions: 'For prompt reduction of body temperature and painful skin nodule inflammation.'
          },
          {
            name: 'Inj. Ivermectin 1%',
            dosage: '7 ml Subcutaneous (SC)',
            frequency: 'Single shot only',
            instructions: 'To control biting flies, ticks and prevent myiasis in broken nodules.'
          },
          {
            name: 'Inj. Belamyl (B-Complex + Liver Extract)',
            dosage: '10 ml Intramuscular (IM)',
            frequency: 'Alternate day for 3 doses',
            instructions: 'Appetite stimulant and recovery support.'
          },
          {
            name: 'Charmil Plus Wound Spray',
            dosage: 'External topical application',
            frequency: 'Twice daily on ulcerated skin nodules',
            instructions: 'Herbal antimicrobial wound healing and fly repellent.'
          }
        ],
        home_care: {
          english: 'Isolate Gauri immediately in a dry, mosquito-netted enclosure. Wash open skin lesions with 1% Lal Dawai (Potassium Permanganate) solution. Provide soft lukewarm rice water gruel mixed with 200g Jaggery (Gur) and 2 spoons turmeric powder.',
          hindi: 'गौरी को तुरंत बाकी पशुओं से अलग रखें ताकि संक्रमण न फैले। त्वचा की खुली गांठों को 1% लाल दवाई के घोल से साफ करें। 200 ग्राम गुड़ और हल्दी मिलाकर गुनगुना दलिया या चावल का मांड़ पिलाएं।'
        },
        notes: 'Condition critical but responding well to Melonex. Strict fly protection advised. Re-evaluate on 15 Sep 2024 for nodule scab formation.'
      },
      {
        id: 'med-2',
        case_id: 'CASE-2024-0818-04',
        date: '18 Aug 2024',
        time: '02:15 PM',
        title: 'Simple Indigestion & Loss of Appetite',
        risk_level: 'Medium Risk',
        status: 'Resolved',
        symptoms: 'Animal stopped eating concentrate feed; mild tympany, dry muzzle and sluggish rumination.',
        doctor_name: 'Dr. Neha Verma',
        doctor_title: 'Veterinary Assistant Surgeon',
        doctor_phone: '+91 7562 225881',
        follow_up_date: '21 Aug 2024',
        vital_signs: {
          temperature: '101.5 °F (Normal)',
          rumination: 'Subnormal (1 / min)'
        },
        case_photos: [
          '/images/cow1.png'
        ],
        prescription: [
          {
            name: 'Himalayan Batisa Bolus',
            dosage: '2 bolus twice daily for 3 days',
            frequency: 'Oral with jaggery paste',
            instructions: 'Digestive appetizer and rumen microflora stimulant.'
          },
          {
            name: 'RumenFS Sachet',
            dosage: '50 gm once daily',
            frequency: 'Mixed in drinking water for 2 days',
            instructions: 'Live yeast probiotics for rumen fermentation.'
          }
        ],
        home_care: {
          english: 'Withhold dry straw for 12 hours. Offer fresh green berseem grass and warm ginger-carom seed (ajwain) decoction.',
          hindi: '12 घंटे सूखा भूसा न दें। हरा चारा और अजवायन-सोंठ का काढ़ा गुनगुना करके पिलाएं।'
        },
        notes: 'Rumen motility fully restored within 48 hours. Appetite back to normal.'
      },
      {
        id: 'med-3',
        case_id: 'CASE-2024-0605-02',
        date: '05 Jun 2024',
        time: '11:20 AM',
        title: 'Routine Health Checkup & Annual Vaccination',
        risk_level: 'Low Risk',
        status: 'Completed',
        symptoms: 'Routine wellness examination and seasonal epidemic immunization check.',
        doctor_name: 'Dr. R. Patel',
        doctor_title: 'Block Veterinary Officer',
        vaccination: 'FMD (Foot & Mouth Disease) + HS (Haemorrhagic Septicaemia) Dual Shot',
        vital_signs: {
          temperature: '101.4 °F (Normal)',
          weight: '335 kg'
        },
        case_photos: [
          '/images/cow1.png'
        ],
        prescription: [
          {
            name: 'Raksha-Ovac FMD Vaccine',
            dosage: '2 ml Subcutaneous (SC)',
            frequency: 'Annual Booster',
            instructions: 'Animal vaccinated under National Animal Disease Control Programme.'
          },
          {
            name: 'Albendazole Oral Suspension (Albomar)',
            dosage: '90 ml single oral drench',
            frequency: 'Morning empty stomach',
            instructions: 'Broad spectrum deworming before monsoon rains.'
          }
        ],
        home_care: {
          english: 'No strenuous field work for 24 hours. Normal green grazing permitted.',
          hindi: 'टीकाकरण के बाद 24 घंटे आराम दें। सामान्य चारा पानी जारी रखें।'
        },
        notes: 'Animal active, healthy, clear eyes and clean lungs.'
      }
    ]
  },
  {
    tag_id: 'TAG-1F92AB31',
    name: 'Lakshmi',
    animal_type: 'Buffalo',
    breed: 'Murrah',
    gender: 'Female',
    age: 4.0,
    weight: '480 kg',
    owner_phone: '9876543210',
    owner_name: 'Ram Kishan',
    village: 'Rampur',
    district: 'Sehore (MP)',
    status: 'Healthy',
    image: '/images/buffalo.jpg',
    registered_at: '2024-09-02T11:30:00Z',
    medical_history: [
      {
        id: 'med-4',
        case_id: 'CASE-2024-0720-09',
        date: '20 Jul 2024',
        time: '09:00 AM',
        title: 'Deworming & Chelated Mineral Mixture Administration',
        risk_level: 'Low Risk',
        status: 'Completed',
        symptoms: 'Routine mid-lactation nutritional supplementation check.',
        doctor_name: 'Dr. R. Patel',
        doctor_title: 'Veterinary Officer',
        vital_signs: {
          temperature: '100.8 °F (Normal)',
          milk_yield: '11.5 Litres/day'
        },
        case_photos: ['/images/buffalo.jpg'],
        prescription: [
          {
            name: 'Agrimin Forte Mineral Powder',
            dosage: '50 gm daily in concentrate feed',
            frequency: 'Continuous for 30 days',
            instructions: 'To maintain peak milk yield and improve reproductive cycling.'
          },
          {
            name: 'Oxyclozanide + Levamisole (Nilzan)',
            dosage: '100 ml oral drench',
            frequency: 'Single dose',
            instructions: 'Deworming against liver fluke and gastrointestinal nematodes.'
          }
        ],
        home_care: {
          english: 'Provide ad-lib clean drinking water and mud wallowing during afternoon peak heat.',
          hindi: 'दोपहर में धूप से बचाएं और साफ पानी में नहलाएं। खली-चोकर में मिनरल मिक्सचर मिलाकर दें।'
        },
        notes: 'Healthy prime buffalo in peak 2nd lactation.'
      }
    ]
  },
  {
    tag_id: 'TAG-3D71E9F0',
    name: 'Rani',
    animal_type: 'Cow',
    breed: 'Sahiwal Cross',
    gender: 'Female',
    age: 2.0,
    weight: '240 kg',
    owner_phone: '9876543210',
    owner_name: 'Ram Kishan',
    village: 'Rampur',
    district: 'Sehore (MP)',
    status: 'Healthy',
    image: '/images/cow2.png',
    registered_at: '2024-08-15T09:15:00Z',
    medical_history: [
      {
        id: 'med-5',
        case_id: 'CASE-2024-0912-07',
        date: '12 Sep 2024',
        time: '08:45 AM',
        title: 'Heifer Growth & Calcium Administration',
        risk_level: 'Low Risk',
        status: 'Completed',
        symptoms: 'Heifer pre-breeding check and skeleton bone fortification.',
        doctor_name: 'Dr. Neha Verma',
        doctor_title: 'Veterinary Assistant',
        vital_signs: {
          temperature: '101.6 °F (Normal)'
        },
        case_photos: ['/images/cow2.png'],
        prescription: [
          {
            name: 'Ostovet Forte Liquid Calcium',
            dosage: '50 ml daily orally',
            frequency: 'Daily for 20 days',
            instructions: 'Calcium and Vitamin D3 for bone development.'
          }
        ],
        home_care: {
          english: 'Provide abundant sunlight exposure and fresh mineralized green fodder.',
          hindi: 'धूप में बांधें और ताजा हरा चारा खिलाएं।'
        },
        notes: 'Good body condition score (BCS 3.5). Ideal candidate for upcoming AI cycle.'
      }
    ]
  },
  {
    tag_id: 'TAG-9B34CD12',
    name: 'Chutki',
    animal_type: 'Goat',
    breed: 'Jamnapari',
    gender: 'Female',
    age: 1.0,
    weight: '28 kg',
    owner_phone: '9876543210',
    owner_name: 'Ram Kishan',
    village: 'Rampur',
    district: 'Sehore (MP)',
    status: 'Healthy',
    image: '/images/goat.jpg',
    registered_at: '2024-07-10T14:00:00Z',
    medical_history: [
      {
        id: 'med-6',
        case_id: 'CASE-2024-0810-02',
        date: '10 Aug 2024',
        time: '11:00 AM',
        title: 'Peste des Petits Ruminants (PPR) Vaccination',
        risk_level: 'Low Risk',
        status: 'Completed',
        symptoms: 'Annual goat plague immunization.',
        doctor_name: 'Dr. S. Sharma',
        doctor_title: 'Veterinary Officer',
        vital_signs: {
          temperature: '102.1 °F (Normal)'
        },
        case_photos: ['/images/goat.jpg'],
        prescription: [
          {
            name: 'PPR Live Vaccine',
            dosage: '1 ml Subcutaneous',
            frequency: 'Annual Shot',
            instructions: 'National PPR eradication campaign.'
          }
        ],
        home_care: {
          english: 'Keep goat dry and avoid grazing in damp wet pastures for 2 days.',
          hindi: 'बारिश के गीले चरागाह में न ले जाएं। सूखा चारा दें।'
        },
        notes: 'Immunization certificate issued.'
      }
    ]
  },
  {
    tag_id: 'TAG-5E76GH88',
    name: 'Moti',
    animal_type: 'Cow',
    breed: 'Malvi Bull',
    gender: 'Male',
    age: 5.0,
    weight: '460 kg',
    owner_phone: '9876543210',
    owner_name: 'Ram Kishan',
    village: 'Rampur',
    district: 'Sehore (MP)',
    status: 'Under Treatment',
    image: '/images/cow3.png',
    registered_at: '2024-06-20T16:20:00Z',
    medical_history: [
      {
        id: 'med-7',
        case_id: 'CASE-2024-0908-05',
        date: '08 Sep 2024',
        time: '04:30 PM',
        title: 'Hock Joint Sprain & Mild Lameness',
        risk_level: 'Medium Risk',
        status: 'Under Treatment',
        symptoms: 'Limping on right hind leg after field plowing; warm swelling over hock joint.',
        doctor_name: 'Dr. S. Sharma',
        doctor_title: 'Veterinary Officer',
        vital_signs: {
          temperature: '101.8 °F (Mild local heat)'
        },
        case_photos: ['/images/cow3.png'],
        prescription: [
          {
            name: 'Inj. Megludyne (Flunixin Meglumine)',
            dosage: '10 ml IM stat',
            frequency: 'Once daily for 2 days',
            instructions: 'Potent analgesic and musculoskeletal anti-inflammatory.'
          },
          {
            name: 'Wisprec Advanced Herbal Pain Balm',
            dosage: 'Gentle massage over affected joint',
            frequency: 'Twice daily',
            instructions: 'Soothing herbal counter-irritant.'
          }
        ],
        home_care: {
          english: 'Strict stall rest on soft sand or straw bedding. Avoid concrete floors and field work.',
          hindi: 'रेत या पुआल की नरम बिछाली पर रखें। पक्के फर्श पर न बांधें और खेत का काम बिल्कुल न लें।'
        },
        notes: 'Swelling reduced by 60%. Lameness improving.'
      }
    ]
  }
];

export const RECENT_ACTIVITIES = [
  {
    id: 'act-1',
    type: 'treatment',
    title: 'Treatment added for Rani',
    date: '12 Sep 2024',
    iconColor: 'bg-purple-100 text-purple-700',
    tagId: 'TAG-3D71E9F0'
  },
  {
    id: 'act-2',
    type: 'concern',
    title: 'Concern reported for Gauri',
    date: '10 Sep 2024',
    iconColor: 'bg-rose-100 text-rose-700',
    tagId: 'TAG-8A21F3C2'
  },
  {
    id: 'act-3',
    type: 'register',
    title: 'Animal Lakshmi registered',
    date: '02 Sep 2024',
    iconColor: 'bg-emerald-100 text-emerald-700',
    tagId: 'TAG-1F92AB31'
  }
];
