import { Link, useNavigate } from "react-router-dom";
const Login = () => {
  const navigate = useNavigate();
  console.log("Login page rendered");
  const handleSubmit = (event: any) => {
    event.preventDefault();
    console.log("Login form submitted");
    navigate("/dashboard");
  };
  return (
    <div className="flex items-center justify-center h-screen bg-gradient-to-br from-blue-100 via-white to-purple-200">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-2xl shadow-2xl w-96 border border-blue-200"
      >
        <h2 className="text-3xl font-bold mb-6 text-center text-blue-700">
          Login
        </h2>
        <input
          type="email"
          placeholder="Email"
          className="w-full p-3 mb-4 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
        />
        <input
          type="password"
          placeholder="Password"
          className="w-full p-3 mb-6 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
        />
        <button
          className="w-full bg-gradient-to-r from-blue-500 to-indigo-500 text-white p-3 rounded-lg font-semibold shadow hover:from-blue-600 hover:to-indigo-600 transition duration-150"
          type="submit"
        >
          Login
        </button>
        <div className="mt-4 text-center">
          <Link to="/signup" className="text-sm text-blue-600 hover:underline transition">
            Didn't have an account?
          </Link>
        </div>
      </form>
    </div>
  );
};
export default Login;