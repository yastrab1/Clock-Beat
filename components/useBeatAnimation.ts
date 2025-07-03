import { useState, useEffect, useRef } from 'react';

interface Particle {
  id: number;
  x: number;
  y: number;
  baseX: number;
  baseY: number;
  size: number;
  opacity: number;
  speed: number;
  angle: number;
  pulsePhase: number;
  color: string;
}

// Only store UI state that affects clock rendering
interface BeatAnimationState {
  clockScale: number;
  beatIntensity: number;
  glowIntensity: number;
}

export function useBeatAnimation(beatTimes: number[], colors: string[]) {
  // Only manage clock-related state, not particles
  const [uiState, setUiState] = useState<BeatAnimationState>({
    clockScale: 1,
    beatIntensity: 0,
    glowIntensity: 0
  });

  const animationRef = useRef<number>(0);
  const lastBeatRef = useRef(-1);
  const beatIntensityRef = useRef(0);
  const particlesRef = useRef<Particle[]>([]);
  const particleElementsRef = useRef<HTMLElement[]>([]);

  // Initialize particles once
  useEffect(() => {
    const generateParticles = () => {
      const particleCount = 100;
      const newParticles: Particle[] = [];
      console.log("generating particles")
      for (let i = 0; i < particleCount; i++) {
        newParticles.push({
          id: i,
          x: Math.random() * window.innerWidth,
          y: Math.random() * window.innerHeight,
          baseX: Math.random() * window.innerWidth,
          baseY: Math.random() * window.innerHeight,
          size: Math.random() * 3 + 1,
          opacity: Math.random() * 0.6 + 0.2,
          speed: Math.random() * 0.5 + 0.1,
          angle: Math.random() * Math.PI * 2,
          pulsePhase: Math.random() * Math.PI * 2,
          color: colors[Math.floor(Math.random() * colors.length)]
        });
      }

      particlesRef.current = newParticles;
    };

    generateParticles();

    const handleResize = () => {
      generateParticles();
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Main animation loop - separated into beat detection and particle animation
  useEffect(() => {
    let lastUIUpdate = 0;
    
    const animate = () => {
      const now = Date.now();
      const time = now * 0.001;

      // Check for beats
      const closestBeat = beatTimes.find((beatTime, index) => {
        const timeDiff = Math.abs(now - beatTime);
        return timeDiff <= 300 && index > lastBeatRef.current;
      });

      let beatOccurred = false;
      if (closestBeat !== undefined) {
        const beatIndex = beatTimes.indexOf(closestBeat);
        if (beatIndex > lastBeatRef.current) {
          beatIntensityRef.current = 1;
          lastBeatRef.current = beatIndex;
          beatOccurred = true;
        }
      }

      // Decay intensity smoothly
      beatIntensityRef.current = Math.max(0, beatIntensityRef.current - 0.015);

      // Update particles directly in ref (no React state)
      particlesRef.current = particlesRef.current.map(particle => {
        const beatSway = beatIntensityRef.current * 20 * Math.sin(time * 2 + particle.pulsePhase);
        
        return {
          ...particle,
          x: particle.baseX + Math.sin(time * particle.speed + particle.angle) * 30 + beatSway,
          y: particle.baseY + Math.cos(time * particle.speed * 0.7 + particle.angle) * 20 + beatSway * 0.5,
          opacity:  (0.2 + beatIntensityRef.current * 0.8)
        };
      });

      // Update particle DOM elements directly (bypass React)
      particleElementsRef.current.forEach((element, index) => {
        if (element && particlesRef.current[index]) {
          const particle = particlesRef.current[index];
          element.style.left = `${particle.x}px`;
          element.style.top = `${particle.y}px`;
          element.style.opacity = particle.opacity.toString();
        }
      });

      // Only update React state occasionally for clock UI (not every frame)
      if (beatOccurred || now - lastUIUpdate > 100) { // Update UI every 100ms or on beat
        setUiState({
          clockScale: 1 + beatIntensityRef.current * 0.05,
          beatIntensity: beatIntensityRef.current,
          glowIntensity: beatIntensityRef.current * 0.8
        });
        lastUIUpdate = now;
      }

      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [beatTimes]); // Only depend on beatTimes array

  // Function to register particle DOM elements
  const registerParticleElement = (index: number, element: HTMLElement | null) => {
    if (element) {
      particleElementsRef.current[index] = element;
    }
  };

  return {
    ...uiState,
    particles: particlesRef.current,
    registerParticleElement
  };
}
