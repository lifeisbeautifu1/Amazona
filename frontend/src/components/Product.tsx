import { IProduct } from '../interfaces';
import { Link } from 'react-router-dom';
import { useAppContext } from '../context';
import axios from 'axios';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import React from 'react';
import { Rating } from '../components';

interface ProductProps {
  product: IProduct;
}

const Product: React.FC<ProductProps> = ({ product }) => {
  const { dispatch: cartDispatch, state } = useAppContext();
  const { cart } = state;
  const addToCart = async () => {
    const itemExist = cart.cartItems.find((item) => item._id === product?._id);
    const quantity = itemExist ? itemExist.quantity + 1 : 1;
    const { data } = await axios.get('/api/products/' + product?._id);
    if (data.countInStock < quantity) {
      window.alert('Sorry, the product is out of stock.');
    } else {
      cartDispatch({
        type: 'ADD_TO_CART',
        payload: { ...product!, quantity },
      });
    }
  };
  return (
    <Card key={product.slug}>
      <Link to={`/product/${product.slug}`}>
        <img src={product.image} className="card-img-top" alt={product.name} />
      </Link>
      <Card.Body className="product-info">
        <Link to={`/product/${product.slug}`}>
          <Card.Title>{product.name}</Card.Title>
        </Link>
        <Rating rating={product.rating} numReviews={product.numReviews} />
        <Card.Text>${product.price}</Card.Text>
        {product?.countInStock === 0 ? (
          <Button disabled variant="light">
            Out of Stock
          </Button>
        ) : (
          <Button onClick={addToCart}>Add to Cart</Button>
        )}
      </Card.Body>
    </Card>
  );
};

export default Product;
