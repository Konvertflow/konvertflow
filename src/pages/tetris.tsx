import Head from 'next/head';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';

type Cell = string | null;
type PieceKey = 'I' | 'J' | 'L' | 'O' | 'S' | 'T' | 'Z';

const COLS = 10;
const ROWS = 20;
const BLOCK_SIZE = 30;
const DROP_INTERVAL = 420;

const SHAPES: Record<PieceKey, number[][]> = {
    I: [
        [0, 0, 0, 0],
        [1, 1, 1, 1],
        [0, 0, 0, 0],
        [0, 0, 0, 0]
    ],
    J: [
        [1, 0, 0],
        [1, 1, 1],
        [0, 0, 0]
    ],
    L: [
        [0, 0, 1],
        [1, 1, 1],
        [0, 0, 0]
    ],
    O: [
        [1, 1],
        [1, 1]
    ],
    S: [
        [0, 1, 1],
        [1, 1, 0],
        [0, 0, 0]
    ],
    T: [
        [0, 1, 0],
        [1, 1, 1],
        [0, 0, 0]
    ],
    Z: [
        [1, 1, 0],
        [0, 1, 1],
        [0, 0, 0]
    ]
};

const COLORS: Record<PieceKey, string> = {
    I: '#00eaff',
    J: '#4f8fff',
    L: '#ff9c3d',
    O: '#ffe54d',
    S: '#5fff86',
    T: '#dd59ff',
    Z: '#ff4d71'
};

const PIECES = Object.keys(SHAPES) as PieceKey[];

type Piece = {
    type: PieceKey;
    matrix: number[][];
    x: number;
    y: number;
};

const createEmptyBoard = (): Cell[][] => Array.from({ length: ROWS }, () => Array.from({ length: COLS }, () => null));

const rotate = (matrix: number[][]): number[][] => matrix[0].map((_, col) => matrix.map((row) => row[col]).reverse());

const randomPiece = (): Piece => {
    const type = PIECES[Math.floor(Math.random() * PIECES.length)];
    const matrix = SHAPES[type].map((row) => [...row]);
    return {
        type,
        matrix,
        x: Math.floor(COLS / 2 - matrix[0].length / 2),
        y: 0
    };
};

const collides = (board: Cell[][], piece: Piece): boolean => {
    for (let y = 0; y < piece.matrix.length; y += 1) {
        for (let x = 0; x < piece.matrix[y].length; x += 1) {
            if (!piece.matrix[y][x]) continue;
            const nextX = piece.x + x;
            const nextY = piece.y + y;
            if (nextX < 0 || nextX >= COLS || nextY >= ROWS) return true;
            if (nextY >= 0 && board[nextY][nextX]) return true;
        }
    }
    return false;
};

const merge = (board: Cell[][], piece: Piece): Cell[][] => {
    const next = board.map((row) => [...row]);
    for (let y = 0; y < piece.matrix.length; y += 1) {
        for (let x = 0; x < piece.matrix[y].length; x += 1) {
            if (piece.matrix[y][x] && piece.y + y >= 0) {
                next[piece.y + y][piece.x + x] = COLORS[piece.type];
            }
        }
    }
    return next;
};

const clearLines = (board: Cell[][]): { board: Cell[][]; lines: number } => {
    const filtered = board.filter((row) => row.some((cell) => !cell));
    const lines = ROWS - filtered.length;
    while (filtered.length < ROWS) filtered.unshift(Array.from({ length: COLS }, () => null));
    return { board: filtered, lines };
};

export default function TetrisPage() {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const boardRef = useRef<Cell[][]>(createEmptyBoard());
    const pieceRef = useRef<Piece>(randomPiece());
    const gameOverRef = useRef(false);

    const [score, setScore] = useState(0);
    const [lines, setLines] = useState(0);
    const [gameOver, setGameOver] = useState(false);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return undefined;
        const ctx = canvas.getContext('2d');
        if (!ctx) return undefined;

        canvas.width = COLS * BLOCK_SIZE;
        canvas.height = ROWS * BLOCK_SIZE;

        const drawCell = (x: number, y: number, color: string, glow = false) => {
            const px = x * BLOCK_SIZE;
            const py = y * BLOCK_SIZE;
            ctx.fillStyle = color;
            if (glow) {
                ctx.shadowBlur = 16;
                ctx.shadowColor = color;
            } else {
                ctx.shadowBlur = 0;
            }
            ctx.fillRect(px + 1, py + 1, BLOCK_SIZE - 2, BLOCK_SIZE - 2);
        };

        const draw = () => {
            const flash = 0.55 + Math.sin(Date.now() * 0.012) * 0.25;
            ctx.fillStyle = `rgba(12, 10, 30, ${Math.min(0.9, flash)})`;
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            boardRef.current.forEach((row, y) => {
                row.forEach((color, x) => {
                    if (color) drawCell(x, y, color);
                });
            });

            const piece = pieceRef.current;
            piece.matrix.forEach((row, y) => {
                row.forEach((value, x) => {
                    if (value) drawCell(piece.x + x, piece.y + y, COLORS[piece.type], true);
                });
            });

            ctx.shadowBlur = 0;
            ctx.strokeStyle = 'rgba(255, 230, 77, 0.14)';
            for (let y = 0; y <= ROWS; y += 1) {
                ctx.beginPath();
                ctx.moveTo(0, y * BLOCK_SIZE);
                ctx.lineTo(canvas.width, y * BLOCK_SIZE);
                ctx.stroke();
            }
            for (let x = 0; x <= COLS; x += 1) {
                ctx.beginPath();
                ctx.moveTo(x * BLOCK_SIZE, 0);
                ctx.lineTo(x * BLOCK_SIZE, canvas.height);
                ctx.stroke();
            }
        };

        const spawnPiece = () => {
            const next = randomPiece();
            pieceRef.current = next;
            if (collides(boardRef.current, next)) {
                gameOverRef.current = true;
                setGameOver(true);
            }
        };

        const tick = () => {
            if (gameOverRef.current) {
                draw();
                return;
            }

            const moved = { ...pieceRef.current, y: pieceRef.current.y + 1 };
            if (!collides(boardRef.current, moved)) {
                pieceRef.current = moved;
            } else {
                boardRef.current = merge(boardRef.current, pieceRef.current);
                const cleared = clearLines(boardRef.current);
                boardRef.current = cleared.board;
                if (cleared.lines > 0) {
                    setLines((prev) => prev + cleared.lines);
                    setScore((prev) => prev + cleared.lines * 120);
                } else {
                    setScore((prev) => prev + 10);
                }
                spawnPiece();
            }
            draw();
        };

        const handleKeyDown = (event: KeyboardEvent) => {
            if (gameOverRef.current) return;

            if (event.key === 'ArrowLeft') {
                const next = { ...pieceRef.current, x: pieceRef.current.x - 1 };
                if (!collides(boardRef.current, next)) pieceRef.current = next;
            }
            if (event.key === 'ArrowRight') {
                const next = { ...pieceRef.current, x: pieceRef.current.x + 1 };
                if (!collides(boardRef.current, next)) pieceRef.current = next;
            }
            if (event.key === 'ArrowDown') {
                const next = { ...pieceRef.current, y: pieceRef.current.y + 1 };
                if (!collides(boardRef.current, next)) pieceRef.current = next;
            }
            if (event.key === 'ArrowUp' || event.key.toLowerCase() === 'x') {
                const rotated = { ...pieceRef.current, matrix: rotate(pieceRef.current.matrix) };
                if (!collides(boardRef.current, rotated)) pieceRef.current = rotated;
            }
            draw();
        };

        draw();
        const loop = window.setInterval(tick, DROP_INTERVAL);
        window.addEventListener('keydown', handleKeyDown);

        return () => {
            window.clearInterval(loop);
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, []);

    const restart = () => {
        boardRef.current = createEmptyBoard();
        pieceRef.current = randomPiece();
        gameOverRef.current = false;
        setScore(0);
        setLines(0);
        setGameOver(false);
    };

    return (
        <>
            <Head>
                <title>Tetris | Konvertflow</title>
                <meta name="description" content="Play a colorful, fast, and flashy mini Tetris game." />
            </Head>

            <main className="min-h-screen bg-gradient-to-b from-yellow-200 via-fuchsia-300 to-indigo-700 px-6 py-10 text-zinc-950">
                <div className="mx-auto flex w-full max-w-5xl flex-col items-center gap-6">
                    <Link href="/" className="text-sm font-semibold underline">
                        ← Back to home
                    </Link>
                    <h1 className="text-4xl font-black tracking-wide text-yellow-50 drop-shadow-[0_0_10px_rgba(255,255,0,0.8)]">PLAY TETRIS</h1>
                    <p className="text-center text-sm font-semibold text-white">Arrow keys move blocks, Up/X rotates. Clear lines and chase the glow.</p>

                    <div className="flex flex-wrap items-center justify-center gap-3">
                        <span className="rounded-full bg-black/60 px-4 py-2 text-sm font-bold text-yellow-200">Score: {score}</span>
                        <span className="rounded-full bg-black/60 px-4 py-2 text-sm font-bold text-cyan-200">Lines: {lines}</span>
                        <button
                            type="button"
                            onClick={restart}
                            className="rounded-full bg-yellow-300 px-5 py-2 text-sm font-black text-zinc-900 transition hover:bg-yellow-200"
                        >
                            Restart
                        </button>
                    </div>

                    <div className="rounded-2xl border-4 border-yellow-300 bg-black p-2 shadow-[0_0_30px_rgba(255,255,0,0.55)]">
                        <canvas ref={canvasRef} aria-label="Tetris game board" className="h-auto max-w-full" />
                    </div>

                    {gameOver ? <p className="text-lg font-black text-yellow-100">Game Over! Hit Restart and go again.</p> : null}
                </div>
            </main>
        </>
    );
}
