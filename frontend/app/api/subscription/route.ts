import { NextRequest, NextResponse } from 'next/server';

const BASE_URL = `${process.env.BACKEND_SERVER}/api/subscriptions`;

// GET all subscriptions
export async function GET(req: NextRequest) {
    try {
        const incomingCookies = req.headers.get('cookie');
        const response = await fetch(BASE_URL, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                ...(incomingCookies ? { Cookie: incomingCookies } : {}),
            },
        });

        if (!response.ok) {
            throw new Error(
                `Error fetching subscriptions: ${response.statusText}`
            );
        }

        const data = await response.json();
        return NextResponse.json(data);
    } catch (error) {
        console.error('Error in subscriptions GET route:', error);
        return NextResponse.json(
            { error: 'Failed to fetch subscriptions' },
            { status: 500 }
        );
    }
}

// POST create a new subscription
export async function POST(req: NextRequest) {
    try {
        const incomingCookies = req.headers.get('cookie');
        const body = await req.json();

        const response = await fetch(BASE_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                ...(incomingCookies ? { Cookie: incomingCookies } : {}),
            },
            body: JSON.stringify(body),
        });

        if (!response.ok) {
            throw new Error(
                `Error creating subscription: ${response.statusText}`
            );
        }

        const data = await response.json();
        return NextResponse.json(data);
    } catch (error) {
        console.error('Error in subscriptions POST route:', error);
        return NextResponse.json(
            { error: 'Failed to create subscription' },
            { status: 500 }
        );
    }
}
