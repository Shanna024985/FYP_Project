export type Review = {
  id: number;
  companyId: number;
  companyName: string;
  companyLogo: string;

  rating: number;
  description: string;

  createdAt: string;
  updatedAt?: string;
};