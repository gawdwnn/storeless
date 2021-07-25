import React from "react";
import { BrowserRouter } from "react-router-dom";
import "./App.css";
import "./fontawesome";
import Layout from "./Layout";
import Routes from "./routes/Routes";
import AuthContextProvider from "./state/auth-context";
import ModalContextProvider from "./state/modal-context";
import ProductsContextProvider from "./state/product-context";
import CartContextProvider from "./state/cart-context";

function App() {
  return (
    <AuthContextProvider>
      <ModalContextProvider>
        <ProductsContextProvider>
          <CartContextProvider>
            <BrowserRouter>
              <Layout>
                <Routes />
              </Layout>
            </BrowserRouter>
          </CartContextProvider>
        </ProductsContextProvider>
      </ModalContextProvider>
    </AuthContextProvider>
  );
}

export default App;
