import { Button } from "@mui/material";
import axios from "axios";
import { useCartContext } from "../utils/CartContext";
import { Wrapper } from "./styled/Wrapper";

export const Product = (props) => {
  const { product } = props;
  const { setCartProducts } = useCartContext();
  const handleAddToCart = (event) => {
    event.preventDefault();
    axios
      .post(
        `/customers/${
          JSON.parse(localStorage.getItem("user"))._id
        }/cart/products`,
        {
          product: event.target.value,
        }
      )
      .then((response) => {
        setCartProducts(response.data.data._cartProducts);
      });
  };
  return (
    <Wrapper>
      <img
        style={{
          height: 200,
        }}
        src={product.img || product.product.img}
        alt={product.name || product.product.name}
      ></img>
      <div
        style={{
          fontFamily: "Verdana, sans-serif",
          fontSize: 25,
          fontWeight: 700,
          marginBottom: 10,
        }}
      >
        {product.name || product.product.name}
      </div>
      <div
        style={{
          fontFamily: "Verdana, sans-serif",
        }}
      >
        ${product.price || product.product.price}
      </div>
      <Button value={product._id} onClick={handleAddToCart}>
        Add to cart
      </Button>
      <input
        type="number"
        name="quantity"
        min="0"
        step="1"
        defaultValue="1"
      ></input>
    </Wrapper>
  );
};
