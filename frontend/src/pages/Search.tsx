import axios from 'axios';
import { useState, useEffect, useReducer } from 'react';
import { searchReducer } from '../reducers/searchReducer';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import { getError } from '../utils';
import { Helmet } from 'react-helmet-async';
import { Message, Loading, Rating, Product } from '../components';
import { Row, Col, Button } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';

const prices = [
  {
    name: '$1 to $50',
    value: '1-50',
  },
  {
    name: '$51 to $200',
    value: '51-200',
  },
  {
    name: '$201 to $1000',
    value: '201-1000',
  },
];

const ratings = [
  {
    name: '4 stars & up',
    rating: 4,
  },
  {
    name: '3 stars & up',
    rating: 3,
  },
  {
    name: '2 stars & up',
    rating: 2,
  },
  {
    name: '1 stars & up',
    rating: 1,
  },
];

const Search = () => {
  const [{ isLoading, error, products, pages, countProducts }, dispatch] =
    useReducer(searchReducer, {
      isLoading: false,
      error: '',
      products: [],
      pages: 1,
      page: 1,
      countProducts: 0,
    });
  const navigate = useNavigate();
  const { search } = useLocation();
  const sp = new URLSearchParams(search);
  const category = sp.get('category') || 'all';
  const price = sp.get('price') || 'all';
  const query = sp.get('query') || 'all';
  const rating: number | string = sp.get('rating') || 'all';
  const order = sp.get('order') || 'newest';
  const page = sp.get('page') || '1';

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        dispatch({
          type: 'FETCH_REQUEST',
        });
        const { data } =
          await axios.get(`api/products/search?query=${query}&category=${category}&price=${price}
        &rating=${rating}&order=${order}&page=${page}`);
        dispatch({
          type: 'FETCH_SUCCESS',
          payload: data,
        });
      } catch (error) {
        dispatch({
          type: 'FETCH_FAIL',
          payload: getError(error),
        });
      }
    };

    fetchProducts();
  }, [query, category, price, rating, order, page, error]);

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
  }, [dispatch]);

  type Filter = {
    page?: number;
    category?: string;
    query?: string;
    rating?: number | string;
    price?: string;
    order?: string;
  };

  const getFilterUrl = (filter: Filter) => {
    const filterPage = filter.page || page;
    const filterCategory = filter.category || category;
    const filterQuery = filter.query || query;
    const filterRating = filter.rating || rating;
    const filterPrice = filter.price || price;
    const sortOrder = filter.order || order;
    return `/search?category=${filterCategory}&query=${filterQuery}&price=${filterPrice}&rating=${filterRating}&order=${sortOrder}&page=${filterPage}`;
  };
  return (
    <div>
      <Helmet>
        <title>Search Products</title>
      </Helmet>
      <Row>
        <Col md={3}>
          <h3>Department</h3>
          <div>
            <ul>
              <li>
                <Link
                  className={category === 'all' ? 'text-bold' : ''}
                  to={getFilterUrl({ category: 'all' })}
                >
                  Any
                </Link>
              </li>
              {categories.map((c) => (
                <li key={c}>
                  <Link
                    className={category === c ? 'text-bold' : ''}
                    to={getFilterUrl({ category: c })}
                  >
                    {c}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3>Price</h3>
            <ul>
              <li>
                <Link
                  className={price === 'all' ? 'text-bold' : ''}
                  to={getFilterUrl({ price: 'all' })}
                >
                  Any
                </Link>
              </li>
              {prices.map((p) => (
                <li key={p.value}>
                  <Link
                    className={price === p.value ? 'text-bold' : ''}
                    to={getFilterUrl({ price: p.value })}
                  >
                    {p.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3>Avg. Customer Review</h3>
            <ul>
              {ratings.map((r) => (
                <li key={r.name}>
                  <Link
                    //   @ts-ignore
                    className={+rating === r.rating ? 'text-bold' : ''}
                    to={getFilterUrl({ rating: r.rating })}
                  >
                    <Rating caption=" & up" rating={r.rating} />
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  //   @ts-ignore
                  className={rating === 'all' ? 'text-bold' : ''}
                  to={getFilterUrl({ rating: 'all' })}
                >
                  <Rating caption=" & up" rating={0} />
                </Link>
              </li>
            </ul>
          </div>
        </Col>
        <Col md={9}>
          {isLoading ? (
            <Loading />
          ) : error ? (
            <Message variant="danger">{error}</Message>
          ) : (
            <>
              <Row className="justify-content-between mb-3">
                <Col md={6}>
                  <div>
                    {countProducts === 0 ? 'No' : countProducts} Results
                    {query !== 'all' && ' : ' + query}{' '}
                    {category !== 'all' && ' : ' + category}{' '}
                    {price !== 'all' && ' : Price ' + price}{' '}
                    {rating !== 'all' && ' : Rating ' + rating + ' & up'}{' '}
                    {query !== 'all' ||
                    category !== 'all' ||
                    rating !== 'all' ||
                    price !== 'all' ? (
                      <Button
                        variant="light"
                        onClick={() => navigate('/search')}
                      >
                        {' '}
                        <i className="fas fa-times-circle"></i>
                      </Button>
                    ) : null}
                  </div>
                </Col>
                <Col className="text-end">
                  Sort by{' '}
                  <select
                    value={order}
                    onChange={(e) =>
                      navigate(getFilterUrl({ order: e.target.value }))
                    }
                  >
                    <option value="newest">Newest Arrivals</option>
                    <option value="lowest">Price: Low to High</option>
                    <option value="highest">Price: High to Low</option>
                    <option value="toprated">Avg. Customer Reviews</option>
                  </select>
                </Col>
              </Row>
              {products.length === 0 && (
                <Message variant="info">No Product Found</Message>
              )}
              <Row>
                {products.map((product) => (
                  <Col lg={4} sm={6} className="mb-3" key={product._id}>
                    <Product product={product} />
                  </Col>
                ))}
              </Row>
              <div>
                {[...Array(pages)].map((x, index) => (
                  <LinkContainer
                    key={index + 1}
                    className="mx-1"
                    to={getFilterUrl({ page: index + 1 })}
                  >
                    <Button
                      variant="light"
                      className={Number(page) === index + 1 ? 'text-bold' : ''}
                    >
                      {index + 1}
                    </Button>
                  </LinkContainer>
                ))}
              </div>
            </>
          )}
        </Col>
      </Row>
    </div>
  );
};

export default Search;
