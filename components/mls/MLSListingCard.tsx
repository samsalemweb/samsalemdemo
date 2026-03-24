'use client';

import Image from 'next/image';
import Link from 'next/link';
import { MLSListing, formatMLSPrice } from '@/lib/mls';

interface MLSListingCardProps {
    listing: MLSListing;
}

export default function MLSListingCard({ listing }: MLSListingCardProps) {


    const lastUpdated = new Date(listing.ModificationTimestamp).toLocaleDateString(
        'en-CA',
        { year: 'numeric', month: 'short', day: 'numeric' }
    );

    return (
        <Link
            href={`/listing/mls-search/${listing.ListingKey}`}
            className="group block"
        >
            <div className="bg-white border border-border rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-500">
                {/* Image */}
                <div className="relative aspect-[4/3] overflow-hidden">
                    <Image
                        src={listing.PhotoUrl}
                        alt={listing.StreetAddress}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-700"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                    {/* Property type badge */}
                    <span className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm text-foreground text-xs font-semibold px-3 py-1.5 rounded-full">
                        {listing.PropertyType}
                    </span>
                    {/* Status badge */}
                    <span
                        className={`absolute top-3 right-3 text-xs font-semibold px-3 py-1.5 rounded-full ${listing.ListingStatus === 'Active'
                                ? 'bg-green-500/90 text-white'
                                : listing.ListingStatus === 'Pending'
                                    ? 'bg-amber-500/90 text-white'
                                    : 'bg-primary/90 text-white'
                            }`}
                    >
                        {listing.ListingStatus}
                    </span>
                </div>

                {/* Content */}
                <div className="p-5">
                    {/* Price */}
                    <p className="text-xl font-heading font-semibold text-foreground mb-1">
                        {formatMLSPrice(listing.ListPrice)}
                    </p>

                    {/* Address */}
                    <p className="text-sm text-foreground font-medium truncate">
                        {listing.StreetAddress}
                    </p>
                    <p className="text-xs text-muted mb-4">
                        {listing.City}, {listing.Province} {listing.PostalCode}
                    </p>

                    {/* Beds / Baths / Sqft */}
                    {(listing.BedroomsTotal > 0 || listing.LivingArea > 0) && (
                        <div className="flex items-center gap-4 text-xs text-muted border-t border-border pt-3 mb-3">
                            {listing.BedroomsTotal > 0 && (
                                <span className="flex items-center gap-1">
                                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
                                    </svg>
                                    {listing.BedroomsTotal} Bed{listing.BedroomsTotal !== 1 ? 's' : ''}
                                </span>
                            )}
                            {listing.BathroomsTotalInteger > 0 && (
                                <span>{listing.BathroomsTotalInteger} Bath{listing.BathroomsTotalInteger !== 1 ? 's' : ''}</span>
                            )}
                            {listing.LivingArea > 0 && (
                                <span>{listing.LivingArea.toLocaleString()} sqft</span>
                            )}
                        </div>
                    )}

                    {/* Footer */}
                    <div className="border-t border-border pt-3">
                        <p className="text-xs text-accent font-semibold">
                            Contact Sam Salem for details
                        </p>
                    </div>

                    {/* CREA compliance footer */}
                    <div className="flex items-center justify-between mt-2 pt-2 border-t border-dashed border-border/60">
                        <span className="text-[10px] text-muted/60 tracking-wide">
                            MLS® #{listing.MlsNumber}
                        </span>
                        <span className="text-[10px] text-muted/60">
                            Updated {lastUpdated}
                        </span>
                    </div>
                </div>
            </div>
        </Link>
    );
}
