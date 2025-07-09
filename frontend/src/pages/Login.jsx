import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAppDispatch } from '../store/hooks';
import { setCredentials } from '../redux/slices/userSlice';
import api from '../services/api';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const validateForm = () => {
    let newErrors = {};
    if (!/^\S+@\S+\.\S+$/.test(email)) newErrors.email = 'Invalid email format';
    if (!/(?=.*[A-Z])(?=.*\d).{8,}/.test(password))
      newErrors.password = 'Must be 8+ chars, include 1 uppercase & 1 number';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      // Use axios instance to login and set auth header
      const data = await api.post('/api/auth/login', { email, password }).then(res => res.data);

      // Store token
      localStorage.setItem('token', data.token);
      api.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;

      // Dispatch to Redux
      dispatch(
        setCredentials({
          name: data.name,
          email,
          role: data.role,
          token: data.token,       // ← include the JWT here
        })
      );
      // Navigate based on role
      if (data.role === 'admin') {
        navigate('/admin/orders');
      } else {
        navigate('/');
      }
    } catch (err) {
      setErrors({ form: err.response?.data?.message || err.message });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Login</h2>
      {errors.form && (
        <div className="mb-4 p-2 bg-red-100 text-red-700 rounded">
          {errors.form}
        </div>
      )}
      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <div>
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-2 border rounded"
            required
          />
          {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
        </div>

        <div>
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-2 border rounded"
            required
          />
          {errors.password && (
            <p id="password-error" className="text-red-500 text-sm mt-1">
              {errors.password}
            </p>
          )}
        </div>

        <button
          type="submit"
          id="login-button"
          disabled={isLoading}
          className={`bg-blue-500 text-white py-2 rounded hover:bg-blue-600 ${
            isLoading ? 'opacity-70 cursor-not-allowed' : ''
          }`}>
          {isLoading ? 'Logging in...' : 'Login'}
        </button>

        <p className="text-sm mt-3 text-center">
          New User?{' '}
          <Link to="/register" className="text-blue-500 hover:underline">
            Register here
          </Link>
        </p>
      </form>
    </div>
  );
};

export default Login;