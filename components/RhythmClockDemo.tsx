'use client';

import React, { useState, useEffect } from 'react';
import RhythmClock from './RhythmClock';

export default function RhythmClockDemo() {
  const [beatTimes, setBeatTimes] = useState<number[]>([]);

  // Generate sample lo-fi beat pattern for demo
  useEffect(() => {
    const generateLoFiBeat = () => {
      const bpm = 85; // Slow, lo-fi tempo
      const beatInterval = 60000 / bpm;
      const startTime = Date.now() + 2000; // Start in 2 seconds
      const beats: number[] = [];
      
      // Generate a longer pattern with slight variations
      for (let i = 0; i < 120; i++) {
        // Add slight timing variations for more organic feel
        const variation = (Math.random() - 0.5) * 50; // ±25ms variation
        beats.push(startTime + (i * beatInterval) + variation);
      }
      
      setBeatTimes(beats);
      
      // Continuously regenerate beats to keep the rhythm going
      setTimeout(generateLoFiBeat, 120 * beatInterval);
    };
    
    // Start the lo-fi beat after a short delay
    const timeout = setTimeout(generateLoFiBeat, 1000);
    
    return () => clearTimeout(timeout);
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
