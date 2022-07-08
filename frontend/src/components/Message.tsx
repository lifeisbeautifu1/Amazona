import React from 'react';
import Alert from 'react-bootstrap/Alert';

interface MessageProps {
  variant: 'success' | 'info' | 'warning' | 'danger';
  children: React.ReactNode;
}

const Message: React.FC<MessageProps> = ({ variant, children }) => {
  return <Alert variant={variant}>{children}</Alert>;
};

export default Message;
