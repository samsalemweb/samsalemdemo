export interface OfficeListing {
    title: string;
    price: string;
    offer_type: string;
    property_type: string;
    city: string;
    neighbourhood: string;
    address: string;
    beds: string;
    baths: string;
    sq_ft: string;
    lot: string;
    year_built: string;
    tax: string;
    strata_fee: string;
    mls: string;
    agent: string;
    description: string;
    source_url: string;
}

export interface OfficeListingImage {
    listing_title: string;
    slug: string;
    image_number: number;
    cloudinary_public_id: string;
    original_image_url: string;
    cloudinary_url: string;
}

export interface OfficeListingWithImages extends OfficeListing {
    slug: string;
    images: { url: string; alt: string }[];
    cover_image: string | null;
}
