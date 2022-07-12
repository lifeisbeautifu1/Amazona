import { useParams, useNavigate, Link } from 'react-router-dom';
import React, { useReducer, useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { productReducer } from '../reducers/productReducer';
import {
  Row,
  Col,
  Badge,
  Button,
  ListGroup,
  Card,
  Form,
  FloatingLabel,
} from 'react-bootstrap';
import { Rating, Loading, Message } from '../components';
import { Helmet } from 'react-helmet-async';
import { getError } from '../utils';
import { useAppContext } from '../context';
import { toast } from 'react-toastify';

const Product = () => {
  const navigate = useNavigate();

  const [{ error, product, isLoading }, dispatch] = useReducer(productReducer, {
    isLoading: true,
    error: '',
    product: null,
  });

  const { slug } = useParams();

  const [loadingCreateReview, setLoadingCreateReview] = useState(false);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [selectedImage, setSelectedImage] = useState('');
  let reviewsRef = useRef<HTMLHeadingElement>({} as HTMLHeadingElement);

  useEffect(() => {
    const fetchProducts = async () => {
      dispatch({ type: 'FETCH_REQUEST' });
      try {
        const { data } = await axios.get('/api/products/slug/' + slug);
        dispatch({
          type: 'FETCH_SUCCESS',
          payload: data,
        });
        console.log(data);
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
  const { cart, userInfo } = state;

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

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!comment || !rating) {
      toast.error('Please enter comment and rating');
      return;
    }
    try {
      setLoadingCreateReview(true);
      const { data } = await axios.post(
        '/api/products/' + product?._id + '/reviews',
        {
          rating,
          comment,
          name: userInfo?.name,
        },
        {
          headers: {
            authorization: `Bearer ${userInfo?.token}`,
          },
        }
      );
      dispatch({
        type: 'FETCH_SUCCESS',
        payload: data.product,
      });
      window.scrollTo({
        behavior: 'smooth',
        top: reviewsRef?.current?.offsetTop,
      });
      setLoadingCreateReview(false);
    } catch (error) {
      toast.error(getError(error));
      setLoadingCreateReview(false);
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
          <img
            className="img-large"
            src={selectedImage || product?.image}
            alt={product?.name}
          />
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
              <Row xs={1} md={2} className="g-2">
                {[product?.image, ...product?.images!].map((img) => (
                  <Col key={img}>
                    <Card>
                      <Button
                        className="thumbnail"
                        type="button"
                        variant="light"
                        onClick={() => setSelectedImage(img!)}
                      >
                        <Card.Img variant="top" src={img} alt="product" />
                      </Button>
                    </Card>
                  </Col>
                ))}
              </Row>
            </ListGroup.Item>
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
      <div className="my-3">
        <h1 ref={reviewsRef}>Reviews</h1>
        <div className="mb-3">
          {product?.reviews?.length === 0 && (
            <Message variant="info">There is no reviews</Message>
          )}
        </div>
        <ListGroup>
          {product?.reviews?.map((review) => (
            <ListGroup.Item key={review._id}>
              <strong>{review.name}</strong>
              <Rating rating={review.rating} caption=" "></Rating>
              <p>{review.createdAt.substring(0, 10)}</p>
              <p>{review.comment}</p>
            </ListGroup.Item>
          ))}
        </ListGroup>
        <div className="my-3">
          {userInfo ? (
            <Form onSubmit={handleSubmit}>
              <h1>Write a customer review</h1>
              <Form.Group className="mb-3" controlId="rating">
                <Form.Label>Rating</Form.Label>
                <Form.Select
                  aria-label="Rating"
                  value={rating}
                  onChange={(e) => setRating(+e.target.value)}
                >
                  <option value="">Select...</option>
                  <option value="1">1- Poor</option>
                  <option value="2">2- Fair</option>
                  <option value="3">3- Good</option>
                  <option value="4">4- Very Good</option>
                  <option value="5">5- Excellent</option>
                </Form.Select>
              </Form.Group>
              <FloatingLabel
                controlId="floatingTextarea"
                label="Comments"
                className="mb-3"
              >
                <Form.Control
                  as="textarea"
                  placeholder="Leave a comment here"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                />
              </FloatingLabel>
              <div className="mb-3">
                <Button disabled={loadingCreateReview} type="submit">
                  Submit
                </Button>
                {loadingCreateReview && <Loading />}
              </div>
            </Form>
          ) : (
            <Message variant="info">
              Please{' '}
              <Link to={`/signin?redirect=/product/${product?.slug}`}>
                Sign In
              </Link>{' '}
              to write a review
            </Message>
          )}
        </div>
      </div>
    </div>
  );
};

export default Product;
