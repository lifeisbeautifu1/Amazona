import { useEffect, useReducer } from 'react';
import { Message, Loading } from '../components';
import { Link, useLocation } from 'react-router-dom';
import { useAppContext } from '../context';
import { searchReducer } from '../reducers/searchReducer';
import { getError } from '../utils';
import axios from 'axios';

const ProductList = () => {
  const [{ error, pages, products, isLoading }, dispatch] = useReducer(
    searchReducer,
    {
      products: [],
      page: 1,
      pages: 1,
      countProducts: 0,
      isLoading: false,
      error: '',
    }
  );
  const {
    state: { userInfo },
  } = useAppContext();
  const { search, pathname } = useLocation();
  const sp = new URLSearchParams(search);
  const page = sp.get('page') || 1;

  useEffect(() => {
    const fetchProducts = async () => {
      dispatch({ type: 'FETCH_REQUEST' });
      try {
        const { data } = await axios.get(`/api/products/admin?page=${page}`, {
          headers: {
            authorization: `Bearer ${userInfo?.token}`,
          },
        });
        console.log(data);
        dispatch({ type: 'FETCH_SUCCESS', payload: data });
      } catch (error) {
        dispatch({ type: 'FETCH_FAIL', payload: getError(error) });
      }
    };
    fetchProducts();
  }, [userInfo, page]);
  return (
    <div>
      <h1>Products</h1>
      {isLoading ? (
        <Loading />
      ) : error ? (
        <Message variant="danger">{error}</Message>
      ) : (
        <>
          <table className="table table-hover">
            <thead>
              <tr>
                <th>ID</th>
                <th>NAME</th>
                <th>PRICE</th>
                <th>CATEGORY</th>
                <th>BRAND</th>
              </tr>
            </thead>
            <tbody>
              {products?.map((product) => (
                <tr key={product._id}>
                  <td>{product._id}</td>
                  <td>{product.name}</td>
                  <td>{product.price}</td>
                  <td>{product.category}</td>
                  <td>{product.brand}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div>
            {[...Array(pages)].map((x, index) => (
              <Link
                key={index}
                className={+page === index + 1 ? 'btn text-bold' : 'btn'}
                to={`/admin/products?page=${index + 1}`}
              >
                {index + 1}
              </Link>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default ProductList;
