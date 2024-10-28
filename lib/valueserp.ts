import { Advisor, SearchResponse } from "./types"

const VALUESERP_API_KEY = process.env.VALUESERP_API_KEY
const RESULTS_PER_PAGE = 10

interface ValueSerpResult {
  title: string
  address?: string
  phone?: string
  link?: string
  rating?: number
  reviews?: number
  snippet?: string
  hours?: string
}

export async function searchAdvisors(params: {
  type: string
  city: string
  page?: number
}): Promise<SearchResponse> {
  if (!VALUESERP_API_KEY) {
    throw new Error("ValueSerp API key is not configured")
  }

  try {
    const response = await fetch("https://api.valueserp.com/search", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        api_key: VALUESERP_API_KEY,
        search_type: "places",
        q: `${params.type} advisors in ${params.city}`,
        location: `${params.city}, United Kingdom`,
        google_domain: "google.co.uk",
        gl: "uk",
        hl: "en",
        page: params.page || 1,
        engine: "google",
        num: RESULTS_PER_PAGE,
        include_fields: "places_results.title,places_results.address,places_results.phone,places_results.link,places_results.rating,places_results.reviews,places_results.snippet,places_results.hours"
      }),
    })

    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`)
    }

    const data = await response.json()

    if (data.request_info?.success === false) {
      throw new Error(data.request_info?.message || "API request failed")
    }

    const results = (data.places_results || []).map((result: ValueSerpResult) => ({
      id: `${Date.now()}-${Math.random()}`,
      title: result.title,
      type: params.type.toLowerCase(),
      location: {
        city: params.city,
        region: extractRegion(result.address),
        address: result.address
      },
      phone: result.phone || "Contact for details",
      website: result.link || "",
      description: result.snippet || `Professional ${params.type.toLowerCase()} advisor in ${params.city}`,
      openingHours: result.hours || extractOpeningHours(result.extensions),
      rating: result.rating || 0,
      reviews: result.reviews || 0
    }))

    return {
      results,
      total: data.search_information?.total_results || results.length,
      hasMore: Boolean(data.pagination?.next),
      page: params.page || 1
    }
  } catch (error) {
    console.error("ValueSerp API Error:", error)
    throw new Error(error instanceof Error ? error.message : "Failed to fetch advisors")
  }
}

function extractRegion(address?: string): string {
  if (!address) return "United Kingdom"
  const parts = address.split(",")
  return parts.length > 1 ? parts[parts.length - 2].trim() : "United Kingdom"
}

function extractOpeningHours(extensions?: string[]): string {
  if (!extensions) return "Contact for hours"
  const hours = extensions.find(ext => ext.toLowerCase().includes("open"))
  return hours ? hours.replace(/open\s*[·•]?\s*/i, "") : "Contact for hours"
}