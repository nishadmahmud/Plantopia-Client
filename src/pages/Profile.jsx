import { useContext, useState, useEffect } from 'react';
import { AuthContext } from '../auth/AuthProvider';
import toast from 'react-hot-toast';

const defaultAvatar = 'https://ui-avatars.com/api/?name=User&background=E0F2F1&color=388E3C&rounded=true';

const Profile = () => {
  const { user, updateUserProfile } = useContext(AuthContext);
  const [edit, setEdit] = useState(false);
  const [name, setName] = useState(user?.displayName || '');
  const [photo, setPhoto] = useState(user?.photoURL || '');
  const [loading, setLoading] = useState(false);

  // Sync fields with user info
  useEffect(() => {
    setName(user?.displayName || '');
    setPhoto(user?.photoURL || '');
  }, [user]);

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Profile</h1>
        <p className="text-gray-700">You must be logged in to view your profile.</p>
      </div>
    );
  }

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await updateUserProfile(name, photo);
      toast.success('Profile updated!');
      setEdit(false);
      // Optionally, reload the page or user info
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 flex flex-col items-center">
      <h1 className="text-4xl font-bold text-gray-900 mb-6">My Profile</h1>
      <img
        src={user.photoURL || defaultAvatar}
        alt="User"
        className="w-24 h-24 rounded-full border-4 border-green-200 shadow mb-4 object-cover"
        onError={e => { e.target.onerror = null; e.target.src = defaultAvatar; }}
      />
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md text-center">
        {edit ? (
          <form onSubmit={handleUpdate} className="space-y-4">
            <div>
              <label className="block text-gray-700 mb-1">Display Name</label>
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                required
              />
            </div>
            <div>
              <label className="block text-gray-700 mb-1">Photo URL</label>
              <input
                type="text"
                value={photo}
                onChange={e => setPhoto(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="https://..."
              />
            </div>
            <div className="flex gap-2 justify-center">
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2 rounded-lg bg-green-600 text-white font-semibold hover:bg-green-700 transition-colors disabled:opacity-50"
              >
                {loading ? 'Saving...' : 'Save'}
              </button>
              <button
                type="button"
                onClick={() => setEdit(false)}
                className="px-6 py-2 rounded-lg bg-gray-200 text-gray-700 font-semibold hover:bg-gray-300 transition-colors"
                disabled={loading}
              >
                Cancel
              </button>
            </div>
          </form>
        ) : (
          <>
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">{user.displayName || 'No Name'}</h2>
            <p className="text-gray-600 mb-4">{user.email}</p>
            <button
              className="px-6 py-2 rounded-lg bg-green-600 text-white font-semibold hover:bg-green-700 transition-colors"
              onClick={() => setEdit(true)}
            >
              Edit Profile
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default Profile; 