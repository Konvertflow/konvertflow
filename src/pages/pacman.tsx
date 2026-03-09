import Head from 'next/head';
import { useEffect, useRef, useState } from 'react';

import { GameState, setupPacmanGame } from '@/components/pacmanGame';

const PacmanPage = () => {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const [score, setScore] = useState(0);
    const [state, setState] = useState<GameState>('running');

    useEffect(() => {
        const canvas = canvasRef.current;

        if (!canvas) {
            return undefined;
        }

        const cleanup = setupPacmanGame(canvas, {
            onScoreChange: setScore,
            onStateChange: setState
        });

        return cleanup;
    }, []);

    return (
        <>
            <Head>
                <title>Pac-Man | Konvertflow</title>
                <meta name="description" content="Play a lightweight Pac-Man game built with HTML5 Canvas." />
            </Head>

            <main className="min-h-screen bg-zinc-950 px-6 py-10 text-zinc-100">
                <div className="mx-auto flex w-full max-w-4xl flex-col items-center gap-6">
                    <h1 className="text-3xl font-bold text-yellow-300">Pac-Man</h1>
                    <p className="text-sm text-zinc-300">Use the arrow keys to move, eat all pellets, and avoid ghosts.</p>
                    <div className="flex gap-4 text-sm font-semibold sm:text-base">
                        <span className="rounded-full bg-zinc-900 px-4 py-2">Score: {score}</span>
                        <span className="rounded-full bg-zinc-900 px-4 py-2">
                            {state === 'running' ? 'State: Running' : state === 'won' ? 'State: You Win!' : 'State: Game Over'}
                        </span>
                    </div>

                    <div className="rounded-xl border border-zinc-700 bg-black p-2 shadow-lg shadow-black/40">
                        <canvas ref={canvasRef} aria-label="Pac-Man game canvas" />
                    </div>
                </div>
            </main>
        </>
    );
};

export default PacmanPage;
