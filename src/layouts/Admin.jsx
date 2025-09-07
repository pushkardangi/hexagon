import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

const menuItems = [
  { path: "users", label: "User Management" },
  { path: "redeem-codes", label: "Redeem Code Management" },
  { path: "images", label: "Images Management" },
];

export default function AdminLayout() {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="flex flex-col justify-between bg-white border-r border-gray-200">
        <div>
          <div className="p-4 text-lg font-bold border-b">Admin Dashboard</div>
          <nav className="flex flex-col p-2">
            {menuItems.map((item) => (
              <Link
                key={item.path}
                to={`/admin/${item.path}`}
                className={`px-4 py-2 rounded mb-1 transition ${
                  location.pathname.includes(item.path) ? "bg-blue-500 text-white" : "hover:bg-gray-200"
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex p-4">
          <button
            onClick={() => navigate("/")}
            className="flex gap-2 px-3 py-1 text-sm text-black border border-black rounded hover:bg-gray-900 hover:text-white transition-all duration-300"
          >
            <ArrowLeft className="w-4 h-5" />
            Back to Home
          </button>
        </div>
      </aside>

      {/* Dynamic Content Area */}
      <main className="flex-1 p-6">
        <Outlet />
      </main>
    </div>
  );
}
