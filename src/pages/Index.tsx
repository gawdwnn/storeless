import React, { useEffect } from "react";
import { useHistory } from "react-router";
import ProductItem from "../components/Products/ProductItem";
import Spinner from "../components/Spinner";
import { useAuthContext } from "../state/auth-context";
import { useModalContext } from "../state/modal-context";
import { useProductsContext } from "../state/product-context";

interface Props {}

const Index: React.FC<Props> = () => {
  const { setModalType } = useModalContext();
  // const { state } = useLocation<{ from: string }>();
  const history = useHistory<{ from: string }>();
  const { state } = history.location;
  const { authState } = useAuthContext();
  const { authUser, signoutRedirect } = authState;
  const { productsState } = useProductsContext();
  const { products, loading } = productsState;

  useEffect(() => {
    if (!signoutRedirect) {
      if (state?.from) {
        if (!authUser) setModalType("signin");
        else history.push(state.from);
      } else {
        history.replace("/", undefined);
      }
    }
  }, [setModalType, state, authUser, history, signoutRedirect]);

  if (loading) return <Spinner color="grey" width={50} height={50} />;

  if (!loading && products.All.length === 0)
    return <h2 className="header--center">No Products</h2>;

  return (
    <div className="page--products">
      <div className="products">
        {products.All.map((product) => (
          <ProductItem key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
};

export default Index;
