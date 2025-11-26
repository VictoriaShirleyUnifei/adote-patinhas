export interface Animal {
  id: string;
  name: string;
  distance?: string;
  age: string;
  sex: string;
  size: string;
  image: string;
  isInterested?: boolean;
  
  // Propriedades para o Modal (opcionais)
  species?: string;
  breed?: string;
  description?: string;
  vaccinated?: boolean;
  castrated?: boolean;
  dewormed?: boolean;
  getsAlongWithAnimals?: boolean;
  getsAlongWithChildren?: boolean;
  needsSpecialCare?: boolean;
  isElderly?: boolean;
  hasDisability?: boolean;
  tutor?: {
    name: string;
    phone: string;
    avatar?: string;
  };
  publicationDate?: string;
}