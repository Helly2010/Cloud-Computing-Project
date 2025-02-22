import { render, screen, waitFor } from "@testing-library/react";
import Home from "../components/Home";  // Adjusted import path
import { CartState } from "../context/CartContext";  // Adjusted import path

// Mock the external API calls
jest.mock("../services/api/products", () => ({
  fetchProducts: jest.fn(),
}));

jest.mock("../services/api/categories", () => ({
  fetchCategories: jest.fn(),
}));

jest.mock("../context/CartContext", () => ({
  CartState: jest.fn(),
}));

describe("Home Component", () => {
  beforeEach(() => {
    // Mock the return values for the API functions
    require("../services/api/products").fetchProducts.mockResolvedValue([
      { 
        id: 1, 
        name: "Product 1", 
        public_unit_price: 10, 
        stock: { quantity: 5 }, 
        extra_info: { fast_delivery: true, rating: 4 }, 
        category: { name: "Category 1" }
      },
      { 
        id: 2, 
        name: "Product 2", 
        public_unit_price: 20, 
        stock: { quantity: 3 }, 
        extra_info: { fast_delivery: false, rating: 5 }, 
        category: { name: "Category 2" }
      }
    ]);
    
    require("../services/api/categories").fetchCategories.mockResolvedValue([
      { id: 1, name: "Category 1" },
      { id: 2, name: "Category 2" },
    ]);

    // Mock CartState return values
    CartState.mockReturnValue({
      productFilterState: {
        sort: "lowToHigh", // Assuming sorting low to high
        byStock: true,
        byFastDelivery: true,
        byRating: 4,
        searchQuery: "",
        byCategory: "Category 1",
      },
    });
  });

  test("renders Home component and applies filters correctly", async () => {
    render(<Home />);

    // Wait for the component to load
    await waitFor(() => expect(screen.queryByText("Loading...")).not.toBeInTheDocument());

    // Check if filtered products are rendered
    expect(screen.getByText("Product 1")).toBeInTheDocument();
    expect(screen.getByText("Product 2")).toBeInTheDocument();
  });

  test("applies filter correctly based on CartContext state", async () => {
    render(<Home />);

    // Wait for loading to finish
    await waitFor(() => expect(screen.queryByText("Loading...")).not.toBeInTheDocument());

    // Ensure that the products are filtered based on CartContext state
    const filteredProducts = screen.getAllByText(/Product/);
    
    // Check that only the filtered product shows up
    expect(filteredProducts.length).toBe(1); // In this case, Product 1 should be the only one that matches the filters
  });
});