import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import ProductDetails from "../components/ProductDetail";
import CartContext from "../context/CartContext";

// Mock the API call
jest.mock("../services/api/products", () => ({
  fetchProduct: jest.fn((id) =>
    Promise.resolve({
      id: 1,
      name: "Product 1",
      description: "This is a test product",
      formatted_price: "€100",
      category: { name: "Category 1" },
      extra_info: { rating: 4, fast_delivery: true },
      stock: { quantity: 10 },
      img_link: "https://example.com/image.jpg",
    })
  ),
}));

describe("ProductDetails Component", () => {
  it("should load product details when a product is clicked", async () => {
    render(
      <CartContext>
        <MemoryRouter initialEntries={["/products/1"]}>
          <Routes>
            <Route path="/products/:id" element={<ProductDetails />} />
          </Routes>
        </MemoryRouter>
      </CartContext>
    );

    // Wait for the loading state to disappear
    await waitFor(() => {
      expect(screen.queryByText("Loading ...")).not.toBeInTheDocument();
    });

    // Check if the product details are displayed
    expect(screen.getByText("Product 1")).toBeInTheDocument();
    expect(screen.getByText("This is a test product")).toBeInTheDocument();
    expect(screen.getByText("€100")).toBeInTheDocument();
    expect(screen.getByText("Category 1")).toBeInTheDocument();
    expect(screen.getByText("4 / 5")).toBeInTheDocument();
    expect(screen.getByText("10 items available")).toBeInTheDocument();
    expect(screen.getByText("Yes")).toBeInTheDocument(); // Fast delivery
  });
});