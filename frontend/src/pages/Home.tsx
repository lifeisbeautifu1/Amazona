import axios from 'axios';
import { useReducer, useEffect } from 'react';
import { Product, Loading, Message } from '../components';
import { productsReducer } from '../reducers/productsReducer';
import { Row, Col } from 'react-bootstrap';
import { Helmet } from 'react-helmet-async';

const Home = () => {
  const [{ error, products, isLoading }, dispatch] = useReducer(
    productsReducer,
    {
      isLoading: true,
      error: '',
      products: [],
    }
  );
  useEffect(() => {
    const fetchProducts = async () => {
      dispatch({ type: 'FETCH_REQUEST' });
      try {
        const { data } = await axios.get('/api/products');
        dispatch({
          type: 'FETCH_SUCCESS',
          payload: data,
        });
      } catch (error) {
        dispatch({
          type: 'FETCH_FAIL',
          // @ts-ignore
          payload: error.message,
        });
      }
    };
    fetchProducts();
  }, []);
  return (
    <main>
      <Helmet>
        <title>Amazona</title>
      </Helmet>
      <h1>Featured products</h1>
      <div className="products">
        {isLoading ? (
          <Loading />
        ) : error ? (
          <Message variant="danger">{error}</Message>
        ) : (
          <Row>
            {products.map((product) => (
              <Col key={product.slug} sm={6} md={4} lg={3} className="mb-3">
                <Product product={product} />
              </Col>
            ))}
          </Row>
        )}
      </div>
    </main>
  );
};

export default Home;
