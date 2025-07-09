import React, { useEffect, useState } from 'react';
import { getCurrentUser } from '../services/api';

const Profile = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const data = await getCurrentUser();
        setUser(data);
      } catch (err) {
        console.error('Failed to load user profile', err);
      }
    })();
  }, []);

  if (!user) {
    return (
      <div className="flex items-center justify-center h-full py-20">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center py-12">
      <div className="card w-80 bg-base-100 shadow-xl">
        <div className="card-body items-center text-center">
          {/* User Information */}
          <h2 className="card-title text-xl font-semibold">{user.name}</h2>
          <p className="text-sm text-gray-500">{user.email}</p>
          <div className="mt-2">
            <span className="badge badge-info text-base">
              {user.role || (user.isAdmin ? 'Admin' : 'User')}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;