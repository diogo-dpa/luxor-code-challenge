import { useState, useEffect } from "react";
import { ApiStatusCode } from "@/shared/api-constants";
import { Collection } from "../../prisma/generated/prisma";

type CollectionResponse = {
  collections: Collection[];
};

export function useCollections() {
  const [collections, setCollections] = useState<CollectionResponse>({
    collections: [],
  });
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCollections = async () => {
      try {
        setLoading(true);
        const response = await fetch("/collections");
        if (response.status === ApiStatusCode.OK) {
          const data: CollectionResponse = await response.json();
          setCollections(data);
        } else {
          throw new Error("Failed to fetch collections");
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchCollections();
  }, []);

  // add the creation, update and deletion functions
  const createCollection = async (collection: Omit<Collection, "id">) => {
    try {
      const response = await fetch("/collections", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(collection),
      });
      if (response.status === ApiStatusCode.CREATED) {
        const newCollection: Collection = await response.json();
        setCollections((prev) => ({
          collections: [...prev.collections, newCollection],
        }));
      } else {
        throw new Error("Failed to create collection");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    }
  };

  const updateCollection = async (
    id: string,
    collection: Partial<Collection>
  ) => {
    try {
      const response = await fetch(`/collections/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(collection),
      });
      if (response.status === ApiStatusCode.OK) {
        const updatedCollection: Collection = await response.json();
        setCollections((prev) => ({
          collections: prev.collections.map((c) =>
            String(c.id) === id ? updatedCollection : c
          ),
        }));
      } else {
        throw new Error("Failed to update collection");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    }
  };

  const deleteCollection = async (id: string) => {
    try {
      const response = await fetch(`/collections/${id}`, {
        method: "DELETE",
      });
      if (response.status === ApiStatusCode.NO_CONTENT) {
        setCollections((prev) => ({
          collections: prev.collections.filter((c) => String(c.id) !== id),
        }));
      } else {
        throw new Error("Failed to delete collection");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    }
  };

  return {
    collections,
    loading,
    error,
    createCollection,
    updateCollection,
    deleteCollection,
  };
}
