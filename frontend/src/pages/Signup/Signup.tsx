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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-100 via-white to-slate-200 px-4">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-200 p-8">
        <h2 className="text-3xl font-bold mb-2 text-center text-slate-900">Signup</h2>
        <p className="text-sm text-slate-500 mb-8 text-center">
          Create your account and get started with the CRM.
        </p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Name"
            className="w-full p-3 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-slate-300 transition"
          />
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
            Signup
          </button>
        </form>
        <div className="mt-6 text-center text-sm text-slate-600">
          Already have an account?{' '}
          <Link to="/login" className="text-sky-600 hover:text-sky-700 font-medium">
            Login
          </Link>
        </div>
      </div>
    </div>
  );
};
export default Signup;