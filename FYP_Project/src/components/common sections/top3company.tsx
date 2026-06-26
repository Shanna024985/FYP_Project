import {
  Card,
  CardContent,
  CardHeader,
} from "@/components/ui/card"
import '../../title.css'
type CompanyCardProps = {
  name: string
  logo: string
  rating: number
  reviewCount: number
}

function CompanyCard({
  name,
  logo,
  rating,
  reviewCount,
}: CompanyCardProps) {
  return (
    <Card className="hover:shadow-md transition text-center">
      {/* Row 1: Logo */}
      <CardHeader className="flex items-center justify-center">
        <img
          src={logo}
          alt={name}
          className="h-14 w-14 rounded-md object-cover"
        />
      </CardHeader>

      <CardContent className="space-y-2">
        {/* Row 2: Company Name */}
        <p className="font-semibold">{name}</p>

        {/* Row 3: Rating */}
        <p className="text-sm text-muted-foreground">
          Rating: <span className="font-medium text-foreground">{rating}</span>{" "}
          ({reviewCount} reviews)
        </p>
      </CardContent>
    </Card>
  )
}
type Props = {
  currentUrl: string;
};
export default function TopCompaniesSection({ currentUrl }: Props) {
  const companies = [
    {
      name: "Tech Corp",
      logo: "https://via.placeholder.com/80",
      rating: 4.8,
      reviewCount: 120,
    },
    {
      name: "Design Studio",
      logo: "https://via.placeholder.com/80",
      rating: 4.6,
      reviewCount: 98,
    },
    {
      name: "Finance Group",
      logo: "https://via.placeholder.com/80",
      rating: 4.7,
      reviewCount: 150,
    },
  ]

  return (
    <section className="mt-12 space-y-6">
      {/* Title */}
      <h2 className="text-center text-2xl font-semibold title-black">
        Top Rated Companies
      </h2>

      {/* Grid */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {companies.map((c, i) => (
          <CompanyCard key={i} {...c} />
        ))}
      </div>
    </section>
  )
}