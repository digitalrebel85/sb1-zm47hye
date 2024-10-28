import { notFound } from "next/navigation"
import { getAdvisors, getCity, getAdvisorType, getAllAdvisors } from "@/lib/data"
import { AdvisorCard } from "@/components/advisor/AdvisorCard"

interface PageProps {
  params: {
    advisorType: string
    city: string
  }
}

export default async function AdvisorListingPage({ params }: PageProps) {
  const { advisorType, city } = params
  const [cityData, advisorTypeData, advisors] = await Promise.all([
    getCity(city),
    getAdvisorType(advisorType),
    getAdvisors({ type: advisorType, city })
  ])

  if (!cityData || !advisorTypeData) {
    notFound()
  }

  return (
    <div className="container px-4 py-12 md:px-6">
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
            {advisorTypeData.title} in {cityData.name}
          </h1>
          <p className="mt-4 text-lg text-muted-foreground">
            Find the best {advisorType.toLowerCase()} advisors in {cityData.name} to help you achieve your goals.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {advisors.map((advisor) => (
            <AdvisorCard key={advisor.id} advisor={advisor} />
          ))}
        </div>
      </div>
    </div>
  )
}

export async function generateStaticParams() {
  const advisors = await getAllAdvisors()
  const paths = advisors.map((advisor) => ({
    advisorType: advisor.type,
    city: advisor.location.city.toLowerCase(),
  }))
  
  // Remove duplicates
  return Array.from(new Set(paths.map(JSON.stringify))).map(JSON.parse)
}