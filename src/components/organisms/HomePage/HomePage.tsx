"use client";

import { AccordionDemo } from "@/components/molecules/Accordion/Accordion";
import { PageWrapper } from "@/components/organisms/PageWrapper/PageWrapper";
import { useCollectionsContext } from "@/contexts/collectionsContext";
import { useUserContext } from "@/contexts/userContext";

export function HomePage() {
  const { collections, loading } = useCollectionsContext();
  const { userId } = useUserContext();

  const formattedCollections = collections.collections.map((collection) => ({
    id: String(collection.id),
    title: collection.name,
    description: collection.description || "No description available",
    stocks: collection.stocks,
    price: collection.price,
    ownerInfo: {
      id: String(collection.user.id),
      name: collection.user.name || "Unknown Owner",
    },
    bids: collection.bids.map((bid) => ({
      id: String(bid.id),
      price: bid.price.toString(),
      status: bid.status,
      bidderInfo: {
        id: String(bid.user.id),
        name: bid.user.name || "Unknown Bidder",
      },
    })),
  }));

  if (!userId) {
    return (
      <PageWrapper title="Collections">
        <div className="w-full p-4">
          <h1 className="text-2xl font-bold text-center mb-4">
            Please select an user in the upper select to enable the features.
          </h1>
        </div>
      </PageWrapper>
    );
  }

  const renderContent = () => {
    if (loading) {
      return (
        <div className="w-full p-4">
          <h1 className="text-2xl font-bold text-center mb-4">
            Loading Collections...
          </h1>
        </div>
      );
    }

    if (collections.collections.length === 0) {
      return (
        <div className="w-full max-w-2xl p-4">
          <h1 className="text-2xl font-bold text-center mb-4">
            No Collections Found
          </h1>
          <p className="text-gray-600 text-center">
            Please create a collection to get started.
          </p>
        </div>
      );
    }

    return <AccordionDemo items={formattedCollections} />;
  };

  return (
    <PageWrapper
      title="Collections"
      actionText="Create Collection"
      actionLink={`/collections/create?userId=${userId}`}>
      {renderContent()}
    </PageWrapper>
  );
}
