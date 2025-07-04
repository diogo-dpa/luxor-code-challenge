import { Button } from "@/components/ui/button";

interface AccordionHeaderProps {
  title: string;
  description: string;
  owner: string;
  isOwner: boolean;
  onEdit?: () => void;
  onDelete?: () => void;
  onPlaceBid?: () => void;
}

export function AccordionHeader({
  title,
  description,
  owner,
  isOwner,
  onEdit,
  onDelete,
  onPlaceBid,
}: AccordionHeaderProps) {
  const handlePlaceBid = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation(); // Impede que o accordion abra/feche
    onPlaceBid?.();
  };

  const handleEdit = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation(); // Impede que o accordion abra/feche
    onEdit?.();
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation(); // Impede que o accordion abra/feche
    onDelete?.();
  };

  return (
    <div className="w-full flex items-center justify-between">
      <div className="flex flex-col items-start">
        <h2 className="text-lg font-semibold">{title}</h2>
        <p className="text-sm text-gray-600">{description}</p>
        <p className="text-xs text-gray-500">Owner: {owner}</p>
      </div>
      {isOwner ? (
        <div className="flex space-x-2">
          <Button
            onClick={handlePlaceBid}
            className="px-3 py-1 text-sm text-green-600 bg-green-100 rounded hover:bg-green-200 cursor-pointer">
            Place bid
          </Button>
        </div>
      ) : (
        <div className="flex space-x-2">
          <Button
            onClick={handleEdit}
            className="px-3 py-1 text-sm text-blue-600 bg-blue-100 rounded hover:bg-blue-200 cursor-pointer">
            Edit
          </Button>
          <Button
            onClick={handleDelete}
            className="px-3 py-1 text-sm text-red-600 bg-red-100 rounded hover:bg-red-200 cursor-pointer">
            Delete
          </Button>
        </div>
      )}
    </div>
  );
}
