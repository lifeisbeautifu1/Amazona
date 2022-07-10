import {
  Navbar,
  Nav,
  NavDropdown,
  Container,
  Badge,
  Button,
} from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { LinkContainer } from 'react-router-bootstrap';
import { useAppContext } from '../context';
import Search from './Search';

type AppNavbarProps = {
  toggleSidebar: () => void;
};

const AppNavbar: React.FC<AppNavbarProps> = ({ toggleSidebar }) => {
  const { state, dispatch: ctxDispatch } = useAppContext();
  const { userInfo, cart } = state;

  const handleSignout = () => {
    ctxDispatch({ type: 'USER_SIGNOUT' });
    localStorage.removeItem('userInfo');
    localStorage.removeItem('shippingAddress');
    localStorage.removeItem('paymentMethod');
  };

  return (
    <Navbar bg="dark" variant="dark" expand="lg">
      <Container>
        <Button variant="dark" onClick={toggleSidebar}>
          <i className="fas fa-bars"></i>
        </Button>{' '}
        <LinkContainer to="/">
          <Navbar.Brand> amazona</Navbar.Brand>
        </LinkContainer>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Search />
          <Nav className="me-auto w-100  justify-content-end">
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
            {userInfo ? (
              <NavDropdown title={userInfo?.name} id="basic-nav-dropdown">
                <LinkContainer to="/profile">
                  <NavDropdown.Item>Profile</NavDropdown.Item>
                </LinkContainer>
                <LinkContainer to="/orderhistory">
                  <NavDropdown.Item>Order History</NavDropdown.Item>
                </LinkContainer>
                <NavDropdown.Divider />
                <Link
                  className="dropdown-item"
                  to="/signin"
                  onClick={handleSignout}
                >
                  Sign Out
                </Link>
              </NavDropdown>
            ) : (
              <Link className="nav-link" to="/signin">
                Sign In
              </Link>
            )}
            {userInfo && userInfo.isAdmin && (
              <NavDropdown title="Admin" id="admin-nav-dropdown">
                <LinkContainer to="/admin/dashboard">
                  <NavDropdown.Item>Dashboard</NavDropdown.Item>
                </LinkContainer>
                <LinkContainer to="/admin/products">
                  <NavDropdown.Item>Products</NavDropdown.Item>
                </LinkContainer>
                <LinkContainer to="/admin/orders">
                  <NavDropdown.Item>Orders</NavDropdown.Item>
                </LinkContainer>
                <LinkContainer to="/admin/users">
                  <NavDropdown.Item>Users</NavDropdown.Item>
                </LinkContainer>
              </NavDropdown>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default AppNavbar;
