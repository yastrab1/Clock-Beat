import getTopTracks from "@/lib/spotify";
import Image from "next/image";
import getCurrentTrack from "@/lib/spotify";

export default async function Home() {
  const topTracks = await getCurrentTrack();
  topTracks.then(console.log);

  return <div>
    {topTracks}
  </div>
}
