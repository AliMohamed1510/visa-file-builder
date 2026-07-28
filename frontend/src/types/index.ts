export interface Client {
  id: string;
  firstName: string;
  lastName: string;
  firstNameAr?: string;
  lastNameAr?: string;
  email?: string;
  phone?: string;
  passportNumber?: string;
  passportIssueDate?: string;
  passportExpiryDate?: string;
  dateOfBirth?: string;
  nationality?: string;
  gender?: string;
  maritalStatus?: string;
  address?: string;
  city?: string;
  country?: string;
  occupation?: string;
  employerName?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Country {
  id: string;
  name: string;
  nameAr?: string;
  code: string;
  isSchengen: boolean;
  isActive: boolean;
  formTemplate?: any;
  documentRequirements?: any;
}

export interface VisaApplication {
  id: string;
  applicationNumber: string;
  applicationType: string;
  status: string;
  destinationCountryId: string;
  destinationCountry?: Country;
  clientId: string;
  client?: Client;
  entryType?: string;
  durationOfStay?: number;
  intendedDateOfEntry?: string;
  intendedDateOfExit?: string;
  hasPreviousVisas: boolean;
  hasSponsor: boolean;
  formData?: any;
  reviewNotes?: string;
  generatedPdf?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Document {
  id: string;
  fileName: string;
  originalName: string;
  mimeType: string;
  size: number;
  path: string;
  type: string;
  status: string;
  ocrData?: any;
  ocrConfidence?: number;
  clientId: string;
  visaApplicationId?: string;
  createdAt: string;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
}
