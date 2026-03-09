'use client';

import Image from 'next/image';
import ScrollReveal from '@/components/animations/ScrollReveal';

const otherAgencies = [
    'Pushy sales approach',
    'Generic listings, often outdated',
    'Complicated process full of paperwork',
    'Hard to reach agents',
    'One-size-fits-all service',
    'Focus only on closing deals',
    'Limited area knowledge',
    'Confusing websites and search tools',
];

const samSalem = [
    'Friendly guidance with no pressure',
    'Verified listings updated daily',
    'Step-by-step support, we handle all',
    'Easy contact anytime',
    'Personalized advice for your needs',
    'Focus on building relationships',
    'Local experts who know inside-out',
    'Simple and fast property search',
];

export default function ComparisonSection() {
    return (
        <section className="relative py-16 md:py-28 overflow-hidden">
            {/* Background Image */}
            <div className="absolute inset-0 z-0">
                <Image
                    src="/vancomp.jpg"
                    alt=""
                    fill
                    className="object-cover"
                    sizes="100vw"
                    priority
                />
                {/* Slight overlay for readability */}
                <div className="absolute inset-0 bg-black/10" />
            </div>

            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-0 rounded-3xl overflow-hidden shadow-2xl">
                    {/* Other Agencies — White */}
                    <ScrollReveal direction="left" delay={0.1}>
                        <div className="bg-white/95 backdrop-blur-sm p-8 md:p-10 h-full">
                            <h3 className="text-2xl md:text-3xl font-heading font-semibold text-foreground text-center mb-8">
                                Other agencies
                            </h3>
                            <div className="space-y-0">
                                {otherAgencies.map((item, i) => (
                                    <div
                                        key={i}
                                        className="flex items-center gap-4 py-3.5 border-b border-gray-100 last:border-0"
                                    >
                                        <div className="w-6 h-6 rounded-md bg-gray-200 flex items-center justify-center shrink-0">
                                            <svg className="w-3.5 h-3.5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                            </svg>
                                        </div>
                                        <span className="text-foreground/80 text-sm md:text-base">{item}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </ScrollReveal>

                    {/* Sam Salem — Dark */}
                    <ScrollReveal direction="right" delay={0.2}>
                        <div className="bg-primary/95 backdrop-blur-sm p-8 md:p-10 h-full">
                            <h3 className="text-2xl md:text-3xl font-heading font-semibold text-white text-center mb-8">
                                Sam Salem
                            </h3>
                            <div className="space-y-0">
                                {samSalem.map((item, i) => (
                                    <div
                                        key={i}
                                        className="flex items-center gap-4 py-3.5 border-b border-white/10 last:border-0"
                                    >
                                        <div className="w-6 h-6 rounded-md bg-accent flex items-center justify-center shrink-0">
                                            <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                            </svg>
                                        </div>
                                        <span className="text-white/90 text-sm md:text-base">{item}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </ScrollReveal>
                </div>
            </div>
        </section>
    );
}
