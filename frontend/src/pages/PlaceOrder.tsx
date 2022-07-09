import { useState, useEffect } from 'react';
import axios from 'axios';
import { Helmet } from 'react-helmet-async';
import { Card, Row, Col, Button, ListGroup } from 'react-bootstrap';
import { useNavigate, Link } from 'react-router-dom';
import { CheckoutSteps, Loading } from '../components';
import { useAppContext } from '../context';
import { toast } from 'react-toastify';
import { getError } from '../utils';

const PlaceOrder = () => {
  const navigate = useNavigate();

  const { state, dispatch: ctxDispatch } = useAppContext();

  const { userInfo, cart } = state;

  const round2 = (num: number) => Math.round(num * 100 + Number.EPSILON) / 100;

  cart.itemsPrice = round2(
    cart.cartItems.reduce(
      (total, item) => total + item.quantity * item.price,
      0
    )
  );

  cart.shippingPrice = cart.itemsPrice > 100 ? round2(0) : round2(10);

  cart.taxPrice = round2(0.15 * cart.itemsPrice);

  cart.totalPrice = cart.itemsPrice + cart.shippingPrice + cart.taxPrice;

  const [isLoading, setIsLoading] = useState(false);

  const handlePlaceOrder = async () => {
    setIsLoading(true);
    try {
      const { data } = await axios.post(
        '/api/orders',
        {
          orderItems: cart.cartItems,
          shippingAddress: cart.shippingAddress,
          paymentMethod: cart.paymentMethod,
          itemsPrice: cart.itemsPrice,
          shippingPrice: cart.shippingPrice,
          taxPrice: cart.taxPrice,
          totalPrice: cart.totalPrice,
        },
        {
          headers: {
            authorization: `Bearer ${userInfo?.token}`,
          },
        }
      );
      ctxDispatch({ type: 'CART_CLEAR' });
      localStorage.removeItem('cartItems');
      navigate('/order/' + data?.order?._id);
      setIsLoading(false);
    } catch (error) {
      toast.error(getError(error));
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!cart.paymentMethod) navigate('/payment');
  }, [cart, navigate]);

  return (
    <div>
      <CheckoutSteps step1 step2 step3 step4></CheckoutSteps>
      <Helmet>
        <title>Place Order</title>
      </Helmet>
      <h1 className="my-4">Preview Order</h1>
      <Row>
        <Col md={8}>
          <Card className="mb-3">
            <Card.Body>
              <Card.Title>Shipping</Card.Title>
              <Card.Text>
                <strong>Name: </strong> {cart?.shippingAddress?.fullName}{' '}
                <strong>Address: </strong> {cart?.shippingAddress?.address},{' '}
                {cart?.shippingAddress?.city},{' '}
                {cart?.shippingAddress?.postalCode},{' '}
                {cart?.shippingAddress?.country}
              </Card.Text>
              <Link to="/shipping">Edit</Link>
            </Card.Body>
          </Card>
          <Card className="mb-3">
            <Card.Body>
              <Card.Title>Payment</Card.Title>
              <Card.Text>
                <strong>Method: </strong> {cart.paymentMethod}
              </Card.Text>
              <Link to="/payment">Edit</Link>
            </Card.Body>
          </Card>
          <Card className="mb-3">
            <Card.Body>
              <Card.Title>Items</Card.Title>
              <ListGroup variant="flush">
                {cart.cartItems.map((item) => (
                  <ListGroup.Item key={item._id}>
                    <Row className="align-items-center">
                      <Col md={6}>
                        <img
                          src={item.image}
                          alt={item.name}
                          className="img-fluid rounded img-thumbnail"
                        />{' '}
                        <Link to={`/product/${item.slug}`}>{item.name}</Link>
                      </Col>
                      <Col md={3}>
                        <span>{item.quantity}</span>
                      </Col>
                      <Col md={3}>${item.price}</Col>
                    </Row>
                  </ListGroup.Item>
                ))}
              </ListGroup>
              <Link to="/cart">Edit</Link>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card>
            <Card.Body>
              <Card.Title>Order Summary</Card.Title>
              <ListGroup variant="flush">
                <ListGroup.Item>
                  <Row>
                    <Col>Items</Col>
                    <Col>${cart.itemsPrice.toFixed(2)}</Col>
                  </Row>
                </ListGroup.Item>
                <ListGroup.Item>
                  <Row>
                    <Col>Shipping</Col>
                    <Col>${cart.shippingPrice.toFixed(2)}</Col>
                  </Row>
                </ListGroup.Item>
                <ListGroup.Item>
                  <Row>
                    <Col>Tax</Col>
                    <Col>${cart.taxPrice.toFixed(2)}</Col>
                  </Row>
                </ListGroup.Item>
                <ListGroup.Item>
                  <Row>
                    <Col>Order Total</Col>
                    <Col>${cart.totalPrice.toFixed(2)}</Col>
                  </Row>
                </ListGroup.Item>
                <ListGroup.Item>
                  <div className="d-grid">
                    <Button
                      type="button"
                      disabled={cart.cartItems.length === 0}
                      onClick={handlePlaceOrder}
                    >
                      Place Order
                    </Button>
                  </div>
                  {isLoading && <Loading />}
                </ListGroup.Item>
              </ListGroup>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default PlaceOrder;
