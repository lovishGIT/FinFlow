import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    try {
        const body = await request.json();

        const { email, password } = body;
        if (!email || !password) {
            return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
        }

        const response = await fetch(`${process.env.BACKEND_SERVER}/api/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password }),
            credentials: 'include'
        });

        if (!response.ok) {
            const errorData = await response.json();
            return NextResponse.json({ error: errorData.message || 'Authentication failed' }, { status: response.status });
        }

        const data = await response.json();

        const { message, token } = data;
        if (token && token?.toString()?.trim()?.length > 0) {
            // console.log("token", token);
            (await cookies()).set("authToken", token?.toString()?.trim());
        } else {
            throw new Error('Tokenization Failed'); // Only for 500
        }

        return NextResponse.json(data);
    } catch (error) {
        console.log('Error during authentication:', error);
        return NextResponse.json({ error: (error as Error)?.message || 'Internal server error' }, { status: 500 });
    }
}