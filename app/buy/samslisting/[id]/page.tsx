import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getMyListingBySlug, getAllMyListingSlugs } from '@/lib/my-listings';
import MyListingImageGallery from '@/components/my-listing/MyListingImageGallery';

export const revalidate = 3600;

export async function generateStaticParams() {
    const slugs = await getAllMyListingSlugs();
    return slugs.map((slug) => ({ id: slug }));
}

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
    const listing = await getMyListingBySlug(params.id);
    if (!listing) return { title: 'Listing Not Found' };
    return {
        title: `${listing.title} | Sam Salem's Listings`,
        description: listing.description
            ? listing.description.substring(0, 160)
            : `View details for ${listing.title} in ${listing.city}. Contact Sam Salem for more information.`,
    };
}

export default async function SamsListingDetailPage({ params }: { params: { id: string } }) {
    const listing = await getMyListingBySlug(params.id);
    if (!listing) notFound();

    const isEmptyPrice =
        !listing.price || listing.price === '—' || listing.price.trim() === '';

    // Stats for accent boxes
    const statItems: { label: string; value: string }[] = [];
    if (listing.beds?.trim()) statItems.push({ label: 'Beds', value: listing.beds });
    if (listing.baths?.trim()) statItems.push({ label: 'Baths', value: listing.baths });
    if (listing.sq_ft?.trim()) statItems.push({ label: 'Sq Ft', value: listing.sq_ft });

    // Detail grid rows — only render non-empty
    const detailRows: { label: string; value: string }[] = [
        { label: 'Property Type', value: listing.property_type },
        { label: 'City', value: listing.city },
        { label: 'Neighbourhood', value: listing.neighbourhood },
        { label: 'Address', value: listing.address },
        { label: 'Year Built', value: listing.built },
        { label: 'Strata Fee', value: listing.strata_fee },
        { label: 'MLS Number', value: listing.mls_number },
    ].filter((row) => row.value && row.value.trim() !== '');

    return (
        <div className="min-h-screen bg-background">
            {/* Back link bar */}
            <div className="pt-28 md:pt-32 pb-4 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <Link
                    href="/buy/samslisting"
                    className="inline-flex items-center gap-2 text-muted hover:text-accent transition-colors text-sm font-body"
                >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                    </svg>
                    Back to My Listings
                </Link>
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
                <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
                    {/* LEFT — Image Gallery (3/5 width on desktop) */}
                    <div className="lg:col-span-3">
                        {listing.images.length > 0 ? (
                            <MyListingImageGallery images={listing.images} title={listing.title} />
                        ) : (
                            <div
                                className="w-full h-[400px] rounded-2xl flex items-center justify-center bg-gray-100"
                            >
                                <span className="text-muted text-sm font-body">No images available</span>
                            </div>
                        )}
                    </div>

                    {/* RIGHT — Details (2/5 width on desktop) */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Active Listing label */}
                        <span
                            className="inline-block text-[11px] font-semibold tracking-[0.25em] uppercase font-body"
                            style={{ color: '#C9A84C' }}
                        >
                            Active Listing
                        </span>

                        {/* Building Name */}
                        {listing.building?.trim() && (
                            <p
                                className="text-xs font-semibold tracking-[0.2em] uppercase font-body -mt-3"
                                style={{ color: '#C9A84C' }}
                            >
                                {listing.building}
                            </p>
                        )}

                        {/* Title */}
                        <h1 className="text-3xl md:text-4xl font-cinzel font-medium text-foreground tracking-tight leading-tight">
                            {listing.title}
                        </h1>

                        {/* Price */}
                        {isEmptyPrice ? (
                            <p className="text-2xl font-cinzel font-medium italic" style={{ color: '#C9A84C' }}>
                                Pricing On Request
                            </p>
                        ) : (
                            <p className="text-2xl font-cinzel font-semibold" style={{ color: '#C9A84C' }}>
                                {listing.price}
                            </p>
                        )}

                        {/* Gold divider */}
                        <div className="w-16 h-[2px]" style={{ backgroundColor: '#C9A84C' }} />

                        {/* Stats row — accent boxes */}
                        {statItems.length > 0 && (
                            <div className="flex gap-3">
                                {statItems.map((stat) => (
                                    <div
                                        key={stat.label}
                                        className="flex-1 text-center py-4 rounded-xl border"
                                        style={{
                                            borderColor: 'rgba(201, 168, 76, 0.25)',
                                            backgroundColor: 'rgba(201, 168, 76, 0.06)',
                                        }}
                                    >
                                        <p className="text-xl font-cinzel font-semibold text-foreground">{stat.value}</p>
                                        <p
                                            className="text-[10px] font-medium uppercase tracking-widest font-body mt-1"
                                            style={{ color: '#C9A84C' }}
                                        >
                                            {stat.label}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Detail grid */}
                        {detailRows.length > 0 && (
                            <div className="space-y-3 pt-2">
                                {detailRows.map((row) => (
                                    <div key={row.label} className="flex justify-between items-baseline py-2 border-b border-border">
                                        <span className="text-xs font-body text-muted uppercase tracking-wider">{row.label}</span>
                                        <span className="text-sm font-body text-foreground text-right">{row.value}</span>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Description */}
                        {listing.description?.trim() && (
                            <div className="pt-4">
                                <p className="text-muted font-body text-sm leading-relaxed whitespace-pre-line">
                                    {listing.description}
                                </p>
                            </div>
                        )}

                        {/* CTA Buttons */}
                        <div className="flex flex-col sm:flex-row gap-3 pt-4">
                            <a
                                href="https://calendly.com/samsalemhomes/60min"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex-1 inline-flex items-center justify-center gap-2 py-3.5 px-6 rounded-xl font-body font-semibold text-sm tracking-wide text-white transition-all duration-300 hover:opacity-90"
                                style={{
                                    background: 'linear-gradient(135deg, #C9A84C, #D4BA6A)',
                                }}
                            >
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
                                </svg>
                                Book a Showing
                            </a>
                            <Link
                                href="/contact"
                                className="flex-1 inline-flex items-center justify-center gap-2 py-3.5 px-6 rounded-xl font-body font-semibold text-sm tracking-wide transition-all duration-300 hover:bg-[#C9A84C]/10"
                                style={{
                                    color: '#C9A84C',
                                    border: '1px solid rgba(201, 168, 76, 0.4)',
                                }}
                            >
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                                </svg>
                                Contact Sam
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
