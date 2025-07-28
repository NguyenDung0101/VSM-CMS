import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  // Only allow access in development mode
  if (process.env.NODE_ENV !== "development") {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: "/admin/homepage/:path*",
};
