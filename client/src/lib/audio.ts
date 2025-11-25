// Audio tracks with actual file paths
import stayedGoneUrl from "@assets/Hazbin Hotel - Stayed Gone Instrumental high quality audio_1764062747147.mp3";
import hearMyHopeUrl from "@assets/Hazbin Hotel Season 2 - Hear My Hope Instrumental high quality audio_1764063523710.mp3";
import insaneUrl from "@assets/Insane Hazbin Hotel Original Song - Instrumental_1764062734894.mp3";
import voxDeiUrl from "@assets/Hazbin Hotel Season 2 - VOX DEI Instrumental high quality audio_1764063580083.mp3";
import dontYouForgetUrl from "@assets/Hazbin Hotel Season 2 - Dont You Forget Instrumental high quality audio_1764063596106.mp3";
import outForLoveUrl from "@assets/Hazbin Hotel - Out For Love Instrumental high quality audio_1764063833729.mp3";
import readyForThisUrl from "@assets/Hazbin Hotel - Ready For This Instrumental high quality audio_1764063838680.mp3";

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
let lastBackgroundTrack: "stayed-gone" | "hear-my-hope" = "stayed-gone";
let backgroundMusicCount = 0;

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
    let trackName = "Stayed Gone";
    
    if (location === "battle") {
      fileUrl = insaneUrl;
      trackName = "Insane";
    } else if (location === "background") {
      // Alternate between Stayed Gone and Hear My Hope
      if (backgroundMusicCount % 2 === 0) {
        fileUrl = stayedGoneUrl;
        trackName = "Stayed Gone";
        lastBackgroundTrack = "stayed-gone";
      } else {
        fileUrl = hearMyHopeUrl;
        trackName = "Hear My Hope";
        lastBackgroundTrack = "hear-my-hope";
      }
      backgroundMusicCount++;
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
      console.log(`Playing: ${trackName}`);
    } catch (e) {
      console.warn("Error playing audio:", e);
    }
  }
}

export function playBattleMusic(opponent: string): void {
  let fileUrl = insaneUrl;
  let trackName = "Insane";
  
  // Map opponents to their themes
  if (opponent === "alastor") {
    fileUrl = insaneUrl;
    trackName = "Insane";
  } else if (opponent === "vox" || opponent === "valentino") {
    fileUrl = voxDeiUrl;
    trackName = "Vox Dei";
  } else if (opponent === "rosie") {
    fileUrl = dontYouForgetUrl;
    trackName = "Don't You Forget";
  } else if (opponent === "carmilla") {
    fileUrl = outForLoveUrl;
    trackName = "Out For Love";
  } else if (opponent === "charlie") {
    fileUrl = readyForThisUrl;
    trackName = "Ready For This";
  } else if (opponent === "lucifer") {
    fileUrl = readyForThisUrl;
    trackName = "Ready For This";
  }
  
  // Stop existing audio
  if (audioElement) {
    audioElement.pause();
    audioElement.currentTime = 0;
  }
  
  // Create and play new audio
  try {
    audioElement = new Audio(fileUrl);
    audioElement.volume = 0.7;
    audioElement.loop = true;
    audioElement.play().catch(e => console.warn("Could not play audio:", e));
    console.log(`Playing battle theme: ${trackName}`);
    currentTrack = "battle";
  } catch (e) {
    console.warn("Error playing battle audio:", e);
  }
}

export function playMenuMusic(): void {
  // Stop existing audio
  if (audioElement) {
    audioElement.pause();
    audioElement.currentTime = 0;
  }
  
  // Create and play Hear My Hope
  try {
    audioElement = new Audio(hearMyHopeUrl);
    audioElement.volume = 0.5;
    audioElement.loop = true;
    audioElement.play().catch(e => console.warn("Could not play audio:", e));
    console.log("Playing: Hear My Hope");
    currentTrack = "menu";
  } catch (e) {
    console.warn("Error playing menu audio:", e);
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
