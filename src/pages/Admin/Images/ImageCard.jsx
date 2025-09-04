import { useState } from "react";
import { Sparkles } from "lucide-react";

const ImageCard = ({ image, isSelected, toggleSelect, onClick }) => {
  const [hover, setHover] = useState(false);

  const hasImage = Boolean(image?.image);

  return (
    <div
      className="relative aspect-square overflow-hidden rounded-md bg-gray-200 cursor-pointer group"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      onClick={onClick}
    >
      {hasImage ? (
        <img
          src={image.image.replace("/upload/", "/upload/w_100,h_100,c_fill/")}
          alt={image?.publicId || "Gallery Image"}
          className="w-full h-full object-cover"
          loading="lazy"
        />
      ) : (
        <div className="flex items-center justify-center w-full h-full bg-gray-300">
          <Sparkles className="w-8 h-8 text-gray-400" />
        </div>
      )}

      {/* Checkbox overlay */}
      {(hover || isSelected) && (
        <div className="absolute top-2 left-2">
          <input
            type="checkbox"
            checked={isSelected}
            onClick={(e) => e.stopPropagation()}
            onChange={() => toggleSelect(image._id)}
            className="w-6 h-6 accent-blue-500 cursor-pointer"
          />
        </div>
      )}
    </div>
  );
};

export default ImageCard;
