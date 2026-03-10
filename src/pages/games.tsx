import Link from 'next/link';

export default function GamesPage() {
    return (
        <main className="mx-auto min-h-screen w-full max-w-5xl px-6 py-16">
            <h1 className="mb-3 text-4xl font-bold text-slate-900">Games</h1>
            <p className="mb-8 text-slate-600">Jump into lightweight browser experiments.</p>

            <div className="grid gap-6 md:grid-cols-2">
                <Link
                    href="/tetris"
                    className="group block rounded-3xl border border-yellow-300 bg-gradient-to-br from-yellow-200 via-fuchsia-200 to-indigo-200 p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
                >
                    <p className="text-xs font-black uppercase tracking-[0.2em] text-yellow-800">New arcade drop</p>
                    <h2 className="mt-2 text-2xl font-black text-slate-900">Play Tetris</h2>
                    <p className="mt-2 text-slate-700">Stack blocks, clear lines, and enjoy flashy neon colors in this 2D mini game.</p>
                    <span className="mt-5 inline-flex rounded-full bg-yellow-300 px-4 py-2 text-sm font-black text-zinc-900 transition group-hover:bg-yellow-200">
                        Start Tetris
                    </span>
                </Link>

                <Link
                    href="/play"
                    className="group block rounded-3xl border border-violet-200 bg-gradient-to-br from-violet-100 to-cyan-100 p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
                >
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-violet-700">Playable now</p>
                    <h2 className="mt-2 text-2xl font-semibold text-slate-900">Dream Orb Delivery</h2>
                    <p className="mt-2 text-slate-700">Float around a tiny stylized world, collect every orb, and complete the run.</p>
                    <span className="mt-5 inline-flex rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition group-hover:bg-slate-700">
                        Play game
                    </span>
                </Link>
            </div>
        </main>
    );
}
