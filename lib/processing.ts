import getCurrentTrack from "@/lib/spotify";
import {searchYoutube} from "@/lib/youtube";

export async function getBeats(){
    const currentTrack = await getCurrentTrack()
    const trackName = currentTrack["item"]["name"]
    const ytURL = await searchYoutube(trackName)
    const videoID = ytURL.url.split("=")[1]
    const processingMachineURL = process.env.NEXT_PUBLIC_PROCESSING_MACHINE_URL || ''

    const processed = await fetch(processingMachineURL+"?songName="+ytURL.title+"&songURL="+videoID)
    return await processed.json()
}