import RhythmClockDemo from "@/components/RhythmClockDemo";
import getCurrentTrack from "@/lib/spotify";

export default function Home() {
  const currentTrack = getCurrentTrack()
  currentTrack.then(data => {
    console.log(data);
  })
  return (
    <div>
      <RhythmClockDemo />
    </div>
  );
}
