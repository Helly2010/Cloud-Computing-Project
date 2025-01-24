import { useState, useEffect } from "react";
import { toast } from "react-toastify";

const useStock = (productIds) => {
  const [stockData, setStockData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Ensure productIds is valid
    if (!productIds || (Array.isArray(productIds) && productIds.length === 0)) {
      setLoading(false);
      return;
    }

    // Normalize productIds to always be an array
    const productIdsArray = Array.isArray(productIds) ? productIds : [productIds];

    const fetchStockData = async () => {
      try {
        setLoading(true);
        setError(null); // Reset previous errors

        const responses = await Promise.all(
          productIdsArray.map(async (productId) => {
            const response = await fetch(`http://localhost:8000/stock/${productId}`);
            
            // Check for HTTP errors
            if (!response.ok) {
              throw new Error(`Failed to fetch stock for product ID: ${productId}`);
            }

            const data = await response.json();
            return { productId, quantity: data.quantity };
          })
        );

        // Convert responses to stock data map
        const stockMap = responses.reduce((acc, { productId, quantity }) => {
          acc[productId] = quantity;
          return acc;
        }, {});

        setStockData(stockMap);
      } catch (err) {
        setError(err.message);
        toast.error(`Error while fetching stock data: ${err.message}`, {
          position: "top-left",
          autoClose: 1500,
          closeOnClick: true,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchStockData();
  }, [productIds]);

  return { stockData, loading, error };
};

export default useStock;
