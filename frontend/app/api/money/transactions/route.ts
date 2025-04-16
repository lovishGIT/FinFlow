import { NextResponse } from 'next/server';

export async function GET(request: Request) {
    try {
        const incomingCookies = request.headers.get('cookie');

        const response = await fetch(`${process.env.BACKEND_SERVER}/api/money/all`, {
            method: 'GET',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
                ...(incomingCookies ? { Cookie: incomingCookies } : {}),
            },
        });

        if (!response.ok) {
            throw new Error('Failed to fetch transactions');
        }

        const transactions = await response.json();
        return NextResponse.json({ ...transactions }, { status: 200 });
    } catch (error) {
        console.error('Error fetching transactions:', error);
        return NextResponse.json(
            { error: 'Failed to fetch transactions' },
            { status: 500 }
        );
    }
}