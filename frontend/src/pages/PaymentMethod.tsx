import { useState, useEffect } from 'react';
import { useAppContext } from '../context';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
import { Button, Form } from 'react-bootstrap';
import { CheckoutSteps } from '../components';

const PaymentMethod = () => {
  const navigate = useNavigate();
  const { state, dispatch: ctxDispatch } = useAppContext();
  const { shippingAddress, paymentMethod } = state.cart;
  const [paymentMethodForm, setPaymentMethodForm] = useState(
    paymentMethod || 'PayPal'
  );

  useEffect(() => {
    if (!shippingAddress?.address) {
      navigate('/shipping');
    }
  }, [shippingAddress, navigate]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    ctxDispatch({
      type: 'SAVE_PAYMENT_METHOD',
      payload: paymentMethodForm,
    });
    localStorage.setItem('paymentMethod', paymentMethodForm);
    navigate('/placeorder');
  };
  return (
    <div>
      <Helmet>
        <title>Payment Method</title>
      </Helmet>
      <CheckoutSteps step1 step2 step3 />
      <div className="container small-container">
        <h1 className="my-4">Payment Method</h1>
        <Form onSubmit={handleSubmit}>
          <div className="mb-3">
            <Form.Check
              type="radio"
              id="PayPal"
              label="PayPal"
              value="PayPal"
              checked={paymentMethodForm === 'PayPal'}
              onChange={(e) => setPaymentMethodForm(e.target.value)}
            />
          </div>
          <div className="mb-3">
            <Form.Check
              type="radio"
              id="Stripe"
              label="Stripe"
              value="Stripe"
              checked={paymentMethodForm === 'Stripe'}
              onChange={(e) => setPaymentMethodForm(e.target.value)}
            />
          </div>
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

export default PaymentMethod;
