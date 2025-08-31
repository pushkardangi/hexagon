const UserTable = ({ users, loading }) => {
  if (loading) {
    return <p className="text-gray-500">Loading users...</p>;
  }

  if (!users.length) {
    return <p className="text-gray-500">No users found.</p>;
  }

  return (
    <div className="w-full border border-gray-300 max-h-[600px] overflow-y-auto">
      {/* Header */}
      <div className="grid grid-cols-[minmax(100px,0.6fr),minmax(120px,1fr),minmax(200px,2fr),minmax(100px,0.6fr),minmax(100px,1fr)] bg-gray-100 font-semibold sticky top-0 z-10">
        <div className="p-3 border">Status</div>
        <div className="p-3 border">Name</div>
        <div className="p-3 border">Email</div>
        <div className="p-3 border text-center">Role</div>
        <div className="p-3 border text-right">Credits</div>
      </div>

      {/* Rows */}
      {users.map((user) => (
        <div
          key={user.id}
          className="grid grid-cols-[minmax(100px,0.6fr),minmax(120px,1fr),minmax(200px,2fr),minmax(100px,0.6fr),minmax(100px,1fr)]"
        >
          <div className="p-3 border">{user.accountStatus}</div>
          <div className="p-3 border truncate">
            {user.firstName} {user.lastName}
          </div>
          <div className="p-3 border truncate">{user.email}</div>
          <div className="p-3 border text-center">{user.role}</div>
          <div className="p-3 border text-right">{user.credits.toFixed(2)}</div>
        </div>
      ))}
    </div>
  );
};

export default UserTable;
