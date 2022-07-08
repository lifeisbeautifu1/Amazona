import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { Home, Product, Cart, Signin } from './pages';
import Navbar from 'react-bootstrap/Navbar';
import Container from 'react-bootstrap/Container';
import Badge from 'react-bootstrap/Badge';
import Nav from 'react-bootstrap/Nav';
import { useAppContext } from './context';
import { LinkContainer } from 'react-router-bootstrap';

function App() {
  const { state } = useAppContext();
  const { cart } = state;
  return (
    <BrowserRouter>
      <div className="d-flex flex-column site-container">
        <Navbar bg="dark" variant="dark">
          <Container>
            <LinkContainer to="/">
              <Navbar.Brand>amazona</Navbar.Brand>
            </LinkContainer>
            <Nav className="me-auto">
              <Link to="/cart" className="nav-link">
                <span>Cart </span>
                {cart?.cartItems?.length > 0 && (
                  <Badge pill bg="info">
                    {cart?.cartItems?.reduce((total, item) => {
                      return total + item?.quantity;
                    }, 0)}
                  </Badge>
                )}
              </Link>
            </Nav>
          </Container>
        </Navbar>
        <main className="mt-3">
          <Container>
            <Routes>
              <Route path="/cart" element={<Cart />} />
              <Route path="/" element={<Home />} />
              <Route path="/signin" element={<Signin />} />
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
