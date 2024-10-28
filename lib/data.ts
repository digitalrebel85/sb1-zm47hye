import { Advisor, AdvisorType, City } from "./types"

// Mock data for static generation
const advisors: Advisor[] = [
  {
    id: 1,
    name: "John Smith",
    company: "London Mortgage Solutions",
    type: "mortgage",
    location: {
      city: "London",
      region: "Greater London"
    },
    phone: "+44 20 1234 5678",
    website: "https://example.com",
    description: "Experienced mortgage advisor with over 15 years in the industry. Specializing in first-time buyers and buy-to-let mortgages.",
    openingHours: "Monday - Friday: 9:00 - 17:30",
    specialties: ["First Time Buyers", "Buy to Let", "Remortgage"]
  },
  {
    id: 2,
    name: "Sarah Johnson",
    company: "Manchester Financial Services",
    type: "mortgage",
    location: {
      city: "Manchester",
      region: "Greater Manchester"
    },
    phone: "+44 161 234 5678",
    website: "https://example.com",
    description: "Award-winning mortgage advisor helping families find their dream homes. Expert in residential and commercial mortgages.",
    openingHours: "Monday - Friday: 9:00 - 18:00",
    specialties: ["Residential Mortgages", "Commercial Mortgages", "First Time Buyers"]
  }
]

const cities: City[] = [
  {
    name: "London",
    region: "Greater London",
    count: 150
  },
  {
    name: "Manchester",
    region: "Greater Manchester",
    count: 85
  }
]

const advisorTypes: AdvisorType[] = [
  {
    slug: "mortgage",
    title: "Mortgage Advisors",
    description: "Find expert mortgage advisors to guide you through the home buying process",
    icon: "home"
  },
  {
    slug: "insurance",
    title: "Insurance Advisors",
    description: "Connect with insurance professionals to protect what matters most",
    icon: "shield"
  },
  {
    slug: "financial",
    title: "Financial Advisors",
    description: "Get expert guidance on financial planning and investments",
    icon: "briefcase"
  }
]

export async function getAdvisorById(id: number): Promise<Advisor | undefined> {
  return advisors.find(advisor => advisor.id === id)
}

export async function getAllAdvisors(): Promise<Advisor[]> {
  return advisors
}

export async function getAdvisorsByType(type: string): Promise<Advisor[]> {
  return advisors.filter(advisor => advisor.type === type.toLowerCase())
}

export async function getAdvisorsByCity(city: string): Promise<Advisor[]> {
  return advisors.filter(advisor => 
    advisor.location.city.toLowerCase() === city.toLowerCase()
  )
}

export async function getCity(cityName: string): Promise<City | undefined> {
  return cities.find(city => city.name.toLowerCase() === cityName.toLowerCase())
}

export async function getAllCities(): Promise<City[]> {
  return cities
}

export async function getAdvisors(params: {
  type?: string
  city?: string
  service?: string
}): Promise<Advisor[]> {
  return advisors.filter(advisor => {
    if (params.type && advisor.type !== params.type.toLowerCase()) return false
    if (params.city && advisor.location.city.toLowerCase() !== params.city.toLowerCase()) return false
    if (params.service && !advisor.specialties.some(s => s.toLowerCase() === params.service?.toLowerCase())) return false
    return true
  })
}

export async function getAdvisorType(slug: string): Promise<AdvisorType | undefined> {
  return advisorTypes.find(type => type.slug === slug.toLowerCase())
}

export async function getAllAdvisorTypes(): Promise<AdvisorType[]> {
  return advisorTypes
}