export default function UserCard({ user }) {
  if (!user) return null;
  return (
    <div className="border p-2 rounded">
      <h3 className="font-bold">{user.name || user.username || "No name"}</h3>
      <p className="text-sm text-gray-600">Email: {user.email || "-"}</p>
      <p className="text-sm text-gray-600">ID: {user.userId ?? user.id}</p>
    </div>
  );
}
