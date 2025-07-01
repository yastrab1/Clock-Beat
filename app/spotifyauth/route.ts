import { Redis } from '@upstash/redis'
import { auth } from "@clerk/nextjs/server";
import { setClientToken } from '@/lib/redis';

export async function GET(request: Request) {
    const { userId } = await auth();
    if (!userId) {
        return new Response('Unauthorized', { status: 401 });
    }


    const { searchParams } = new URL(request.url);
    const code = searchParams.get('code');
    console.log(code);
    const exchangeResponse = await fetch('https://accounts.spotify.com/api/token', {
        method: 'POST',
        headers: {
            'Authorization': `Basic ${Buffer.from(process.env.SPOTIFY_CLIENT_ID + ":" + process.env.SPOTIFY_CLIENT_SECRET).toString('base64')}`,
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: new URLSearchParams({
            code: code || '',
            redirect_uri: process.env.SPOTIFY_REDIRECT_URI || '',
            grant_type: 'authorization_code'
        }).toString()
    });
    const tokenResponse = await exchangeResponse.json();
    console.log(tokenResponse);
    const accessToken = tokenResponse.access_token;

    const response = await fetch('https://api.spotify.com/v1/me/player/currently-playing?additional_types=track', {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${accessToken}`
        }
    });




    await setClientToken(userId, JSON.stringify(accessToken));
    return new Response("Success", { status: 200 });
}