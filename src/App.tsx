import React from 'react';
import SnakeGame from './components/SnakeGame';
import MusicPlayer from './components/MusicPlayer';
import { Gamepad2 } from 'lucide-react';

export default function App() {
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 font-sans selection:bg-fuchsia-500/30 flex flex-col overflow-x-hidden">
      {/* Background Ambient Glow */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-fuchsia-600/10 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-cyan-600/10 blur-[120px]" />
      </div>

      <header className="relative z-10 w-full p-6 flex justify-center items-center border-b border-zinc-800/50 bg-zinc-950/50 backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <Gamepad2 className="w-8 h-8 text-cyan-400 drop-shadow-[0_0_8px_rgba(34,211,238,0.8)]" />
          <h1 className="text-3xl font-black tracking-tighter uppercase text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-fuchsia-500 drop-shadow-[0_0_10px_rgba(217,70,239,0.4)]">
            Neon Snake
          </h1>
        </div>
      </header>

      <main className="relative z-10 flex-1 flex flex-col lg:flex-row items-center justify-center gap-12 p-6 max-w-7xl mx-auto w-full">
        <div className="flex-1 flex justify-center w-full">
          <SnakeGame />
        </div>
        <div className="w-full lg:w-[400px] flex flex-col gap-8">
          <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6 text-center shadow-[0_0_20px_rgba(0,0,0,0.5)]">
            <h2 className="text-xl font-bold text-zinc-300 mb-4 uppercase tracking-widest text-sm">Controls</h2>
            <div className="grid grid-cols-2 gap-4 text-sm text-zinc-400">
              <div className="flex flex-col items-center p-3 bg-zinc-950 rounded-lg border border-zinc-800 shadow-inner">
                <span className="text-cyan-400 font-bold mb-1">WASD / Arrows</span>
                <span>Move Snake</span>
              </div>
              <div className="flex flex-col items-center p-3 bg-zinc-950 rounded-lg border border-zinc-800 shadow-inner">
                <span className="text-fuchsia-400 font-bold mb-1">Spacebar</span>
                <span>Pause / Restart</span>
              </div>
            </div>
          </div>
          <MusicPlayer />
        </div>
      </main>
    </div>
  );
}
