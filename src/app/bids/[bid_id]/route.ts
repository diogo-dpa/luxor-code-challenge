import prisma from "@/lib/prisma";
import { validateRequest } from "@/shared/validations";
import { updateBidSchema } from "@/shared/validations/bid.validation";
import { NextRequest, NextResponse } from "next/server";
import { BidIdRouteParams } from "../route-types";
import { ApiStatusCode } from "@/shared/api-constants";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<BidIdRouteParams> }
) {
  const { bid_id } = await params;

  const parsedBidId = parseInt(bid_id);

  if (!bid_id || isNaN(parsedBidId)) {
    return NextResponse.json(
      { error: "Invalid request" },
      { status: ApiStatusCode.BAD_REQUEST }
    );
  }

  const { data, error } = await validateRequest(updateBidSchema)(request);

  if (error || !data) {
    return NextResponse.json({ error }, { status: ApiStatusCode.BAD_REQUEST });
  }

  try {
    const foundBid = await prisma.bid.findFirst({
      where: { id: parsedBidId },
    });

    if (!foundBid) {
      return NextResponse.json(
        { error: "Bid not found" },
        { status: ApiStatusCode.NOT_FOUND }
      );
    }

    const bid = await prisma.bid.update({
      where: { id: parsedBidId },
      data: data,
      include: {
        collection: true,
        user: true,
      },
    });

    return NextResponse.json({ bid }, { status: ApiStatusCode.OK });
  } catch (_error: unknown) {
    console.error("Error updating bid:", _error);
    return NextResponse.json(
      { error: "Failed to update bid" },
      { status: ApiStatusCode.INTERNAL_SERVER_ERROR }
    );
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<BidIdRouteParams> }
) {
  const { bid_id } = await params;
  const parsedBidId = parseInt(bid_id);

  if (!bid_id || isNaN(parsedBidId)) {
    return NextResponse.json(
      { error: "Invalid request" },
      { status: ApiStatusCode.BAD_REQUEST }
    );
  }

  try {
    const existingBid = await prisma.bid.findUnique({
      where: { id: parsedBidId },
    });

    if (!existingBid) {
      return NextResponse.json(
        { error: "Bid not found" },
        { status: ApiStatusCode.NOT_FOUND }
      );
    }

    await prisma.bid.delete({
      where: { id: parsedBidId },
    });

    return NextResponse.json(null);
  } catch (_error: unknown) {
    console.error("Error deleting bid:", _error);
    return NextResponse.json(
      { error: "Failed to delete bid" },
      { status: ApiStatusCode.INTERNAL_SERVER_ERROR }
    );
  }
}

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<BidIdRouteParams> }
) {
  const { bid_id } = await params;
  const parsedBidId = parseInt(bid_id);

  if (!bid_id || isNaN(parsedBidId)) {
    return NextResponse.json(
      { error: "Invalid request" },
      { status: ApiStatusCode.BAD_REQUEST }
    );
  }

  try {
    const bid = await prisma.bid.findUnique({
      where: { id: parsedBidId },
      include: {
        collection: true,
        user: true,
      },
    });

    if (!bid) {
      return NextResponse.json(
        { error: "Bid not found" },
        { status: ApiStatusCode.NOT_FOUND }
      );
    }

    return NextResponse.json({ bid }, { status: ApiStatusCode.OK });
  } catch (_error: unknown) {
    console.error("Error fetching bid:", _error);
    return NextResponse.json(
      { error: "Failed to fetch bid" },
      { status: ApiStatusCode.INTERNAL_SERVER_ERROR }
    );
  }
}
