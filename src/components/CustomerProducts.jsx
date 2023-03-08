import axios from "axios";
import styled from "styled-components";
import { useEffect, useState } from "react";
import { Product } from "./Product";
import { SearchBar } from "./styled/SearchBar";
import { useUserContext } from "../utils/UserContext";
import { PageHeading } from "./styled/PageHeading";

export const RowWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  width: 100%;
`;

export const CustomerProducts = () => {
  const { currentUser, cart } = useUserContext();
  const [products, setProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  useEffect(() => {
    if (currentUser) {
      axios
        .get(
          `/merchants/${currentUser._merchant._id}/stock/products?name=${searchQuery}`
        )
        .then((response) => {
          setProducts(response.data.data);
        });
    }
  }, [currentUser]);
  const handleSearchQueryChange = (event) => {
    event.preventDefault();
    setSearchQuery(event.target.value);
  };
  return (
    <>
      <PageHeading>PRODUCTS</PageHeading>
      <form>
        <SearchBar
          value={searchQuery}
          onChange={handleSearchQueryChange}
          placeholder="Search for products"
        />
      </form>
      <RowWrapper>
        {products &&
          products.map((product) => {
            const existingProduct = cart.length
              ? cart.find(
                  (cartProduct) => cartProduct.stockProduct._id == product._id
                )
              : null;
            return (
              <Product
                key={product._id}
                product={product}
                existingProduct={existingProduct}
              />
            );
          })}
        {!products.length && <h2>No products matching that criteria</h2>}
      </RowWrapper>
    </>
  );
};