import prisma from "@/lib/prisma";
import { CollectionIdBidIdRouteParams } from "@/app/collections/route-types";
import { ApiStatusCode } from "@/shared/api-constants";
import { validateRequest } from "@/shared/validations";
import { updateStatusSchema } from "@/shared/validations/bid.validation";
import { NextRequest, NextResponse } from "next/server";
import { Status } from "../../../../../../prisma/generated/prisma";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<CollectionIdBidIdRouteParams> }
) {
  const { status } = await request.json();

  const { collection_id, bid_id } = await params;

  const parsedCollectionId = parseInt(collection_id);
  const parsedBidId = parseInt(bid_id);

  if (
    !collection_id ||
    !status ||
    !bid_id ||
    isNaN(parsedCollectionId) ||
    isNaN(parsedBidId)
  ) {
    return NextResponse.json(
      { error: "Invalid request" },
      { status: ApiStatusCode.BAD_REQUEST }
    );
  }

  const { data, error } = await validateRequest(updateStatusSchema)(request);

  if (error || !data) {
    return NextResponse.json({ error }, { status: ApiStatusCode.BAD_REQUEST });
  }

  try {
    const bid = await prisma.bid.update({
      where: { id: parsedBidId, collectionId: parsedCollectionId },
      data: { status },
      include: {
        user: true,
      },
    });

    if (status === Status.ACCEPTED) {
      await prisma.bid.updateMany({
        where: { NOT: { id: parsedBidId }, collectionId: parsedCollectionId },
        data: { status: Status.REJECTED },
      });
    }

    return NextResponse.json({ bid }, { status: ApiStatusCode.OK });
  } catch (_error: unknown) {
    console.error("Error updating bid status:", _error);
    return NextResponse.json(
      { error: "Failed to update bid status" },
      { status: ApiStatusCode.INTERNAL_SERVER_ERROR }
    );
  }
}
