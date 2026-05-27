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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-100 via-white to-slate-200 px-4">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-200 p-8">
        <h2 className="text-3xl font-bold mb-2 text-center text-slate-900">Login</h2>
        <p className="text-sm text-slate-500 mb-8 text-center">
          Welcome back! Sign in to continue to your dashboard.
        </p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            className="w-full p-3 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-slate-300 transition"
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full p-3 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-slate-300 transition"
          />
          <button
            className="w-full bg-gradient-to-r from-sky-500 to-indigo-500 text-white p-3 rounded-2xl font-semibold shadow hover:from-sky-600 hover:to-indigo-600 transition duration-150"
            type="submit"
          >
            Login
          </button>
        </form>
        <div className="mt-6 text-center text-sm text-slate-600">
          Don&apos;t have an account?{' '}
          <Link to="/signup" className="text-sky-600 hover:text-sky-700 font-medium">
            Signup
          </Link>
        </div>
      </div>
    </div>
  );
};
export default Login;