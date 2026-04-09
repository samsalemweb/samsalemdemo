'use client';

import { useState, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import type { OfficeListingWithImages } from '@/types/office-listing';

const offerColors: Record<string, string> = {
    'For Sale': 'bg-emerald-500/90 text-white',
    'For Rent': 'bg-amber-500/90 text-white',
};

interface OfficeListingGridProps {
    listings: OfficeListingWithImages[];
}

export default function OfficeListingGrid({ listings }: OfficeListingGridProps) {
    const [cityFilter, setCityFilter] = useState('');
    const [typeFilter, setTypeFilter] = useState('');
    const [offerFilter, setOfferFilter] = useState('');

    const cities = useMemo(() => {
        return Array.from(new Set(listings.map((l) => l.city).filter(Boolean))).sort();
    }, [listings]);

    const propertyTypes = useMemo(() => {
        return Array.from(new Set(listings.map((l) => l.property_type).filter(Boolean))).sort();
    }, [listings]);

    const offerTypes = useMemo(() => {
        return Array.from(new Set(listings.map((l) => l.offer_type).filter(Boolean))).sort();
    }, [listings]);

    const filtered = useMemo(() => {
        return listings.filter((l) => {
            if (cityFilter && l.city !== cityFilter) return false;
            if (typeFilter && l.property_type !== typeFilter) return false;
            if (offerFilter && l.offer_type !== offerFilter) return false;
            return true;
        });
    }, [listings, cityFilter, typeFilter, offerFilter]);

    const isEmptyPrice = (price: string) => !price || price === '—' || price.trim() === '';

    return (
        <div>
            {/* Filter Bar */}
            <div className="flex flex-wrap items-center gap-4 mb-10 p-5 bg-white rounded-2xl border border-border shadow-sm">
                <div className="flex-1 min-w-[160px]">
                    <label className="text-xs font-semibold tracking-widest uppercase text-muted mb-2 block">City</label>
                    <select
                        value={cityFilter}
                        onChange={(e) => setCityFilter(e.target.value)}
                        className="w-full px-4 py-2.5 bg-background border border-border rounded-xl text-sm focus:outline-none focus:border-accent/50 transition-all"
                    >
                        <option value="">All Cities</option>
                        {cities.map((city) => (
                            <option key={city} value={city}>{city}</option>
                        ))}
                    </select>
                </div>
                <div className="flex-1 min-w-[160px]">
                    <label className="text-xs font-semibold tracking-widest uppercase text-muted mb-2 block">Property Type</label>
                    <select
                        value={typeFilter}
                        onChange={(e) => setTypeFilter(e.target.value)}
                        className="w-full px-4 py-2.5 bg-background border border-border rounded-xl text-sm focus:outline-none focus:border-accent/50 transition-all"
                    >
                        <option value="">All Types</option>
                        {propertyTypes.map((type) => (
                            <option key={type} value={type}>{type}</option>
                        ))}
                    </select>
                </div>
                <div className="flex-1 min-w-[160px]">
                    <label className="text-xs font-semibold tracking-widest uppercase text-muted mb-2 block">Offer Type</label>
                    <select
                        value={offerFilter}
                        onChange={(e) => setOfferFilter(e.target.value)}
                        className="w-full px-4 py-2.5 bg-background border border-border rounded-xl text-sm focus:outline-none focus:border-accent/50 transition-all"
                    >
                        <option value="">All</option>
                        {offerTypes.map((t) => (
                            <option key={t} value={t}>{t}</option>
                        ))}
                    </select>
                </div>
                <div className="flex items-end pt-6">
                    <span className="text-sm text-muted font-medium">
                        {filtered.length} {filtered.length === 1 ? 'listing' : 'listings'} found
                    </span>
                </div>
            </div>

            {/* Grid */}
            {filtered.length === 0 ? (
                <div className="text-center py-16">
                    <svg className="w-16 h-16 text-muted/30 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m5.231 13.481L15 17.25m-4.5-15H5.625c-.621 0-1.125.504-1.125 1.125v16.5c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9zm3.75 11.625a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
                    </svg>
                    <p className="text-muted font-body text-base">No listings match your filters.</p>
                    <button
                        onClick={() => { setCityFilter(''); setTypeFilter(''); setOfferFilter(''); }}
                        className="mt-4 text-accent text-sm font-semibold hover:underline"
                    >
                        Clear all filters
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {filtered.map((listing) => (
                        <Link key={listing.slug} href={`/listing/office-listing/${listing.slug}`} className="group block">
                            <motion.div
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                whileHover={{ y: -5 }}
                                viewport={{ once: true, margin: '-50px' }}
                                transition={{ type: "spring", stiffness: 260, damping: 20, duration: 0.8 }}
                                className="rounded-3xl overflow-hidden border border-border bg-white shadow-sm hover:shadow-2xl transition-shadow duration-300 h-full flex flex-col"
                            >
                                {/* Hero Image */}
                                <div className="relative h-[260px] overflow-hidden">
                                    {listing.cover_image ? (
                                        <Image
                                            src={listing.cover_image}
                                            alt={listing.title}
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
                                    {/* Offer type badge */}
                                    <div className="absolute top-4 right-4">
                                        <span className={`px-3 py-1 backdrop-blur-sm rounded-full text-xs font-bold tracking-wide shadow-sm ${offerColors[listing.offer_type] || 'bg-accent/90 text-white'}`}>
                                            {listing.offer_type}
                                        </span>
                                    </div>
                                </div>

                                {/* Content */}
                                <div className="p-6 flex flex-col flex-1">
                                    <h3 className="text-xl font-heading font-semibold text-foreground mb-1 group-hover:text-accent transition-colors duration-300 line-clamp-2">
                                        {listing.title}
                                    </h3>
                                    <p className="text-muted text-sm mb-3">
                                        {listing.city}{listing.neighbourhood && listing.neighbourhood !== listing.city ? ` · ${listing.neighbourhood}` : ''}
                                    </p>

                                    {/* Price */}
                                    {isEmptyPrice(listing.price) ? (
                                        <p className="text-lg font-heading font-semibold text-accent italic mb-4">Pricing Coming Soon</p>
                                    ) : (
                                        <p className="text-lg font-heading font-semibold text-foreground mb-4">{listing.price}</p>
                                    )}

                                    {/* Stats Row */}
                                    <div className="flex items-center gap-4 mb-5 flex-wrap">
                                        {listing.beds && (
                                            <div className="flex items-center gap-1.5">
                                                <svg className="w-4 h-4 text-muted/60" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
                                                </svg>
                                                <span className="text-xs text-muted font-medium">{listing.beds} Beds</span>
                                            </div>
                                        )}
                                        {listing.baths && (
                                            <div className="flex items-center gap-1.5">
                                                <svg className="w-4 h-4 text-muted/60" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                </svg>
                                                <span className="text-xs text-muted font-medium">{listing.baths} Baths</span>
                                            </div>
                                        )}
                                        {listing.sq_ft && (
                                            <div className="flex items-center gap-1.5">
                                                <svg className="w-4 h-4 text-muted/60" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75h-4.5m4.5 0v4.5m0-4.5L15 9m5.25 11.25h-4.5m4.5 0v-4.5m0 4.5L15 15" />
                                                </svg>
                                                <span className="text-xs text-muted font-medium">{listing.sq_ft} sqft</span>
                                            </div>
                                        )}
                                    </div>

                                    {/* View Details */}
                                    <div className="mt-auto pt-4 border-t border-border flex items-center justify-end">
                                        <span className="text-xs font-semibold text-accent group-hover:underline">
                                            View Details →
                                        </span>
                                    </div>
                                </div>
                            </motion.div>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
}
