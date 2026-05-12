import axios from "axios";
import React, { useEffect, useState } from "react";
import { createContext } from "react";

export const ShopContext = createContext(null);

const ShopContextProvider = (props) => {
  const [cartItems, setCartItems] = useState({});
  const url = "http://localhost:4000";
  const [token, setToken] = useState("");
  const [all_products, setAll_products] = useState([]);
  const [user, setUser] = useState(null);

  const addToCart = async (itemId) => {
    if (!cartItems[itemId]) {
      setCartItems((prev) => ({ ...prev, [itemId]: 1 }));
    } else {
      setCartItems((prev) => ({ ...prev, [itemId]: prev[itemId] + 1 }));
    }
    if (token) {
      await axios.post(url + "/api/cart/add", { itemId }, { headers: { token } });
    }
  };

  const removeFromCart = async (itemId) => {
    setCartItems((prev) => ({ ...prev, [itemId]: prev[itemId] - 1 }));
    if (token) {
      await axios.post(url + "/api/cart/remove", { itemId }, { headers: { token } });
    }
  };

  const getTotalCartAmount = () => {
    let totalAmount = 0;
    for (const item in cartItems) {
      if (cartItems[item] > 0) {
        let itemInfo = all_products.find((product) => product._id === item);
        totalAmount += itemInfo.price * cartItems[item];
      }
    }
    return totalAmount;
  };

  const fetchProductList = async () => {
    const response = await axios.get(url + "/api/product/list");
    setAll_products(response.data.data);
  };

  const loadCartData = async (token) => {
    const response = await axios.post(url + "/api/cart/get", {}, { headers: { token } });
    setCartItems(response.data.cartData);
  };

  const fetchUserData = async (token) => {
    const response = await axios.get(url + "/api/user/profile", { headers: { token } });
    if (response.data.success) {
      setUser(response.data.data);
    }
  };

  const addComment = async (productId, content) => {
    try {
      const response = await axios.post(
        url + "/api/product/comments",
        { productId, content },
        { headers: { token } }
      );
      if (response.data.success) {
        return true;
      }
      return false;
    } catch (error) {
      console.log(error);
      return false;
    }
  };

  const addReview = async (productId, rating, content) => {
    try {
      const response = await axios.post(
        url + "/api/product/reviews",
        { productId, rating, content },
        { headers: { token } }
      );
      if (response.data.success) {
        return true;
      }
      return false;
    } catch (error) {
      console.log(error);
      return false;
    }
  };

  useEffect(() => {
    async function loadData() {
      await fetchProductList();
      if (localStorage.getItem("token")) {
        const token = localStorage.getItem("token");
        setToken(token);
        await loadCartData(token);
        await fetchUserData(token);
      }
    }
    loadData();
  }, []);

  const contextValue = {
    all_products,
    cartItems,
    setCartItems,
    addToCart,
    removeFromCart,
    getTotalCartAmount,
    url,
    token,
    setToken,
    user,
    addComment,
    addReview,
  };

  return <ShopContext.Provider value={contextValue}>{props.children}</ShopContext.Provider>;
};

export default ShopContextProvider;