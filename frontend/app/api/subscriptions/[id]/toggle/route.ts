import { NextRequest, NextResponse } from 'next/server';

const BASE_URL = `${process.env.BACKEND_SERVER}/api/subscriptions`;

// GET toggle subscription by ID
export async function GET(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const incomingCookies = request.headers.get('cookie');
        const { id } = params;

        const response = await fetch(`${BASE_URL}/toggle/${id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                ...(incomingCookies ? { Cookie: incomingCookies } : {}),
            },

        });

        if (!response.ok) {
            throw new Error(
                `Error toggling subscription: ${response.statusText}`
            );
        }

        const data = await response.json();
        return NextResponse.json(data);
    } catch (error) {
        console.error('Error in subscription toggle route:', error);
        return NextResponse.json(
            { error: 'Failed to toggle subscription' },
            { status: 500 }
        );
    }
}
