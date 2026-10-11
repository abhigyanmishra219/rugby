import { Team } from './types';

export const teamsData: Team[] = [
  {
    id: 'team-senior-men',
    name: 'Senior Men State Squad',
    shortName: 'Senior Men',
    category: 'Senior Men',
    division: 'Garhwal & Kumaon State Squad',
    nickname: 'Uttarakhand Himalayan Bulls',
    headCoach: 'Vikramaditya Chauhan (WR Level 3)',
    captain: 'Rohit Rawat',
    squadSize: 26,
    imageUrl: 'https://images.unsplash.com/photo-1544698310-74ea9d1c8258?auto=format&fit=crop&w=1000&q=80',
    description: 'The flagship senior men’s representative team of Uttarakhand competing in national Rugby XVs and Rugby 7s tournaments across India.',
    achievements: [
      'North Zone Rugby 7s Champions 2025',
      'All India Division 2 Finalists 2024',
      'Garhwal-Kumaon State Derby Winner 2026'
    ],
    trainingGround: 'Maharana Pratap Sports College, Raipur, Dehradun',
    roster: [
      { name: 'Rohit Rawat', position: 'Fly-Half', district: 'Pauri Garhwal', number: 10, role: 'Captain' },
      { name: 'Suraj Rawat', position: 'Scrum-Half', district: 'Dehradun', number: 9, role: 'Vice-Captain' },
      { name: 'Devendra Joshi', position: 'Prop', district: 'Almora', number: 1 },
      { name: 'Manish Singh Bisht', position: 'Hooker', district: 'Nainital', number: 2 },
      { name: 'Pradeep Chamoli', position: 'Lock', district: 'Chamoli', number: 4 },
      { name: 'Karan Negi', position: 'Flanker', district: 'Tehri Garhwal', number: 7 },
      { name: 'Aman Deep Verma', position: 'Wing', district: 'Haridwar', number: 11 },
      { name: 'Arjun Gusain', position: 'Full-Back', district: 'Udham Singh Nagar', number: 15 }
    ]
  },
  {
    id: 'team-senior-women',
    name: 'Senior Women State Squad',
    shortName: 'Senior Women',
    category: 'Senior Women',
    division: 'Garhwal & Kumaon State Squad',
    nickname: 'Uttarakhand Himalayan Tigresses',
    headCoach: 'Sunita Bhandari (WR Level 2)',
    captain: 'Anjali Negi',
    squadSize: 24,
    imageUrl: 'https://images.unsplash.com/photo-1517649763962-0c623266ddc0?auto=format&fit=crop&w=1000&q=80',
    description: 'Trailblazing state women’s team, widely celebrated for rapid pace, agile tackling, and pioneering the women’s sports revolution in the hills.',
    achievements: [
      'North Zone Rugby 7s Silver Medalists 2026',
      'National University Games Bronze 2025',
      'Fastest Rising Women’s State Squad Award'
    ],
    trainingGround: 'Pavilion Ground, Dehradun',
    roster: [
      { name: 'Anjali Negi', position: 'Fly-Half', district: 'Dehradun', number: 10, role: 'Captain' },
      { name: 'Meenakshi Pandey', position: 'Full-Back', district: 'Nainital', number: 15, role: 'Vice-Captain' },
      { name: 'Kavita Kandari', position: 'Prop', district: 'Rudraprayag', number: 3 },
      { name: 'Pooja Karki', position: 'Scrum-Half', district: 'Pithoragarh', number: 9 },
      { name: 'Divya Arya', position: 'Wing', district: 'Almora', number: 14 },
      { name: 'Priyanka Rawat', position: 'Flanker', district: 'Pauri Garhwal', number: 6 },
      { name: 'Sheetal Rawat', position: 'Center', district: 'Uttarkashi', number: 12 }
    ]
  },
  {
    id: 'team-u20-men',
    name: 'Under-20 Men State Squad',
    shortName: 'U20 Men',
    category: 'U20 Men',
    division: 'Youth State Squad',
    nickname: 'Junior Himalayan Bulls',
    headCoach: 'Maheshwar Panwar',
    captain: 'Ayush Gusain',
    squadSize: 22,
    imageUrl: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=1000&q=80',
    description: 'High-performance youth squad bridging university athletes and emerging district talent into senior national contention.',
    achievements: [
      'National Junior Sevens Quarter-Finalists 2025',
      'North Region Under-20 Cup Champions 2024'
    ],
    trainingGround: 'Indira Gandhi Stadium, Haldwani',
    roster: [
      { name: 'Ayush Gusain', position: 'Center', district: 'Pauri Garhwal', number: 12, role: 'Captain' },
      { name: 'Gaurav Bisht', position: 'Scrum-Half', district: 'Nainital', number: 9 },
      { name: 'Sachin Bhatt', position: 'Lock', district: 'Dehradun', number: 5 }
    ]
  },
  {
    id: 'team-u20-women',
    name: 'Under-20 Women State Squad',
    shortName: 'U20 Women',
    category: 'U20 Women',
    division: 'Youth State Squad',
    nickname: 'Junior Himalayan Tigresses',
    headCoach: 'Deepa Joshi',
    captain: 'Neha Semwal',
    squadSize: 20,
    imageUrl: 'https://images.unsplash.com/photo-1526676037777-05a232554f77?auto=format&fit=crop&w=1000&q=80',
    description: 'Dynamic young women athletes nurtured through inter-college and district school tournaments in Uttarakhand.',
    achievements: [
      'North Zone U20 Sevens Runners-Up 2025',
      'State Youth Games Gold 2025'
    ],
    trainingGround: 'Sports Complex, Haridwar',
    roster: [
      { name: 'Neha Semwal', position: 'Fly-Half', district: 'Tehri Garhwal', number: 10, role: 'Captain' },
      { name: 'Rashmi Koranga', position: 'Wing', district: 'Bageshwar', number: 11 }
    ]
  },
  {
    id: 'team-u18-boys',
    name: 'Under-18 Boys State Squad',
    shortName: 'U18 Boys',
    category: 'U18 Boys',
    division: 'Youth State Squad',
    nickname: 'Himalayan Colts',
    headCoach: 'Rajendra Danu',
    captain: 'Kabir Thapa',
    squadSize: 24,
    imageUrl: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&w=1000&q=80',
    description: 'School-level athletes selected through the Uttarakhand Inter-School Rugby Championship and district camps.',
    achievements: [
      'SGFI School National Games Silver 2025',
      'State Winter Cup Winners 2026'
    ],
    trainingGround: 'Parade Ground, Dehradun',
    roster: [
      { name: 'Kabir Thapa', position: 'Full-Back', district: 'Dehradun', number: 15, role: 'Captain' },
      { name: 'Aakash Rana', position: 'Prop', district: 'Uttarkashi', number: 1 }
    ]
  },
  {
    id: 'team-u18-girls',
    name: 'Under-18 Girls State Squad',
    shortName: 'U18 Girls',
    category: 'U18 Girls',
    division: 'Youth State Squad',
    nickname: 'Himalayan Lionesses',
    headCoach: 'Mamta Rautela',
    captain: 'Simran Chauhan',
    squadSize: 22,
    imageUrl: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&w=1000&q=80',
    description: 'Emerging adolescent squad displaying supreme fitness, team spirit, and discipline from hill district schools.',
    achievements: [
      'SGFI School Games Gold 2025',
      'All-India Junior Sevens Plate Winners 2025'
    ],
    trainingGround: 'Sports Stadium, Almora',
    roster: [
      { name: 'Simran Chauhan', position: 'Fly-Half', district: 'Dehradun', number: 10, role: 'Captain' },
      { name: 'Komal Mehra', position: 'Scrum-Half', district: 'Nainital', number: 9 }
    ]
  },
  {
    id: 'team-grassroots',
    name: 'Grassroots Development Squad',
    shortName: 'Grassroots',
    category: 'Grassroots Development',
    division: 'Grassroots Academy',
    nickname: 'Young Mountain Warriors',
    headCoach: 'Sunil Bisht & Regional Coordinators',
    captain: 'Rotational Leadership',
    squadSize: 120,
    imageUrl: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=1000&q=80',
    description: 'Foundational pathway program introducing 8–14 year old children across 13 hill districts to tag and touch rugby.',
    achievements: [
      'Over 4,500 children engaged in 2025-26',
      'Active in 65+ government and private schools'
    ],
    trainingGround: 'District Sports Arenas Across All 13 Districts',
    roster: []
  },
  {
    id: 'team-touch-wheelchair',
    name: 'Touch & Inclusive Rugby Squad',
    shortName: 'Touch & Inclusive',
    category: 'Touch & Wheelchair',
    division: 'Garhwal & Kumaon State Squad',
    nickname: 'Himalayan Resilient',
    headCoach: 'Dr. Vivek Dimri',
    captain: 'Kamlesh Negi',
    squadSize: 18,
    imageUrl: 'https://images.unsplash.com/photo-1544698310-74ea9d1c8258?auto=format&fit=crop&w=1000&q=80',
    description: 'Promoting inclusive, mixed-gender touch rugby and adaptive wheelchair rugby initiatives in Uttarakhand.',
    achievements: [
      'North India Para Sports Exhibition Champion 2025',
      'State Mixed Touch Trophy 2026'
    ],
    trainingGround: 'Raipur Indoor Complex, Dehradun',
    roster: []
  }
];
