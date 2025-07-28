import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Get user data from cookie or header (in real app)
  // For demo, we'll check localStorage on client side

  // Protected dashboard routes
  if (pathname.startsWith("/dashboard")) {
    // In real app, verify JWT token here
    // For demo, we'll handle this on client side
    return NextResponse.next()
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/dashboard/:path*"],
}
