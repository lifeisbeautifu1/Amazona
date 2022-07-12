import React, { useState, useEffect } from 'react';
import { Container, Form, Button, ListGroup } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { Helmet } from 'react-helmet-async';
import { getError } from '../utils';
import { useAppContext } from '../context';
import { Message, Loading } from '../components';
import { useNavigate, useParams } from 'react-router-dom';
import { IProduct } from '../interfaces';
import axios from 'axios';

const ProductEdit = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [uploadLoading, setUploadLoading] = useState(false);
  const [updateLoading, setUpdateLoading] = useState(false);
  const [error, setError] = useState('');
  const {
    state: { userInfo },
  } = useAppContext();
  const navigate = useNavigate();
  const { id: productId } = useParams();

  const [product, setProduct] = useState<IProduct>({} as IProduct);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setIsLoading(true);
        const { data } = await axios.get('/api/products/' + productId);
        setProduct((prevState) => ({
          ...prevState,
          name: data.name,
          slug: data.slug,
          price: data.price,
          image: data.image,
          images: data.images,
          category: data.category,
          countInStock: data.countInStock,
          brand: data.brand,
          description: data.description,
        }));
        setIsLoading(false);
      } catch (error) {
        setIsLoading(false);
        setError(getError(error));
      }
    };
    fetchProduct();
  }, [productId]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setUpdateLoading(true);

    try {
      await axios.patch(
        '/api/products/' + productId,
        {
          ...product,
        },
        {
          headers: {
            authorization: `Bearer ${userInfo?.token}`,
          },
        }
      );
      toast.success('Product updated successfully');
      navigate('/admin/products');
      setUpdateLoading(false);
    } catch (error) {
      setUpdateLoading(false);
      toast.error(getError(error));
    }
  };

  const handleUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    forImages?: boolean
  ) => {
    setUploadLoading(true);
    // @ts-ignore
    const file = e.target.files[0];
    const bodyFormData = new FormData();
    bodyFormData.append('file', file);
    try {
      const { data } = await axios.post('/api/upload', bodyFormData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          authorization: `Bearer ${userInfo?.token}`,
        },
      });
      setUploadLoading(false);
      if (forImages) {
        setProduct({
          ...product,
          images: [...product.images, data.secure_url],
        });
      } else {
        setProduct({
          ...product,
          image: data.secure_url,
        });
      }
      toast.success('Image uploaded successfully');
    } catch (error) {
      toast.error(getError(error));
      setUploadLoading(false);
    }
  };

  const deleteFile = async (fileName: string) => {
    setProduct({
      ...product,
      images: product.images.filter((img) => img !== fileName),
    });
    toast.success('Image removed successfully. Click update to apply it.');
  };

  return (
    <Container className="small-container">
      <Helmet>
        <title>Edit Product {productId}</title>
      </Helmet>
      {isLoading ? (
        <Loading />
      ) : error ? (
        <Message variant="danger">{error}</Message>
      ) : (
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3" controlId="name">
            <Form.Label>Name</Form.Label>
            <Form.Control
              value={product?.name}
              name="name"
              required
              onChange={(e) =>
                setProduct({ ...product, [e.target.name]: e.target.value })
              }
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="slug">
            <Form.Label>Slug</Form.Label>
            <Form.Control
              value={product?.slug}
              name="slug"
              required
              onChange={(e) =>
                setProduct({ ...product, [e.target.name]: e.target.value })
              }
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="price">
            <Form.Label>Price</Form.Label>
            <Form.Control
              value={product?.price}
              name="price"
              required
              onChange={(e) =>
                setProduct({ ...product, [e.target.name]: e.target.value })
              }
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="image">
            <Form.Label>Image File</Form.Label>
            <Form.Control
              value={product?.image}
              name="image"
              required
              onChange={(e) =>
                setProduct({ ...product, [e.target.name]: e.target.value })
              }
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="imageFile">
            <Form.Label>Upload Image</Form.Label>
            <Form.Control type="file" onChange={handleUpload} />
            {uploadLoading && <Loading />}
          </Form.Group>
          <Form.Group className="mb-3" controlId="additionalImage">
            <Form.Label>Additional Images</Form.Label>
            {product?.images?.length === 0 && (
              <Message variant="info">No image</Message>
            )}
            <ListGroup variant="flush">
              {product?.images?.map((img) => (
                <ListGroup.Item key={img}>
                  {img}
                  <Button variant="flush" onClick={() => deleteFile(img)}>
                    <i className="fa fa-times-circle"></i>
                  </Button>
                </ListGroup.Item>
              ))}
            </ListGroup>
          </Form.Group>
          <Form.Group className="mb-3" controlId="additionalImageFile">
            <Form.Label>Upload Additional Image</Form.Label>
            {/* @ts-ignore */}
            <Form.Control type="file" onChange={(e) => handleUpload(e, true)} />
            {uploadLoading && <Loading />}
          </Form.Group>
          <Form.Group className="mb-3" controlId="category">
            <Form.Label>Category</Form.Label>
            <Form.Control
              value={product?.category}
              name="category"
              required
              onChange={(e) =>
                setProduct({ ...product, [e.target.name]: e.target.value })
              }
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="brand">
            <Form.Label>Brand</Form.Label>
            <Form.Control
              value={product?.brand}
              name="brand"
              required
              onChange={(e) =>
                setProduct({ ...product, [e.target.name]: e.target.value })
              }
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="countInStock">
            <Form.Label>Count in Stock</Form.Label>
            <Form.Control
              value={product?.countInStock}
              name="countInStock"
              required
              onChange={(e) =>
                setProduct({ ...product, [e.target.name]: e.target.value })
              }
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="description">
            <Form.Label>Description</Form.Label>
            <Form.Control
              value={product?.description}
              name="description"
              required
              onChange={(e) =>
                setProduct({ ...product, [e.target.name]: e.target.value })
              }
            />
          </Form.Group>
          <div>
            <Button disabled={updateLoading} type="submit" variant="primary">
              Update
            </Button>
          </div>
        </Form>
      )}
    </Container>
  );
};

export default ProductEdit;
