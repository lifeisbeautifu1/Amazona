import { useParams, useNavigate } from 'react-router-dom';
import { useReducer, useEffect } from 'react';
import axios from 'axios';
import { productReducer } from '../reducers/productReducer';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Badge from 'react-bootstrap/Badge';
import Button from 'react-bootstrap/Button';
import ListGroup from 'react-bootstrap/ListGroup';
import Card from 'react-bootstrap/Card';
import { Rating, Loading, Message } from '../components';
import { Helmet } from 'react-helmet-async';
import { getError } from '../utils';
import { useAppContext } from '../context';

const Product = () => {
  const navigate = useNavigate();

  const [{ error, product, isLoading }, dispatch] = useReducer(productReducer, {
    isLoading: true,
    error: '',
    product: null,
  });

  const { slug } = useParams();

  useEffect(() => {
    const fetchProducts = async () => {
      dispatch({ type: 'FETCH_REQUEST' });
      try {
        const { data } = await axios.get('/api/products/slug/' + slug);
        dispatch({
          type: 'FETCH_SUCCESS',
          payload: data,
        });
      } catch (error) {
        dispatch({
          type: 'FETCH_FAIL',
          // @ts-ignore
          payload: getError(error),
        });
      }
    };
    fetchProducts();
  }, [slug]);

  const { dispatch: cartDispatch, state } = useAppContext();
  const { cart } = state;
  const addToCart = async () => {
    const itemExist = cart.cartItems.find((item) => item._id === product?._id);
    const quantity = itemExist ? itemExist.quantity + 1 : 1;
    const { data } = await axios.get('/api/products/' + product?._id);
    if (data.countInStock < quantity) {
      window.alert('Sorry, the product is out of stock.');
    } else {
      cartDispatch({
        type: 'ADD_TO_CART',
        payload: { ...product!, quantity },
      });
      navigate('/cart');
    }
  };

  return isLoading ? (
    <Loading />
  ) : error ? (
    <Message variant="danger">{error}</Message>
  ) : (
    <div>
      <Helmet>
        <title>{product?.name}</title>
      </Helmet>
      <Row>
        <Col md={6}>
          <img className="img-large" src={product?.image} alt={product?.name} />
        </Col>
        <Col md={3}>
          <ListGroup variant="flush">
            <ListGroup.Item>
              <h1>{product?.name}</h1>
            </ListGroup.Item>
            <ListGroup.Item>
              <Rating
                numReviews={product?.numReviews!}
                rating={product?.rating!}
              />
            </ListGroup.Item>
            <ListGroup.Item>Price: ${product?.price}</ListGroup.Item>
            <ListGroup.Item>
              Description:
              <p>{product?.description}</p>
            </ListGroup.Item>
          </ListGroup>
        </Col>
        <Col md={3}>
          <Card>
            <Card.Body>
              <ListGroup.Item>
                <Row>
                  <Col>Price:</Col>
                  <Col>${product?.price}</Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Status:</Col>
                  <Col>
                    {product?.countInStock! > 0 ? (
                      <Badge bg="success">In Stock</Badge>
                    ) : (
                      <Badge bg="danger">Unavailable</Badge>
                    )}
                  </Col>
                </Row>
              </ListGroup.Item>
              {product?.countInStock! > 0 && (
                <ListGroup.Item>
                  <div className="d-grid">
                    <Button variant="primary" onClick={addToCart}>
                      Add to Cart
                    </Button>
                  </div>
                </ListGroup.Item>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Product;
