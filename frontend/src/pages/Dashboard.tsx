import { useState, useEffect } from 'react';
import { useAppContext } from '../context';
import { Chart } from 'react-google-charts';
import { getError } from '../utils';
import { Loading, Message } from '../components';
import { Row, Col, Card } from 'react-bootstrap';
import axios from 'axios';

interface ISummary {
  users: { _id: null; numUsers: number }[];
  orders: { _id: null; numOrders: number; totalSales: number }[];
  dailyOrders: { _id: string; orders: number; sales: number }[];
  productCategories: { _id: string; count: number }[];
}

const Dashboard = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [summary, setSummary] = useState({} as ISummary);
  const {
    state: { userInfo },
  } = useAppContext();

  useEffect(() => {
    const fetchSummary = async () => {
      setIsLoading(true);
      try {
        const { data } = await axios.get('/api/orders/summary', {
          headers: {
            authorization: `Bearer ${userInfo?.token}`,
          },
        });
        setSummary(data);
        setIsLoading(false);
      } catch (error) {
        setError(getError(error));
        setIsLoading(false);
      }
    };
    fetchSummary();
  }, [userInfo]);
  let sales: any = [];
  if (summary?.dailyOrders) {
    sales = summary?.dailyOrders?.map((x) => [x?._id, x?.sales]);
  }
  let categories: any = [];
  if (summary?.productCategories) {
    categories = summary?.productCategories?.map((x) => [x?._id, x?.count]);
  }
  // console.log(sales, categories);
  return (
    <div>
      <h1>Dashboard</h1>
      {isLoading ? (
        <Loading />
      ) : error ? (
        <Message variant="danger">{error}</Message>
      ) : (
        <>
          <Row>
            <Col md={4}>
              <Card>
                <Card.Body>
                  <Card.Title>
                    {summary?.users && summary?.users[0]
                      ? summary?.users[0].numUsers
                      : 0}
                  </Card.Title>
                  <Card.Text> Users</Card.Text>
                </Card.Body>
              </Card>
            </Col>
            <Col md={4}>
              <Card>
                <Card.Body>
                  <Card.Title>
                    {summary?.orders && summary?.users[0]
                      ? summary?.orders[0].numOrders
                      : 0}
                  </Card.Title>
                  <Card.Text> Orders</Card.Text>
                </Card.Body>
              </Card>
            </Col>
            <Col md={4}>
              <Card>
                <Card.Body>
                  <Card.Title>
                    $
                    {summary?.orders && summary?.users[0]
                      ? summary?.orders[0].totalSales.toFixed(2)
                      : 0}
                  </Card.Title>
                  <Card.Text> Orders</Card.Text>
                </Card.Body>
              </Card>
            </Col>
          </Row>
          <div className="my-3">
            <h2>Sales</h2>
            {summary?.dailyOrders?.length === 0 ? (
              <Message variant="info">No Sale</Message>
            ) : (
              <Chart
                width="100%"
                height="400px"
                chartType="AreaChart"
                loader={<div>Loading Chart...</div>}
                data={[['Date', 'Sales'], ...sales]}
              ></Chart>
            )}
          </div>
          <div className="my-3">
            <h2>Categories</h2>
            {summary?.productCategories?.length === 0 ? (
              <Message variant="info">No Category</Message>
            ) : (
              <Chart
                width="100%"
                height="400px"
                chartType="PieChart"
                loader={<div>Loading Chart...</div>}
                data={[['Date', 'Sales'], ...categories]}
              ></Chart>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default Dashboard;
