import RhythmClockDemo from "@/components/RhythmClockDemo";
import getCurrentTrack from "@/lib/spotify";

export default async function Home() {

    const currentTrack = await getCurrentTrack()
    console.log("getting current track")
    console.log(currentTrack)
    return (
        <div>
            <RhythmClockDemo/>
        </div>
    );
}
