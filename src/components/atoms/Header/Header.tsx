import { cn } from "@/lib/utils";
import { CustomSelect } from "../CustomSelect/CustomSelect";
import { useUsers } from "@/hooks/useUsers";
import { useUserContext } from "@/contexts/userContext";

interface HeaderProps {
  title: string;
  className?: string;
}

export function Header({ title, className }: HeaderProps) {
  const { users } = useUsers();
  const { userId, setUserId } = useUserContext();

  const userOptions = users.users.map((user) => ({
    value: String(user.id),
    label: user.name,
  }));

  const selectedUser =
    users.users.find((user) => String(user.id) === userId)?.name ?? "";

  return (
    <header
      className={cn(
        "max-w-[1024px] flex items-center justify-between py-4 mx-auto",
        className
      )}>
      <h1 className="text-2xl font-bold text-center text-gray-900 dark:text-white">
        {title}
      </h1>
      <div className="flex items-center">
        {selectedUser ? (
          <p className="mr-2 text-lg text-gray-600 dark:text-gray-400">
            Selected User: <span className="font-semibold">{selectedUser}</span>
          </p>
        ) : (
          <p className="mr-2 text-lg text-gray-600 dark:text-gray-400">
            No user selected
          </p>
        )}
        <CustomSelect
          placeholder="Select an user"
          label="Users"
          options={userOptions}
          onValueChange={(value) => setUserId(value)}
          defaultValue={userId || ""}
        />
      </div>
    </header>
  );
}
