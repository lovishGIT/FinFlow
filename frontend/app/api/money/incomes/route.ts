import { NextRequest, NextResponse } from 'next/server';

const BASE_URL = `${process.env.BACKEND_SERVER}/api/money/income`;

export async function POST(req: NextRequest) {
    const incomingCookies = req.headers.get('cookie');
    const body = await req.json();
    const res = await fetch(BASE_URL, {
        method: 'POST',
        body: JSON.stringify(body),
        headers: {
            'Content-Type': 'application/json',
            ...(incomingCookies ? { Cookie: incomingCookies } : {}),
        },
    });
    const data = await res.json();
    // console.log('POST Response:', body, data); // Debugging
    return NextResponse.json(data, { status: res.status });
}

export async function GET(req: NextRequest) {
    const incomingCookies = req.headers.get('cookie');
    const id = req.nextUrl.searchParams.get('id');
    if (!id)
        return NextResponse.json(
            { error: 'ID is required' },
            { status: 400 }
        );

    const res = await fetch(`${BASE_URL}/${id}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            ...(incomingCookies ? { Cookie: incomingCookies } : {}),
        },
    });
    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
}

export async function PUT(req: NextRequest) {
    const incomingCookies = req.headers.get('cookie');
    const id = req.nextUrl.searchParams.get('id');
    if (!id)
        return NextResponse.json(
            { error: 'ID is required' },
            { status: 400 }
        );

    const body = await req.json();
    const res = await fetch(`${BASE_URL}/${id}`, {
        method: 'PUT',
        body: JSON.stringify(body),
        headers: {
            'Content-Type': 'application/json',
            ...(incomingCookies ? { Cookie: incomingCookies } : {}),
        },
    });
    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
}

export async function DELETE(req: NextRequest) {
    const incomingCookies = req.headers.get('cookie');
    const id = req.nextUrl.searchParams.get('id');
    if (!id)
        return NextResponse.json(
            { error: 'ID is required' },
            { status: 400 }
        );

    const res = await fetch(`${BASE_URL}/${id}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            ...(incomingCookies ? { Cookie: incomingCookies } : {}),
        },
    });
    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
}
