import axios from 'axios';
import { useState, useEffect } from 'react';
import { getError } from '../utils';
import { useAppContext } from '../context';
import { Helmet } from 'react-helmet-async';
import { Loading, Message } from '../components';
import { IUserInfo } from '../interfaces';
import { useNavigate } from 'react-router-dom';
import { Button } from 'react-bootstrap';
import { toast } from 'react-toastify';

const UserList = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteSuccess, setDeleteSuccess] = useState(false);
  const [error, setError] = useState('');
  const [users, setUsers] = useState<IUserInfo[]>([]);
  const {
    state: { userInfo },
  } = useAppContext();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setIsLoading(true);
        const { data } = await axios.get('/api/users/', {
          headers: {
            authorization: `Bearer ${userInfo?.token}`,
          },
        });
        setUsers(data);
        setIsLoading(false);
      } catch (error) {
        setError(getError(error));
        setIsLoading(false);
      }
    };
    if (deleteSuccess) {
      setDeleteSuccess(false);
    } else {
      fetchUsers();
    }
  }, [userInfo, deleteSuccess]);

  const navigate = useNavigate();

  const handleDelete = async (user: IUserInfo) => {
    window.confirm('Are you sure to delete user?');
    try {
      setDeleteLoading(false);
      await axios.delete('/api/users/' + user._id, {
        headers: {
          authorization: `Bearer ${userInfo?.token}`,
        },
      });
      setDeleteLoading(true);
      setDeleteSuccess(true);
    } catch (error) {
      toast.error(getError(error));
      setDeleteSuccess(false);
      setDeleteLoading(false);
    }
  };

  return (
    <div>
      <Helmet>
        <title>Users</title>
      </Helmet>
      <h1>Users</h1>
      {}
      {isLoading ? (
        <Loading />
      ) : error ? (
        <Message variant="danger">{error}</Message>
      ) : (
        <table className="table table-hover text-center">
          <thead>
            <tr>
              <td>ID</td>
              <td>NAME</td>
              <td>EMAIL</td>
              <td>IS ADMIN</td>
              <td>ACTIONS</td>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user?._id}>
                <td>{user._id}</td>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>{user.isAdmin ? 'YES' : 'NO'}</td>
                <td>
                  <Button
                    type="button"
                    variant="light"
                    onClick={() => navigate('/admin/user/' + user._id)}
                  >
                    Edit
                  </Button>{' '}
                  <Button
                    type="button"
                    variant="light"
                    onClick={() => handleDelete(user)}
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

export default UserList;
