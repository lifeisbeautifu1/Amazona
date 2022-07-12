import axios from 'axios';
import { Container, Form, Button } from 'react-bootstrap';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Helmet } from 'react-helmet-async';
import { getError } from '../utils';
import { useAppContext } from '../context';
import { Loading, Message } from '../components';
import React, { useState, useEffect } from 'react';

const EditUser = () => {
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [updateLoading, setUpdateLoading] = useState(false);
  const navigate = useNavigate();
  const { id: userId } = useParams();
  const {
    state: { userInfo },
  } = useAppContext();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setIsLoading(true);
        const { data } = await axios.get('/api/users/' + userId, {
          headers: {
            authorization: `Bearer ${userInfo?.token}`,
          },
        });
        setName(data.name);
        setEmail(data.email);
        setIsAdmin(data.isAdmin);
        setIsLoading(false);
      } catch (error) {
        setError(getError(error));
        setIsLoading(false);
      }
    };
    fetchUser();
  }, [userInfo, userId]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      setUpdateLoading(true);
      await axios.patch(
        '/api/users/' + userId,
        {
          name,
          email,
          isAdmin,
        },
        {
          headers: {
            authorization: `Bearer ${userInfo?.token}`,
          },
        }
      );
      setUpdateLoading(false);
      toast.success('User successfully updated');
      navigate('/admin/users');
    } catch (error) {
      toast.error(getError(error));
      setUpdateLoading(false);
    }
  };

  return (
    <Container className="small-container">
      <Helmet>
        <title>Update User</title>
      </Helmet>
      <h1>Update user {userId}</h1>
      {isLoading ? (
        <Loading />
      ) : error ? (
        <Message variant="danger">{error}</Message>
      ) : (
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3" controlId="name">
            <Form.Label>Name</Form.Label>
            <Form.Control
              value={name}
              required
              onChange={(e) => setName(e.target.value)}
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="email">
            <Form.Label>Email</Form.Label>
            <Form.Control
              value={email}
              required
              type="email"
              onChange={(e) => setEmail(e.target.value)}
            />
          </Form.Group>
          <Form.Check
            type="checkbox"
            label="isAdmin"
            id="isAdmin"
            className="mb-3"
            onChange={(e) => setIsAdmin(e.target.checked)}
            checked={isAdmin}
          />
          <div className="mb-3">
            <Button disabled={isLoading} type="submit" variant="primary">
              Update
            </Button>
            {isLoading && <Loading />}
          </div>
        </Form>
      )}
    </Container>
  );
};

export default EditUser;
