import { supabase } from './supabase';
import type { MyListing, MyListingImage, MyListingWithImages } from '@/types/my-listing';

export const revalidate = 3600;

// ---- helpers ----

function resolveImageUrl(img: MyListingImage): string {
    const cloudinary = img.cloudinary_url?.trim();
    if (cloudinary) return cloudinary;
    return img.original_image_url || '';
}

function mapRawListing(row: Record<string, unknown>): MyListing {
    return {
        title: (row['Title'] as string) || '',
        building: (row['Building'] as string) || '',
        price: (row['Price'] as string) || '',
        property_type: (row['Property Type'] as string) || '',
        city: (row['City'] as string) || '',
        neighbourhood: (row['Neighbourhood'] as string) || '',
        address: (row['Address'] as string) || '',
        beds: (row['Beds'] as string) || '',
        baths: (row['Baths'] as string) || '',
        sq_ft: (row['Sq Ft'] as string) || '',
        built: (row['Built'] as string) || '',
        strata_fee: (row['Strata Fee'] as string) || '',
        mls_number: (row['MLS Number'] as string) || '',
        description: (row['Description'] as string) || '',
        source_url: (row['Source URL'] as string) || '',
    };
}

function mapRawImage(row: Record<string, unknown>): MyListingImage {
    return {
        listing: (row['Listing'] as string) || '',
        mls_number: (row['MLS Number'] as string) || '',
        image_number: (row['Image #'] as number) || 0,
        cloudinary_public_id: (row['Cloudinary Public ID'] as string) || '',
        original_image_url: (row['Original Image URL'] as string) || '',
        cloudinary_url: (row['Cloudinary URL (fill after upload)'] as string) || '',
    };
}

// ---- public API ----

/**
 * Fetch all my listings with images joined by MLS Number.
 */
export async function getAllMyListings(): Promise<MyListingWithImages[]> {
    const [listingsRes, imagesRes] = await Promise.all([
        supabase
            .from('my_listings')
            .select('"Title", "Building", "Price", "Property Type", "City", "Neighbourhood", "Address", "Beds", "Baths", "Sq Ft", "Built", "Strata Fee", "MLS Number", "Description", "Source URL"'),
        supabase
            .from('my_listing_images')
            .select('"Listing", "MLS Number", "Image #", "Cloudinary Public ID", "Original Image URL", "Cloudinary URL (fill after upload)"')
            .order('"Image #"', { ascending: true }),
    ]);

    if (listingsRes.error) {
        console.error('Error fetching my_listings:', listingsRes.error);
        return [];
    }
    if (imagesRes.error) {
        console.error('Error fetching my_listing_images:', imagesRes.error);
    }

    const rawListings = (listingsRes.data || []) as Record<string, unknown>[];
    const rawImages = (imagesRes.data || []) as Record<string, unknown>[];

    const listings = rawListings.map(mapRawListing);
    const images = rawImages.map(mapRawImage);

    // Group images by MLS Number
    const imagesByMLS = new Map<string, MyListingImage[]>();
    for (const img of images) {
        const key = img.mls_number;
        if (!key) continue;
        if (!imagesByMLS.has(key)) imagesByMLS.set(key, []);
        imagesByMLS.get(key)!.push(img);
    }

    const results: MyListingWithImages[] = [];

    for (const listing of listings) {
        const slug = listing.mls_number ? listing.mls_number.toLowerCase() : '';
        if (!slug) continue; // skip listings without MLS Number

        const listingImages = imagesByMLS.get(listing.mls_number) || [];

        // Sort by image_number ascending (already ordered from DB, but ensure)
        listingImages.sort((a, b) => a.image_number - b.image_number);

        const resolvedImages = listingImages
            .map((img) => ({
                url: resolveImageUrl(img),
                alt: `${listing.title} - Image ${img.image_number}`,
            }))
            .filter((img) => img.url !== '');

        results.push({
            ...listing,
            slug,
            images: resolvedImages,
            cover_image: resolvedImages.length > 0 ? resolvedImages[0].url : null,
        });
    }

    return results;
}

/**
 * Fetch a single my listing by slug (lowercase MLS Number).
 */
export async function getMyListingBySlug(slug: string): Promise<MyListingWithImages | null> {
    const allListings = await getAllMyListings();
    return allListings.find((l) => l.slug === slug) || null;
}

/**
 * Get all slugs for generateStaticParams.
 */
export async function getAllMyListingSlugs(): Promise<string[]> {
    const listings = await getAllMyListings();
    return listings.map((l) => l.slug);
}
