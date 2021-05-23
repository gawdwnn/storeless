import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import './App.css';
import './fontawesome';
import Layout from './Layout';
import Routes from './routes/Routes';
import AuthContextProvider from './state/auth-context';
import ModalContextProvider from './state/modal-context';

function App() {
  return (
    <AuthContextProvider>
      <ModalContextProvider>
        <BrowserRouter>
          <Layout>
            <Routes />
          </Layout>
        </BrowserRouter>
      </ModalContextProvider>
    </AuthContextProvider>
  );
}

export default App;
