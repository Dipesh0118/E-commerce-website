import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../../redux/slices/userSlice';
import { ShoppingCart, Menu, X } from 'lucide-react';
import { clearCart } from '../../redux/slices/cartSlice';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const dispatch = useDispatch();
  const userInfo = useSelector((state) => state.user.userInfo);
  const cartItems = useSelector((state) => state.cart.cartItems);
  const isAdmin = useSelector((state) => state.user.userInfo?.role === 'admin');
  const navigate = useNavigate(); // 👈 initialize navigate

  const cartItemsCount = cartItems.reduce((acc, item) => acc + item.qty, 0);

  const handleLogout = () => {
    dispatch(logout());
    dispatch(clearCart());
    setIsMenuOpen(false);
    navigate('/');
  };

  const getUserInitial = () => {
    if (!userInfo) return '?';
    return isAdmin ? 'A' : 'U';
  };

  return (
    <div className="navbar bg-base-100 shadow-md sticky top-0 z-50">
      <div className="container mx-auto flex justify-between items-center w-full">
        {/* Left side: Brand + Home */}
        <div className="flex items-center gap-4">
          <Link to="/" className="btn btn-ghost normal-case text-2xl font-bold text-primary">
            ElectroCart
          </Link>
          <Link to="/" className="btn btn-primary btn-sm rounded-full px-4 hover:bg-primary-focus transition-colors">
            Home
          </Link>
          {isAdmin && (
            <Link to="/admin/orders" className="btn bg-secondary hover:bg-secondary-focus text-white btn-sm rounded-full px-4 transition-colors">
              Admin Panel
            </Link>
          )}
        </div>

        {/* Right side: Cart + Auth/User Menu */}
        <div className="flex-none gap-6 items-center hidden md:flex">
          <Link to="/cart" className="btn btn-ghost btn-circle relative">
            <ShoppingCart size={28} />
            {cartItemsCount > 0 && (
              <span className="badge badge-md indicator-item badge-primary">
                {cartItemsCount}
              </span>
            )}
          </Link>

          {userInfo ? (
            <div className="dropdown dropdown-end">
              <label tabIndex={0} className="btn btn-primary btn-circle text-lg w-10 h-10">
                {getUserInitial()}
              </label>
              <ul
                tabIndex={0}
                className="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52 mt-3"
              >
                {/* <li><Link to="/profile" className="text-lg">Profile</Link></li> */}
                {!isAdmin && (<li><Link to="/orders" className="text-lg">Orders</Link></li>
               )}
                {isAdmin && (
                  <li><Link to="/admin" className="text-lg">All Products</Link></li>
                )}
                {isAdmin && (
                  <li><Link to="/admin/orders" className="text-lg">Admin Panel</Link></li>
                )}
                <li>
                  <button className="text-lg text-error" onClick={handleLogout}>
                    Logout
                  </button>
                </li>
              </ul>
            </div>
          ) : (
            <>
              <Link to="/login" className="btn btn-outline btn-md rounded-btn text-lg">
                Login
              </Link>
              <Link to="/register" className="btn btn-primary btn-md rounded-btn text-lg">
                Register
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <div className="flex md:hidden gap-2">
          <Link to="/cart" className="btn btn-ghost btn-circle relative">
            <ShoppingCart size={28} />
            {cartItemsCount > 0 && (
              <span className="badge badge-md indicator-item badge-primary">
                {cartItemsCount}
              </span>
            )}
          </Link>

          <button
            className="btn btn-ghost btn-circle"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Content */}
      {isMenuOpen && (
        <div className="md:hidden bg-base-100 shadow-lg py-4 px-6">
          <div className="flex flex-col space-y-4">
            <Link to="/" className="btn btn-outline" onClick={() => setIsMenuOpen(false)}>
              Home
            </Link>

            {userInfo ? (
              <>
                <div className="flex items-center space-x-3 mb-4">
                  <div className="btn btn-primary btn-circle text-lg w-10 h-10">
                    {getUserInitial()}
                  </div>
                  <span className="font-semibold text-lg">{userInfo.name}</span>
                </div>
                <Link to="/profile" className="btn btn-ghost justify-start text-lg" onClick={() => setIsMenuOpen(false)}>Profile</Link>
                {!isAdmin && (
                  <Link to="/orders" className="btn btn-ghost justify-start text-lg" onClick={() => setIsMenuOpen(false)}>Orders</Link>
                )}
                {isAdmin && (
                  <>
                    <Link to="/admin" className="btn btn-ghost justify-start text-lg" onClick={() => setIsMenuOpen(false)}>All Products</Link>
                    <Link to="/admin/orders" className="btn btn-ghost justify-start text-lg" onClick={() => setIsMenuOpen(false)}>Admin Panel</Link>
                  </>
                )}
                <button className="btn btn-error text-lg" onClick={handleLogout}>Logout</button>
              </>
            ) : (
              <>
                <Link to="/login" className="btn btn-outline text-lg" onClick={() => setIsMenuOpen(false)}>Login</Link>
                <Link to="/register" className="btn btn-primary text-lg" onClick={() => setIsMenuOpen(false)}>Register</Link>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Navbar;