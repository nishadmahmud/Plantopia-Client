import { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { AuthContext } from '../auth/AuthProvider';
import { FaLeaf } from 'react-icons/fa';
import toast from 'react-hot-toast';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const { createUser, updateUserProfile, loading, signInWithGoogle } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      // Create user
      const result = await createUser(email, password);
      
      // Update profile
      await updateUserProfile(name);
      
      toast.success('Registration successful!');
      navigate('/');
    } catch (error) {
      setError(error.message);
      toast.error(error.message);
    }
  };

  // Google sign in handler (placeholder if not implemented)
  const handleGoogleSignIn = async () => {
    if (signInWithGoogle) {
      try {
        await signInWithGoogle();
        toast.success('Registered with Google!');
        navigate('/');
      } catch (error) {
        toast.error(error.message);
      }
    } else {
      toast('Google sign-in not implemented');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-green-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-lg">
        <div className="text-center">
          <div className="flex justify-center">
            <FaLeaf className="text-4xl text-green-600" />
          </div>
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            Create your account
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Already have an account?{' '}
            <Link to="/login" className="font-medium text-green-600 hover:text-green-500">
              Sign in here
            </Link>
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="bg-red-50 text-red-500 p-3 rounded-md text-sm">
              {error}
            </div>
          )}

          <div className="rounded-md shadow-sm space-y-4">
            <div>
              <label htmlFor="name" className="sr-only">
                Full Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="appearance-none rounded-lg relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-green-500 focus:border-green-500 focus:z-10 sm:text-sm"
                placeholder="Full Name"
              />
            </div>
            <div>
              <label htmlFor="email" className="sr-only">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="appearance-none rounded-lg relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-green-500 focus:border-green-500 focus:z-10 sm:text-sm"
                placeholder="Email address"
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="appearance-none rounded-lg relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-green-500 focus:border-green-500 focus:z-10 sm:text-sm"
                placeholder="Password"
              />
            </div>
            <div>
              <label htmlFor="confirm-password" className="sr-only">
                Confirm Password
              </label>
              <input
                id="confirm-password"
                name="confirm-password"
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="appearance-none rounded-lg relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-green-500 focus:border-green-500 focus:z-10 sm:text-sm"
                placeholder="Confirm Password"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Creating account...' : 'Create account'}
            </button>
          </div>
        </form>
        {/* Google Register Button */}
        <div className="mt-4">
          <button
            type="button"
            onClick={handleGoogleSignIn}
            className="w-full flex items-center justify-center gap-3 py-2 px-4 border border-gray-300 rounded-lg bg-white hover:bg-green-50 text-gray-700 font-medium shadow-sm transition-colors"
          >
            <svg className="w-5 h-5" viewBox="0 0 48 48"><g><path fill="#4285F4" d="M24 9.5c3.54 0 6.7 1.22 9.19 3.23l6.85-6.85C35.64 2.36 30.21 0 24 0 14.82 0 6.71 5.82 2.69 14.09l7.98 6.19C12.33 13.16 17.67 9.5 24 9.5z"/><path fill="#34A853" d="M46.1 24.55c0-1.64-.15-3.22-.42-4.74H24v9.01h12.42c-.54 2.9-2.18 5.36-4.64 7.03l7.19 5.59C43.93 37.36 46.1 31.45 46.1 24.55z"/><path fill="#FBBC05" d="M10.67 28.28c-1.04-3.13-1.04-6.44 0-9.57l-7.98-6.19C.64 16.36 0 20.06 0 24s.64 7.64 2.69 11.48l7.98-6.19z"/><path fill="#EA4335" d="M24 48c6.21 0 11.64-2.05 15.53-5.59l-7.19-5.59c-2.01 1.35-4.58 2.15-8.34 2.15-6.33 0-11.67-3.66-13.33-8.79l-7.98 6.19C6.71 42.18 14.82 48 24 48z"/><path fill="none" d="M0 0h48v48H0z"/></g></svg>
            Register with Google
          </button>
        </div>
      </div>
    </div>
  );
};

export default Register;