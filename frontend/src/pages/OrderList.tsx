import axios from 'axios';
import { Loading, Message } from '../components';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Button } from 'react-bootstrap';
import { useAppContext } from '../context';
import { getError } from '../utils';
import { IOrder } from '../interfaces';
import { toast } from 'react-toastify';

const OrderList = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [orders, setOrders] = useState<IOrder[]>([]);

  const navigate = useNavigate();
  const {
    state: { userInfo },
  } = useAppContext();

  const [isLoadingDelete, setIsLoadingDelete] = useState(false);
  const [deleteSuccess, setDeleteSuccess] = useState(false);
  const handleDelete = async (order: IOrder) => {
    window.confirm('Are you user you want to delete order?');
    try {
      setIsLoadingDelete(true);
      setDeleteSuccess(false);
      await axios.delete('/api/orders/' + order?._id, {
        headers: {
          authorization: `Bearer ${userInfo?.token}`,
        },
      });
      setDeleteSuccess(true);
      setIsLoadingDelete(false);
    } catch (error) {
      toast.error(getError(error));
      setDeleteSuccess(false);
      setIsLoadingDelete(false);
    }
  };

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setIsLoading(true);
        const { data } = await axios.get('/api/orders/', {
          headers: {
            authorization: `Bearer ${userInfo?.token}`,
          },
        });
        setOrders(data);
        console.log(data);
        setIsLoading(false);
      } catch (error) {
        setError(getError(error));
        setIsLoading(false);
      }
    };
    if (deleteSuccess) {
      setDeleteSuccess(false);
    } else {
      fetchOrders();
    }
  }, [userInfo, deleteSuccess]);

  return (
    <div>
      <Helmet>
        <title>Orders</title>
      </Helmet>
      <h1>Orders</h1>
      {isLoadingDelete && <Loading />}
      {isLoading ? (
        <Loading />
      ) : error ? (
        <Message variant="danger">{error}</Message>
      ) : (
        <table className="table table-hover text-center">
          <thead>
            <tr>
              <th>ID</th>
              <th>USER</th>
              <th>DATE</th>
              <th>TOTAl</th>
              <th>PAID</th>
              <th>DELIVERED</th>
              <th>ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order._id}>
                <td>{order._id}</td>
                <td>{order?.user ? order?.user?.name : 'DELETED USER'}</td>
                <td>{order?.createdAt.substring(0, 10)}</td>
                <td>{order?.totalPrice.toFixed(2)}</td>
                <td>{order?.isPaid ? order?.paidAt.substring(0, 10) : 'NO'}</td>
                <td>
                  {order?.isDelivered
                    ? order?.deliveredAt.substring(0, 10)
                    : 'NO'}
                </td>
                <td>
                  <Button
                    variant="light"
                    type="button"
                    onClick={() => navigate('/order/' + order?._id)}
                  >
                    Details
                  </Button>{' '}
                  <Button
                    variant="light"
                    type="button"
                    onClick={() => handleDelete(order)}
                  >
                    Delete
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default OrderList;
