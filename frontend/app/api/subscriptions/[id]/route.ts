import { NextRequest, NextResponse } from 'next/server';

const BASE_URL = `${process.env.BACKEND_SERVER}/api/subscriptions`;

// GET subscription by ID
export async function GET(
    req: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const { id } = params;
        const incomingCookies = req.headers.get('cookie');

        const response = await fetch(`${BASE_URL}/${id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                ...(incomingCookies ? { Cookie: incomingCookies } : {}),
            },
        });

        if (!response.ok) {
            throw new Error(
                `Error fetching subscription: ${response.statusText}`
            );
        }

        const data = await response.json();
        return NextResponse.json(data);
    } catch (error) {
        console.error(
            'Error in subscription GET by ID route:',
            error
        );
        return NextResponse.json(
            { error: 'Failed to fetch subscription' },
            { status: 500 }
        );
    }
}

// PUT update subscription by ID
export async function PUT(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const incomingCookies = request.headers.get('cookie');
        const { id } = params;
        const body = await request.json();

        const response = await fetch(`${BASE_URL}/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                ...(incomingCookies ? { Cookie: incomingCookies } : {}),
            },
            body: JSON.stringify(body),
        });

        if (!response.ok) {
            throw new Error(
                `Error updating subscription: ${response.statusText}`
            );
        }

        const data = await response.json();
        return NextResponse.json(data);
    } catch (error) {
        console.error('Error in subscription PUT route:', error);
        return NextResponse.json(
            { error: 'Failed to update subscription' },
            { status: 500 }
        );
    }
}

export async function DELETE(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const incomingCookies = request.headers.get('cookie');
        const { id } = params;

        const response = await fetch(`${BASE_URL}/${id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                ...(incomingCookies ? { Cookie: incomingCookies } : {}),
            },
        });

        if (!response.ok) {
            throw new Error(
                `Error deleting subscription: ${response.statusText}`
            );
        }

        return NextResponse.json(
            { message: 'Subscription deleted successfully' },
            { status: 200 }
        );
    } catch (error) {
        console.error('Error in subscription DELETE route:', error);
        return NextResponse.json(
            { error: 'Failed to delete subscription' },
            { status: 500 }
        );
    }
}