export interface Worker {
  id: string;
  firstName: string;
  lastName: string;
  photo: string;
  gender: 'male' | 'female';
  age: number;
  district: string;
  sector: string;
  salaryMin: number;
  salaryMax: number;
  experience: 'no-experience' | 'fresher' | 'intermediate' | 'expert';
  languages: string[];
  hasInsurance: boolean;
  type: 'company' | 'freelance';
  companyName?: string;
  rating: number;
  reviewCount: number;
  isAvailable: boolean;
  workTypes: ('full-time' | 'part-time' | 'live-in')[];
  registeredAt: Date;
}

export interface SearchFilters {
  searchQuery: string;
  gender: 'all' | 'male' | 'female';
  ageMin: number;
  ageMax: number;
  districts: string[];
  salaryMin: number;
  salaryMax: number;
  experience: string[];
  languages: string[];
  hasInsurance: 'all' | 'yes' | 'no';
  workerType: 'all' | 'company' | 'freelance';
  workTypes: string[];
  availableOnly: boolean;
}

export const DISTRICTS = [
  'Gasabo',
  'Kicukiro',
  'Nyarugenge',
  'Bugesera',
  'Gatsibo',
  'Kayonza',
  'Kirehe',
  'Ngoma',
  'Nyagatare',
  'Rwamagana',
];

export const LANGUAGES = [
  'Kinyarwanda',
  'English',
  'French',
  'Swahili',
];

export const EXPERIENCE_LEVELS = [
  { value: 'no-experience', label: 'No Experience' },
  { value: 'fresher', label: 'Fresher (< 1 year)' },
  { value: 'intermediate', label: 'Intermediate (1-3 years)' },
  { value: 'expert', label: 'Expert (3+ years)' },
];

export const WORK_TYPES = [
  { value: 'full-time', label: 'Full Time' },
  { value: 'part-time', label: 'Part Time' },
  { value: 'live-in', label: 'Live-In' },
];
