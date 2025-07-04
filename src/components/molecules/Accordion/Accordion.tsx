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

interface AccordionDemoProps {
  items: {
    title: string;
    content: React.ReactNode;
  }[];
}

export function AccordionDemo({ items }: AccordionDemoProps) {
  const [actionDetails, setActionDetails] = useState<{
    actionName: string;
    actionDescription: string;
    action: () => void;
  } | null>(null);

  const router = useRouter();

  const onChangeBidStatus = (status: string) => {
    console.log(`Bid status changed to: ${status}`);
    setActionDetails(null); // Reset action details after performing the action
  };

  const onDeleteCollection = () => {
    console.log("Delete collection action triggered");
    setActionDetails(null); // Reset action details after performing the action
  };

  const onDeleteBid = () => {
    console.log("Delete bid action triggered");
    setActionDetails(null); // Reset action details after performing the action
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
              title={item.title}
              description="This is a description for the accordion item."
              owner="Diogo Almazan"
              isOwner={true}
              onEdit={() =>
                router.push(`/collections/edit?collectionId=${item.title}`)
              }
              onDelete={() =>
                setActionDetails({
                  actionName: "Delete Collection",
                  actionDescription: `Are you sure you want to delete the collection ${item.title}?`,
                  action: () => onDeleteCollection(),
                })
              }
              onPlaceBid={() => router.push(`/bids/create`)}
            />
          </AccordionTrigger>
          <AccordionContent className="text-gray-700">
            <AccordionBidContent
              title={item.title}
              price="$100.00"
              bidder="John Doe"
              isOwner={true}
              onChangeStatus={(status: string) =>
                setActionDetails({
                  actionName:
                    status === Status.ACCEPTED ? "Accept Bid" : "Delete Bid",
                  actionDescription: `Are you sure you want to accept the bid ${item.title}?`,
                  action: () => onChangeBidStatus(status),
                })
              }
              onEdit={() => router.push(`/bids/edit?bidId=${item.title}`)}
              onDelete={() =>
                setActionDetails({
                  actionName: "Delete Bid",
                  actionDescription: `Are you sure you want to delete the bid ${item.title}?`,
                  action: () => onDeleteBid(),
                })
              }
            />
          </AccordionContent>
        </AccordionItem>
      ))}
      <ConfirmationModal
        title={`Confirm Action - ${actionDetails?.actionName}`}
        description="Are you sure you want to perform this action?"
        onConfirm={actionDetails ? () => actionDetails?.action() : () => {}}
        onCancel={() => setActionDetails(null)}
        isOpen={!!actionDetails}
      />
    </Accordion>
  );
}
