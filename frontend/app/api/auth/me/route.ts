import { NextResponse } from 'next/server';

export async function GET() {
    try {
        const response = await fetch(`${process.env.BACKEND_SERVER}/api/auth/me`, {
            method: 'GET',
            credentials: 'include',
        });

        if (!response.ok) {
            return NextResponse.json({ error: 'Failed to fetch data' }, { status: response.status });
        }

        const data = await response.json();
        return NextResponse.json(data);
    } catch (error) {
        return NextResponse.json({ error: 'An error occurred' }, { status: 500 });
    }
};