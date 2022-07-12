import { Form, Button } from 'react-bootstrap';
import axios from 'axios';
import { useAppContext } from '../context';
import { Helmet } from 'react-helmet-async';
import { toast } from 'react-toastify';
import { getError } from '../utils';
import { useState } from 'react';

const Profile = () => {
  const {
    state: { userInfo },
    dispatch: ctxDispatch,
  } = useAppContext();

  const [name, setName] = useState(userInfo?.name);
  const [email, setEmail] = useState(userInfo?.email);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    try {
      const { data } = await axios.patch(
        '/api/users/profile',
        {
          name,
          email,
          password,
        },
        {
          headers: {
            authorization: `Bearer ${userInfo?.token}`,
          },
        }
      );
      ctxDispatch({
        type: 'USER_SIGNIN',
        payload: data,
      });
      localStorage.setItem('userInfo', JSON.stringify(data));
      toast.success('User successfully updated');
    } catch (error) {
      toast.error(getError(error));
    }
  };

  return (
    <div className="container small-container">
      <Helmet>
        <title>User Profile</title>
      </Helmet>
      <h1 className="my-4">Profile</h1>
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3" controlId="name">
          <Form.Label>Name</Form.Label>
          <Form.Control
            required
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </Form.Group>
        <Form.Group className="mb-3" controlId="email">
          <Form.Label>Email</Form.Label>
          <Form.Control
            required
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </Form.Group>
        <Form.Group className="mb-3" controlId="password">
          <Form.Label>Password</Form.Label>
          <Form.Control
            required
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </Form.Group>
        <Form.Group className="mb-3" controlId="confirm-password">
          <Form.Label>Confirm Password</Form.Label>
          <Form.Control
            required
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </Form.Group>
        <div className="mb-3">
          <Button variant="primary" type="submit">
            Update
          </Button>
        </div>
      </Form>
    </div>
  );
};

export default Profile;
