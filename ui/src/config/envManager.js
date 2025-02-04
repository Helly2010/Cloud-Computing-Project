
const EnvManager = Object.freeze(
    {
        BACKEND_URL: process.env.REACT_APP_STORE_BACKEND_URL,
        PAYPAL_CLIENT_ID: process.env.REACT_APP_PAYPAL_CLIENT_ID,
        STRIPE_KEY: process.env.REACT_APP_STRIPE_KEY
    }
);

export default EnvManager;