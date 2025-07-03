'use client';

import React, { useState, useEffect } from 'react';
import RhythmClock from './RhythmClock';

interface BPMDemo {
  bpm: number;
  genre: string;
  description: string;
}

const bpmDemos: BPMDemo[] = [
  { bpm: 45, genre: "Ambient", description: "Deep blues and purples" },
  { bpm: 72, genre: "Lo-fi", description: "Cool blues and teals" },
  { bpm: 88, genre: "Indie", description: "Warm oranges and yellows" },
  { bpm: 110, genre: "Rock", description: "Greens and earth tones" },
  { bpm: 128, genre: "Dance", description: "Reds and pinks" },
  { bpm: 160, genre: "D&B", description: "Bright magentas and violets" }
];

export default function BPMColorDemo() {
  const [currentDemo, setCurrentDemo] = useState(0);
  const [beatTimes, setBeatTimes] = useState<number[]>([]);
  const [isPlaying, setIsPlaying] = useState(false);

  // Generate beat pattern for current BPM
  useEffect(() => {
    const generateBeatPattern = () => {
      const bpm = bpmDemos[currentDemo].bpm;
      const beatInterval = 60000 / bpm;
      const startTime = Date.now() + 1000;
      const beats: number[] = [];
      
      // Generate beats for the next 30 seconds
      for (let i = 0; i < Math.floor(30 * bpm / 60); i++) {
        beats.push(Math.floor(startTime + (i * beatInterval)));
      }
      
      setBeatTimes(beats);
    };

    generateBeatPattern();
  }, [currentDemo]);

  const nextDemo = () => {
    setCurrentDemo((prev) => (prev + 1) % bpmDemos.length);
  };

  const prevDemo = () => {
    setCurrentDemo((prev) => (prev - 1 + bpmDemos.length) % bpmDemos.length);
  };

  const currentBPM = bpmDemos[currentDemo];

  return (
    <div className="relative min-h-screen bg-black text-white">
      {/* Main clock display */}
      <RhythmClock
        beatTimes={beatTimes}
        size={400}
        bpm={currentBPM.bpm}
        showTime={true}
      />

      {/* BPM Info Panel */}
      <div className="absolute top-4 left-4 bg-black bg-opacity-50 p-4 rounded-lg">
        <h2 className="text-xl font-bold mb-2">BPM Color Palette Demo</h2>
        <div className="space-y-2">
          <div className="text-lg">
            <span className="font-semibold">{currentBPM.bpm} BPM</span> - {currentBPM.genre}
          </div>
          <div className="text-sm text-gray-300">
            {currentBPM.description}
          </div>
        </div>
      </div>

      {/* Navigation Controls */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-4">
        <button
          onClick={prevDemo}
          className="bg-white bg-opacity-20 hover:bg-opacity-30 px-4 py-2 rounded-lg transition-all"
        >
          ← Previous
        </button>
        <button
          onClick={nextDemo}
          className="bg-white bg-opacity-20 hover:bg-opacity-30 px-4 py-2 rounded-lg transition-all"
        >
          Next →
        </button>
      </div>

      {/* BPM Range Indicators */}
      <div className="absolute top-4 right-4 bg-black bg-opacity-50 p-4 rounded-lg">
        <h3 className="font-semibold mb-2">BPM Ranges</h3>
        <div className="space-y-1 text-sm">
          {bpmDemos.map((demo, index) => (
            <div
              key={index}
              className={`cursor-pointer p-2 rounded ${
                index === currentDemo ? 'bg-white bg-opacity-20' : 'hover:bg-white hover:bg-opacity-10'
              }`}
              onClick={() => setCurrentDemo(index)}
            >
              <span className="font-mono">{demo.bpm}</span> - {demo.genre}
            </div>
          ))}
        </div>
      </div>

      {/* Auto-advance toggle */}
      <div className="absolute bottom-4 right-4">
        <button
          onClick={() => {
            if (isPlaying) {
              setIsPlaying(false);
            } else {
              setIsPlaying(true);
              // Auto-advance every 10 seconds
              const interval = setInterval(() => {
                setCurrentDemo((prev) => (prev + 1) % bpmDemos.length);
              }, 10000);
              setTimeout(() => {
                clearInterval(interval);
                setIsPlaying(false);
              }, 60000); // Run for 1 minute
            }
          }}
          className="bg-white bg-opacity-20 hover:bg-opacity-30 px-4 py-2 rounded-lg transition-all"
        >
          {isPlaying ? 'Stop Auto-Demo' : 'Start Auto-Demo'}
        </button>
      </div>
    </div>
  );
}
