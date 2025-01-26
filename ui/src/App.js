import { loadStripe } from '@stripe/stripe-js';
import './App.css';
import CheckoutForm from './components/CheckoutForm';
import { Elements } from '@stripe/react-stripe-js';
import { BrowserRouter, Route, Routes} from 'react-router-dom';
import Header from './components/Header';
import Home from './components/Home';
import Cart from './components/Cart';
import { ToastContainer } from 'react-toastify';
import ProductList from "./components/ProductList";
import ProductDetail from "./components/ProductDetail";
import { PayPalScriptProvider } from "@paypal/react-paypal-js";

const stripePromise = loadStripe('pk_test_51MwPQuSBD8MtMZAoDOk33CGs935GKRdxMeR3HN4Rro4g8HIuIPOMfDRLHoEYWPFPHIpK0RfN5Gc9zbKOhqcMzMPn00z8zgZCFw');

const App = () => {
  return (
    <PayPalScriptProvider
      options={{
        "client-id": process.env.REACT_APP_PAYPAL_CLIENT_ID,
        currency: "USD",
      }}
    >
      <BrowserRouter>
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route
            path="/checkout"
            element={
              // Wrap the CheckoutForm with the <Elements> provider
              <Elements stripe={stripePromise}>
                <CheckoutForm />
              </Elements>
            }
          />
        </Routes>
        <ToastContainer />
      </BrowserRouter>
    </PayPalScriptProvider>
  );
};

export default App;