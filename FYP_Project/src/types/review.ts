export interface Review {
  id: number;
  company_id: number;
  user_id: number;
  company_name: string;
  rating: number;
  message: string;
  created_at: string;
}