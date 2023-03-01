import styled from "styled-components";
import { useAuthContext } from "../../utils/AuthContext";

//importing default exports - name can be different
import Product from "./Product";

// import styled UI components
import GridBox from "../styled/GridBox";
import { useEffect, useState } from "react";
import axios from "axios";

export const CustomGrid = styled(GridBox)`
  padding: 30px;
`;

export function ProductList(props) {
  const { loggedInUser } = useAuthContext();
  const { products } = props;
  return (
    <div id="products">
      <CustomGrid>
        {products &&
          products.map((product) => {
            return (
              <Product
                key={product._id}
                product={product}
                setProduct={props.setProduct}
                loggedInUser={loggedInUser}
              />
            );
          })}
      </CustomGrid>
    </div>
  );
}
