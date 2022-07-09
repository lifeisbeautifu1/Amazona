import React from 'react';
import { Row, Col } from 'react-bootstrap';

type CheckoutStepsProps = {
  step1?: boolean;
  step2?: boolean;
  step3?: boolean;
  step4?: boolean;
};

const CheckoutSteps: React.FC<CheckoutStepsProps> = (props) => {
  return (
    <Row className="checkout-steps">
      <Col className={props.step1 ? 'active' : ''}>Sign In</Col>
      <Col className={props.step2 ? 'active' : ''}>Shipping</Col>
      <Col className={props.step3 ? 'active' : ''}>Payment</Col>
      <Col className={props.step4 ? 'active' : ''}>Place order</Col>
    </Row>
  );
};

export default CheckoutSteps;
