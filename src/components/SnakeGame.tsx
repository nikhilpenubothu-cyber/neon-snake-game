import React, { useEffect, useRef, useState } from 'react';

const GRID_SIZE = 20;
const CELL_SIZE = 20;
const CANVAS_SIZE = GRID_SIZE * CELL_SIZE;

type Point = { x: number, y: number };

export default function SnakeGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  const snakeRef = useRef<Point[]>([{ x: 10, y: 10 }]);
  const directionRef = useRef<Point>({ x: 0, y: -1 });
  const nextDirectionRef = useRef<Point>({ x: 0, y: -1 });
  const foodRef = useRef<Point>({ x: 5, y: 5 });
  const lastMoveTimeRef = useRef<number>(0);
  const speedRef = useRef<number>(120);
  const gameOverRef = useRef<boolean>(false);
  const isPausedRef = useRef<boolean>(false);

  const spawnFood = (currentSnake: Point[]) => {
    let newFood: Point;
    while (true) {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE)
      };
      if (!currentSnake.some(segment => segment.x === newFood.x && segment.y === newFood.y)) {
        break;
      }
    }
    foodRef.current = newFood;
  };

  const resetGame = () => {
    snakeRef.current = [{ x: 10, y: 10 }];
    directionRef.current = { x: 0, y: -1 };
    nextDirectionRef.current = { x: 0, y: -1 };
    speedRef.current = 120;
    gameOverRef.current = false;
    isPausedRef.current = false;
    setGameOver(false);
    setIsPaused(false);
    setScore(0);
    spawnFood(snakeRef.current);
    lastMoveTimeRef.current = performance.now();
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", " "].includes(e.key)) {
        e.preventDefault();
      }

      if (e.key === ' ' && gameOverRef.current) {
         resetGame();
         return;
      }

      if (e.key === ' ' && !gameOverRef.current) {
         isPausedRef.current = !isPausedRef.current;
         setIsPaused(isPausedRef.current);
         return;
      }

      const currentDir = directionRef.current;
      switch (e.key) {
        case 'ArrowUp':
        case 'w':
        case 'W':
          if (currentDir.y !== 1) nextDirectionRef.current = { x: 0, y: -1 };
          break;
        case 'ArrowDown':
        case 's':
        case 'S':
          if (currentDir.y !== -1) nextDirectionRef.current = { x: 0, y: 1 };
          break;
        case 'ArrowLeft':
        case 'a':
        case 'A':
          if (currentDir.x !== 1) nextDirectionRef.current = { x: -1, y: 0 };
          break;
        case 'ArrowRight':
        case 'd':
        case 'D':
          if (currentDir.x !== -1) nextDirectionRef.current = { x: 1, y: 0 };
          break;
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    let animationFrameId: number;

    const moveSnake = () => {
      if (gameOverRef.current || isPausedRef.current) return;

      const head = snakeRef.current[0];
      const direction = nextDirectionRef.current;
      directionRef.current = direction;

      const newHead = { x: head.x + direction.x, y: head.y + direction.y };

      if (newHead.x < 0 || newHead.x >= GRID_SIZE || newHead.y < 0 || newHead.y >= GRID_SIZE) {
        gameOverRef.current = true;
        setGameOver(true);
        return;
      }

      if (snakeRef.current.some(segment => segment.x === newHead.x && segment.y === newHead.y)) {
        gameOverRef.current = true;
        setGameOver(true);
        return;
      }

      const newSnake = [newHead, ...snakeRef.current];

      if (newHead.x === foodRef.current.x && newHead.y === foodRef.current.y) {
        setScore(s => s + 10);
        speedRef.current = Math.max(50, speedRef.current - 2);
        spawnFood(newSnake);
      } else {
        newSnake.pop();
      }

      snakeRef.current = newSnake;
    };

    const draw = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      ctx.fillStyle = '#09090b'; // bg-zinc-950
      ctx.fillRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);

      // Grid lines
      ctx.strokeStyle = '#18181b'; // bg-zinc-900
      ctx.lineWidth = 1;
      for (let i = 0; i <= CANVAS_SIZE; i += CELL_SIZE) {
        ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i, CANVAS_SIZE); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(0, i); ctx.lineTo(CANVAS_SIZE, i); ctx.stroke();
      }

      // Food
      ctx.shadowBlur = 15;
      ctx.shadowColor = '#d946ef';
      ctx.fillStyle = '#d946ef';
      ctx.fillRect(foodRef.current.x * CELL_SIZE + 1, foodRef.current.y * CELL_SIZE + 1, CELL_SIZE - 2, CELL_SIZE - 2);

      // Snake
      ctx.shadowBlur = 10;
      ctx.shadowColor = '#22d3ee';
      snakeRef.current.forEach((segment, index) => {
        if (index === 0) {
           ctx.fillStyle = '#67e8f9';
        } else {
           ctx.fillStyle = '#22d3ee';
        }
        ctx.fillRect(segment.x * CELL_SIZE + 1, segment.y * CELL_SIZE + 1, CELL_SIZE - 2, CELL_SIZE - 2);
      });

      ctx.shadowBlur = 0;
    };

    const loop = (time: number) => {
      if (!gameOverRef.current && !isPausedRef.current) {
        const deltaTime = time - lastMoveTimeRef.current;
        if (deltaTime >= speedRef.current) {
          lastMoveTimeRef.current = time;
          moveSnake();
        }
      }
      draw();
      animationFrameId = requestAnimationFrame(loop);
    };

    lastMoveTimeRef.current = performance.now();
    animationFrameId = requestAnimationFrame(loop);

    return () => cancelAnimationFrame(animationFrameId);
  }, []);

  return (
    <div className="flex flex-col items-center gap-6 w-full max-w-[400px]">
      <div className="flex justify-between items-center w-full px-2">
        <div className="flex flex-col">
          <span className="text-zinc-500 font-mono text-xs uppercase tracking-widest">Score</span>
          <span className="text-4xl font-black text-cyan-400 drop-shadow-[0_0_8px_rgba(34,211,238,0.5)]">{score}</span>
        </div>
        <div className="flex flex-col items-end">
          <span className="text-zinc-500 font-mono text-xs uppercase tracking-widest">Status</span>
          <span className={`text-lg font-bold uppercase tracking-widest ${gameOver ? 'text-red-500' : isPaused ? 'text-yellow-400' : 'text-lime-400'}`}>
            {gameOver ? 'Game Over' : isPaused ? 'Paused' : 'Playing'}
          </span>
        </div>
      </div>

      <div className="relative p-2 rounded-xl bg-zinc-900 border border-zinc-800 shadow-[0_0_30px_rgba(34,211,238,0.1)] w-full aspect-square">
        <canvas
          ref={canvasRef}
          width={CANVAS_SIZE}
          height={CANVAS_SIZE}
          className="rounded-lg bg-zinc-950 block w-full h-full"
        />

        {gameOver && (
          <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-zinc-950/80 backdrop-blur-sm rounded-xl">
            <h2 
              className="text-4xl md:text-5xl font-digital text-fuchsia-500 mb-6 drop-shadow-[0_0_15px_rgba(217,70,239,0.8)] uppercase tracking-widest glitch text-center leading-tight"
              data-text="GAME OVER"
            >
              GAME OVER
            </h2>
            <p className="text-zinc-300 mb-8 font-mono text-lg">Final Score: <span className="text-cyan-400 font-bold">{score}</span></p>
            <button
              onClick={resetGame}
              className="px-8 py-4 bg-cyan-500/20 text-cyan-400 border border-cyan-500/50 rounded-lg font-bold uppercase tracking-widest hover:bg-cyan-500/30 hover:shadow-[0_0_20px_rgba(34,211,238,0.5)] transition-all cursor-pointer"
            >
              Play Again
            </button>
          </div>
        )}

        {isPaused && !gameOver && (
          <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-zinc-950/60 backdrop-blur-sm rounded-xl">
            <h2 className="text-3xl font-black text-yellow-400 mb-2 drop-shadow-[0_0_10px_rgba(250,204,21,0.8)] uppercase tracking-widest">Paused</h2>
            <p className="text-zinc-400 font-mono text-sm">Press Space to Resume</p>
          </div>
        )}
      </div>
    </div>
  );
}
