import type { Review } from "../types/review";

export const mockReviews: Review[] = [
  {
    id: 1,
    companyId: 1,
    companyName: "Google",
    companyLogo:
      "https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg",
    rating: 5,
    description:
      "Great experience working with the team. Friendly environment and supportive management.",
    createdAt: "2026-06-01",
  },
  {
    id: 2,
    companyId: 2,
    companyName: "Microsoft",
    companyLogo:
      "https://upload.wikimedia.org/wikipedia/commons/4/44/Microsoft_logo.svg",
    rating: 4,
    description:
      "Good learning opportunities and flexible working arrangements.",
    createdAt: "2026-05-15",
    updatedAt: "2026-05-20",
  },
];