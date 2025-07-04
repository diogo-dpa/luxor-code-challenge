import { Button } from "@/components/ui/button";
import { Status } from "../../../../prisma/generated/prisma";

interface AccordionBidContentProps {
  title: string;
  price: string;
  bidder: string;
  status: Status;
  isOwner?: boolean;
  onChangeStatus?: (status: Status) => void;
  onEdit?: () => void;
  onDelete?: () => void;
}

export function AccordionBidContent({
  title,
  price,
  bidder,
  status,
  isOwner = false,
  onChangeStatus,
  onEdit,
  onDelete,
}: AccordionBidContentProps) {
  const renderOnChangeStatusActions = () => {
    if (!onChangeStatus) return null;

    return (
      <div className="flex space-x-2">
        <Button
          onClick={() => onChangeStatus(Status.ACCEPTED)}
          disabled={status === Status.ACCEPTED}
          className="px-3 py-1 text-sm text-blue-600 bg-blue-100 rounded hover:bg-blue-200 disabled:cursor-not-allowed">
          Accept
        </Button>
        <Button
          onClick={() => onChangeStatus(Status.REJECTED)}
          disabled={status === Status.REJECTED}
          className="px-3 py-1 text-sm text-red-600 bg-red-100 rounded hover:bg-red-20 disabled:cursor-not-allowed">
          Reject
        </Button>
      </div>
    );
  };

  const renderOnEditAndDeleteActions = () => {
    if (!onEdit || !onDelete) return null;

    return (
      <div className="flex space-x-2">
        <Button
          onClick={onEdit}
          className="px-3 py-1 text-sm text-blue-600 bg-blue-100 rounded hover:bg-blue-200 cursor-pointer">
          Edit
        </Button>
        <Button
          onClick={onDelete}
          className="px-3 py-1 text-sm text-red-600 bg-red-100 rounded hover:bg-red-200 cursor-pointer">
          Delete
        </Button>
      </div>
    );
  };

  return (
    <div className="w-full flex items-center justify-between px-10 py-4">
      <div className="flex flex-col items-start">
        <h2 className="text-lg font-semibold">{title}</h2>
        <p className="text-sm text-gray-600">{price}</p>
        <p className="text-xs text-gray-500">Bidder: {bidder}</p>
        <p className="text-xs text-gray-500">Status: {status}</p>
      </div>
      {isOwner ? renderOnEditAndDeleteActions() : renderOnChangeStatusActions()}
    </div>
  );
}
