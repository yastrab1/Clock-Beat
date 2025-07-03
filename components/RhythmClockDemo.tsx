'use client';

import React, { useState, useEffect } from 'react';
import RhythmClock from './RhythmClock';
import {getBeats} from "@/lib/processing";

export default function RhythmClockDemo() {
  const [beatTimes, setBeatTimes] = useState<number[]>([]);
  useEffect(() => {
    getBeats().then(beatJSON => {
      setBeatTimes(beatJSON["beatTimestamps"])
    })

  }, []);

  return (
    <RhythmClock
      beatTimes={beatTimes}
      size={400}
      theme="warm"
      bpm={95}
      showTime={true}
    />
  );
}
