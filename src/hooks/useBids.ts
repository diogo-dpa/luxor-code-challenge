import { useState, useEffect } from "react";
import { ApiStatusCode } from "@/shared/api-constants";
import { Bid } from "../../prisma/generated/prisma";

type BidResponse = {
  bids: Bid[];
};

export function useBids() {
  const [bids, setBids] = useState<BidResponse>({ bids: [] });
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

  const updateBid = async (id: string, bid: Omit<Bid, "id">) => {
    try {
      const response = await fetch(`/bids/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(bid),
      });
      if (response.status === ApiStatusCode.OK) {
        const updatedBid: Bid = await response.json();
        setBids((prev) => ({
          bids: prev.bids.map((b) => (String(b.id) === id ? updatedBid : b)),
        }));
      } else {
        throw new Error("Failed to update bid");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    }
  };

  const patchBidStatus = async (id: string, bid: Pick<Bid, "status">) => {
    try {
      const response = await fetch(`/bids/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(bid),
      });
      if (response.status === ApiStatusCode.OK) {
        const updatedBid: Bid = await response.json();
        setBids((prev) => ({
          bids: prev.bids.map((b) => (String(b.id) === id ? updatedBid : b)),
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
  };
}
