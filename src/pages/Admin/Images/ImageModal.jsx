import { X, Trash2 } from "lucide-react";

const formatDate = (date) => {
  try {
    return new Date(date).toLocaleString();
  } catch {
    return "-";
  }
};

const ImageModal = ({ image, onClose }) => {
  if (!image) return null;

  const handleDelete = () => {
    // integrate API call here
    console.log("Delete image:", image._id);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
      <div className="relative bg-white rounded-lg shadow-lg max-w-5xl w-full h-[90vh] flex overflow-hidden">
        {/* Close button */}
        <button onClick={onClose} className="absolute top-3 right-3 p-2 rounded-full hover:bg-gray-100 transition">
          <X className="w-5 h-5 text-gray-700" />
        </button>

        {/* Left: Image */}
        <div className="flex-1 bg-gray-100 flex items-center justify-center p-4">
          <img src={image?.image} alt={image?.prompt} className="max-h-full max-w-full object-contain rounded" />
        </div>

        {/* Right: Details */}
        <div className="w-[40%] border-l border-gray-200 p-6 flex flex-col justify-between">
          <div className="overflow-y-auto pr-2 space-y-3">
            <h2 className="font-bold text-lg mb-3">Image Details</h2>
            <div className="text-sm space-y-2">
              <DetailRow label="Prompt" value={image?.prompt} />
              <DetailRow label="Public ID" value={image?.publicId} />
              <DetailRow label="Model" value={image?.model} />
              <DetailRow label="Size" value={image?.size} />
              <DetailRow label="Quality" value={image?.quality} />
              <DetailRow label="Style" value={image?.style} />
              <DetailRow
                label="Owner"
                value={
                  image?.ownerId
                    ? `${image?.ownerId?.firstName || ""} ${image?.ownerId?.lastName || ""} (${image?.ownerId?.email})`
                    : "-"
                }
              />
              <DetailRow label="Status" value={image?.status} />
              <DetailRow label="Created At" value={formatDate(image?.createdAt)} />
            </div>
          </div>

          {/* Delete button */}
          <div className="pt-4 border-t mt-4">
            <button
              onClick={handleDelete}
              className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
            >
              <Trash2 className="w-5 h-5" />
              Delete Permanently
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const DetailRow = ({ label, value }) => (
  <div className="flex flex-col">
    <span className="text-gray-500 font-medium">{label}</span>
    <span className="break-words">{value || "-"}</span>
  </div>
);

export default ImageModal;
