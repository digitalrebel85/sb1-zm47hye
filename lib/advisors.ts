import { Advisor, SearchParams } from "@/lib/types"

const mockAdvisors: Advisor[] = [
  {
    id: 1,
    name: "Sarah Johnson",
    company: "Premier Financial Advisors",
    type: "mortgage",
    rating: 4.8,
    reviews: 127,
    image: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e",
    phone: "+44 20 7123 4567",
    description: "Expert financial advisor with over 15 years of experience",
    specialties: ["Mortgages", "First Time Buyers", "Buy to Let"],
    location: {
      city: "London",
      region: "Greater London"
    },
    openingHours: "Monday - Friday: 9:00 - 17:00"
  },
  {
    id: 2,
    name: "James Wilson",
    company: "City Financial Services",
    type: "mortgage",
    rating: 4.9,
    reviews: 98,
    image: "https://images.unsplash.com/photo-1560250097-0b93528c311a",
    phone: "+44 20 7234 5678",
    description: "Specialized in residential and commercial mortgages",
    specialties: ["Residential Mortgages", "Commercial Mortgages", "Remortgaging"],
    location: {
      city: "London",
      region: "Greater London"
    },
    openingHours: "Monday - Friday: 9:00 - 18:00"
  },
  {
    id: 3,
    name: "Emma Thompson",
    company: "Thompson Advisory Group",
    type: "mortgage",
    rating: 4.7,
    reviews: 156,
    image: "https://images.unsplash.com/photo-1580489944761-15a19d654956",
    phone: "+44 20 7345 6789",
    description: "Dedicated to helping clients find their perfect mortgage",
    specialties: ["First Time Buyers", "Buy to Let", "Residential Mortgages"],
    location: {
      city: "London",
      region: "Greater London"
    },
    openingHours: "Monday - Friday: 8:30 - 17:30"
  }
]

export async function getAdvisors(params: SearchParams): Promise<{
  advisors: Advisor[]
  total: number
}> {
  try {
    const { city, type, query, page = 1, limit = 9 } = params
    const offset = (page - 1) * limit

    const filteredAdvisors = mockAdvisors.filter(advisor => {
      if (city && advisor.location.city.toLowerCase() !== city.toLowerCase()) return false
      if (type && advisor.type !== type.toLowerCase()) return false
      if (query) {
        const searchStr = `${advisor.name} ${advisor.company} ${advisor.specialties.join(" ")}`.toLowerCase()
        if (!searchStr.includes(query.toLowerCase())) return false
      }
      return true
    })

    return {
      advisors: filteredAdvisors.slice(offset, offset + limit),
      total: filteredAdvisors.length
    }
  } catch (error) {
    console.error("Error fetching advisors:", error)
    throw new Error("Failed to fetch advisors")
  }
}