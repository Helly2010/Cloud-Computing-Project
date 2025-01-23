import { useState, useEffect } from "react";
import { toast } from "react-toastify";

const useStock = (productIds) => {
  const [stockData, setStockData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!productIds || productIds.length === 0) {
      setLoading(false);
      return;
    }

    // Fetch stock data for each product and update state
    const fetchStockData = async () => {
      try {
        const responses = await Promise.all(
          productIds.map((productId) =>
            fetch(`http://localhost:8000/stock/${productId}`)
              .then((response) => response.json())
              .then((data) => ({ productId, quantity: data.quantity }))
          )
        );

        // Map response to stockData
        const stockMap = responses.reduce((acc, { productId, quantity }) => {
          acc[productId] = quantity;
          return acc;
        }, {});

        setStockData(stockMap);
      } catch (err) {
        setError(err.message);
        toast.error("Error while fetching stock data", {
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