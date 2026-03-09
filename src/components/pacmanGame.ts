export type GameState = 'running' | 'game-over' | 'won';

type Point = {
    x: number;
    y: number;
};

type Direction = Point;

type Ghost = {
    position: Point;
    direction: Direction;
    color: string;
};

type SetupOptions = {
    onScoreChange: (score: number) => void;
    onStateChange: (state: GameState) => void;
};

const TILE_SIZE = 24;
const PLAYER_SPEED = 4;
const GHOST_SPEED = 2;

const MAZE_TEMPLATE = [
    '###############',
    '#.............#',
    '#.###.###.###.#',
    '#o#.......#...#',
    '#.###.#.#.###.#',
    '#.....#.#.....#',
    '#####.#.#.#####',
    '#.............#',
    '#.###.#.#.###.#',
    '#...#.....#...#',
    '###.#.###.#.###',
    '#.............#',
    '###############'
];

const GHOST_COLORS = ['#ff4d4d', '#67e8f9', '#f472b6'];

const isWall = (maze: string[], tileX: number, tileY: number) => {
    if (tileY < 0 || tileY >= maze.length || tileX < 0 || tileX >= maze[0].length) {
        return true;
    }
    return maze[tileY][tileX] === '#';
};

const canMove = (maze: string[], next: Point) => {
    const corners: Point[] = [
        { x: next.x + 2, y: next.y + 2 },
        { x: next.x + TILE_SIZE - 2, y: next.y + 2 },
        { x: next.x + 2, y: next.y + TILE_SIZE - 2 },
        { x: next.x + TILE_SIZE - 2, y: next.y + TILE_SIZE - 2 }
    ];

    return corners.every((corner) => {
        const tileX = Math.floor(corner.x / TILE_SIZE);
        const tileY = Math.floor(corner.y / TILE_SIZE);
        return !isWall(maze, tileX, tileY);
    });
};

const randomDirection = (): Direction => {
    const directions = [
        { x: 1, y: 0 },
        { x: -1, y: 0 },
        { x: 0, y: 1 },
        { x: 0, y: -1 }
    ];
    return directions[Math.floor(Math.random() * directions.length)];
};

export const setupPacmanGame = (canvas: HTMLCanvasElement, { onScoreChange, onStateChange }: SetupOptions) => {
    const context = canvas.getContext('2d');

    if (!context) {
        return () => undefined;
    }

    const maze = [...MAZE_TEMPLATE];
    const width = maze[0].length * TILE_SIZE;
    const height = maze.length * TILE_SIZE;
    canvas.width = width;
    canvas.height = height;

    let pellets = new Set<string>();
    let score = 0;
    let state: GameState = 'running';

    for (let y = 0; y < maze.length; y += 1) {
        for (let x = 0; x < maze[y].length; x += 1) {
            if (maze[y][x] === '.' || maze[y][x] === 'o') {
                pellets.add(`${x},${y}`);
            }
        }
    }

    let pacman: Point = { x: TILE_SIZE, y: TILE_SIZE };
    let direction: Direction = { x: 0, y: 0 };
    let queuedDirection: Direction = { x: 0, y: 0 };

    const ghosts: Ghost[] = GHOST_COLORS.map((color, index) => ({
        color,
        position: {
            x: (6 + index) * TILE_SIZE,
            y: 7 * TILE_SIZE
        },
        direction: randomDirection()
    }));

    const keys: Record<string, Direction> = {
        ArrowUp: { x: 0, y: -1 },
        ArrowDown: { x: 0, y: 1 },
        ArrowLeft: { x: -1, y: 0 },
        ArrowRight: { x: 1, y: 0 }
    };

    const keyHandler = (event: KeyboardEvent) => {
        const next = keys[event.key];
        if (!next) {
            return;
        }
        event.preventDefault();
        queuedDirection = next;
    };

    window.addEventListener('keydown', keyHandler);

    const atTileCenter = (position: Point) => position.x % TILE_SIZE === 0 && position.y % TILE_SIZE === 0;

    const updatePacman = () => {
        if (state !== 'running') {
            return;
        }

        if (atTileCenter(pacman)) {
            const queuedTarget = {
                x: pacman.x + queuedDirection.x * PLAYER_SPEED,
                y: pacman.y + queuedDirection.y * PLAYER_SPEED
            };
            if (canMove(maze, queuedTarget)) {
                direction = queuedDirection;
            }
        }

        const nextPosition = {
            x: pacman.x + direction.x * PLAYER_SPEED,
            y: pacman.y + direction.y * PLAYER_SPEED
        };

        if (canMove(maze, nextPosition)) {
            pacman = nextPosition;
        }

        const tileX = Math.floor((pacman.x + TILE_SIZE / 2) / TILE_SIZE);
        const tileY = Math.floor((pacman.y + TILE_SIZE / 2) / TILE_SIZE);
        const pelletKey = `${tileX},${tileY}`;

        if (pellets.has(pelletKey)) {
            pellets.delete(pelletKey);
            score += 10;
            onScoreChange(score);

            if (pellets.size === 0) {
                state = 'won';
                onStateChange(state);
            }
        }
    };

    const updateGhost = (ghost: Ghost) => {
        if (state !== 'running') {
            return;
        }

        const nextPosition = {
            x: ghost.position.x + ghost.direction.x * GHOST_SPEED,
            y: ghost.position.y + ghost.direction.y * GHOST_SPEED
        };

        if (!canMove(maze, nextPosition)) {
            const possibleDirections = [
                { x: 1, y: 0 },
                { x: -1, y: 0 },
                { x: 0, y: 1 },
                { x: 0, y: -1 }
            ].filter((dir) =>
                canMove(maze, {
                    x: ghost.position.x + dir.x * GHOST_SPEED,
                    y: ghost.position.y + dir.y * GHOST_SPEED
                })
            );

            ghost.direction = possibleDirections[Math.floor(Math.random() * possibleDirections.length)] || randomDirection();
            return;
        }

        ghost.position = nextPosition;

        if (atTileCenter(ghost.position) && Math.random() < 0.15) {
            ghost.direction = randomDirection();
        }
    };

    const checkCollisions = () => {
        for (const ghost of ghosts) {
            const dx = ghost.position.x - pacman.x;
            const dy = ghost.position.y - pacman.y;
            const distance = Math.hypot(dx, dy);

            if (distance < TILE_SIZE * 0.75) {
                state = 'game-over';
                onStateChange(state);
                break;
            }
        }
    };

    const render = () => {
        context.fillStyle = '#09090b';
        context.fillRect(0, 0, width, height);

        for (let y = 0; y < maze.length; y += 1) {
            for (let x = 0; x < maze[y].length; x += 1) {
                const tile = maze[y][x];
                if (tile === '#') {
                    context.fillStyle = '#1d4ed8';
                    context.fillRect(x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
                }

                if (pellets.has(`${x},${y}`)) {
                    context.beginPath();
                    context.fillStyle = tile === 'o' ? '#facc15' : '#f8fafc';
                    context.arc(
                        x * TILE_SIZE + TILE_SIZE / 2,
                        y * TILE_SIZE + TILE_SIZE / 2,
                        tile === 'o' ? 5 : 3,
                        0,
                        Math.PI * 2
                    );
                    context.fill();
                }
            }
        }

        context.beginPath();
        context.fillStyle = '#facc15';
        context.arc(pacman.x + TILE_SIZE / 2, pacman.y + TILE_SIZE / 2, TILE_SIZE / 2 - 2, 0, Math.PI * 2);
        context.fill();

        for (const ghost of ghosts) {
            context.beginPath();
            context.fillStyle = ghost.color;
            context.arc(ghost.position.x + TILE_SIZE / 2, ghost.position.y + TILE_SIZE / 2, TILE_SIZE / 2 - 2, 0, Math.PI * 2);
            context.fill();
        }

        if (state !== 'running') {
            context.fillStyle = 'rgba(0, 0, 0, 0.6)';
            context.fillRect(0, height / 2 - 32, width, 64);
            context.fillStyle = '#f8fafc';
            context.font = 'bold 24px sans-serif';
            context.textAlign = 'center';
            context.fillText(state === 'won' ? 'You Win!' : 'Game Over', width / 2, height / 2 + 8);
        }
    };

    let animationFrame = 0;

    const tick = () => {
        updatePacman();
        ghosts.forEach(updateGhost);
        checkCollisions();
        render();
        animationFrame = window.requestAnimationFrame(tick);
    };

    onScoreChange(score);
    onStateChange(state);
    tick();

    return () => {
        window.cancelAnimationFrame(animationFrame);
        window.removeEventListener('keydown', keyHandler);
        pellets = new Set();
    };
};
