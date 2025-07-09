import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Cart from './pages/Cart';
import ProductDetails from './pages/ProductDetails';
import Profile from './pages/Profile';
import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';
import AdminDashboard from './pages/AdminDashboard';
import AdminAddProduct from './pages/AdminAddProduct';
import AdminEditProduct from './pages/AdminEditProduct';
import Admin from './pages/Admin'; // Import the Admin component
import Checkout from './pages/Checkout';
import OrderConfirmation from './pages/OrderConfirmation';
import OrderDetails from './pages/OrderDetails';
import MyOrders from './pages/MyOrders';
import AdminOrdersPage from './pages/AdminOrdersPage';
import AdminCustomersPage from './pages/AdminCustomersPage';

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <main className="p-4 min-h-screen">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/product/:id" element={<ProductDetails />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/order-confirmation" element={<OrderConfirmation />} />
          <Route path="/orders" element={<MyOrders/>} />

          <Route path="/orders/:id" element={<OrderDetails />} />

          {/* Admin product management routes */}
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/product/create" element={<AdminAddProduct />} />
          <Route path="/admin/product/:productId/edit" element={<AdminEditProduct />} />
          <Route path="/admin/create" element={<Admin />} /> {/* Admin creation route */}
          <Route path="/admin/orders" element={<AdminOrdersPage />} />
          <Route path="/admin/customers" element={<AdminCustomersPage/>} />

        </Routes>
      </main>
      <Footer />
    </BrowserRouter>
  );
}

export default App;
