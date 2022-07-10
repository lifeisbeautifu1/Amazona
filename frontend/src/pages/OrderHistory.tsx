import axios from 'axios';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useAppContext } from '../context';
import { getError } from '../utils';
import { Message, Loading } from '../components';
import { IOrder } from '../interfaces';
import { Button } from 'react-bootstrap';

const OrderHistory = () => {
  const navigate = useNavigate();
  const {
    state: { userInfo },
  } = useAppContext();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(false);
  const [orders, setOrders] = useState<IOrder[]>([]);

  useEffect(() => {
    const fetchOrders = async () => {
      setIsLoading(true);
      try {
        const { data } = await axios.get('/api/orders/mine', {
          headers: {
            authorization: `Bearer ${userInfo?.token}`,
          },
        });
        setOrders(data.orders);
        setIsLoading(false);
      } catch (error) {
        setError(getError(error));
        setIsLoading(false);
      }
    };
    fetchOrders();
  }, [userInfo]);
  return (
    <div>
      <Helmet>
        <title>Order History</title>
      </Helmet>
      <h1 className="my-4">Order History</h1>
      {isLoading ? (
        <Loading />
      ) : error ? (
        <Message variant="danger">{error}</Message>
      ) : (
        <table className="table">
          <thead>
            <tr>
              <th>ID</th>
              <th>DATE</th>
              <th>TOTAL</th>
              <th>PAID</th>
              <th>DELIVERED</th>
              <th>ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {orders?.map((order) => (
              <tr key={order?._id}>
                <td>{order?._id}</td>
                <td>{order?.createdAt.substring(0, 10)}</td>
                <td>{order?.totalPrice.toFixed(2)}</td>
                <td>{order?.isPaid ? order?.paidAt.substring(0, 10) : 'No'}</td>
                <td>
                  {order?.isDelivered
                    ? order?.deliveredAt.substring(0, 10)
                    : 'No'}
                </td>
                <td>
                  <Button
                    type="button"
                    variant="light"
                    onClick={() => navigate('/order/' + order?._id)}
                  >
                    Details
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

export default OrderHistory;
