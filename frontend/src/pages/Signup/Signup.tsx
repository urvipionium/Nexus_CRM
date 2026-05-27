import { Link, useNavigate } from "react-router-dom";
const Signup = () => {
  const navigate = useNavigate();
  console.log("Signup page rendered");
  const handleSubmit = (event: any) => {
    event.preventDefault();
    console.log("Signup form submitted");
    navigate("/dashboard");
  };
  return (
    <div className="flex items-center justify-center h-screen bg-gradient-to-br from-green-100 via-white to-emerald-200">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-2xl shadow-2xl w-96 border border-green-200"
      >
        <h2 className="text-3xl font-bold mb-6 text-center text-green-700">
          Signup
        </h2>
        <input
          type="text"
          placeholder="Name"
          className="w-full p-3 mb-4 border border-green-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-400 transition"
        />
        <input
          type="email"
          placeholder="Email"
          className="w-full p-3 mb-4 border border-green-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-400 transition"
        />
        <input
          type="password"
          placeholder="Password"
          className="w-full p-3 mb-6 border border-green-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-400 transition"
        />
        <button
          className="w-full bg-gradient-to-r from-green-500 to-emerald-500 text-white p-3 rounded-lg font-semibold shadow hover:from-green-600 hover:to-emerald-600 transition duration-150"
          type="submit"
        >
          Signup
        </button>
        <div className="mt-4 text-center">
          <Link to="/login" className="text-sm text-green-600 hover:underline transition">
            Already have an account?
          </Link>
        </div>
      </form>
    </div>
  );
};
export default Signup;