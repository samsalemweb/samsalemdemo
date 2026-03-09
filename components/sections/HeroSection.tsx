'use client';

import { motion } from 'framer-motion';
import { useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import ScrollReveal from '@/components/animations/ScrollReveal';

const ctaButtons = [
    { label: "SAM'S LISTINGS", href: '/buy/samslisting' },
    { label: 'MLS SEARCH', href: '/listing/mls-search' },
    { label: 'PRESALE', href: '/presale' },
];

export default function HeroSection() {
    const sectionRef = useRef<HTMLElement>(null);

    return (
        <section
            ref={sectionRef}
            className="relative min-h-screen -mt-20 flex items-center overflow-hidden"
        >
            {/* Video background */}
            <video
                autoPlay
                muted
                loop
                playsInline
                className="absolute inset-0 w-full h-full object-cover"
            >
                <source
                    src="https://res.cloudinary.com/djtzs6kuv/video/upload/v1773072171/1396928-uhd_4096_2160_24fps_wnmpey.mp4"
                    type="video/mp4"
                />
            </video>

            {/* Dark overlay */}
            <div className="absolute inset-0 bg-black/55" />

            {/* ============ DESKTOP LAYOUT ============ */}
            <div className="hidden md:block w-full h-full">
                {/* Sam's photo — absolute left, bottom-anchored */}
                <motion.div
                    className="absolute left-0 bottom-0 z-10 flex items-end pl-8 lg:pl-16"
                    initial={{ opacity: 0, x: -40 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 1, delay: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
                >
                    <Image
                        src="https://res.cloudinary.com/djtzs6kuv/image/upload/v1773074987/samsalempicture-removebg-preview_sfjzyc.png"
                        alt="Sam Salem"
                        width={480}
                        height={680}
                        className="object-contain h-[78vh] w-auto"
                        priority
                    />
                </motion.div>

                {/* Text — centered over full width */}
                <div className="relative z-10 w-full min-h-screen flex flex-col items-center justify-center text-center px-6 py-20">
                    <motion.h1
                        className="text-6xl lg:text-7xl xl:text-8xl font-serif font-bold text-white tracking-wide mb-4"
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
                    >
                        SAM SALEM
                    </motion.h1>

                    <ScrollReveal direction="up" delay={0.8} blur>
                        <p className="text-lg lg:text-xl text-white/90 font-medium mb-2">
                            Personal Real Estate Corporation
                        </p>
                    </ScrollReveal>

                    <ScrollReveal direction="up" delay={1.0} blur>
                        <p className="text-xl lg:text-2xl text-white font-semibold mb-4">
                            To buy or sell, call me. From coffee to keys.
                        </p>
                    </ScrollReveal>

                    <ScrollReveal direction="up" delay={1.1} blur>
                        <div className="flex items-center gap-4 mb-8">
                            <motion.div
                                className="shrink-0"
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.8, delay: 1.3, ease: [0.25, 0.1, 0.25, 1] }}
                            >
                                <Image
                                    src="/top1.jpeg"
                                    alt="Top 1% Greater Vancouver PREC"
                                    width={120}
                                    height={120}
                                    className="w-[100px] lg:w-[110px] h-auto rounded-full shadow-[0_0_40px_rgba(201,168,76,0.5)] border-3 border-[#C9A84C]/50"
                                />
                            </motion.div>
                            <p className="text-white/90 text-base lg:text-lg text-left max-w-sm leading-snug font-semibold">
                                Strong focus on Presales, Condos, and Luxury Homes — Top 1% of all REALTORS in Greater Vancouver
                            </p>
                        </div>
                    </ScrollReveal>

                    <ScrollReveal direction="up" delay={1.4}>
                        <div className="flex flex-row gap-4">
                            {ctaButtons.map((btn, i) => (
                                <motion.div
                                    key={btn.label}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{
                                        duration: 0.5,
                                        delay: 1.5 + i * 0.15,
                                        ease: [0.25, 0.1, 0.25, 1],
                                    }}
                                >
                                    <Link href={btn.href} className="hero-cta-btn">
                                        {btn.label}
                                    </Link>
                                </motion.div>
                            ))}
                        </div>
                    </ScrollReveal>
                </div>
            </div>

            {/* ============ MOBILE LAYOUT ============ */}
            <div className="md:hidden relative w-full overflow-hidden" style={{ height: '100svh' }}>

                {/* Sam photo — absolute bottom, left-aligned */}
                <motion.div
                    className="absolute bottom-0 left-0 z-[1]"
                    style={{ height: '60%' }}
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 1, delay: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
                >
                    <Image
                        src="https://res.cloudinary.com/djtzs6kuv/image/upload/v1773074987/samsalempicture-removebg-preview_sfjzyc.png"
                        alt="Sam Salem"
                        width={300}
                        height={420}
                        className="h-full w-auto object-contain object-bottom"
                        priority
                    />
                </motion.div>

                {/* Text — top center */}
                <div className="absolute top-24 left-0 right-0 z-10 text-center px-6">
                    <motion.h1
                        className="text-3xl font-serif font-bold text-white mb-1"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
                    >
                        SAM SALEM
                    </motion.h1>

                    <ScrollReveal direction="up" delay={0.7} blur>
                        <p className="text-base text-white/80 mb-1">
                            Personal Real Estate Corporation
                        </p>
                    </ScrollReveal>

                    <ScrollReveal direction="up" delay={0.9} blur>
                        <p className="text-lg text-white font-medium mb-1">
                            From coffee to keys.
                        </p>
                    </ScrollReveal>

                    <ScrollReveal direction="up" delay={1.0} blur>
                        <p className="text-sm text-white/70 mt-1">
                            Strong focus on Presales, Condos, and Luxury Homes — Top 1% of all REALTORS in Greater Vancouver
                        </p>
                    </ScrollReveal>
                </div>

                {/* Buttons — bottom center, 2+1 triangle layout */}
                <div className="absolute bottom-[60%] left-0 right-0 z-10 flex flex-col items-center gap-2 px-6">
                    <ScrollReveal direction="up" delay={1.1}>
                        <div className="flex flex-col items-center gap-2 w-full">
                            <div className="flex flex-row gap-2 w-full">
                                <motion.div
                                    className="flex-1"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.5, delay: 1.2, ease: [0.25, 0.1, 0.25, 1] }}
                                >
                                    <Link href={ctaButtons[0].href} className="hero-cta-btn w-full whitespace-nowrap h-12">
                                        {ctaButtons[0].label}
                                    </Link>
                                </motion.div>
                                <motion.div
                                    className="flex-1"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.5, delay: 1.35, ease: [0.25, 0.1, 0.25, 1] }}
                                >
                                    <Link href={ctaButtons[1].href} className="hero-cta-btn w-full whitespace-nowrap h-12">
                                        {ctaButtons[1].label}
                                    </Link>
                                </motion.div>
                            </div>
                            <motion.div
                                className="w-1/2"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: 1.5, ease: [0.25, 0.1, 0.25, 1] }}
                            >
                                <Link href={ctaButtons[2].href} className="hero-cta-btn w-full whitespace-nowrap h-12">
                                    {ctaButtons[2].label}
                                </Link>
                            </motion.div>
                        </div>
                    </ScrollReveal>
                </div>

            </div>
        </section>
    );
}
