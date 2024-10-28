import { NextResponse } from "next/server"
import { SearchResponse } from "@/lib/types"
import { getAdvisors } from "@/lib/advisors"

export const dynamic = "force-dynamic"
export const runtime = "edge"

const DEFAULT_RESPONSE: SearchResponse = {
  results: [],
  total: 0,
  hasMore: false,
  page: 1
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const type = searchParams.get("type")
    const city = searchParams.get("city")
    const page = parseInt(searchParams.get("page") || "1")
    const limit = 9

    if (!type || !city) {
      return NextResponse.json(DEFAULT_RESPONSE)
    }

    const { advisors, total } = await getAdvisors({ 
      type, 
      city, 
      page, 
      limit 
    })

    return NextResponse.json({
      results: advisors,
      total,
      hasMore: total > page * limit,
      page
    })
  } catch (error) {
    console.error("Search API error:", error)
    return NextResponse.json(
      { 
        ...DEFAULT_RESPONSE,
        error: true,
        message: error instanceof Error ? error.message : "Failed to fetch advisors"
      },
      { status: 200 }
    )
  }
}