export interface User {
  id: string;
  email: string;
  role: 'applicant' | 'admin' | 'moderator';
  createdAt: string;
}

export interface Applicant {
  id: string;
  userId: string;
  lastName: string;
  firstName: string;
  middleName: string;
  birthDate: string;
  region: string;
  city: string;
  school: string;
  class: string;
  phone: string;
  email: string;
  address?: string;
  parentsInfo?: string;
  status: 'new' | 'in_review' | 'accepted' | 'rejected';
  createdAt: string;
  updatedAt: string;
}

export interface Document {
  id: string;
  applicantId: string;
  documentType: 'achievements' | 'motivation' | 'grades' | 'oge' | 'certificate';
  fileName: string;
  filePath: string;
  fileSize: number;
  uploadedAt: string;
}

export interface AuthContextType {
  currentUser: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

export interface ApplicantFormData {
  lastName: string;
  firstName: string;
  middleName: string;
  birthDate: string;
  region: string;
  city: string;
  school: string;
  class: string;
  phone: string;
  email: string;
  address: string;
  parentsInfo: string;
}