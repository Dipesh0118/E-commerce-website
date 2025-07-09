import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from '../services/api';

const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleChange = e => {
    const { name, type } = e.target;
    // read actual number for <input type="number">, otherwise a string
    const value = type === 'number'
      ? e.target.valueAsNumber // gives you a Number
      : e.target.value;

    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!/^\S+@\S+\.\S+$/.test(formData.email)) newErrors.email = "Invalid email format";
    if (!/(?=.*[A-Z])(?=.*\d).{8,}/.test(formData.password))
      newErrors.password = "Must be 8+ chars, include 1 uppercase & 1 number";
    if (formData.password !== formData.confirmPassword)
      newErrors.confirmPassword = "Passwords do not match";
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    
    try {
      await api.post('/api/auth/register', {
        name: formData.name,
        email: formData.email,
        password: formData.password,
      });
      setSuccess(true);
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      setErrors({ api: err.response?.data?.message || 'Registration failed' });
    }
  };
  
  return (
    <div className="max-w-md mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Register</h2>
      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <input 
          type="text" 
          id="name"
          name="name" 
          placeholder="Name" 
          value={formData.name}
          onChange={handleChange}
          className="p-2 border rounded" 
        />
        {errors.name && <p className="text-red-500 text-sm" id="name-error">{errors.name}</p>}
        
        <input 
          type="email" 
          id="email"
          name="email" 
          placeholder="Email" 
          value={formData.email}
          onChange={handleChange}
          className="p-2 border rounded" 
        />
        {errors.email && <p className="text-red-500 text-sm" id="email-error">{errors.email}</p>}
        
        <input 
          type="password" 
          id="password"
          name="password" 
          placeholder="Password" 
          value={formData.password}
          onChange={handleChange}
          className="p-2 border rounded" 
        />
        {errors.password && <p className="text-red-500 text-sm" id="password-error">{errors.password}</p>}
        
        <input 
          type="password" 
          id="confirm-password"
          name="confirmPassword" 
          placeholder="Confirm Password" 
          value={formData.confirmPassword}
          onChange={handleChange}
          className="p-2 border rounded" 
        />
        {errors.confirmPassword && <p className="text-red-500 text-sm" id="confirm-password-error">{errors.confirmPassword}</p>}
        
        <button 
          id="register-btn" 
          className="bg-green-500 text-white py-2 rounded hover:bg-green-600"
          type="submit"
        >
          Register
        </button>
        
        {errors.api && (
          <div className="alert alert-error mt-4">
            <span>{errors.api}</span>
          </div>
        )}
        
        {success && (
          <div className="alert alert-success mt-4">
            <span>Registration successful! Redirecting to login...</span>
          </div>
        )}
      </form>
    </div>
  );
};

export default Register;