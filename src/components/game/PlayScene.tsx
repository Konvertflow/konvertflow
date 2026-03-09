import { useEffect, useMemo, useRef, useState } from 'react';
import * as THREE from 'three';

type GameStatus = 'playing' | 'won';

const PLANET_RADIUS = 6;
const PLAYER_HEIGHT = 0.45;
const PLAYER_SPEED = 0.9;
const MAX_COLLECTIBLES = 8;

const createCollectiblePoints = (count: number) => {
    const points: THREE.Vector3[] = [];

    for (let i = 0; i < count; i += 1) {
        const theta = (Math.PI * 2 * i) / count + Math.random() * 0.5;
        const phi = Math.PI * 0.35 + Math.random() * Math.PI * 0.3;
        points.push(
            new THREE.Vector3(
                PLANET_RADIUS * Math.sin(phi) * Math.cos(theta),
                PLANET_RADIUS * Math.cos(phi),
                PLANET_RADIUS * Math.sin(phi) * Math.sin(theta)
            )
        );
    }

    return points;
};

export default function PlayScene() {
    const mountRef = useRef<HTMLDivElement | null>(null);
    const keysRef = useRef<Record<string, boolean>>({});
    const scoreRef = useRef(0);
    const statusRef = useRef<GameStatus>('playing');

    const [score, setScore] = useState(0);
    const [status, setStatus] = useState<GameStatus>('playing');
    const [moveHint, setMoveHint] = useState('Collect all the dream orbs');
    const [seed, setSeed] = useState(0);

    const restart = () => {
        scoreRef.current = 0;
        statusRef.current = 'playing';
        setScore(0);
        setStatus('playing');
        setMoveHint('Collect all the dream orbs');
        setSeed((prev) => prev + 1);
    };

    const collectibleSeed = useMemo(() => seed, [seed]);

    useEffect(() => {
        if (!mountRef.current) return undefined;
        const collectiblePoints = createCollectiblePoints(MAX_COLLECTIBLES);

        const scene = new THREE.Scene();
        scene.background = new THREE.Color('#efe8ff');
        scene.fog = new THREE.Fog('#efe8ff', 12, 45);

        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
        renderer.outputColorSpace = THREE.SRGBColorSpace;
        mountRef.current.innerHTML = '';
        mountRef.current.appendChild(renderer.domElement);

        const camera = new THREE.PerspectiveCamera(60, mountRef.current.clientWidth / mountRef.current.clientHeight, 0.1, 100);
        camera.position.set(0, 8, 14);

        scene.add(new THREE.HemisphereLight('#ffffff', '#c4b5fd', 1.1));
        const dir = new THREE.DirectionalLight('#fff8e1', 0.8);
        dir.position.set(8, 10, 7);
        scene.add(dir);

        const world = new THREE.Group();
        scene.add(world);

        world.add(
            new THREE.Mesh(
                new THREE.IcosahedronGeometry(PLANET_RADIUS, 1),
                new THREE.MeshStandardMaterial({ color: '#8bdbb2', flatShading: true, roughness: 0.9, metalness: 0.05 })
            )
        );

        const cloudRing = new THREE.Mesh(
            new THREE.TorusGeometry(PLANET_RADIUS + 1.5, 0.28, 8, 50),
            new THREE.MeshStandardMaterial({ color: '#c4b5fd', roughness: 1, transparent: true, opacity: 0.72 })
        );
        cloudRing.rotation.x = Math.PI * 0.45;
        world.add(cloudRing);

        const player = new THREE.Mesh(
            new THREE.CapsuleGeometry(0.35, PLAYER_HEIGHT, 6, 10),
            new THREE.MeshStandardMaterial({ color: '#ff7ab6', roughness: 0.8, metalness: 0.1 })
        );
        world.add(player);

        const shadow = new THREE.Mesh(
            new THREE.CircleGeometry(0.45, 20),
            new THREE.MeshBasicMaterial({ color: '#35224c', transparent: true, opacity: 0.25 })
        );
        world.add(shadow);

        const collectibles = collectiblePoints.map((point) => {
            const orb = new THREE.Mesh(
                new THREE.OctahedronGeometry(0.35, 0),
                new THREE.MeshStandardMaterial({ color: '#ffde59', emissive: '#ffb703', emissiveIntensity: 0.35, roughness: 0.25 })
            );
            orb.position.copy(point.clone().setLength(PLANET_RADIUS + 0.7));
            world.add(orb);
            return orb;
        });

        const characterState = { theta: 0, phi: Math.PI * 0.52, heading: new THREE.Vector3(1, 0, 0) };
        const clock = new THREE.Clock();
        let rafId = 0;

        const onResize = () => {
            if (!mountRef.current) return;
            const { clientWidth, clientHeight } = mountRef.current;
            camera.aspect = clientWidth / clientHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(clientWidth, clientHeight);
        };
        const keyDown = (event: KeyboardEvent) => {
            keysRef.current[event.key.toLowerCase()] = true;
        };
        const keyUp = (event: KeyboardEvent) => {
            keysRef.current[event.key.toLowerCase()] = false;
        };

        window.addEventListener('resize', onResize);
        window.addEventListener('keydown', keyDown);
        window.addEventListener('keyup', keyUp);

        const animate = () => {
            const dt = Math.min(clock.getDelta(), 0.05);
            if (statusRef.current === 'playing') {
                let moveX = 0;
                let moveY = 0;
                if (keysRef.current.w || keysRef.current.arrowup) moveY += 1;
                if (keysRef.current.s || keysRef.current.arrowdown) moveY -= 1;
                if (keysRef.current.a || keysRef.current.arrowleft) moveX -= 1;
                if (keysRef.current.d || keysRef.current.arrowright) moveX += 1;

                const magnitude = Math.hypot(moveX, moveY) || 1;
                moveX /= magnitude;
                moveY /= magnitude;

                if (Math.abs(moveX) > 0.01 || Math.abs(moveY) > 0.01) {
                    characterState.theta += moveX * PLAYER_SPEED * dt;
                    characterState.phi -= moveY * PLAYER_SPEED * dt;
                    characterState.phi = THREE.MathUtils.clamp(characterState.phi, 0.2, Math.PI - 0.2);
                    setMoveHint('Find every orb to complete the delivery run');
                }

                const surface = new THREE.Vector3(
                    Math.sin(characterState.phi) * Math.cos(characterState.theta),
                    Math.cos(characterState.phi),
                    Math.sin(characterState.phi) * Math.sin(characterState.theta)
                );
                const up = surface.clone().normalize();
                const playerPos = up.clone().multiplyScalar(PLANET_RADIUS + PLAYER_HEIGHT + 0.12);

                player.position.copy(playerPos);
                shadow.position.copy(up.clone().multiplyScalar(PLANET_RADIUS + 0.05));
                shadow.lookAt(shadow.position.clone().add(up));

                const tangentTheta = new THREE.Vector3(-Math.sin(characterState.theta), 0, Math.cos(characterState.theta)).normalize();
                const tangentPhi = new THREE.Vector3(
                    Math.cos(characterState.phi) * Math.cos(characterState.theta),
                    -Math.sin(characterState.phi),
                    Math.cos(characterState.phi) * Math.sin(characterState.theta)
                ).normalize();
                const moveDir = tangentTheta.multiplyScalar(moveX).add(tangentPhi.multiplyScalar(-moveY)).normalize();

                if (moveDir.lengthSq() > 0.1) characterState.heading.lerp(moveDir, 0.2).normalize();

                player.up.copy(up);
                player.lookAt(playerPos.clone().add(characterState.heading));
                camera.position.lerp(playerPos.clone().add(up.clone().multiplyScalar(2.5)).add(characterState.heading.clone().multiplyScalar(-5)), 0.1);
                camera.lookAt(playerPos.clone().add(up.clone().multiplyScalar(1.3)));

                collectibles.forEach((orb, index) => {
                    if (!orb.visible) return;
                    orb.rotation.y += dt * 1.8;
                    orb.position.multiplyScalar(1 + Math.sin(clock.elapsedTime * 2 + index) * 0.0007);
                    if (orb.position.distanceTo(player.position) < 0.85) {
                        orb.visible = false;
                        const nextScore = scoreRef.current + 1;
                        scoreRef.current = nextScore;
                        setScore(nextScore);
                        setMoveHint('Nice! Keep going');
                        if (nextScore === MAX_COLLECTIBLES) {
                            statusRef.current = 'won';
                            setStatus('won');
                            setMoveHint('Delivery complete. Press Restart for another run.');
                        }
                    }
                });
            }

            cloudRing.rotation.z += dt * 0.15;
            world.rotation.y += dt * 0.06;
            renderer.render(scene, camera);
            rafId = window.requestAnimationFrame(animate);
        };

        animate();

        return () => {
            window.removeEventListener('resize', onResize);
            window.removeEventListener('keydown', keyDown);
            window.removeEventListener('keyup', keyUp);
            window.cancelAnimationFrame(rafId);
            renderer.dispose();
            scene.traverse((obj) => {
                const mesh = obj as THREE.Mesh;
                if (mesh.geometry) mesh.geometry.dispose();
                if (mesh.material) {
                    if (Array.isArray(mesh.material)) mesh.material.forEach((m) => m.dispose());
                    else mesh.material.dispose();
                }
            });
        };
    }, [collectibleSeed]);

    return (
        <div className="mx-auto w-full max-w-5xl px-4 py-8">
            <h1 className="mb-2 text-3xl font-bold text-slate-900">Dream Orb Delivery</h1>
            <p className="mb-4 text-slate-600">WASD / Arrow keys · float around the tiny world and collect each orb.</p>
            <div className="mb-4 flex flex-wrap gap-2 text-sm">
                <span className="rounded-full bg-violet-100 px-3 py-1 text-violet-700">Score: {score}/{MAX_COLLECTIBLES}</span>
                <span className="rounded-full bg-cyan-100 px-3 py-1 text-cyan-700">{moveHint}</span>
                {status === 'won' && <span className="rounded-full bg-emerald-100 px-3 py-1 text-emerald-700">You win 🎉</span>}
            </div>
            <div className="relative h-[65vh] min-h-[420px] w-full overflow-hidden rounded-3xl border border-violet-100 bg-gradient-to-b from-white to-violet-50 shadow-lg">
                <div ref={mountRef} className="h-full w-full" />
                <button
                    type="button"
                    onClick={restart}
                    className="absolute bottom-4 right-4 rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white shadow"
                >
                    Restart
                </button>
            </div>
        </div>
    );
}
