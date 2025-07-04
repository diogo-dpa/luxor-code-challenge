import prisma from "@/lib/prisma";
import { ApiStatusCode } from "@/shared/api-constants";
import { NextResponse } from "next/server";

export async function GET() {
  const users = await prisma.user.findMany({
    include: {
      bids: true,
      collections: true,
    },
  });
  return NextResponse.json(
    { collections: users },
    { status: ApiStatusCode.OK }
  );
}
