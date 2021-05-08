import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import './App.css';
import './fontawesome';
import Layout from './Layout';
import Routes from './routes/Routes';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Layout>
          <Routes />
        </Layout>
      </BrowserRouter>
    </div>
  );
}

export default App;
