import axios from 'axios';
import { Helmet } from 'react-helmet-async';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useAppContext } from '../context';
import { Row, Col, Card, ListGroup } from 'react-bootstrap';
import { Loading, Message } from '../components';
import { getError } from '../utils';
import { IOrder } from '../interfaces';

const Order = () => {
  const navigate = useNavigate();
  const {
    state: { userInfo },
  } = useAppContext();
  const { id: orderId } = useParams();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [order, setOrder] = useState<IOrder>({} as IOrder);
  useEffect(() => {
    const fetchOrder = async () => {
      setIsLoading(true);
      try {
        const { data } = await axios.get('/api/orders/' + orderId, {
          headers: {
            authorization: `Bearer ${userInfo?.token}`,
          },
        });
        setOrder(data);
        setIsLoading(false);
      } catch (error) {
        setIsLoading(false);
        setError(getError(error));
      }
    };
    if (!userInfo) navigate('/');
    if (!order?._id || (order?._id && order?._id !== orderId)) {
      fetchOrder();
    }
  }, [order, userInfo, orderId, navigate]);
  return isLoading ? (
    <Loading />
  ) : error ? (
    <Message variant="danger">{error}</Message>
  ) : (
    <div>
      <Helmet>
        <title>Order {orderId}</title>
      </Helmet>
      <h1 className="my-4">Order {orderId}</h1>
      <Row>
        <Col md={8}>
          <Card className="mb-3">
            <Card.Body>
              <Card.Title>Shipping</Card.Title>
              <Card.Text>
                <strong>Name: </strong> {order?.shippingAddress?.fullName}{' '}
                <br />
                <strong>Address: </strong> {order?.shippingAddress?.address},{' '}
                {order?.shippingAddress?.city},{' '}
                {order?.shippingAddress?.postalCode},{' '}
                {order?.shippingAddress?.country}
              </Card.Text>
              {order?.isDelivered ? (
                <Message variant="success">
                  Delivered at {order?.deliveredAt}
                </Message>
              ) : (
                <Message variant="danger">Not Delivered</Message>
              )}
            </Card.Body>
          </Card>
          <Card className="mb-3">
            <Card.Body>
              <Card.Title>Payment</Card.Title>
              <Card.Text>
                <strong>Method: </strong> {order?.paymentMethod}
              </Card.Text>
              {order?.isPaid ? (
                <Message variant="success">Paid at ${order?.paidAt}</Message>
              ) : (
                <Message variant="danger">Not Paid</Message>
              )}
            </Card.Body>
          </Card>
          <Card className="mb-3">
            <Card.Body>
              <Card.Title>Items</Card.Title>
              <ListGroup variant="flush">
                {order?.orderItems?.map((item) => (
                  <ListGroup.Item key={item?._id}>
                    <Row className="align-items-center">
                      <Col md={6}>
                        <img
                          src={item?.image}
                          alt={item?.name}
                          className="img-fluid rounded img-thumbnail"
                        />{' '}
                        <Link to={`/product/${item?.slug}`}>{item?.name}</Link>
                      </Col>
                      <Col md={3}>
                        <span>{item?.quantity}</span>
                      </Col>
                      <Col>${item?.price}</Col>
                    </Row>
                  </ListGroup.Item>
                ))}
              </ListGroup>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="mb-3">
            <Card.Body>
              <Card.Title>Order Summary</Card.Title>
              <ListGroup variant="flush">
                <ListGroup.Item>
                  <Row>
                    <Col>Items</Col>
                    <Col>${order?.itemsPrice?.toFixed(2)}</Col>
                  </Row>
                </ListGroup.Item>
                <ListGroup.Item>
                  <Row>
                    <Col>Shipping</Col>
                    <Col>${order?.shippingPrice?.toFixed(2)}</Col>
                  </Row>
                </ListGroup.Item>
                <ListGroup.Item>
                  <Row>
                    <Col>Tax</Col>
                    <Col>${order?.taxPrice?.toFixed(2)}</Col>
                  </Row>
                </ListGroup.Item>
                <ListGroup.Item>
                  <Row>
                    <Col>
                      <strong>Order Total</strong>
                    </Col>
                    <Col>
                      <strong>${order?.totalPrice?.toFixed(2)}</strong>
                    </Col>
                  </Row>
                </ListGroup.Item>
              </ListGroup>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Order;
