import Link from 'next/link';

export default function GamesPage() {
    return (
        <main className="mx-auto min-h-screen w-full max-w-5xl px-6 py-16">
            <h1 className="mb-3 text-4xl font-bold text-slate-900">Games</h1>
            <p className="mb-8 text-slate-600">Jump into lightweight browser experiments.</p>

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
        </main>
    );
}
