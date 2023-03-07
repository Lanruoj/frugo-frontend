import axios from "axios";
import { Route, Routes, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { HomePage } from "./pages/HomePage";
import { Products } from "./components/Products";
import { Login } from "./components/Login";
import { NavBar } from "./components/NavBar";
import { Register } from "./components/Register";
import "./App.css";
import { Cart } from "./components/Cart";
import { OrderList } from "./components/OrderList";
import { OrderConfirmation } from "./components/OrderConfirmation";
import { Stock } from "./components/Stock";
import { CustomerRoute } from "./utils/CustomerRoute";
import { Main } from "./components/styled/Main";
import { MerchantRoute } from "./utils/MerchantRoute";
import { UserContext } from "./utils/UserContext";
import { AddNewStockProduct } from "./components/AddNewStockProduct";
import { CustomerProfile } from "./components/CustomerProfile";

function App() {
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const [loggedInUser, setLoggedInUser] = useState(
    localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")) : ""
  );
  const [role, setRole] = useState(localStorage.getItem("role") || "");
  const [merchant, setMerchant] = useState(
    localStorage.getItem("merchant")
      ? JSON.parse(localStorage.getItem("merchant"))
      : ""
  );
  const [cartProducts, setCartProducts] = useState([]);
  const [newOrder, setNewOrder] = useState("");
  const [customerProducts, setCustomerProducts] = useState([]);
  const navigate = useNavigate();
  useEffect(() => {
    if (loggedInUser) {
      setToken(() => {
        return localStorage.getItem("token");
      });
      setRole(() => {
        return localStorage.getItem("role");
      });
      if (localStorage.getItem("role") == "Customer") {
        setMerchant(() => {
          return JSON.parse(localStorage.getItem("merchant"));
        });
        axios
          .get(
            `/merchants/${
              JSON.parse(localStorage.getItem("merchant"))._id
            }/stock/products`
          )
          .then((response) => {
            console.log(response.data.data);
            setCustomerProducts(response.data.data);
          });
        navigate("/customer/products");
        axios.get(`/customers/${loggedInUser._id}/cart`).then((response) => {
          setCartProducts((prev) => {
            let data = response.data.data._cartProducts;
            const cartProducts = data.map((cartProduct) => {
              return { stockProduct: cartProduct, quantity: 1 };
            });
            return cartProducts;
          });
        });
      } else if (localStorage.getItem("role") == "Merchant") {
        navigate("/merchant/stock");
      }
    } else if (!loggedInUser) {
      navigate("/");
    }
  }, [loggedInUser]);
  return (
    <div className="App">
      <UserContext.Provider
        value={{
          loggedInUser,
          setLoggedInUser,
          role,
          setRole,
          token,
          setToken,
          merchant,
          setMerchant,
          cartProducts,
          setCartProducts,
          newOrder,
          setNewOrder,
          customerProducts,
          setCustomerProducts,
        }}
      >
        <NavBar />
        <Main>
          <Routes>
            <Route exact path="/" element={<HomePage />} />
            <Route exact path="/login" element={<Login />} />
            <Route exact path="/customer/register" element={<Register />} />
            <Route path="customer">
              <Route
                path="profile"
                element={
                  <CustomerRoute>
                    <CustomerProfile />
                  </CustomerRoute>
                }
              />
              <Route index path="products" element={<Products />} />
              <Route
                path="cart"
                element={
                  <CustomerRoute>
                    <Cart />
                  </CustomerRoute>
                }
              />
              <Route
                path="orders"
                element={
                  <CustomerRoute>
                    <OrderList />
                  </CustomerRoute>
                }
              />
              <Route
                path={`orderConfirmation`}
                element={
                  <CustomerRoute>
                    <OrderConfirmation />
                  </CustomerRoute>
                }
              />
            </Route>
            <Route path="merchant">
              <Route path="stock">
                <Route
                  index
                  element={
                    <MerchantRoute>
                      <Stock />
                    </MerchantRoute>
                  }
                />
                <Route
                  path="add"
                  element={
                    <MerchantRoute>
                      <AddNewStockProduct />
                    </MerchantRoute>
                  }
                />
              </Route>
              <Route
                path="orders"
                element={
                  <MerchantRoute>
                    <OrderList />
                  </MerchantRoute>
                }
              />
            </Route>
          </Routes>
        </Main>
      </UserContext.Provider>
    </div>
  );
}

export default App;
