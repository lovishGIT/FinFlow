import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    try {
        const body = await request.json();

        const { name, email, password } = body;
        if (!name || !email || !password) {
            return NextResponse.json({ error: 'Full Name, Email and password are required' }, { status: 400 });
        }

        const response = await fetch(`${process.env.BACKEND_SERVER}/api/auth/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name, email, password }),
            credentials: 'include'
        });

        if (!response.ok) {
            const errorData = await response.json();
            return NextResponse.json({ error: errorData.message || 'Authentication failed' }, { status: response.status });
        }

        const data = await response.json();

        return NextResponse.json(data);
    } catch (error) {
        console.error('Error during authentication:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}