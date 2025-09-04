import { useState, useCallback } from "react";
import { useInView } from "react-intersection-observer";
import { BarChart3, Trash2, Edit3 } from "lucide-react";

import { useAdminGalleryImages } from "../../../hooks";
import ImageCard from "./ImageCard";
import ImageModal from "./ImageModal";

const ImagesManagement = () => {
  const [status, setStatus] = useState("");
  const [prompt, setPrompt] = useState("");
  const [sort, setSort] = useState("desc");
  const [selected, setSelected] = useState([]);
  const [activeImage, setActiveImage] = useState(null);

  // hook fetch
  const { images, isLoading, isError, hasMore, fetchNextPage } = useAdminGalleryImages({ status, prompt, sort });

  // infinite scroll
  const { ref } = useInView({
    threshold: 0,
    onChange: (inView) => {
      if (inView && hasMore && !isLoading) {
        fetchNextPage();
      }
    },
  });

  // handle select toggle
  const toggleSelect = useCallback((id) => {
    setSelected((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  }, []);

  const isAllSelected = images.length > 0 && selected.length === images.length;

  const toggleSelectAll = () => {
    if (isAllSelected) {
      setSelected([]);
    } else {
      setSelected(images.map((img) => img._id));
    }
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Top bar: filters + actions */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        {/* Filters */}
        <div className="flex flex-wrap gap-2">
          <select value={status} onChange={(e) => setStatus(e.target.value)} className="border rounded px-2 py-1">
            <option value="">All Status</option>
            <option value="active">Active</option>
            <option value="trashed">Trashed</option>
            <option value="archived">Archived</option>
          </select>

          <input
            type="text"
            placeholder="Search by prompt..."
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            className="border rounded px-2 py-1"
          />

          <select value={sort} onChange={(e) => setSort(e.target.value)} className="border rounded px-2 py-1">
            <option value="desc">Newest First</option>
            <option value="asc">Oldest First</option>
          </select>
        </div>

        {/* Bulk actions */}
        <div className="flex gap-2">
          <button
            className="px-3 py-1 bg-yellow-500 text-white rounded flex items-center gap-2"
            disabled={!selected.length}
          >
            <Edit3 className="w-4 h-4" />
            Update Status
          </button>
          <button
            className="px-3 py-1 bg-red-500 text-white rounded flex items-center gap-2"
            disabled={!selected.length}
          >
            <Trash2 className="w-4 h-4" />
            Delete Selected
          </button>
          <button className="px-3 py-1 bg-blue-500 text-white rounded flex items-center gap-2">
            <BarChart3 className="w-4 h-4" />
            Analytics
          </button>
        </div>
      </div>

      {/* Gallery grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-10 gap-2">
        {images.map((img) => (
          <ImageCard
            key={img._id}
            image={img}
            isSelected={selected.includes(img._id)}
            toggleSelect={toggleSelect}
            onClick={() => setActiveImage(img)}
          />
        ))}
      </div>

      {/* Infinite scroll trigger */}
      <div ref={ref} className="h-10 flex justify-center items-center">
        {isLoading && <span className="text-gray-500">Loading...</span>}
        {isError && <span className="text-red-500">Error loading images</span>}
        {!hasMore && !isLoading && <span className="text-gray-500">No more images</span>}
      </div>

      {/* Modal for full image */}
      {activeImage && <ImageModal image={activeImage} onClose={() => setActiveImage(null)} />}
    </div>
  );
};

export default ImagesManagement;
