import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Pages that don't need a logged in user
const publicRoutes = ['/login', '/register']

export function middleware(request: NextRequest) {
    const token = request.cookies.get('accessToken')?.value
    const path = request.nextUrl.pathname

    const isPublicRoute = publicRoutes.includes(path)

    // If no token and trying to access a protected page, go to login
    if (!token && !isPublicRoute) {
        return NextResponse.redirect(new URL('/login', request.url))
    }

    // If already logged in and visiting login/register, go to dashboard
    if (token && isPublicRoute) {
        return NextResponse.redirect(new URL('/dashboard', request.url))
    }

    return NextResponse.next()
}

export const config = {
    matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}