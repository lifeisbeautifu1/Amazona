import { BrowserRouter, Routes, Route } from 'react-router-dom';
import {
  Home,
  Product,
  Cart,
  Signin,
  Signup,
  Search,
  Order,
  Profile,
  ShippingAddress,
  PaymentMethod,
  PlaceOrder,
  OrderHistory,
  Dashboard,
  ProductList,
  ProductEdit,
  OrderList,
  UserList,
  EditUser,
} from './pages';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AppNavbar, Sidebar, AdminRoute, ProtectedRoute } from './components';
import { useState, useEffect } from 'react';
import { Container } from 'react-bootstrap';
import { getError } from './utils';
import { toast } from 'react-toastify';
import axios from 'axios';

function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const toggleSidebar = () => {
    setIsSidebarOpen((prevState) => !prevState);
  };
  const [categories, setCategories] = useState<string[]>([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data } = await axios.get('/api/products/categories');
        setCategories(data);
      } catch (error) {
        toast.error(getError(error));
      }
    };
    fetchCategories();
  }, []);
  return (
    <BrowserRouter>
      <div
        className={
          isSidebarOpen
            ? 'd-flex flex-column site-container active-cont'
            : 'd-flex flex-column site-container'
        }
      >
        <ToastContainer position="bottom-center" limit={1} />
        <AppNavbar toggleSidebar={toggleSidebar} />
        <Sidebar
          isSidebarOpen={isSidebarOpen}
          toggleSidebar={toggleSidebar}
          categories={categories}
        />
        <main className="mt-3">
          <Container>
            <Routes>
              <Route path="/cart" element={<Cart />} />
              <Route path="/" element={<Home />} />
              <Route path="/signin" element={<Signin />} />
              <Route path="signup" element={<Signup />} />
              <Route path="/shipping" element={<ShippingAddress />} />
              <Route path="/payment" element={<PaymentMethod />} />
              <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                }
              />
              <Route path="/search" element={<Search />} />
              <Route
                path="/order/:id"
                element={
                  <ProtectedRoute>
                    <Order />
                  </ProtectedRoute>
                }
              />
              <Route path="/placeorder" element={<PlaceOrder />} />
              <Route
                path="/orderhistory"
                element={
                  <ProtectedRoute>
                    <OrderHistory />
                  </ProtectedRoute>
                }
              />
              <Route path="/product/:slug" element={<Product />} />
              <Route
                path="/admin/dashboard"
                element={
                  <AdminRoute>
                    <Dashboard />
                  </AdminRoute>
                }
              />
              <Route
                path="/admin/users"
                element={
                  <AdminRoute>
                    <UserList />
                  </AdminRoute>
                }
              />
              <Route
                path="/admin/user/:id"
                element={
                  <AdminRoute>
                    <EditUser />
                  </AdminRoute>
                }
              />
              <Route
                path="/admin/products"
                element={
                  <AdminRoute>
                    <ProductList />
                  </AdminRoute>
                }
              />
              <Route
                path="/admin/orders"
                element={
                  <AdminRoute>
                    <OrderList />
                  </AdminRoute>
                }
              />
              <Route
                path="/admin/product/:id"
                element={
                  <AdminRoute>
                    <ProductEdit />
                  </AdminRoute>
                }
              />
            </Routes>
          </Container>
        </main>
        <footer>
          <div className="text-center">All rights reserved</div>
        </footer>
      </div>
    </BrowserRouter>
  );
}

export default App;
