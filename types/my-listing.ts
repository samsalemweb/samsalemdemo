export interface MyListing {
    title: string;
    building: string;
    price: string;
    property_type: string;
    city: string;
    neighbourhood: string;
    address: string;
    beds: string;
    baths: string;
    sq_ft: string;
    built: string;
    strata_fee: string;
    mls_number: string;
    description: string;
    source_url: string;
}

export interface MyListingImage {
    listing: string;
    mls_number: string;
    image_number: number;
    cloudinary_public_id: string;
    original_image_url: string;
    cloudinary_url: string;
}

export interface MyListingWithImages extends MyListing {
    slug: string;
    images: { url: string; alt: string }[];
    cover_image: string | null;
}
