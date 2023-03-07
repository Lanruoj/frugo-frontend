import axios from "axios";
import styled from "styled-components";
import { useEffect, useState } from "react";
import { GridBox } from "./styled/GridBox";
import { Product } from "./Product";
import { SearchBar } from "./styled/SearchBar";
import { useUserContext } from "../utils/UserContext";

export const CustomGrid = styled(GridBox)`
  padding: 30px;
`;

export function Products() {
  const {
    loggedInUser,
    merchant,
    cartProducts,
    setCustomerProducts,
    customerProducts,
  } = useUserContext();
  // const [products, setProducts] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  useEffect(() => {
    if (loggedInUser) {
      axios
        .get(`/merchants/${merchant._id}/stock/products?name=${searchQuery}`)
        .then((response) => {
          setCustomerProducts(response.data.data);
        });
    } else {
      axios
        .get(`products?name=${searchQuery}`)
        .then((response) => setCustomerProducts(response.data.data));
    }
  }, [searchQuery]);
  const handleSearchQueryChange = (event) => {
    event.preventDefault();
    setSearchQuery(event.target.value);
  };
  return (
    <>
      <h1>PRODUCTS</h1>
      <form>
        <SearchBar
          value={searchQuery}
          onChange={handleSearchQueryChange}
          placeholder="Search for products"
        />
      </form>
      <div id="products">
        <GridBox>
          {customerProducts &&
            customerProducts.map((product) => {
              const existingProduct = cartProducts.find(
                (cartProduct) => cartProduct.stockProduct._id == product._id
              );
              return (
                <Product
                  key={product._id}
                  product={product}
                  existingProduct={existingProduct}
                />
              );
            })}
          {!customerProducts.length && (
            <h2>No products matching that criteria</h2>
          )}
        </GridBox>
      </div>
    </>
  );
}
