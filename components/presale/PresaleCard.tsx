'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import type { PresaleWithImages } from '@/types/presale';

const statusColors: Record<string, string> = {
    'Selling': 'bg-emerald-500/90 text-white',
    'Registration': 'bg-blue-500/90 text-white',
    'Coming Soon': 'bg-amber-500/90 text-white',
    'Sold Out': 'bg-gray-500/90 text-white',
};

interface PresaleCardProps {
    listing: PresaleWithImages;
}

export default function PresaleCard({ listing }: PresaleCardProps) {
    const isMasterPlanned = listing.property_type === 'Master Planned Community';
    const statusClass = statusColors[listing.listing_status] || 'bg-accent/90 text-white';

    return (
        <Link href={`/presale/${listing.slug}`} className="group block">
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                whileHover={{ y: -5 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{
                    type: "spring",
                    stiffness: 260,
                    damping: 20,
                    duration: 0.8
                }}
                className="rounded-3xl overflow-hidden border border-border bg-white shadow-sm hover:shadow-2xl transition-shadow duration-300 h-full flex flex-col"
            >
                {/* Hero Image */}
                <div className="relative h-[260px] overflow-hidden">
                    {listing.cover_image ? (
                        <Image
                            src={listing.cover_image}
                            alt={listing.listing_name}
                            fill
                            className="object-cover transition-transform duration-700 group-hover:scale-105"
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        />
                    ) : (
                        <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                            <span className="text-muted text-sm">No image available</span>
                        </div>
                    )}
                    {/* Property type badge */}
                    <div className="absolute top-4 left-4">
                        <span className="px-3 py-1 bg-white/90 backdrop-blur-sm rounded-full text-xs font-semibold tracking-wide text-foreground shadow-sm">
                            {listing.property_type}
                        </span>
                    </div>
                    {/* Status badge */}
                    <div className="absolute top-4 right-4">
                        <span className={`px-3 py-1 backdrop-blur-sm rounded-full text-xs font-bold tracking-wide shadow-sm ${statusClass}`}>
                            {listing.listing_status}
                        </span>
                    </div>
                </div>

                {/* Content */}
                <div className="p-6 flex flex-col flex-1">
                    <h3 className="text-xl font-heading font-semibold text-foreground mb-1 group-hover:text-accent transition-colors duration-300">
                        {listing.listing_name}
                    </h3>
                    <p className="text-muted text-sm mb-4">
                        {listing.city}{listing.neighbourhood && listing.neighbourhood !== listing.city ? ` · ${listing.neighbourhood}` : ''}
                    </p>

                    {/* Price Range */}
                    {listing.price_range && (
                        <p className="text-lg font-heading font-semibold text-foreground mb-4">
                            {listing.price_range}
                        </p>
                    )}

                    {/* Stats Row */}
                    <div className="grid grid-cols-2 gap-3 mb-5">
                        {!isMasterPlanned && listing.beds && (
                            <div className="flex items-center gap-2">
                                <svg className="w-4 h-4 text-muted/60" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
                                </svg>
                                <span className="text-xs text-muted font-medium">{listing.beds} Beds</span>
                            </div>
                        )}
                        {!isMasterPlanned && listing.baths && (
                            <div className="flex items-center gap-2">
                                <svg className="w-4 h-4 text-muted/60" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <span className="text-xs text-muted font-medium">{listing.baths} Baths</span>
                            </div>
                        )}
                        {listing.total_units && (
                            <div className="flex items-center gap-2">
                                <svg className="w-4 h-4 text-muted/60" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
                                </svg>
                                <span className="text-xs text-muted font-medium">{listing.total_units} Units</span>
                            </div>
                        )}
                        {listing.move_in && (
                            <div className="flex items-center gap-2">
                                <svg className="w-4 h-4 text-muted/60" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
                                </svg>
                                <span className="text-xs text-muted font-medium">{listing.move_in}</span>
                            </div>
                        )}
                        {isMasterPlanned && (
                            <div className="flex items-center gap-2 col-span-2">
                                <svg className="w-4 h-4 text-accent/60" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h18M3 3v18m18-18v18" />
                                </svg>
                                <span className="text-xs text-accent font-semibold">Master Planned Community</span>
                            </div>
                        )}
                    </div>

                    {/* Developer */}
                    {listing.developer && (
                        <div className="mt-auto pt-4 border-t border-border flex items-center justify-between">
                            <span className="text-xs text-muted/70 font-medium">by {listing.developer}</span>
                            <span className="text-xs font-semibold text-accent group-hover:underline">
                                View Details →
                            </span>
                        </div>
                    )}
                </div>
            </motion.div>
        </Link>
    );
}
