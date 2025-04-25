import { auth } from '@/app/(auth)/auth';
import { getAllAnamnesisReports } from '@/lib/db/queries';
import { NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;

  const limit = Number.parseInt(searchParams.get('limit') || '10');
  const startingAfter = searchParams.get('starting_after');
  const endingBefore = searchParams.get('ending_before');

  if (startingAfter && endingBefore) {
    return Response.json(
      'Only one of starting_after or ending_before can be provided!',
      { status: 400 },
    );
  }

  const session = await auth();

  if (!session?.user?.id) {
    return Response.json('Unauthorized!', { status: 401 });
  }

  try {
    const reports = await getAllAnamnesisReports({
      limit,
      startingAfter,
      endingBefore,
    });

    return Response.json(reports);
  } catch (error) {
    console.error('Failed to fetch anamnesis reports:', error);
    return Response.json('Failed to fetch anamnesis reports!', { status: 500 });
  }
}
