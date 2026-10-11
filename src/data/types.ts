export interface NewsItem {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string[];
  category: 'NEWS' | 'TOURNAMENT' | 'TEAM UPDATE' | 'PLAYER' | 'DEVELOPMENT' | 'SELECTION';
  date: string;
  readTime: string;
  imageUrl: string;
  featured?: boolean;
  author: string;
  authorRole: string;
  tags: string[];
}

export interface Competition {
  id: string;
  name: string;
  subtitle: string;
  category: 'Senior Men' | 'Senior Women' | 'U20 Men' | 'U20 Women' | 'U18 Boys' | 'U18 Girls' | 'Open Inter-District';
  format: 'Rugby 7s' | 'Rugby XVs' | 'Touch Rugby';
  startDate: string;
  endDate: string;
  dayDisplay: string;
  monthDisplay: string;
  yearDisplay: string;
  venue: string;
  district: string;
  location: string;
  status: 'Upcoming' | 'Live / Ongoing' | 'Completed';
  registeredTeamsCount: number;
  description: string;
  rulesDocUrl?: string;
  fixturesCount: number;
  standings?: {
    rank: number;
    team: string;
    played: number;
    won: number;
    drawn: number;
    lost: number;
    points: number;
    pointDiff: string;
  }[];
  featured?: boolean;
}

export interface Team {
  id: string;
  name: string;
  shortName: string;
  category: 'Senior Men' | 'Senior Women' | 'U20 Men' | 'U20 Women' | 'U18 Boys' | 'U18 Girls' | 'Grassroots Development' | 'Touch & Wheelchair';
  division: 'Garhwal & Kumaon State Squad' | 'Youth State Squad' | 'Grassroots Academy';
  nickname: string;
  headCoach: string;
  captain: string;
  squadSize: number;
  imageUrl: string;
  description: string;
  achievements: string[];
  trainingGround: string;
  roster: {
    name: string;
    position: string;
    district: string;
    number: number;
    role?: 'Captain' | 'Vice-Captain';
  }[];
}

export interface Player {
  id: string;
  name: string;
  position: 'Fly-Half' | 'Scrum-Half' | 'Full-Back' | 'Wing' | 'Center' | 'Flanker' | 'Hooker' | 'Prop' | 'Lock' | 'Number 8';
  team: string;
  teamCategory: string;
  district: string;
  jerseyNumber: number;
  age: number;
  height: string;
  weight: string;
  caps: number;
  tries: number;
  points: number;
  imageUrl: string;
  bio: string;
  achievements: string[];
  districtJourney: string;
  featured?: boolean;
}

export interface MatchFixture {
  id: string;
  tournament: string;
  round: string;
  category: string;
  homeTeam: string;
  homeScore?: number;
  awayTeam: string;
  awayScore?: number;
  date: string;
  time: string;
  venue: string;
  status: 'Upcoming' | 'Live' | 'Full Time';
  highlight?: string;
}

export interface DistrictData {
  id: string;
  name: string;
  division: 'Garhwal' | 'Kumaon';
  hq: string;
  clubsCount: number;
  registeredPlayers: number;
  academiesCount: number;
  annualEvents: number;
  representative: string;
  keyGrounds: string[];
  description: string;
  spotlightPlayer: string;
}

export interface DocumentItem {
  id: string;
  title: string;
  category: 'Policies' | 'Rules & Regulations' | 'Tournament Documents' | 'Selection Documents' | 'Registration Forms' | 'Annual Reports' | 'Notices' | 'Circulars';
  date: string;
  fileType: 'PDF' | 'DOCX' | 'XLSX';
  fileSize: string;
  documentNumber: string;
  downloadUrl: string;
}

export interface GalleryItem {
  id: string;
  title: string;
  category: 'MATCHES' | 'TRAINING' | 'TOURNAMENTS' | 'PLAYERS' | "WOMEN'S RUGBY" | 'YOUTH RUGBY' | 'EVENTS';
  location: string;
  date: string;
  imageUrl: string;
  aspect: 'landscape' | 'portrait' | 'square';
}

export interface LeaderItem {
  id: string;
  name: string;
  position: 'President' | 'General Secretary' | 'Treasurer' | 'Vice President' | 'Technical Director' | 'Head of Women’s Rugby' | 'Grassroots Development Director';
  qualification: string;
  affiliation: string;
  imageUrl: string;
  bio: string;
}

export interface PartnerItem {
  id: string;
  name: string;
  category: 'Governing Affiliation' | 'State Sports Body' | 'Institutional Partner' | 'Equipment & Grassroots';
  description: string;
  logoText: string;
}

export interface CommitteeMember {
  id: string;
  name: string;
  role: string;
  initials: string;
  isExecutive?: boolean;
}

export interface AssociationContact {
  display: string;
  value: string;
}

export interface AssociationInfo {
  name: string;
  president: string;
  generalSecretary: string;
  treasurer: string;
  address: string;
  contacts: AssociationContact[];
  email: string;
  registrationAct: string;
  registrationNumber: string;
  registrationDate: string;
}

