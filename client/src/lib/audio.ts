// Audio tracks with actual file paths
import stayedGoneUrl from "@assets/Hazbin Hotel - Stayed Gone Instrumental high quality audio_1764062747147.mp3";
import insaneUrl from "@assets/Insane Hazbin Hotel Original Song - Instrumental_1764062734894.mp3";

export interface AudioTrack {
  name: string;
  location: string;
  volume: number;
}

const tracks: Record<string, AudioTrack> = {
  "background": { name: "Stayed Gone", location: "background", volume: 0.5 },
  "battle": { name: "Insane", location: "battle", volume: 0.7 }
};

let currentTrack: string | null = null;
let audioElement: HTMLAudioElement | null = null;
let audioContext: AudioContext | null = null;

export function initAudio(): void {
  if (!audioContext) {
    try {
      audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    } catch (e) {
      console.warn("Web Audio API not available:", e);
    }
  }
}

export function playLocationMusic(location: string): void {
  const track = tracks[location];
  if (track) {
    currentTrack = location;
    
    // Determine which file to play
    let fileUrl = stayedGoneUrl;
    if (location === "battle") {
      fileUrl = insaneUrl;
    }
    
    // Stop existing audio
    if (audioElement) {
      audioElement.pause();
      audioElement.currentTime = 0;
    }
    
    // Create and play new audio
    try {
      audioElement = new Audio(fileUrl);
      audioElement.volume = track.volume;
      audioElement.loop = true;
      audioElement.play().catch(e => console.warn("Could not play audio:", e));
      console.log(`Playing: ${track.name}`);
    } catch (e) {
      console.warn("Error playing audio:", e);
    }
  }
}

export function stopMusic(): void {
  if (audioElement) {
    audioElement.pause();
    audioElement.currentTime = 0;
  }
  if (audioContext) {
    audioContext.suspend();
  }
  currentTrack = null;
}

export function setVolume(level: number): void {
  if (audioElement) {
    audioElement.volume = level;
  }
  if (audioContext) {
    // Volume would be applied to actual audio nodes
  }
}

export function getAvailableTracks(): AudioTrack[] {
  return Object.values(tracks);
}
