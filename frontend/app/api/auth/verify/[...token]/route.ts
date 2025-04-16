import { NextResponse } from 'next/server';

export async function GET(request: Request, context: { params: { token?: string[] } }) {
    const { token } = context.params;
    if (!token) {
        return NextResponse.json({ error: 'Token not provided' }, { status: 400 });
    }

    const fullToken = decodeURIComponent(token.join('/'));
    // console.log('Decoded Token:', fullToken);

    try {
        const resp = await fetch(
            `${process.env.BACKEND_SERVER}/api/auth/verify-user`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    token: fullToken,
                }),
                credentials: 'include',
            }
        );

        const response = await resp.json();

        if (resp.status != 200 || response.message == "") {
            throw new Error(`Failed to verify token: ${response?.message}`);
        }

        return NextResponse.json({ message: 'Token verified' });
    } catch (error) {
        console.error('Error verifying token:', error);
        return NextResponse.json({ error: 'Failed to verify token' }, { status: 500 });
    }
}
