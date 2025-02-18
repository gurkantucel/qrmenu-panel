import { type NextRequest } from 'next/server'

export async function POST(req: NextRequest) {
    const conversationId = req.nextUrl.pathname.split("/")[4];
    return new Response(null, { status: 302, headers: { Location: `/app/auth/pay-success-3d/${conversationId}` } });
}