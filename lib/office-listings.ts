import { supabase } from './supabase';
import type { OfficeListing, OfficeListingImage, OfficeListingWithImages } from '@/types/office-listing';

// ---- helpers ----

function resolveImageUrl(img: OfficeListingImage): string {
    if (img.cloudinary_url && img.cloudinary_url.trim() !== '') {
        return img.cloudinary_url;
    }
    return img.original_image_url || '';
}

function deriveSlug(title: string): string {
    return title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
}

function mapRawListing(row: Record<string, unknown>): OfficeListing {
    return {
        title: (row['Title'] as string) || '',
        price: (row['Price'] as string) || '',
        offer_type: (row['Offer Type'] as string) || '',
        property_type: (row['Property Type'] as string) || '',
        city: (row['City'] as string) || '',
        neighbourhood: (row['Neighbourhood'] as string) || '',
        address: (row['Address'] as string) || '',
        beds: (row['Beds'] as string) || '',
        baths: (row['Baths'] as string) || '',
        sq_ft: (row['Sq Ft'] as string) || '',
        lot: (row['Lot'] as string) || '',
        year_built: (row['Year Built'] as string) || '',
        tax: (row['Tax'] as string) || '',
        strata_fee: (row['Strata Fee'] as string) || '',
        mls: (row['MLS #'] as string) || '',
        agent: (row['Agent'] as string) || '',
        description: (row['Description'] as string) || '',
        source_url: (row['Source URL'] as string) || '',
    };
}

function mapRawImage(row: Record<string, unknown>): OfficeListingImage {
    return {
        listing_title: (row['Listing Title'] as string) || '',
        slug: (row['Slug'] as string) || '',
        image_number: (row['Image #'] as number) || 0,
        cloudinary_public_id: (row['Cloudinary Public ID'] as string) || '',
        original_image_url: (row['Original Image URL'] as string) || '',
        cloudinary_url: (row['Cloudinary URL (fill after upload)'] as string) || '',
    };
}

// ---- public API ----

/**
 * Fetch all office listings with images joined.
 */
export async function getAllOfficeListings(): Promise<OfficeListingWithImages[]> {
    const [listingsRes, imagesRes] = await Promise.all([
        supabase
            .from('office_listings')
            .select('"Title", "Price", "Offer Type", "Property Type", "City", "Neighbourhood", "Address", "Beds", "Baths", "Sq Ft", "Lot", "Year Built", "Tax", "Strata Fee", "MLS #", "Agent", "Description", "Source URL"'),
        supabase
            .from('office_listing_images')
            .select('"Listing Title", "Slug", "Image #", "Cloudinary Public ID", "Original Image URL", "Cloudinary URL (fill after upload)"')
            .order('"Image #"', { ascending: true }),
    ]);

    if (listingsRes.error) {
        console.error('Error fetching office_listings:', listingsRes.error);
        return [];
    }
    if (imagesRes.error) {
        console.error('Error fetching office_listing_images:', imagesRes.error);
    }

    const rawListings = (listingsRes.data || []) as Record<string, unknown>[];
    const rawImages = (imagesRes.data || []) as Record<string, unknown>[];

    const listings = rawListings.map(mapRawListing);
    const images = rawImages.map(mapRawImage);

    // Group images by listing title
    const imagesByTitle = new Map<string, OfficeListingImage[]>();
    for (const img of images) {
        const key = img.listing_title;
        if (!imagesByTitle.has(key)) imagesByTitle.set(key, []);
        imagesByTitle.get(key)!.push(img);
    }

    // Build slug map from images table
    const slugByTitle = new Map<string, string>();
    for (const img of images) {
        if (img.slug && !slugByTitle.has(img.listing_title)) {
            slugByTitle.set(img.listing_title, img.slug);
        }
    }

    const results: OfficeListingWithImages[] = [];

    for (const listing of listings) {
        const slug = slugByTitle.get(listing.title) || deriveSlug(listing.title);
        const listingImages = imagesByTitle.get(listing.title) || [];

        const resolvedImages = listingImages.map((img) => ({
            url: resolveImageUrl(img),
            alt: `${listing.title} - Image ${img.image_number}`,
        })).filter((img) => img.url !== '');

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
 * Fetch a single office listing by slug.
 */
export async function getOfficeListingBySlug(slug: string): Promise<OfficeListingWithImages | null> {
    // Find the listing title from the images table by slug
    const { data: imgRows, error: imgError } = await supabase
        .from('office_listing_images')
        .select('"Listing Title", "Slug", "Image #", "Cloudinary Public ID", "Original Image URL", "Cloudinary URL (fill after upload)"')
        .eq('Slug', slug)
        .order('"Image #"', { ascending: true });

    if (imgError) {
        console.error('Error fetching office images by slug:', imgError);
    }

    const rawImgRows = (imgRows || []) as Record<string, unknown>[];
    const images = rawImgRows.map(mapRawImage);

    const listingTitle = images.length > 0 ? images[0].listing_title : null;

    // If no images matched, try to find by derived slug
    if (!listingTitle) {
        const allListings = await getAllOfficeListings();
        const match = allListings.find((l) => l.slug === slug);
        return match || null;
    }

    // Fetch the listing row
    const { data: listingRows, error: listingError } = await supabase
        .from('office_listings')
        .select('"Title", "Price", "Offer Type", "Property Type", "City", "Neighbourhood", "Address", "Beds", "Baths", "Sq Ft", "Lot", "Year Built", "Tax", "Strata Fee", "MLS #", "Agent", "Description", "Source URL"')
        .eq('Title', listingTitle)
        .limit(1);

    if (listingError || !listingRows || listingRows.length === 0) {
        console.error('Error fetching office listing by title:', listingError);
        return null;
    }

    const listing = mapRawListing(listingRows[0] as Record<string, unknown>);

    const resolvedImages = images.map((img) => ({
        url: resolveImageUrl(img),
        alt: `${listing.title} - Image ${img.image_number}`,
    })).filter((img) => img.url !== '');

    return {
        ...listing,
        slug,
        images: resolvedImages,
        cover_image: resolvedImages.length > 0 ? resolvedImages[0].url : null,
    };
}

/**
 * Get all slugs for generateStaticParams.
 */
export async function getAllOfficeListingSlugs(): Promise<string[]> {
    const listings = await getAllOfficeListings();
    return listings.map((l) => l.slug);
}
