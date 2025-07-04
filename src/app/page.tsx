"use client";

import { AccordionDemo } from "@/components/molecules/Accordion/Accordion";
import { PageWrapper } from "@/components/organisms/PageWrapper/PageWrapper";
import { useCollections } from "@/hooks/useCollections";

export default function Home() {
  const { collections } = useCollections();

  const formattedCollections = collections.collections.map((collection) => ({
    title: collection.name,
    content: <span>Test</span>,
  }));

  return (
    <PageWrapper
      title="Collections"
      actionText="Create Collection"
      actionLink="/collections/create">
      {collections.collections.length > 0 ? (
        <AccordionDemo items={formattedCollections} />
      ) : (
        <div className="w-full max-w-2xl p-4">
          <h1 className="text-2xl font-bold text-center mb-4">
            No Collections Found
          </h1>
          <p className="text-gray-600 text-center">
            Please create a collection to get started.
          </p>
        </div>
      )}
    </PageWrapper>
  );
}
