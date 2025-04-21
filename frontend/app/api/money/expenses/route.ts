import { NextRequest, NextResponse } from 'next/server';

const BASE_URL = `${process.env.BACKEND_SERVER}/api/money/expense`;

export async function POST(req: NextRequest) {
    try {
        const incomingCookies = req.headers.get('cookie');
        const body = await req.json();
        const res = await fetch(BASE_URL, {
            method: 'POST',
            body: JSON.stringify(body),
            headers: {
                'Content-Type': 'application/json',
                ...incomingCookies ? { Cookie: incomingCookies } : {}
            },
        });
        const data = await res.json();
        console.log('Data:', data);
        return NextResponse.json(data, { status: res.status });
    } catch (error) {
        console.error('Error in POST request:', error);
        return NextResponse.json(
            { error: 'An error occurred while processing the POST request', details: (error as Error)?.message || error },
            { status: 500 }
        );
    }
}

export async function GET(req: NextRequest) {
    try {
        const incomingCookies = req.headers.get('cookie');
        const id = req.nextUrl.searchParams.get('id');
        if (!id)
            return NextResponse.json(
                { error: 'ID is required' },
                { status: 400 }
            );

        const res = await fetch(`${BASE_URL}/${id}`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json', ...incomingCookies ? { Cookie: incomingCookies } : {} },
        });
        const data = await res.json();
        return NextResponse.json(data, { status: res.status });
    } catch (error) {
        console.error('Error in GET request:', error);
        return NextResponse.json(
            { error: 'An error occurred while processing the GET request', details: (error as Error)?.message || error },
            { status: 500 }
        );
    }
}

export async function PUT(req: NextRequest) {
    try {
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
                ...incomingCookies ? { Cookie: incomingCookies } : {},
            },
        });
        const data = await res.json();
        return NextResponse.json(data, { status: res.status });
    } catch (error) {
        console.error('Error in PUT request:', error);
        return NextResponse.json(
            { error: 'An error occurred while processing the PUT request', details: (error as Error).message },
            { status: 500 }
        );
    }
}

export async function DELETE(req: NextRequest) {
    try {
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
                ...incomingCookies ? { Cookie: incomingCookies } : {},
            },
        });
        const data = await res.json();
        return NextResponse.json(data, { status: res.status });
    } catch (error) {
        console.error('Error in DELETE request:', error);
        return NextResponse.json(
            { error: 'An error occurred while processing the DELETE request', details: (error as Error)?.message || error },
            { status: 500 }
        );
    }
}
