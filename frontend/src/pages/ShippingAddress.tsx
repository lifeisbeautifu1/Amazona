import { CheckoutSteps } from '../components';
import { Form, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context';
import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { IShippingAddress } from '../interfaces';

const ShippingAddress = () => {
  const navigate = useNavigate();
  const { state, dispatch: ctxDispatch } = useAppContext();
  const {
    userInfo,
    cart: { shippingAddress },
  } = state;
  const [shippingAddressForm, setShippingAddressForm] =
    useState<IShippingAddress>({
      fullName: shippingAddress?.fullName || '',
      address: shippingAddress?.address || '',
      city: shippingAddress?.city || '',
      country: shippingAddress?.country || '',
      postalCode: shippingAddress?.postalCode || '',
    });

  useEffect(() => {
    if (!userInfo) {
      navigate('/signin?redirect=/shipping');
    }
  }, [userInfo, navigate]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    ctxDispatch({
      type: 'SAVE_SHIPPING_ADDRESS',
      payload: shippingAddressForm,
    });
    localStorage.setItem(
      'shippingAddress',
      JSON.stringify(shippingAddressForm)
    );
    navigate('/payment');
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setShippingAddressForm((prevState) => {
      return {
        ...prevState,
        [e.target.name]: e.target.value,
      };
    });
  };

  return (
    <div>
      <Helmet>
        <title>Shipping Address</title>
      </Helmet>
      <CheckoutSteps step1 step2 />
      <div className="container small-container">
        <h1 className="my-4">Shipping Address</h1>
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3" controlId="fullName">
            <Form.Label>Full Name</Form.Label>
            <Form.Control
              value={shippingAddressForm.fullName}
              onChange={handleChange}
              required
              name="fullName"
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="address">
            <Form.Label>Address</Form.Label>
            <Form.Control
              value={shippingAddressForm.address}
              onChange={handleChange}
              required
              name="address"
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="city">
            <Form.Label>City</Form.Label>
            <Form.Control
              value={shippingAddressForm.city}
              onChange={handleChange}
              required
              name="city"
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="postalCode">
            <Form.Label>Postal Code</Form.Label>
            <Form.Control
              value={shippingAddressForm.postalCode}
              onChange={handleChange}
              required
              name="postalCode"
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="country">
            <Form.Label>Country</Form.Label>
            <Form.Control
              value={shippingAddressForm.country}
              onChange={handleChange}
              required
              name="country"
            />
          </Form.Group>
          <div className="mb-3">
            <Button type="submit" variant="primary">
              Continue
            </Button>
          </div>
        </Form>
      </div>
    </div>
  );
};

export default ShippingAddress;
