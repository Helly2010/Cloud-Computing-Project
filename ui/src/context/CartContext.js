import React, { createContext, useContext, useReducer } from "react";
import { faker } from "@faker-js/faker";
import { cartReducer, productFilterReducer } from "./Reducers";

const Cart = createContext(); // Creating the context

// Ensuring static data from Faker.js
faker.seed(99);

const CartContext = ({ children }) => {
  /** 
   * 🛒 useReducer Hook for managing cart state 
   * - `state` contains `products` and `cart`
   * - `dispatch` is used to update the state
   */
  const [state, dispatch] = useReducer(cartReducer, {
    products: [], // Products fetched from API or Faker.js
    cart: [], // Initially empty cart
  });

  /** 
   * 🎯 useReducer Hook for managing filters 
   */
  const [productFilterState, productFilterDispatch] = useReducer(productFilterReducer, {
    byStock: false,
    byFastDelivery: false,
    byRating: 0,
    searchQuery: "",
    byCategory: "", // Filter by category
    sort: "",
  });

  return (
    <Cart.Provider value={{ state, dispatch, productFilterState, productFilterDispatch }}>
      {children}
    </Cart.Provider>
  );
};

// Exporting the context provider
export default CartContext;

// Custom hook for using CartState
export const CartState = () => {
  return useContext(Cart);
};