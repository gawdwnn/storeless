import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import Button from "../components/Button";
import Spinner from '../components/Spinner'

import { useProductsContext } from "../state/product-context";
import { Product } from "../types";
import PageNotFound from "./PageNotFound";

interface Props {}

const ProductDetail: React.FC<Props> = () => {
  const [product, setProduct] = useState<Product | undefined>();
  const { productsState } = useProductsContext();
  const { products, loading, error } = productsState;

  const params = useParams() as { productId: string }

  useEffect(() => {
    const prod = products.All.find((item) => item.id === params.productId);
    if (prod) setProduct(prod);
    else setProduct(undefined);
  }, [params, products.All]);

  if (loading) return <Spinner color='grey' width={50} height={50} />

  if (!loading && error) return <h2 className='header'>{error}</h2>

  if (!product) return <PageNotFound />

  return (
    <div className="page--product-detail">
      <div className="product-detail__section">
        <img src={product.imageUrl} alt={product.title} className="product-image" />
      </div>
      <div className="product-detail__section">
        <div className="product-detail__sub-section">
          <h3 className="header">{product.title}</h3>
          <p className="paragraph">{product.description}</p>
        </div>
        <div className="product-detail__sub-section">
          <p className="paragraph">
            Price: <span className="paragraph--orange">${product.price.toFixed(2)}</span>
          </p>
        </div>
        <div className="product-detail__sub-section product-detail__sub-section--stock">
          <p className="paragraph">
            Availability: <span className="paragraph--success">In stock</span>
          </p>
        </div>
        <div className="product-detail__sub-section quantity-control">
          <div className="qty-action">
            <FontAwesomeIcon icon={["fas", "minus"]} size="xs" color="grey" />
          </div>
          <div className="qty-action qty-action--qty">
            <p className="paragraph">1</p>
          </div>
          <div className="qty-action">
            <FontAwesomeIcon icon={["fas", "plus"]} size="xs" color="grey" />
          </div>
        </div>
        <Button>Add to cart</Button>
      </div>
    </div>
  );
};

export default ProductDetail;
