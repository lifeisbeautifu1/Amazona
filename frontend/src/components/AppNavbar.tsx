import { Navbar, Nav, NavDropdown, Container, Badge } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { LinkContainer } from 'react-router-bootstrap';
import { useAppContext } from '../context';

const AppNavbar = () => {
  const { state, dispatch: ctxDispatch } = useAppContext();
  const { userInfo, cart } = state;

  const handleSignout = () => {
    ctxDispatch({ type: 'USER_SIGNOUT' });
    localStorage.removeItem('userInfo');
    localStorage.removeItem('shippingAddress');
    localStorage.removeItem('paymentMethod');
  };

  return (
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
                to="#signout"
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
        </Nav>
      </Container>
    </Navbar>
  );
};

export default AppNavbar;
