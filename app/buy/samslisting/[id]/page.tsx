import Link from 'next/link';
import Image from 'next/image';
import listingsData from '@/lib/data/listings.json';
import { Listing } from '@/lib/types';
import { formatPrice } from '@/lib/utils';
import { notFound } from 'next/navigation';

interface Props {
    params: { id: string };
}

export function generateStaticParams() {
    return (listingsData as Listing[]).map((listing) => ({ id: listing.id }));
}

export default function ListingDetailPage({ params }: Props) {
    const listing = (listingsData as Listing[]).find((l) => l.id === params.id);
    if (!listing) notFound();

    const statusColors: Record<string, string> = {
        'For Sale': 'bg-accent text-white',
        Sold: 'bg-red-500 text-white',
        Presale: 'bg-primary text-white',
    };

    return (
        <div className="min-h-screen bg-background">
            {/* Minimalist Hero Section */}
            <div className="pt-28 pb-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
                <Link
                    href="/buy/samslisting"
                    className="inline-flex items-center text-muted font-body font-medium hover:text-primary transition-colors mb-6 text-sm uppercase tracking-wider"
                >
                    <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M7 16l-4-4m0 0l4-4m-4 4h18" />
                    </svg>
                    Back to listings
                </Link>
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
                    <div>
                        <span
                            className={`inline-block px-3 py-1 text-xs font-body font-bold tracking-widest uppercase rounded-full mb-4 ${statusColors[listing.status] || 'bg-gray-500 text-white'}`}
                        >
                            {listing.status}
                        </span>
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold text-foreground mb-4 leading-tight">
                            {listing.title}
                        </h1>
                        <p className="text-muted font-body text-xl">{listing.address}, {listing.city}</p>
                    </div>
                    <div className="text-left md:text-right">
                        <p className="text-3xl md:text-4xl font-heading font-bold text-primary">
                            {formatPrice(listing.price)}
                        </p>
                    </div>
                </div>

                <div className="relative h-[50vh] md:h-[70vh] rounded-3xl overflow-hidden mb-16">
                    <Image
                        src={listing.images[0]}
                        alt={listing.title}
                        fill
                        className="object-cover"
                    />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-16">

                        {/* Quote Block */}
                        <div className="relative pl-8 border-l-4 border-accent">
                            <p className="text-2xl font-heading font-medium text-foreground italic leading-relaxed">
                                &quot;Where clean design meets cozy living — a home built for families who love style and space.&quot;
                            </p>
                        </div>

                        {/* Description */}
                        <div>
                            <p className="text-muted font-body text-lg leading-relaxed">{listing.description}</p>
                        </div>

                        {/* Property Details Table */}
                        <div>
                            <h2 className="text-2xl font-heading font-bold text-foreground mb-6 pb-4 border-b border-border">Property Details</h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-12">
                                {[
                                    { label: 'Property Type', value: listing.propertyType },
                                    { label: 'Location', value: listing.city },
                                    { label: 'Price', value: formatPrice(listing.price) },
                                    { label: 'Bedrooms', value: listing.bedrooms },
                                    { label: 'Bathrooms', value: listing.bathrooms },
                                    { label: 'Total Area', value: `${listing.sqft.toLocaleString()} sq ft` },
                                    { label: 'MLS #', value: listing.mlsId || 'N/A' },
                                    { label: 'Brokerage', value: listing.listingBrokerage },
                                ].map((detail) => (
                                    <div key={detail.label} className="flex justify-between items-center py-3 border-b border-gray-100">
                                        <span className="text-muted font-body text-sm">{detail.label}</span>
                                        <span className="text-foreground font-heading font-medium text-sm text-right">{detail.value}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Amenities / Features */}
                        <div>
                            <h2 className="text-2xl font-heading font-bold text-foreground mb-6 pb-4 border-b border-border">Amenities & Features</h2>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-y-6 gap-x-4">
                                {listing.features.map((feature, i) => (
                                    <div key={i} className="flex items-start gap-3">
                                        <svg className="w-5 h-5 text-accent shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                        </svg>
                                        <span className="text-foreground font-body text-sm leading-snug">{feature}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Image Gallery */}
                        {listing.images.length > 1 && (
                            <div>
                                <h2 className="text-2xl font-heading font-bold text-foreground mb-6 pb-4 border-b border-border">Gallery</h2>
                                <div className="grid grid-cols-2 md:grid-cols-2 gap-4">
                                    {listing.images.slice(1).map((img, i) => (
                                        <div key={i} className={`relative rounded-2xl overflow-hidden ${i === 0 ? 'col-span-2 md:col-span-2 h-96' : 'h-64'}`}>
                                            <Image src={img} alt={`View ${i + 2}`} fill className="object-cover hover:scale-105 transition-transform duration-700" />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Sidebar */}
                    <div className="lg:col-span-1">
                        <div className="sticky top-32 space-y-8">
                            {/* Contact Card */}
                            <div className="bg-primary rounded-3xl p-8 shadow-2xl">
                                <h3 className="text-2xl font-heading font-bold text-white mb-4">
                                    Interested in this property?
                                </h3>
                                <p className="text-white/80 font-body text-sm mb-8 leading-relaxed">
                                    Contact Sam Salem for a private showing, detailed floor plans, or more information about this exclusive listing.
                                </p>
                                <div className="space-y-4">
                                    <a
                                        href="tel:+16045551234"
                                        className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-accent text-white font-body font-bold tracking-wide uppercase text-sm rounded-full hover:bg-white hover:text-accent transition-all duration-300"
                                    >
                                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
                                        </svg>
                                        Call Sam Salem
                                    </a>
                                    <a
                                        href="mailto:sam@samsalemrealty.ca"
                                        className="w-full flex items-center justify-center gap-3 px-6 py-4 border-2 border-white/20 text-white font-body font-bold tracking-wide uppercase text-sm rounded-full hover:bg-white/10 transition-all duration-300"
                                    >
                                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                                        </svg>
                                        Email Sam Salem
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
