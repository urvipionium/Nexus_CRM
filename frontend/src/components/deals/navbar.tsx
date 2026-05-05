function Navbar() {
  return (
    <div className="bg-white p-4 shadow flex justify-between">
      <input
        placeholder="Search deals..."
        className="border px-4 py-2 rounded-lg w-1/3"
      />
      <div>👤 Dhairya</div>
    </div>
  );
}

export default Navbar;