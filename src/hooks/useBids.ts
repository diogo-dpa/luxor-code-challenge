import { useState, useEffect } from "react";
import { ApiStatusCode } from "@/shared/api-constants";
import { Bid, Status } from "../../prisma/generated/prisma";

type BidResponse = {
  bids: Bid[];
};

export function useBids() {
  const [bids, setBids] = useState<BidResponse>({ bids: [] });
  const [bid, setBid] = useState<Bid | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBids = async () => {
      try {
        setLoading(true);
        const response = await fetch("/bids");
        if (response.status === ApiStatusCode.OK) {
          const data: BidResponse = await response.json();
          setBids(data);
        } else {
          throw new Error("Failed to fetch bids");
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchBids();
  }, []);

  const fetchBidById = async (id: string) => {
    try {
      const response = await fetch(`/bids/${id}`);
      if (response.status === ApiStatusCode.OK) {
        const bid: { bid: Bid } = await response.json();
        setBid(bid.bid);
        return bid;
      } else {
        throw new Error("Failed to fetch bid");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      return null;
    }
  };

  const createBid = async (bid: Omit<Bid, "id">) => {
    try {
      const response = await fetch("/bids", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(bid),
      });
      if (response.status === ApiStatusCode.CREATED) {
        const newBid: Bid = await response.json();
        setBids((prev) => ({
          bids: [...prev.bids, newBid],
        }));
      } else {
        throw new Error("Failed to create bid");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    }
  };

  const updateBid = async (id: string, bid: Omit<Bid, "id" | "createdAt">) => {
    try {
      const response = await fetch(`/bids/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(bid),
      });
      if (response.status === ApiStatusCode.OK) {
        const updatedBid: { bid: Bid } = await response.json();
        setBids((prev) => ({
          bids: prev.bids.map((b) =>
            String(b.id) === id ? updatedBid.bid : b
          ),
        }));
      } else {
        throw new Error("Failed to update bid");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    }
  };

  const patchBidStatus = async (
    collectionId: string,
    bidId: string,
    bidStatus: Status
  ) => {
    try {
      const response = await fetch(
        `/collections/${collectionId}/bids/${bidId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ status: bidStatus }),
        }
      );
      if (response.status === ApiStatusCode.OK) {
        const updatedBid: Bid = await response.json();
        setBids((prev) => ({
          bids: prev.bids.map((b) => (String(b.id) === bidId ? updatedBid : b)),
        }));
      } else {
        throw new Error("Failed to update bid");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    }
  };

  const deleteBid = async (id: string) => {
    try {
      const response = await fetch(`/bids/${id}`, {
        method: "DELETE",
      });
      if (response.status === ApiStatusCode.NO_CONTENT) {
        setBids((prev) => ({
          bids: prev.bids.filter((b) => String(b.id) !== id),
        }));
      } else {
        throw new Error("Failed to delete bid");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    }
  };

  return {
    bids,
    loading,
    error,
    createBid,
    updateBid,
    deleteBid,
    patchBidStatus,
    fetchBidById,
    bid,
  };
}
