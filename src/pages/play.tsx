import dynamic from 'next/dynamic';
import Script from 'next/script';
import { useState } from 'react';

const PlayScene = dynamic(() => import('../components/game/PlayScene'), {
    ssr: false,
    loading: () => <div className="px-6 py-16 text-center text-slate-500">Loading dreamy world…</div>
});

export default function PlayPage() {
    const [ready, setReady] = useState(Boolean((globalThis as any).THREE));

    return (
        <>
            <Script src="https://unpkg.com/three@0.161.0/build/three.min.js" strategy="afterInteractive" onLoad={() => setReady(true)} />
            {ready ? <PlayScene /> : <div className="px-6 py-16 text-center text-slate-500">Loading Three.js…</div>}
        </>
    );
}
