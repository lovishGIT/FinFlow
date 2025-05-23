import { NextResponse } from 'next/server';

export async function GET(request: Request) {
    try {
        const incomingCookies = request.headers.get('cookie');
        // console.log("Cookies", incomingCookies);

        const response = await fetch(`${process.env.BACKEND_SERVER}/api/auth/me`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                ...(incomingCookies ? {Cookie : incomingCookies} : {})
            }
        });

        if (!response.ok) {
            return NextResponse.json({ error: 'Failed to fetch data' }, { status: response.status });
        }

        const data = await response.json();
        return NextResponse.json({ data }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: 'An error occurred' }, { status: 500 });
    }
};