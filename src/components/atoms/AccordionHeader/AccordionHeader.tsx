interface AccordionHeaderProps {
  owner: string;
  collectionInfo: {
    name: string;
    description: string;
    stocks: number;
    price: string;
  };
  isOwner: boolean;
  onEdit?: () => void;
  onDelete?: () => void;
  onPlaceBid?: () => void;
}

export function AccordionHeader({
  collectionInfo,
  owner,
  isOwner,
  onEdit,
  onDelete,
  onPlaceBid,
}: AccordionHeaderProps) {
  return (
    <div className="w-full flex items-center justify-between">
      <div className="flex flex-col items-start">
        <h2 className="text-lg font-semibold">{collectionInfo.name}</h2>
        <p className="text-sm text-gray-600">{collectionInfo.description}</p>
        <p className="text-sm text-gray-600">
          Stocks: {collectionInfo.stocks} | Price: ${collectionInfo.price}
        </p>
        <p className="text-xs text-gray-500">Owner: {owner}</p>
      </div>
      {!isOwner ? (
        <div className="flex space-x-2">
          <div
            // TODO: Fix nested button issue. Temporary solution is to use div with role button
            role="button"
            onClick={onPlaceBid}
            className="px-3 py-1 text-sm text-green-600 bg-green-100 rounded hover:bg-green-200 cursor-pointer">
            Place bid
          </div>
        </div>
      ) : (
        <div className="flex space-x-2">
          <div
            role="button"
            onClick={onEdit}
            className="px-3 py-1 text-sm text-blue-600 bg-blue-100 rounded hover:bg-blue-200 cursor-pointer">
            Edit
          </div>
          <div
            role="button"
            onClick={onDelete}
            className="px-3 py-1 text-sm text-red-600 bg-red-100 rounded hover:bg-red-200 cursor-pointer">
            Delete
          </div>
        </div>
      )}
    </div>
  );
}
