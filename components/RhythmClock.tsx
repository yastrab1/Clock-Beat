'use client';
import dynamic from 'next/dynamic'


import React, { useState, useEffect, useRef } from 'react';
import { useBeatAnimation } from './useBeatAnimation';

interface RhythmClockProps {
  /** Array of timestamps (in milliseconds) when beats should occur */
  beatTimes: number[];
  /** Clock size in pixels */
  size?: number;
  /** Primary color theme */
  theme?: 'warm' | 'cool' | 'mono';
  /** Show subtle digital time */
  showTime?: boolean;
  /** BPM of the current song */
  bpm?: number;
}

function RhythmClockInternal({
  beatTimes = [],
  size = 320,
  theme = 'warm',
  showTime = true,
  bpm = 85
}: RhythmClockProps) {
  const [currentTime, setCurrentTime] = useState(new Date());
  const containerRef = useRef<HTMLDivElement>(null);

// Advanced BPM-based color palette system
const getBPMColorPalette = (bpm: number) => {
  if (bpm < 60) {
    // Very slow - Deep blues and purples (ambient/drone)
    return {
      primary: '#2d1b69',
      secondary: '#11047a',
      accent: '#5b21b6',
      particles: ['#2d1b69', '#11047a', '#5b21b6', '#7c3aed']
    };
  } else if (bpm < 80) {
    // Slow - Cool blues and teals (lo-fi/chill)
    return {
      primary: '#0891b2',
      secondary: '#0e7490',
      accent: '#155e75',
      particles: ['#0891b2', '#0e7490', '#155e75', '#22d3ee']
    };
  } else if (bpm < 100) {
    // Medium slow - Warm oranges and yellows (indie/folk)
    return {
      primary: '#f59e0b',
      secondary: '#d97706',
      accent: '#b45309',
      particles: ['#f59e0b', '#d97706', '#b45309', '#fbbf24']
    };
  } else if (bpm < 120) {
    // Medium - Greens and earth tones (rock/pop)
    return {
      primary: '#059669',
      secondary: '#047857',
      accent: '#065f46',
      particles: ['#059669', '#047857', '#065f46', '#10b981']
    };
  } else if (bpm < 140) {
    // Fast - Reds and pinks (dance/electronic)
    return {
      primary: '#dc2626',
      secondary: '#b91c1c',
      accent: '#991b1b',
      particles: ['#dc2626', '#b91c1c', '#991b1b', '#f87171']
    };
  } else {
    // Very fast - Bright magentas and violets (hardcore/drum & bass)
    return {
      primary: '#c026d3',
      secondary: '#a21caf',
      accent: '#86198f',
      particles: ['#c026d3', '#a21caf', '#86198f', '#e879f9']
    };
  }
};

const colors = getBPMColorPalette(bpm);

  // Use custom hook for all beat-synced animations
  const { particles, clockScale, beatIntensity, glowIntensity, registerParticleElement } = useBeatAnimation(
    beatTimes,
    colors.particles
  );

  // Update current time smoothly
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 100); // More frequent updates for smoother animation

    return () => clearInterval(timer);
  }, []);

  // Calculate hand positions with smooth animation
  const hours = currentTime.getHours() % 12;
  const minutes = currentTime.getMinutes();
  const seconds = currentTime.getSeconds();
  const milliseconds = currentTime.getMilliseconds();

  // Smooth second hand movement
  const smoothSeconds = seconds + milliseconds / 1000;

  const hourAngle = (hours * 30) + (minutes * 0.5) - 90;
  const minuteAngle = (minutes * 6) + (seconds * 0.1) - 90;
  const secondAngle = (smoothSeconds * 6) - 90;

  // Hand coordinates with beat influence
  const centerX = size / 2;
  const centerY = size / 2;
  const beatOffset = beatIntensity * 3;

  const hourHandLength = size * 0.28;
  const minuteHandLength = size * 0.38;
  const secondHandLength = size * 0.42;

  const hourHandX = centerX + (hourHandLength + beatOffset) * Math.cos(hourAngle * Math.PI / 180);
  const hourHandY = centerY + (hourHandLength + beatOffset) * Math.sin(hourAngle * Math.PI / 180);

  const minuteHandX = centerX + (minuteHandLength + beatOffset) * Math.cos(minuteAngle * Math.PI / 180);
  const minuteHandY = centerY + (minuteHandLength + beatOffset) * Math.sin(minuteAngle * Math.PI / 180);

  const secondHandX = centerX + (secondHandLength + beatOffset * 1.5) * Math.cos(secondAngle * Math.PI / 180);
  const secondHandY = centerY + (secondHandLength + beatOffset * 1.5) * Math.sin(secondAngle * Math.PI / 180);

  // Format time simply
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    }).toLowerCase();
  };

  // clockScale and glowIntensity come from the custom hook

  return (
    <div ref={containerRef} className="relative min-h-screen overflow-hidden flex items-center justify-center bg-black">
      <div
        className="relative"
        style={{
          transform: `scale(${clockScale})`,
          transition: 'transform 0.2s ease-out'
        }}
      >
        {/* Clock SVG */}
        <svg
          width={size}
          height={size}
        >
          {/* Clock face */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={size / 2 - 20}
            fill="transparent"
            stroke={colors.primary}
            strokeWidth="1"
            className="opacity-60"
            style={{ filter: `blur(${glowIntensity}px)` }}
          />

          {/* Hour hand */}
          <line
            x1={centerX}
            y1={centerY}
            x2={hourHandX}
            y2={hourHandY}
            stroke={colors.secondary}
            strokeWidth="6"
            strokeLinecap="round"
            style={{ opacity: 0.8 }}
          />

          {/* Minute hand */}
          <line
            x1={centerX}
            y1={centerY}
            x2={minuteHandX}
            y2={minuteHandY}
            stroke={colors.secondary}
            strokeWidth="4"
            strokeLinecap="round"
            style={{ opacity: 0.8 }}
          />

          {/* Second hand */}
          <line
            x1={centerX}
            y1={centerY}
            x2={secondHandX}
            y2={secondHandY}
            stroke={colors.accent}
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      </div>

      {/* Ambient particles */}
      {particles.map((particle, index) => (
        <div
          key={particle.id}
          ref={(el) => registerParticleElement(index, el)}
          style={{
            position: 'absolute',
            left: particle.x, // Initial position only
            top: particle.y,  // Animation will update via direct DOM manipulation
            width: particle.size,
            height: particle.size,
            borderRadius: '50%',
            backgroundColor: particle.color,
            opacity: particle.opacity, // Initial opacity only
            pointerEvents: 'none'
          }}
        />
      ))}

      {/* Subtle time display */}
      {showTime && (
        <div
          style={{
            position: 'absolute',
            bottom: '10px',
            color: colors.primary,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            padding: '5px 10px',
            borderRadius: '10px',
            fontSize: '0.9rem',
            fontFamily: 'monospace'
          }}
        >
          {formatTime(currentTime)}
        </div>
      )}
    </div>
  );
}
export default dynamic((()=> Promise.resolve(RhythmClockInternal)), {
  ssr: false,
})