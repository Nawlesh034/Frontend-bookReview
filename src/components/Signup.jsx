import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Signup(){
      const [name,setName]=useState('');
      const [email,setEmail]=useState('');
      const [password,setPassword]=useState('');
      const [loading, setLoading] = useState(false);
      const [error, setError] = useState('');
      const [success, setSuccess] = useState('');
      const navigate = useNavigate();
      const { register } = useAuth();

      const handleSubmit = async (e)=>{
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccess('');

        const result = await register(name, email, password);

        if (result.success) {
          setSuccess(result.message);
          setName('');
          setEmail('');
          setPassword('');

          // Redirect to login page after 2 seconds
          setTimeout(() => {
            navigate('/login');
          }, 2000);
        } else {
          setError(result.message);
        }

        setLoading(false);
      }

    



    return(
        <>

<div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
  <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8">
    <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Sign up</h2>

    {error && (
      <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
        {error}
      </div>
    )}

    {success && (
      <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded">
        {success}
      </div>
    )}

    <form className="space-y-4" onSubmit={handleSubmit}>
        <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
        <input
          type="text"
          value={name}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
          placeholder="Enter your full name"
          onChange={(e)=>setName(e.target.value)}
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
        <input
          type="email"
          value= {email}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
          placeholder="your@email.com"
          onChange={(e)=>setEmail(e.target.value)}
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
        <input
          type="password"
          value={password}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
          placeholder="••••••••"
          onChange={(e)=>setPassword(e.target.value)}
          required
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white font-medium py-2.5 rounded-lg transition-colors"
      >
        {loading ? 'Creating Account...' : 'Sign Up'}
      </button>
    </form>

    <div className="mt-6 text-center text-sm text-gray-600">
      Already have an account?
      <Link to="/login" className="text-indigo-600 hover:text-indigo-500 font-medium">Sign In</Link>
    </div>
  </div>
</div>
        </>
    )
}

export default Signup;