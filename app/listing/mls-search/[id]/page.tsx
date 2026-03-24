import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getMockListingByKey, formatMLSPrice } from '@/lib/mls';

export const revalidate = 86400; // CREA compliance — 24hr max cache

interface MLSDetailPageProps {
    params: { id: string };
}

export default function MLSDetailPage({ params }: MLSDetailPageProps) {
    const listing = getMockListingByKey(params.id);

    if (!listing) {
        notFound();
    }

    const lastUpdated = new Date(listing.ModificationTimestamp).toLocaleDateString(
        'en-CA',
        { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' }
    );

    const listedDate = new Date(listing.ListDate).toLocaleDateString('en-CA', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });



    return (
        <div className="min-h-screen bg-cream">
            {/* Back link */}
            <div className="bg-primary text-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <Link
                        href="/listing/mls-search"
                        className="inline-flex items-center gap-2 text-sm text-white/70 hover:text-white transition"
                    >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                        </svg>
                        Back to MLS® Search
                    </Link>
                </div>
            </div>

            {/* CREA compliance banner */}
            <div className="bg-accent/10 border-b border-accent/20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
                    <p className="text-xs text-foreground/70">
                        <strong>Listing data provided by CREA DDF®.</strong> Last updated: {lastUpdated}.
                    </p>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
                {/* Image gallery */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-10 rounded-2xl overflow-hidden">
                    <div className="relative aspect-[4/3]">
                        <Image
                            src={listing.Photos[0]}
                            alt={listing.StreetAddress}
                            fill
                            className="object-cover"
                            sizes="(max-width: 768px) 100vw, 50vw"
                            priority
                        />
                    </div>
                    {listing.Photos.length > 1 && (
                        <div className="relative aspect-[4/3]">
                            <Image
                                src={listing.Photos[1]}
                                alt={`${listing.StreetAddress} - Interior`}
                                fill
                                className="object-cover"
                                sizes="(max-width: 768px) 100vw, 50vw"
                            />
                        </div>
                    )}
                </div>

                {/* Two column layout */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                    {/* Main content */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Header */}
                        <div>
                            <div className="flex flex-wrap items-center gap-3 mb-3">
                                <span className="bg-white text-foreground text-xs font-semibold px-3 py-1.5 rounded-full border border-border">
                                    {listing.PropertyType}
                                </span>
                                <span
                                    className={`text-xs font-semibold px-3 py-1.5 rounded-full ${listing.ListingStatus === 'Active'
                                            ? 'bg-green-500/10 text-green-700'
                                            : listing.ListingStatus === 'Pending'
                                                ? 'bg-amber-500/10 text-amber-700'
                                                : 'bg-primary/10 text-primary'
                                        }`}
                                >
                                    {listing.ListingStatus}
                                </span>
                                <span className="text-xs text-muted">MLS® #{listing.MlsNumber}</span>
                            </div>
                            <h1 className="text-3xl md:text-5xl font-heading font-medium tracking-tight text-foreground mb-2">
                                {formatMLSPrice(listing.ListPrice)}
                            </h1>
                            <p className="text-lg text-foreground font-medium">{listing.StreetAddress}</p>
                            <p className="text-muted">
                                {listing.City}, {listing.Province} {listing.PostalCode}
                            </p>
                        </div>

                        {/* Quick stats */}
                        {(listing.BedroomsTotal > 0 || listing.LivingArea > 0) && (
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                                {listing.BedroomsTotal > 0 && (
                                    <div className="bg-white rounded-xl p-4 border border-border text-center">
                                        <p className="text-2xl font-heading font-semibold text-foreground">{listing.BedroomsTotal}</p>
                                        <p className="text-xs text-muted">Bedrooms</p>
                                    </div>
                                )}
                                {listing.BathroomsTotalInteger > 0 && (
                                    <div className="bg-white rounded-xl p-4 border border-border text-center">
                                        <p className="text-2xl font-heading font-semibold text-foreground">{listing.BathroomsTotalInteger}</p>
                                        <p className="text-xs text-muted">Bathrooms</p>
                                    </div>
                                )}
                                {listing.LivingArea > 0 && (
                                    <div className="bg-white rounded-xl p-4 border border-border text-center">
                                        <p className="text-2xl font-heading font-semibold text-foreground">{listing.LivingArea.toLocaleString()}</p>
                                        <p className="text-xs text-muted">Sq Ft</p>
                                    </div>
                                )}
                                {listing.YearBuilt && (
                                    <div className="bg-white rounded-xl p-4 border border-border text-center">
                                        <p className="text-2xl font-heading font-semibold text-foreground">{listing.YearBuilt}</p>
                                        <p className="text-xs text-muted">Year Built</p>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Description */}
                        <div>
                            <h2 className="text-xl font-heading font-semibold text-foreground mb-4">About this property</h2>
                            <p className="text-muted leading-relaxed">{listing.PublicRemarks}</p>
                        </div>

                        {/* Features */}
                        {listing.Features.length > 0 && (
                            <div>
                                <h2 className="text-xl font-heading font-semibold text-foreground mb-4">Features</h2>
                                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                                    {listing.Features.map((feature) => (
                                        <div
                                            key={feature}
                                            className="flex items-center gap-2 text-sm text-muted"
                                        >
                                            <svg className="w-4 h-4 text-accent shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                            </svg>
                                            {feature}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Property details */}
                        <div>
                            <h2 className="text-xl font-heading font-semibold text-foreground mb-4">Property Details</h2>
                            <div className="bg-white rounded-xl border border-border divide-y divide-border">
                                <DetailRow label="MLS® Number" value={listing.MlsNumber} />
                                <DetailRow label="Property Type" value={listing.PropertyType} />
                                <DetailRow label="Status" value={listing.ListingStatus} />
                                <DetailRow label="Listed Date" value={listedDate} />
                                {listing.LotSizeArea && (
                                    <DetailRow label="Lot Size" value={`${listing.LotSizeArea.toLocaleString()} sqft`} />
                                )}
                                {listing.Parking && (
                                    <DetailRow label="Parking" value={`${listing.Parking}${listing.ParkingSpaces ? ` (${listing.ParkingSpaces} spaces)` : ''}`} />
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Agent card */}
                        <div className="bg-white rounded-2xl border border-border p-6 sticky top-24">
                            <h3 className="text-sm font-semibold text-muted uppercase tracking-wider mb-4">
                                Your Agent
                            </h3>
                            <p className="text-lg font-heading font-semibold text-foreground">
                                Sam Salem
                            </p>
                            <p className="text-sm text-muted mb-4">REALTOR® | PREC</p>

                            <div className="space-y-3 mb-5">
                                <a href="tel:+16044452030" className="flex items-center gap-3 text-sm text-muted hover:text-accent transition-colors">
                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
                                    </svg>
                                    +1 (604) 445-2030
                                </a>
                                <a href="mailto:info@sam-salem.com" className="flex items-center gap-3 text-sm text-muted hover:text-accent transition-colors">
                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                                    </svg>
                                    info@sam-salem.com
                                </a>
                            </div>

                            <Link
                                href="/contact"
                                className="btn-pill btn-pill-dark w-full justify-center"
                            >
                                Contact Sam
                            </Link>

                            <div className="mt-6 pt-4 border-t border-border">
                                <p className="text-[10px] text-muted/60 leading-relaxed">
                                    Data courtesy of CREA DDF®. Last updated {lastUpdated}.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* CREA required disclaimer */}
                <div className="mt-16 pt-8 border-t border-border">
                    <p className="text-[11px] text-muted/60 leading-relaxed max-w-4xl">
                        The trademarks MLS®, Multiple Listing Service® and the associated logos are owned by The Canadian Real Estate Association (CREA) and identify the quality of services provided by real estate professionals who are members of CREA. The trademarks REALTOR®, REALTORS® and the REALTOR® logo are controlled by CREA and identify real estate professionals who are members of CREA. Data is deemed reliable but not guaranteed. Listing data provided by CREA DDF® and updated periodically. All information should be independently reviewed and verified.
                    </p>
                </div>
            </div>
        </div>
    );
}

function DetailRow({ label, value }: { label: string; value: string }) {
    return (
        <div className="flex items-center justify-between px-5 py-3.5">
            <span className="text-sm text-muted">{label}</span>
            <span className="text-sm font-medium text-foreground">{value}</span>
        </div>
    );
}
