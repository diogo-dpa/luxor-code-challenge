"use client";

import { AccordionBidContent } from "@/components/atoms/AccordionBidContent/AccordionBidContent";
import { AccordionHeader } from "@/components/atoms/AccordionHeader/AccordionHeader";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { ConfirmationModal } from "../ConfirmationModal/ConfirmationModal";
import { useState } from "react";
import { Status } from "../../../../prisma/generated/prisma";
import { useRouter } from "next/navigation";
import { useUserContext } from "@/contexts/userContext";
import { useBids } from "@/hooks/useBids";
import { useCollectionsContext } from "@/contexts/collectionsContext";

interface AccordionDemoProps {
  items: {
    id: string;
    title: string;
    description: string;
    stocks: number;
    price: number;
    ownerInfo: { id: string; name: string };
    bids: {
      id: string;
      price: string;
      status: Status;
      bidderInfo: { id: string; name: string };
    }[];
  }[];
}

export function AccordionDemo({ items }: AccordionDemoProps) {
  const { userId } = useUserContext();
  const { deleteBid, patchBidStatus } = useBids();
  const { deleteCollection, fetchCollections } = useCollectionsContext();

  const [actionDetails, setActionDetails] = useState<{
    actionName: string;
    actionDescription: string;
    action: () => void;
  } | null>(null);

  const router = useRouter();

  const onChangeBidStatus = async (
    collectionId: string,
    bidId: string,
    status: Status
  ) => {
    await patchBidStatus(collectionId, bidId, status);
    setActionDetails(null);
    await fetchCollections();
  };

  const onDeleteCollection = async (collectionId: string) => {
    await deleteCollection(collectionId);
    setActionDetails(null);
  };

  const onDeleteBid = async (bidId: string) => {
    await deleteBid(bidId);
    setActionDetails(null);
    await fetchCollections();
  };

  return (
    <Accordion type="multiple" className="w-full">
      {items.map((item, index) => (
        <AccordionItem
          key={index}
          value={`item-${index + 1}`}
          className="border-b border-gray-200">
          <AccordionTrigger className="bg-gray-100 text-lg font-semibold p-4">
            <AccordionHeader
              collectionInfo={{
                name: item.title,
                description: item.description || "No description available",
                stocks: item.stocks,
                price: item.price?.toFixed(2) ?? "0.00",
              }}
              owner={item.ownerInfo.name}
              isOwner={item.ownerInfo.id === userId}
              onEdit={() =>
                router.push(`/collections/edit?collectionId=${item.id}`)
              }
              onDelete={() =>
                setActionDetails({
                  actionName: "Delete Collection",
                  actionDescription: `Are you sure you want to delete the collection ${item.title}?`,
                  action: () => onDeleteCollection(item.id),
                })
              }
              onPlaceBid={() =>
                router.push(`/bids/create?collectionId=${item.id}`)
              }
            />
          </AccordionTrigger>
          <AccordionContent className="text-gray-700">
            {item.bids.length > 0 ? (
              item.bids.map((bid, index) => (
                <AccordionBidContent
                  key={bid.id}
                  title={`Bid ${index + 1}`}
                  price={bid.price}
                  bidder={bid.bidderInfo.name}
                  status={bid.status}
                  isOwner={bid.bidderInfo.id === userId}
                  onChangeStatus={(status: Status) =>
                    setActionDetails({
                      actionName:
                        status === Status.ACCEPTED
                          ? "Accept Bid"
                          : "Delete Bid",
                      actionDescription: `Are you sure you want to ${
                        status === Status.ACCEPTED ? "accept" : "reject"
                      } the bid ${bid.price}?`,
                      action: () => onChangeBidStatus(item.id, bid.id, status),
                    })
                  }
                  onEdit={() => router.push(`/bids/edit?bidId=${bid.id}`)}
                  onDelete={() =>
                    setActionDetails({
                      actionName: "Delete Bid",
                      actionDescription: `Are you sure you want to delete the bid ${bid.price}?`,
                      action: () => onDeleteBid(bid.id),
                    })
                  }
                />
              ))
            ) : (
              <p className="text-gray-500">
                No bids available for this collection.
              </p>
            )}
          </AccordionContent>
        </AccordionItem>
      ))}
      <ConfirmationModal
        title={`Confirm Action - ${actionDetails?.actionName}`}
        description={actionDetails?.actionDescription || "Unknown action"}
        onConfirm={actionDetails ? () => actionDetails?.action() : () => {}}
        onCancel={() => setActionDetails(null)}
        isOpen={!!actionDetails}
      />
    </Accordion>
  );
}
