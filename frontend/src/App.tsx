import { BrowserRouter, Routes, Route } from 'react-router-dom';
import {
  Home,
  Product,
  Cart,
  Signin,
  Signup,
  Order,
  ShippingAddress,
  PaymentMethod,
  PlaceOrder,
} from './pages';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AppNavbar } from './components';
import { Container } from 'react-bootstrap';

function App() {
  return (
    <BrowserRouter>
      <div className="d-flex flex-column site-container">
        <ToastContainer position="bottom-center" limit={1} />
        <AppNavbar />
        <main className="mt-3">
          <Container>
            <Routes>
              <Route path="/cart" element={<Cart />} />
              <Route path="/" element={<Home />} />
              <Route path="/signin" element={<Signin />} />
              <Route path="signup" element={<Signup />} />
              <Route path="/shipping" element={<ShippingAddress />} />
              <Route path="/payment" element={<PaymentMethod />} />
              <Route path="/order/:id" element={<Order />} />
              <Route path="placeorder" element={<PlaceOrder />} />
              <Route path="/product/:slug" element={<Product />} />
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
