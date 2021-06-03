import React, { useEffect } from 'react';
import { useHistory, useLocation } from 'react-router';
import ProductItem from '../components/Products/ProductItem';
import { products } from '../data/products';
import { useAuthContext } from '../state/auth-context';
import { useModalContext } from '../state/modal-context';

interface Props {}

const Index: React.FC<Props> = () => {
  const { setModalType } = useModalContext();
  // const { state } = useLocation<{ from: string }>();
  const history = useHistory<{ from: string }>();
  const { state } = history.location;
  const { authState } = useAuthContext();
  const { authUser, signoutRedirect } = authState;

  useEffect(() => {
    if (!signoutRedirect) {
      if (state?.from) {
        if (!authUser) setModalType('signin');
        else history.push(state.from);
      } else {
        history.replace('/', undefined);
      }
    }
  }, [setModalType, state, authUser, history, signoutRedirect]);

  return (
    <div className="page--products">
      <div className="products">
        {products.map((product) => (
          <ProductItem key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
};

export default Index;
