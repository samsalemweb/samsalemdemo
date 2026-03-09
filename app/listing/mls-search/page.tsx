'use client';

import { useState, useEffect, useCallback } from 'react';
import { MLSListing } from '@/lib/mls';
import MLSListingCard from '@/components/mls/MLSListingCard';

const PROPERTY_TYPES = ['Detached', 'Condo', 'Townhouse', 'Land', 'Commercial'];
const PRICE_OPTIONS = [
    { label: 'No min', value: '' },
    { label: '$300K', value: '300000' },
    { label: '$500K', value: '500000' },
    { label: '$750K', value: '750000' },
    { label: '$1M', value: '1000000' },
    { label: '$1.5M', value: '1500000' },
    { label: '$2M', value: '2000000' },
    { label: '$3M', value: '3000000' },
];
const PRICE_MAX_OPTIONS = [
    { label: 'No max', value: '' },
    { label: '$500K', value: '500000' },
    { label: '$750K', value: '750000' },
    { label: '$1M', value: '1000000' },
    { label: '$1.5M', value: '1500000' },
    { label: '$2M', value: '2000000' },
    { label: '$3M', value: '3000000' },
    { label: '$5M', value: '5000000' },
];

export default function MLSSearchPage() {
    const [listings, setListings] = useState<MLSListing[]>([]);
    const [loading, setLoading] = useState(true);

    // Filter state
    const [city, setCity] = useState('');
    const [keyword, setKeyword] = useState('');
    const [propertyType, setPropertyType] = useState('');
    const [minPrice, setMinPrice] = useState('');
    const [maxPrice, setMaxPrice] = useState('');
    const [minBedrooms, setMinBedrooms] = useState('');
    const [minBathrooms, setMinBathrooms] = useState('');

    const fetchListings = useCallback(async () => {
        setLoading(true);
        const params = new URLSearchParams();
        if (city) params.set('city', city);
        if (keyword) params.set('keyword', keyword);
        if (propertyType) params.set('propertyType', propertyType);
        if (minPrice) params.set('minPrice', minPrice);
        if (maxPrice) params.set('maxPrice', maxPrice);
        if (minBedrooms) params.set('minBedrooms', minBedrooms);
        if (minBathrooms) params.set('minBathrooms', minBathrooms);

        try {
            const res = await fetch(`/api/listings/mls?${params.toString()}`);
            const data = await res.json();
            setListings(data);
        } catch (err) {
            console.error('Error fetching MLS listings:', err);
            setListings([]);
        } finally {
            setLoading(false);
        }
    }, [city, keyword, propertyType, minPrice, maxPrice, minBedrooms, minBathrooms]);

    useEffect(() => {
        fetchListings();
    }, [fetchListings]);

    const clearFilters = () => {
        setCity('');
        setKeyword('');
        setPropertyType('');
        setMinPrice('');
        setMaxPrice('');
        setMinBedrooms('');
        setMinBathrooms('');
    };

    const hasFilters = city || keyword || propertyType || minPrice || maxPrice || minBedrooms || minBathrooms;

    return (
        <div className="min-h-screen bg-cream">
            {/* Hero header */}
            <div className="bg-primary text-white py-16 md:py-24">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h1 className="text-4xl md:text-6xl font-heading font-medium tracking-tight mb-4">
                        MLS® Listings
                    </h1>
                    <p className="text-white/70 text-lg max-w-xl font-body">
                        Search the Greater Vancouver MLS® database. Verified listings updated daily.
                    </p>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
                {/* Search & Filters */}
                <div className="bg-white rounded-2xl border border-border p-5 md:p-6 mb-8 shadow-sm">
                    {/* Search row */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-5">
                        <div>
                            <label className="block text-xs font-semibold text-muted uppercase tracking-wider mb-1.5">
                                City / Area
                            </label>
                            <input
                                type="text"
                                placeholder="e.g. Vancouver, North Vancouver"
                                value={city}
                                onChange={(e) => setCity(e.target.value)}
                                className="w-full px-4 py-2.5 rounded-xl border border-border bg-cream/50 text-sm text-foreground placeholder:text-muted/50 focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent/50 transition"
                            />
                        </div>
                        <div className="md:col-span-2">
                            <label className="block text-xs font-semibold text-muted uppercase tracking-wider mb-1.5">
                                Keyword
                            </label>
                            <input
                                type="text"
                                placeholder="Search by address, neighbourhood, or feature..."
                                value={keyword}
                                onChange={(e) => setKeyword(e.target.value)}
                                className="w-full px-4 py-2.5 rounded-xl border border-border bg-cream/50 text-sm text-foreground placeholder:text-muted/50 focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent/50 transition"
                            />
                        </div>
                    </div>

                    {/* Filter row */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                        {/* Property type */}
                        <div>
                            <label className="block text-xs font-semibold text-muted uppercase tracking-wider mb-1.5">
                                Type
                            </label>
                            <select
                                value={propertyType}
                                onChange={(e) => setPropertyType(e.target.value)}
                                className="w-full px-3 py-2.5 rounded-xl border border-border bg-cream/50 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-accent/30 transition appearance-none"
                            >
                                <option value="">All Types</option>
                                {PROPERTY_TYPES.map((t) => (
                                    <option key={t} value={t}>{t}</option>
                                ))}
                            </select>
                        </div>

                        {/* Min price */}
                        <div>
                            <label className="block text-xs font-semibold text-muted uppercase tracking-wider mb-1.5">
                                Min Price
                            </label>
                            <select
                                value={minPrice}
                                onChange={(e) => setMinPrice(e.target.value)}
                                className="w-full px-3 py-2.5 rounded-xl border border-border bg-cream/50 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-accent/30 transition appearance-none"
                            >
                                {PRICE_OPTIONS.map((p) => (
                                    <option key={p.value} value={p.value}>{p.label}</option>
                                ))}
                            </select>
                        </div>

                        {/* Max price */}
                        <div>
                            <label className="block text-xs font-semibold text-muted uppercase tracking-wider mb-1.5">
                                Max Price
                            </label>
                            <select
                                value={maxPrice}
                                onChange={(e) => setMaxPrice(e.target.value)}
                                className="w-full px-3 py-2.5 rounded-xl border border-border bg-cream/50 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-accent/30 transition appearance-none"
                            >
                                {PRICE_MAX_OPTIONS.map((p) => (
                                    <option key={p.value} value={p.value}>{p.label}</option>
                                ))}
                            </select>
                        </div>

                        {/* Min beds */}
                        <div>
                            <label className="block text-xs font-semibold text-muted uppercase tracking-wider mb-1.5">
                                Bedrooms
                            </label>
                            <select
                                value={minBedrooms}
                                onChange={(e) => setMinBedrooms(e.target.value)}
                                className="w-full px-3 py-2.5 rounded-xl border border-border bg-cream/50 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-accent/30 transition appearance-none"
                            >
                                <option value="">Any</option>
                                {[1, 2, 3, 4, 5].map((n) => (
                                    <option key={n} value={n}>{n}+</option>
                                ))}
                            </select>
                        </div>

                        {/* Min baths */}
                        <div>
                            <label className="block text-xs font-semibold text-muted uppercase tracking-wider mb-1.5">
                                Bathrooms
                            </label>
                            <select
                                value={minBathrooms}
                                onChange={(e) => setMinBathrooms(e.target.value)}
                                className="w-full px-3 py-2.5 rounded-xl border border-border bg-cream/50 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-accent/30 transition appearance-none"
                            >
                                <option value="">Any</option>
                                {[1, 2, 3, 4].map((n) => (
                                    <option key={n} value={n}>{n}+</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Clear filters */}
                    {hasFilters && (
                        <div className="mt-4 pt-4 border-t border-border">
                            <button
                                onClick={clearFilters}
                                className="text-xs font-semibold text-accent hover:text-accent-dark transition"
                            >
                                ✕ Clear all filters
                            </button>
                        </div>
                    )}
                </div>

                {/* Results count */}
                <div className="flex items-center justify-between mb-6">
                    <p className="text-sm text-muted">
                        {loading ? 'Searching...' : `${listings.length} listing${listings.length !== 1 ? 's' : ''} found`}
                    </p>
                    <div className="flex items-center gap-2">
                        <svg className="w-4 h-4 text-muted/40" viewBox="0 0 24 24" fill="none">
                            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14H9V8h2v8zm4 0h-2V8h2v8z" fill="currentColor" opacity="0.4" />
                        </svg>
                        <span className="text-[10px] text-muted/50">
                            Data provided by CREA DDF. MLS® is a trademark of CREA.
                        </span>
                    </div>
                </div>

                {/* Loading skeletons */}
                {loading && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[...Array(6)].map((_, i) => (
                            <div key={i} className="bg-white rounded-2xl overflow-hidden border border-border animate-pulse">
                                <div className="aspect-[4/3] bg-gray-200" />
                                <div className="p-5 space-y-3">
                                    <div className="h-5 bg-gray-200 rounded w-1/3" />
                                    <div className="h-4 bg-gray-200 rounded w-2/3" />
                                    <div className="h-3 bg-gray-200 rounded w-1/2" />
                                    <div className="h-px bg-gray-100 my-3" />
                                    <div className="h-3 bg-gray-200 rounded w-3/4" />
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Results grid */}
                {!loading && listings.length > 0 && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {listings.map((listing) => (
                            <MLSListingCard key={listing.ListingKey} listing={listing} />
                        ))}
                    </div>
                )}

                {/* Empty state */}
                {!loading && listings.length === 0 && (
                    <div className="text-center py-20">
                        <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-border/30 flex items-center justify-center">
                            <svg className="w-8 h-8 text-muted/40" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                            </svg>
                        </div>
                        <h3 className="text-xl font-heading font-semibold text-foreground mb-2">
                            No listings match your search
                        </h3>
                        <p className="text-sm text-muted mb-6">
                            Try adjusting your filters or broadening your search criteria.
                        </p>
                        <button
                            onClick={clearFilters}
                            className="btn-pill btn-pill-dark"
                        >
                            Clear all filters
                        </button>
                    </div>
                )}

                {/* CREA Disclaimer */}
                <div className="mt-16 pt-8 border-t border-border">
                    <p className="text-[11px] text-muted/60 leading-relaxed max-w-4xl">
                        The trademarks MLS®, Multiple Listing Service® and the associated logos are owned by The Canadian Real Estate Association (CREA) and identify the quality of services provided by real estate professionals who are members of CREA. The trademarks REALTOR®, REALTORS® and the REALTOR® logo are controlled by CREA and identify real estate professionals who are members of CREA. Data is deemed reliable but not guaranteed. Listing data is updated periodically and may not reflect the most current information available. All information should be independently reviewed and verified.
                    </p>
                </div>
            </div>
        </div>
    );
}
