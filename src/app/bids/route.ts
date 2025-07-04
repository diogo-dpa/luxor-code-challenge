import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { validateRequest } from "@/shared/validations";
import { createBidSchema } from "@/shared/validations/bid.validation";
import { ApiStatusCode } from "@/shared/api-constants";

export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const collectionId = url.searchParams.get("collectionId");
  const bids = await prisma.bid.findMany({
    where: {
      collectionId: collectionId ? parseInt(collectionId) : undefined,
    },
    include: {
      collection: true,
      user: true,
    },
  });
  return NextResponse.json({ bids }, { status: ApiStatusCode.OK });
}

export async function POST(request: NextRequest) {
  const { data, error } = await validateRequest(createBidSchema)(request);

  if (error || !data) {
    return NextResponse.json({ error }, { status: ApiStatusCode.BAD_REQUEST });
  }

  try {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { userId, ...bidData } = data;
    const existUser = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!existUser) {
      return NextResponse.json(
        { error: "User not found" },
        { status: ApiStatusCode.NOT_FOUND }
      );
    }

    const bid = await prisma.bid.create({
      data,
      include: {
        collection: true,
        user: true,
      },
    });

    return NextResponse.json({ bid }, { status: ApiStatusCode.CREATED });
  } catch (_error: unknown) {
    console.error("Error creating bid:", _error);
    return NextResponse.json(
      { error: "Failed to create bid" },
      { status: ApiStatusCode.INTERNAL_SERVER_ERROR }
    );
  }
}
