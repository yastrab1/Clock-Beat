export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const code = searchParams.get('code');
    

    const response = await fetch('https://api.spotify.com/v1/me/player/currently-playing?additional_types=track', {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${code}`
        }
    });

    const data = await response.json();
    return new Response(JSON.stringify(data), {
        headers: { 'Content-Type': 'application/json' }
    });
}