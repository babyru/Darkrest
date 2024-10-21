import supabaseClient from '@/utils/supabase'
import { NextResponse } from 'next/server'
 
export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const next = searchParams.get('next') ?? '/'

  if (code) {
     const { error } = await supabaseClient.auth.exchangeCodeForSession(code)
    
    if (error) {
      console.error('Error exchanging code for session:', error)
      return NextResponse.redirect(`${origin}/auth/auth-code-error`)
    }

    const forwardedHost = request.headers.get('x-forwarded-host')
    const isBehindLoadBalancer = process.env.IS_BEHIND_LOAD_BALANCER === 'true'

    if (isBehindLoadBalancer && forwardedHost) {
      return NextResponse.redirect(`https://${forwardedHost}${next}`)
    } else {
      return NextResponse.redirect(`${origin}${next}`)
    }
  }

  return NextResponse.redirect(`${origin}/auth/auth-code-error`)
}