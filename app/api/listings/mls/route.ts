import { NextRequest, NextResponse } from 'next/server';
import { getMockListings, buildODataQuery } from '@/lib/mls';

// CREA DDF RESO Web API credentials — Phase 2
const CREA_API_URL = process.env.CREA_DDF_API_URL;
const CREA_USERNAME = process.env.CREA_DDF_USERNAME;
const CREA_PASSWORD = process.env.CREA_DDF_PASSWORD;

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);

    // Phase 1 — return mock data if credentials are not set
    if (!CREA_API_URL || !CREA_USERNAME || !CREA_PASSWORD) {
        const listings = getMockListings(searchParams);
        return NextResponse.json(listings);
    }

    // Phase 2 — real CREA RESO Web API call
    try {
        const oDataQuery = buildODataQuery(searchParams);
        const response = await fetch(
            `${CREA_API_URL}/Property?${oDataQuery}`,
            {
                headers: {
                    Authorization:
                        'Basic ' +
                        Buffer.from(`${CREA_USERNAME}:${CREA_PASSWORD}`).toString('base64'),
                    Accept: 'application/json',
                },
                next: { revalidate: 86400 }, // CREA compliance — 24hr max cache
            }
        );

        if (!response.ok) {
            console.error('CREA API error:', response.status, response.statusText);
            // Fall back to mock data on API failure
            const listings = getMockListings(searchParams);
            return NextResponse.json(listings);
        }

        const data = await response.json();
        return NextResponse.json(data.value || []);
    } catch (error) {
        console.error('CREA API fetch error:', error);
        const listings = getMockListings(searchParams);
        return NextResponse.json(listings);
    }
}
