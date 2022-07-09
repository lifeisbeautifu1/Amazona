import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAppContext } from '../context';
import { Helmet } from 'react-helmet-async';
import { Container, Button, Form } from 'react-bootstrap';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useState, useEffect } from 'react';
import { getError } from '../utils';

const Signup = () => {
  const { search } = useLocation();
  const navigate = useNavigate();

  const redirectURL = new URLSearchParams(search).get('redirect');
  const redirect = redirectURL ? redirectURL : '/';

  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [email, setEmail] = useState('');

  const { state, dispatch: ctxDispatch } = useAppContext();

  const { userInfo } = state;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error('Passwords do not match!');
      return;
    }
    try {
      const { data } = await axios.post('/api/users/signup', {
        name,
        email,
        password,
      });
      ctxDispatch({
        type: 'USER_SIGNIN',
        payload: data,
      });
      localStorage.setItem('userInfo', JSON.stringify(data));
      navigate(redirect || '/');
    } catch (error) {
      toast.error(getError(error));
    }
  };

  useEffect(() => {
    if (userInfo) navigate(redirect);
  }, [navigate, userInfo, redirect]);

  return (
    <Container className="small-container">
      <Helmet>
        <title>Sign Up</title>
      </Helmet>
      <h1 className="my-3 text-center">Sign Up</h1>
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3">
          <Form.Label>Name</Form.Label>
          <Form.Control
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Email</Form.Label>
          <Form.Control
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Confirm password</Form.Label>
          <Form.Control
            type="password"
            required
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </Form.Group>
        <div className="mb-3">
          <Button type="submit">Sign Up</Button>
        </div>
        <div className="mb-3">
          Already have an account?{' '}
          <Link to={`/signin?redirect=${redirect}`}>Sign In</Link>
        </div>
      </Form>
    </Container>
  );
};

export default Signup;
