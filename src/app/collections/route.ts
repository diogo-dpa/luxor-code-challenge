import prisma from "@/lib/prisma";
import { ApiStatusCode } from "@/shared/api-constants";
import { validateRequest } from "@/shared/validations";
import { createCollectionSchema } from "@/shared/validations/collection.validation";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  const collections = await prisma.collection.findMany({
    include: {
      user: true,
      bids: {
        include: {
          user: true,
        },
      },
    },
  });
  return NextResponse.json({ collections }, { status: ApiStatusCode.OK });
}

export async function POST(request: NextRequest) {
  const { data, error } = await validateRequest(createCollectionSchema)(
    request
  );

  if (error || !data) {
    return NextResponse.json({ error }, { status: ApiStatusCode.BAD_REQUEST });
  }

  try {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { userId, ..._collectionData } = data;
    const existUser = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!existUser) {
      return NextResponse.json(
        { error: "User not found" },
        { status: ApiStatusCode.NOT_FOUND }
      );
    }

    const collection = await prisma.collection.create({
      data,
      include: {
        user: true,
      },
    });

    return NextResponse.json({ collection }, { status: ApiStatusCode.CREATED });
  } catch (_error: unknown) {
    console.error("Error creating collection:", _error);
    return NextResponse.json(
      { error: "Failed to create collection" },
      { status: 500 }
    );
  }
}
