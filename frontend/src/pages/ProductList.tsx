import { useEffect, useReducer, useState } from 'react';
import { Message, Loading } from '../components';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAppContext } from '../context';
import { searchReducer } from '../reducers/searchReducer';
import { getError } from '../utils';
import { Row, Col, Button } from 'react-bootstrap';
import { IProduct } from '../interfaces';
import axios from 'axios';
import { toast } from 'react-toastify';

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
  const { search } = useLocation();
  const sp = new URLSearchParams(search);
  const page = sp.get('page') || 1;
  const navigate = useNavigate();
  const [createLoading, setCreateLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [successDelete, setSuccessDelete] = useState(false);

  const handleCreate = async () => {
    window.confirm('Are you sure you want to create product?');
    setCreateLoading(true);
    try {
      const { data } = await axios.post(
        '/api/products',
        {},
        {
          headers: {
            authorization: `Bearer ${userInfo?.token}`,
          },
        }
      );
      toast.success('Product successfully created!');
      navigate('/admin/product/' + data.product._id);
      setCreateLoading(false);
    } catch (error) {
      toast.error(getError(error));
      setCreateLoading(false);
    }
  };

  const handleDelete = async (product: IProduct) => {
    window.confirm('Are you sure you want to delete product?');
    setDeleteLoading(true);
    setSuccessDelete(false);
    try {
      await axios.delete('/api/products/' + product._id, {
        headers: {
          authorization: `Bearer ${userInfo?.token}`,
        },
      });
      setDeleteLoading(false);
      setSuccessDelete(true);
      toast.success('Product successfully deleted!');
    } catch (error) {
      toast.error(getError(error));
      setSuccessDelete(false);
      setDeleteLoading(false);
    }
  };

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
    if (successDelete) {
      setSuccessDelete(false);
    } else {
      fetchProducts();
    }
  }, [userInfo, page, successDelete]);
  return (
    <div>
      <Row>
        <Col>
          <h1>Products</h1>
        </Col>
        <Col className="d-flex justify-content-end align-items-center">
          <div>
            <Button type="button" onClick={handleCreate} variant="primary">
              Create
            </Button>
          </div>
        </Col>
      </Row>
      {createLoading && <Loading />}
      {deleteLoading && <Loading />}
      {isLoading ? (
        <Loading />
      ) : error ? (
        <Message variant="danger">{error}</Message>
      ) : (
        <>
          <table className="table table-hover text-center">
            <thead>
              <tr>
                <th>ID</th>
                <th>NAME</th>
                <th>PRICE</th>
                <th>CATEGORY</th>
                <th>BRAND</th>
                <th>ACTIONS</th>
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
                  <td>
                    <Button
                      variant="light"
                      type="button"
                      onClick={() => navigate('/admin/product/' + product._id)}
                    >
                      Edit
                    </Button>{' '}
                    <Button
                      variant="light"
                      type="button"
                      onClick={() => handleDelete(product)}
                    >
                      Delete
                    </Button>
                  </td>
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
