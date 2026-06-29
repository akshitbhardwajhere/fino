import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';

export async function POST(request: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { phoneNumber } = await request.json();
    if (!phoneNumber) {
      return NextResponse.json({ error: 'Phone number is required' }, { status: 400 });
    }

    const botRes = await fetch('http://localhost:3005/pairing-code', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ phoneNumber }),
    });

    if (botRes.ok) {
      const data = await botRes.json();
      return NextResponse.json(data);
    } else {
      const errData = await botRes.json();
      return NextResponse.json(
        { error: errData.error || 'Failed to request pairing code' },
        { status: botRes.status }
      );
    }
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Internal Server Error' },
      { status: 500 }
    );
  }
}
