import prisma from "@/lib/prisma";
import { validateRequest } from "@/shared/validations";
import { updateCollectionSchema } from "@/shared/validations/collection.validation";
import { NextRequest, NextResponse } from "next/server";
import { CollectionIdRouteParams } from "../route-types";
import { ApiStatusCode } from "@/shared/api-constants";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<CollectionIdRouteParams> }
) {
  const { collection_id } = await params;

  const parsedCollectionId = parseInt(collection_id);

  if (!collection_id || isNaN(parsedCollectionId)) {
    return NextResponse.json(
      { error: "Invalid request" },
      { status: ApiStatusCode.BAD_REQUEST }
    );
  }

  const { data, error } = await validateRequest(updateCollectionSchema)(
    request
  );

  if (error || !data) {
    return NextResponse.json({ error }, { status: ApiStatusCode.BAD_REQUEST });
  }

  try {
    const collection = await prisma.collection.update({
      where: { id: parsedCollectionId },
      data,
      include: {
        user: true,
      },
    });

    return NextResponse.json({ collection }, { status: ApiStatusCode.OK });
  } catch (_error: unknown) {
    console.error("Error updating collection:", _error);
    return NextResponse.json(
      { error: "Failed to update collection" },
      { status: ApiStatusCode.INTERNAL_SERVER_ERROR }
    );
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<CollectionIdRouteParams> }
) {
  const { collection_id } = await params;
  const parsedCollectionId = parseInt(collection_id);

  if (!collection_id || isNaN(parsedCollectionId)) {
    return NextResponse.json(
      { error: "Invalid request" },
      { status: ApiStatusCode.BAD_REQUEST }
    );
  }

  try {
    const existingCollection = await prisma.collection.findUnique({
      where: { id: parsedCollectionId },
    });

    if (!existingCollection) {
      return NextResponse.json(
        { error: "Collection not found" },
        { status: ApiStatusCode.NOT_FOUND }
      );
    }

    await prisma.collection.delete({
      where: { id: parsedCollectionId },
    });

    return NextResponse.json(null);
  } catch (_error: unknown) {
    console.error("Error deleting collection:", _error);
    return NextResponse.json(
      { error: "Failed to delete collection" },
      { status: ApiStatusCode.INTERNAL_SERVER_ERROR }
    );
  }
}

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<CollectionIdRouteParams> }
) {
  const { collection_id } = await params;
  const parsedCollectionId = parseInt(collection_id);

  if (!collection_id || isNaN(parsedCollectionId)) {
    return NextResponse.json(
      { error: "Invalid request" },
      { status: ApiStatusCode.BAD_REQUEST }
    );
  }

  try {
    const collection = await prisma.collection.findUnique({
      where: { id: parsedCollectionId },
      include: {
        user: true,
      },
    });

    if (!collection) {
      return NextResponse.json(
        { error: "Collection not found" },
        { status: ApiStatusCode.NOT_FOUND }
      );
    }

    return NextResponse.json({ collection }, { status: ApiStatusCode.OK });
  } catch (_error: unknown) {
    console.error("Error fetching collection:", _error);
    return NextResponse.json(
      { error: "Failed to fetch collection" },
      { status: ApiStatusCode.INTERNAL_SERVER_ERROR }
    );
  }
}
