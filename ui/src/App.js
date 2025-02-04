import { PayPalScriptProvider } from "@paypal/react-paypal-js";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "./App.css";
import Cart from "./components/Cart";
import CheckoutForm from "./components/CheckoutForm";
import Header from "./components/Header";
import Home from "./components/Home";
import ProductDetail from "./components/ProductDetail";
import EnvManager from "./config/envManager";

const stripePromise = loadStripe(
  EnvManager.STRIPE_KEY
);

const App = () => {
  return (
    <PayPalScriptProvider
      options={{
        "client-id": process.env.REACT_APP_PAYPAL_CLIENT_ID,
        currency: "EUR",
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
              // Wrap the CheckoutForm with the <Elements> provider for Stripe
              <div>
                <Elements stripe={stripePromise}>
                  <CheckoutForm />
                </Elements>
              </div>
            }
          />
        </Routes>
        <ToastContainer />
      </BrowserRouter>
    </PayPalScriptProvider>
  );
};

export default App;
