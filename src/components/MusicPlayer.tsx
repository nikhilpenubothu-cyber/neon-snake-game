import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX, Music } from 'lucide-react';

const TRACKS = [
  { id: 1, title: "Cybernetic Pulse (AI Gen)", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3" },
  { id: 2, title: "Neon Synthwave (AI Gen)", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3" },
  { id: 3, title: "Digital Horizon (AI Gen)", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3" },
];

export default function MusicPlayer() {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [isMuted, setIsMuted] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  useEffect(() => {
    if (isPlaying && audioRef.current) {
      audioRef.current.play().catch(e => console.error("Audio play failed", e));
    }
  }, [currentTrackIndex, isPlaying]);

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play().catch(e => console.error("Audio play failed", e));
      }
      setIsPlaying(!isPlaying);
    }
  };

  const nextTrack = () => {
    setCurrentTrackIndex((prev) => (prev + 1) % TRACKS.length);
  };

  const prevTrack = () => {
    setCurrentTrackIndex((prev) => (prev - 1 + TRACKS.length) % TRACKS.length);
  };

  const handleEnded = () => {
    nextTrack();
  };

  return (
    <div className="bg-zinc-900/80 backdrop-blur-md border border-fuchsia-500/30 rounded-2xl p-6 shadow-[0_0_30px_rgba(217,70,239,0.15)] w-full max-w-md mx-auto flex flex-col items-center gap-4">
      <audio
        ref={audioRef}
        src={TRACKS[currentTrackIndex].url}
        onEnded={handleEnded}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
      />

      <div className="flex items-center gap-3 text-fuchsia-400">
        <Music className={`w-6 h-6 ${isPlaying ? 'animate-pulse' : ''}`} />
        <div className="flex flex-col items-center text-center">
          <span className="text-xs font-mono text-zinc-400 uppercase tracking-widest">Now Playing</span>
          <span className="font-semibold text-lg tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-400 to-cyan-400">
            {TRACKS[currentTrackIndex].title}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-6 mt-2">
        <button onClick={prevTrack} className="p-2 text-zinc-400 hover:text-cyan-400 transition-colors hover:drop-shadow-[0_0_8px_rgba(34,211,238,0.8)] cursor-pointer">
          <SkipBack className="w-6 h-6" />
        </button>
        <button
          onClick={togglePlay}
          className="p-4 bg-zinc-800 rounded-full text-fuchsia-400 border border-fuchsia-500/50 hover:bg-zinc-700 hover:text-fuchsia-300 transition-all hover:shadow-[0_0_15px_rgba(217,70,239,0.5)] cursor-pointer"
        >
          {isPlaying ? <Pause className="w-8 h-8" /> : <Play className="w-8 h-8 ml-1" />}
        </button>
        <button onClick={nextTrack} className="p-2 text-zinc-400 hover:text-cyan-400 transition-colors hover:drop-shadow-[0_0_8px_rgba(34,211,238,0.8)] cursor-pointer">
          <SkipForward className="w-6 h-6" />
        </button>
      </div>

      <div className="flex items-center gap-3 w-full mt-2 px-4">
        <button onClick={() => setIsMuted(!isMuted)} className="text-zinc-400 hover:text-cyan-400 cursor-pointer">
          {isMuted || volume === 0 ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
        </button>
        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={isMuted ? 0 : volume}
          onChange={(e) => {
            setVolume(parseFloat(e.target.value));
            if (isMuted) setIsMuted(false);
          }}
          className="w-full h-1 bg-zinc-700 rounded-lg appearance-none cursor-pointer accent-cyan-400"
        />
      </div>
    </div>
  );
}
