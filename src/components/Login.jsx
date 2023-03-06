import axios from "axios";
import { useState } from "react";
import { Title } from "./styled/Title";
import { useAuthContext } from "../utils/AuthContext";
import { useCustomerContext } from "../utils/CustomerContext";
import { InputWrapper } from "./styled/InputWrapper";

export const Login = () => {
  const { setLoggedInUser, setRole, setToken } = useAuthContext();
  const { setMerchant } = useCustomerContext();
  const [userFormDetails, setUserFormDetails] = useState({
    email: "",
    password: "",
  });
  const handleChange = (event) => {
    event.preventDefault();
    setUserFormDetails((prevDetails) => {
      return {
        ...prevDetails,
        [event.target.name]: event.target.value,
      };
    });
  };
  const handleSubmit = async (event) => {
    event.preventDefault();
    const response = await axios
      .post("/auth/login", userFormDetails)
      .catch((error) => console.log(error));
    if (response.status == 200) {
      setLoggedInUser(() => {
        localStorage.setItem("user", JSON.stringify(response.data.user));
        localStorage.setItem("token", response.data.accessToken);
        localStorage.setItem("role", response.data.role);
        if (localStorage.getItem("role") == "Customer") {
          localStorage.setItem(
            "merchant",
            JSON.stringify(response.data.merchant)
          );
        }
        return response.data.user;
      });
    }
  };
  return (
    <>
      <Title>Login</Title>
      <form
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
        onSubmit={handleSubmit}
      >
        <InputWrapper>
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            name="email"
            onChange={handleChange}
            value={userFormDetails.email}
          />
        </InputWrapper>
        <InputWrapper>
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            name="password"
            onChange={handleChange}
            value={userFormDetails.password}
          />
        </InputWrapper>
        <div>
          <input className="login-button" type="submit" value="SUBMIT" />
        </div>
      </form>
    </>
  );
};
