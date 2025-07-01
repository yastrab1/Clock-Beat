import {auth} from "@clerk/nextjs/server";
import {getClientToken} from "./redis";
import {Buffer} from 'buffer';
// Authorization token that must have been created previously. See : https://developer.spotify.com/documentation/web-api/concepts/authorization
const server_token = 'a28afa0f2b2744bfba5645253a192931';

async function fetchWebApi(endpoint: string, method: string, body: any, token: string = server_token): Promise<any> {
    const res = await fetch(`https://api.spotify.com/${endpoint}`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
        method,
    });
    return await res.json();
}

export default async function getCurrentTrack() {
    const {userId} = await auth();
    const token = await getClientToken(userId || '');
    const response = await fetchWebApi(
        'v1/me/player/currently-playing', 'GET', {}, Buffer.from(process.env.SPOTIFY_CLIENT_ID + ":" + process.env.SPOTIFY_CLIENT_SECRET).toString('base64'))
    return response.items
}
