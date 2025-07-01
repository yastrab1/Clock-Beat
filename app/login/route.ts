import { randomInt } from "crypto";
import { redirect } from "next/navigation";

export async function GET(request: Request) {
    const state = randomInt(1000000).toString();
    const scope = 'user-read-private user-read-email user-read-currently-playing';

    const params = new URLSearchParams({
        response_type: 'code',
        client_id: process.env.SPOTIFY_CLIENT_ID || '',
        scope: scope,
        redirect_uri: process.env.SPOTIFY_REDIRECT_URI || '',
        state: state
    }).toString();
    return redirect('https://accounts.spotify.com/authorize?' + params);
}