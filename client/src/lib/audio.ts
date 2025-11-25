// Audio system using Web Audio API
// Note: Actual audio files would be loaded from assets/audio/

export interface AudioTrack {
  name: string;
  location: string;
  volume: number;
}

const tracks: Record<string, AudioTrack> = {
  "hotel-lobby": { name: "Hazbin Hotel Lobby Theme", location: "lobby", volume: 0.5 },
  "streets": { name: "Pentagram City Streets", location: "streets", volume: 0.6 },
  "battle": { name: "Combat Theme", location: "battle", volume: 0.7 },
  "club": { name: "Club Atmosphere", location: "club", volume: 0.4 }
};

let currentTrack: string | null = null;
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
    // In a real implementation, would load and play audio file here
    console.log(`Playing: ${track.name}`);
  }
}

export function stopMusic(): void {
  if (audioContext) {
    audioContext.suspend();
  }
  currentTrack = null;
}

export function setVolume(level: number): void {
  if (audioContext) {
    // Volume would be applied to actual audio nodes
  }
}

export function getAvailableTracks(): AudioTrack[] {
  return Object.values(tracks);
}
