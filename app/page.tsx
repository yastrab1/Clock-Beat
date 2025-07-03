import RhythmClockDemo from "@/components/RhythmClockDemo";
import getCurrentTrack from "@/lib/spotify";

export default function Home() {

    const currentTrack = getCurrentTrack()
    console.log("getting current track")
    console.log(currentTrack)
    currentTrack.then(() => {
        console.log("got current track");
        console.log(currentTrack)
    })

    return (
        <div>
            <RhythmClockDemo/>
        </div>
    );
}
