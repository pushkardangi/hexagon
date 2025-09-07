import { useState } from "react";
import useSWR from "swr";
import CreateCodeModal from "./CreateCodeModal";
import GenerateBulkModal from "./GenerateBulkModal";
import ConfirmDeleteModal from "./ConfirmDeleteModal";
import { fetchBulkRedeemCodes } from "../../../api";
import { formatDate, formatDateTime } from "../../../utils";

const RedeemCodeManagement = () => {
  const [filter, setFilter] = useState("all");
  const [sort, setSort] = useState("");
  const [selectedCodes, setSelectedCodes] = useState([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showBulkModal, setShowBulkModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const { data, error, isLoading, mutate } = useSWR(
    ["bulk-redeem-codes", filter, sort],
    () => fetchBulkRedeemCodes(filter, sort),
    {
      refreshInterval: 60000,
      revalidateOnFocus: false,
      shouldRetryOnError: false,
      keepPreviousData: true,
    }
  );

  const codes = data?.data || [];

  if (error) {
    console.error("Error while fetching redeem code data:", error);
  }

  return (
    <div className="flex flex-col h-full gap-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex gap-2">
          <select value={filter} onChange={(e) => setFilter(e.target.value)} className="border rounded px-2 py-1">
            <option value="all">All</option>
            <option value="used">Used</option>
            <option value="unused">Unused</option>
            <option value="expired">Expired</option>
            <option value="expiringSoon">Expiring Soon</option>
          </select>

          <select value={sort} onChange={(e) => setSort(e.target.value)} className="border rounded px-2 py-1">
            <option value="">Sort by</option>
            <option value="highValue">High Value</option>
            <option value="lowValue">Low Value</option>
          </select>
        </div>

        <div className="flex gap-2">
          <button onClick={() => setShowCreateModal(true)} className="px-3 py-1 bg-blue-500 text-white rounded">
            Create Code
          </button>
          <button onClick={() => setShowBulkModal(true)} className="px-3 py-1 bg-green-500 text-white rounded">
            Generate Bulk
          </button>
          <button onClick={() => setShowDeleteModal(true)} className="px-3 py-1 bg-red-500 text-white rounded">
            Delete Selected
          </button>
        </div>
      </div>

      {isLoading ? (
        <p>Loading codes...</p>
      ) : (
        <div className="w-full border border-gray-300 max-h-full overflow-y-auto">
          {/* Header */}
          <div className="grid grid-cols-[50px,minmax(160px,1fr),minmax(80px,1fr),minmax(140px,1fr),minmax(80px,1fr),minmax(100px,2fr),minmax(150px,2fr)] bg-gray-100 font-semibold sticky top-0 z-10">
            <div className="p-2 border text-center">
              <input
                type="checkbox"
                checked={selectedCodes?.length === codes.length && codes.length > 0}
                onChange={(e) => setSelectedCodes(e.target.checked ? codes.map((c) => c._id) : [])}
              />
            </div>
            <div className="p-2 border">Code</div>
            <div className="p-2 border">Credits</div>
            <div className="p-2 border">Expiry</div>
            <div className="p-2 border">Used</div>
            <div className="p-2 border">Used By</div>
            <div className="p-2 border">Used At</div>
          </div>

          {/* Row */}
          {codes.map((code) => (
            <div key={code._id} className="grid grid-cols-[50px,minmax(160px,1fr),minmax(80px,1fr),minmax(140px,1fr),minmax(80px,1fr),minmax(100px,2fr),minmax(150px,2fr)] hover:bg-gray-50">
              <div className="p-2 border text-center">
                <input
                  type="checkbox"
                  checked={selectedCodes.includes(code._id)}
                  onChange={(e) =>
                    setSelectedCodes((prev) =>
                      e.target.checked ? [...prev, code._id] : prev.filter((id) => id !== code._id)
                    )
                  }
                />
              </div>
              <div className="p-2 border">{code.code}</div>
              <div className="p-2 border">{code.credits}</div>
              <div className="p-2 border">{formatDate(code.expiresAt)}</div>
              <div className="p-2 border">{code.isUsed ? "Yes" : "No"}</div>
              <div className="p-2 border truncate">{code.usedBy || "-"}</div>
              <div className="p-2 border truncate">{formatDateTime(code.usedAt)}</div>
            </div>
          ))}
        </div>
      )}

      {/* Modals */}
      {showCreateModal && <CreateCodeModal onClose={() => setShowCreateModal(false)} onSuccess={mutate} />}
      {showBulkModal && <GenerateBulkModal onClose={() => setShowBulkModal(false)} onSuccess={mutate} />}
      {showDeleteModal && (
        <ConfirmDeleteModal
          selectedCodes={selectedCodes}
          onClose={() => setShowDeleteModal(false)}
          onSuccess={() => {
            mutate();
            setSelectedCodes([]);
          }}
        />
      )}
    </div>
  );
};

export default RedeemCodeManagement;
