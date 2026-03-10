import Head from 'next/head';
import Link from 'next/link';

import { DynamicComponent } from '@/components/components-registry';
import { PageComponentProps } from '@/types';
import { allContent } from '@/utils/content';
import { seoGenerateMetaDescription, seoGenerateMetaTags, seoGenerateTitle } from '@/utils/seo-utils';
import { resolveStaticProps } from '@/utils/static-props-resolvers';

const services = [
    {
        title: 'Studio',
        description:
            'A fully equipped studio space for branded content, interviews, and cinematic campaigns with controlled lighting and premium set design.',
        points: ['4K multi-cam setup', 'Custom lighting scenes', 'Live client monitoring']
    },
    {
        title: 'Podcast',
        description:
            'End-to-end podcast production for founders and teams: recording, editing, sound design, and social-ready clips delivered every week.',
        points: ['Audio + video capture', 'Episode editing', 'Short-form distribution cuts']
    },
    {
        title: 'Production',
        description:
            'Creative development and on-location production for ads, documentaries, and launch films built to move audiences and drive conversions.',
        points: ['Concept + scripting', 'Location shoots', 'Color grading + finishing']
    }
];

const caseStudies = [
    {
        client: 'Northline Athletics',
        result: '+180% engagement',
        summary: 'Produced a seasonal brand film and athlete interview series that boosted social watch time and ad recall.'
    },
    {
        client: 'Atlas Ventures',
        result: '2.4M organic views',
        summary: 'Built a founder-led podcast pipeline with weekly clips that established authority and doubled inbound leads.'
    },
    {
        client: 'Sora Labs',
        result: '43% landing-page lift',
        summary: 'Created product launch videos and customer stories used across paid channels and sales collateral.'
    }
];

const LandingPage = () => {
    return (
        <main className="bg-zinc-950 text-zinc-100">
            <section className="relative isolate overflow-hidden">
                <div className="absolute inset-0 -z-10 bg-gradient-to-b from-violet-600/20 via-zinc-950 to-zinc-950" />
                <div className="mx-auto flex w-full max-w-6xl flex-col gap-12 px-6 py-20 sm:px-10 lg:flex-row lg:items-center lg:py-28">
                    <div className="max-w-2xl space-y-6">
                        <p className="inline-flex rounded-full border border-violet-300/30 bg-violet-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.22em] text-violet-200">
                            Video Production Agency
                        </p>
                        <h1 className="text-4xl font-semibold leading-tight text-white sm:text-5xl lg:text-6xl">
                            We craft videos that make brands impossible to ignore.
                        </h1>
                        <p className="text-base leading-relaxed text-zinc-300 sm:text-lg">
                            From studio sessions to cinematic productions, we combine strategy, storytelling, and high-end execution
                            to help ambitious teams grow faster.
                        </p>
                        <div className="flex flex-wrap items-center gap-4">
                            <Link
                                href="/games"
                                className="rounded-full bg-emerald-400 px-6 py-3 text-sm font-semibold text-zinc-950 transition hover:bg-emerald-300"
                            >
                                Play our games
                            </Link>
                            <Link
                                href="/tetris"
                                className="rounded-full bg-yellow-300 px-6 py-3 text-sm font-black uppercase tracking-[0.08em] text-zinc-950 shadow-[0_0_20px_rgba(255,230,77,0.75)] transition hover:bg-yellow-200"
                            >
                                PLAY TETRIS
                            </Link>
                            <a
                                href="#contact"
                                className="rounded-full bg-violet-500 px-6 py-3 text-sm font-semibold text-white transition hover:bg-violet-400"
                            >
                                Book a discovery call
                            </a>
                            <a
                                href="#case-studies"
                                className="rounded-full border border-zinc-700 px-6 py-3 text-sm font-semibold text-zinc-100 transition hover:border-zinc-500"
                            >
                                View case studies
                            </a>
                        </div>
                    </div>

                    <div className="w-full max-w-lg rounded-3xl border border-zinc-800 bg-zinc-900/70 p-6 backdrop-blur">
                        <p className="text-sm uppercase tracking-[0.2em] text-zinc-400">Trusted by growth teams</p>
                        <div className="mt-6 grid grid-cols-2 gap-4 text-sm sm:text-base">
                            <div className="rounded-2xl bg-zinc-800/80 p-4">
                                <p className="text-2xl font-semibold text-white">120+</p>
                                <p className="text-zinc-300">Campaigns launched</p>
                            </div>
                            <div className="rounded-2xl bg-zinc-800/80 p-4">
                                <p className="text-2xl font-semibold text-white">8.7M</p>
                                <p className="text-zinc-300">Combined views</p>
                            </div>
                            <div className="rounded-2xl bg-zinc-800/80 p-4">
                                <p className="text-2xl font-semibold text-white">72hr</p>
                                <p className="text-zinc-300">Fast turnaround</p>
                            </div>
                            <div className="rounded-2xl bg-zinc-800/80 p-4">
                                <p className="text-2xl font-semibold text-white">5★</p>
                                <p className="text-zinc-300">Client satisfaction</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section id="services" className="mx-auto w-full max-w-6xl px-6 py-16 sm:px-10">
                <div className="mb-10 flex flex-col gap-3">
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-violet-300">Services</p>
                    <h2 className="text-3xl font-semibold text-white sm:text-4xl">Built for every stage of production</h2>
                </div>
                <div className="grid gap-6 md:grid-cols-3">
                    {services.map((service) => (
                        <article key={service.title} className="rounded-3xl border border-zinc-800 bg-zinc-900 p-6">
                            <h3 className="text-xl font-semibold text-white">{service.title}</h3>
                            <p className="mt-3 text-sm leading-relaxed text-zinc-300">{service.description}</p>
                            <ul className="mt-5 space-y-2 text-sm text-zinc-200">
                                {service.points.map((point) => (
                                    <li key={point} className="flex items-center gap-2">
                                        <span className="h-1.5 w-1.5 rounded-full bg-violet-400" />
                                        {point}
                                    </li>
                                ))}
                            </ul>
                        </article>
                    ))}
                </div>
            </section>

            <section id="case-studies" className="mx-auto w-full max-w-6xl px-6 py-16 sm:px-10">
                <div className="mb-10 flex flex-col gap-3">
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-violet-300">Case studies</p>
                    <h2 className="text-3xl font-semibold text-white sm:text-4xl">Stories backed by measurable outcomes</h2>
                </div>
                <div className="grid gap-6 lg:grid-cols-3">
                    {caseStudies.map((item) => (
                        <article key={item.client} className="rounded-3xl border border-zinc-800 bg-zinc-900 p-6">
                            <p className="text-sm uppercase tracking-[0.12em] text-zinc-400">{item.client}</p>
                            <p className="mt-3 text-2xl font-semibold text-violet-300">{item.result}</p>
                            <p className="mt-3 text-sm leading-relaxed text-zinc-300">{item.summary}</p>
                        </article>
                    ))}
                </div>
            </section>

            <section id="contact" className="mx-auto w-full max-w-6xl px-6 py-16 sm:px-10">
                <div className="grid gap-8 rounded-3xl border border-zinc-800 bg-zinc-900 p-6 sm:p-10 lg:grid-cols-2 lg:gap-12">
                    <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-violet-300">Contact</p>
                        <h2 className="mt-3 text-3xl font-semibold text-white sm:text-4xl">Let&apos;s produce your next standout video</h2>
                        <p className="mt-4 text-sm leading-relaxed text-zinc-300 sm:text-base">
                            Tell us about your timeline, creative direction, and goals. We&apos;ll follow up with a custom plan
                            and estimated production scope.
                        </p>
                    </div>
                    <form className="grid gap-4">
                        <label className="grid gap-2 text-sm text-zinc-200">
                            Name
                            <input
                                type="text"
                                name="name"
                                className="rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-3 text-zinc-100 outline-none ring-violet-400 transition focus:ring"
                                placeholder="Your name"
                            />
                        </label>
                        <label className="grid gap-2 text-sm text-zinc-200">
                            Email
                            <input
                                type="email"
                                name="email"
                                className="rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-3 text-zinc-100 outline-none ring-violet-400 transition focus:ring"
                                placeholder="you@company.com"
                            />
                        </label>
                        <label className="grid gap-2 text-sm text-zinc-200">
                            Project details
                            <textarea
                                name="details"
                                rows={4}
                                className="rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-3 text-zinc-100 outline-none ring-violet-400 transition focus:ring"
                                placeholder="What are you planning to create?"
                            />
                        </label>
                        <button
                            type="submit"
                            className="mt-2 inline-flex w-fit rounded-full bg-violet-500 px-6 py-3 text-sm font-semibold text-white transition hover:bg-violet-400"
                        >
                            Send inquiry
                        </button>
                    </form>
                </div>
            </section>
        </main>
    );
};

const Page: React.FC<PageComponentProps> = (props) => {
    const { global, ...page } = props;
    const { site } = global;
    const title = seoGenerateTitle(page, site);
    const metaTags = seoGenerateMetaTags(page, site);
    const metaDescription = seoGenerateMetaDescription(page, site);
    const isLandingPage = page.__metadata?.urlPath === '/';

    return (
        <>
            <Head>
                <title>{isLandingPage ? 'FrameForge Studio | Video Production Agency' : title}</title>
                <meta
                    name="description"
                    content={
                        isLandingPage
                            ? 'Modern video production agency for studio shoots, podcast production, and full-service creative campaigns.'
                            : metaDescription
                    }
                />
                {metaTags.map((metaTag) => {
                    if (metaTag.format === 'property') {
                        // OpenGraph meta tags (og:*) should be have the format <meta property="og:…" content="…">
                        return <meta key={metaTag.property} property={metaTag.property} content={metaTag.content} />;
                    }
                    return <meta key={metaTag.property} name={metaTag.property} content={metaTag.content} />;
                })}
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                {site.favicon && <link rel="icon" href={site.favicon} />}
            </Head>
            {isLandingPage ? <LandingPage /> : <DynamicComponent {...props} />}
        </>
    );
};

export function getStaticPaths() {
    const allData = allContent();
    const paths = allData.map((obj) => obj.__metadata.urlPath).filter(Boolean);
    return { paths, fallback: false };
}

export function getStaticProps({ params }) {
    const allData = allContent();
    const urlPath = '/' + (params.slug || []).join('/');
    const props = resolveStaticProps(urlPath, allData);
    return { props };
}

export default Page;
