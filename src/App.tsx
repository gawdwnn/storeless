import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import './App.css';
import './fontawesome';
import Layout from './Layout';
import Routes from './routes/Routes';
import ModalContextProvider from './state/modal-context';

function App() {
  return (
    <div className="App">
      <ModalContextProvider>
        <BrowserRouter>
          <Layout>
            <Routes />
          </Layout>
        </BrowserRouter>
      </ModalContextProvider>
    </div>
  );
}

export default App;
