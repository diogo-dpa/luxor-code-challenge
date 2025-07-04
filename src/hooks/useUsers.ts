// create a custom hook to fetch users from the API with loading and error states
import { useState, useEffect } from "react";
import { ApiStatusCode } from "@/shared/api-constants";
import { User } from "../../prisma/generated/prisma";

type UserResponse = {
  users: User[];
};

export function useUsers() {
  const [users, setUsers] = useState<UserResponse>({ users: [] });
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const response = await fetch("/users");
        if (response.status === ApiStatusCode.OK) {
          const data: UserResponse = await response.json();
          setUsers(data);
        } else {
          throw new Error("Failed to fetch users");
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  return { users, loading, error };
}
