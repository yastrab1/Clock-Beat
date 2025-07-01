export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const code = searchParams.get('code');
    
    const exchangeResponse = await fetch('https://accounts.spotify.com/api/token', {
        method: 'POST',
        headers: {
            'Authorization': `Basic ${Buffer.from(process.env.SPOTIFY_CLIENT_ID+":"+process.env.SPOTIFY_CLIENT_SECRET).toString('base64')}`,
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: JSON.stringify({
            grant_type: 'authorization_code',
            code: code,
            redirect_uri: process.env.SPOTIFY_REDIRECT_URI || ''
        })
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

    const currentTrack = await response.json();
    return new Response(JSON.stringify(currentTrack), {
        headers: { 'Content-Type': 'application/json' }
    });
}