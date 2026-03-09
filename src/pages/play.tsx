import dynamic from 'next/dynamic';

const PlayScene = dynamic(() => import('../components/game/PlayScene'), {
    ssr: false,
    loading: () => <div className="px-6 py-16 text-center text-slate-500">Loading dreamy world…</div>
});

export default function PlayPage() {
    return <PlayScene />;
}
