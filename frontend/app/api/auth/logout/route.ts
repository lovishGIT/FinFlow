import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function POST() {
    const response = NextResponse.json({ message: 'Logged out successfully' });

    (await cookies()).delete("authToken");

    return response;
}