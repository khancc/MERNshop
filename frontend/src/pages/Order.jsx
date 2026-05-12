import React, { useContext, useEffect, useState } from "react";
import { ShopContext } from "../context/ShopContext";
import { useNavigate } from "react-router-dom";

const Order = () => {
  const { getTotalCartAmount, all_products, token, cartItems, url } = useContext(ShopContext);
  const navigate = useNavigate();

  const [data, setData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    street: "",
    city: "",
    state: "",
    zipcode: "",
    country: "",
    phone: "",
  });

  const onChangeHandler = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setData((data) => ({ ...data, [name]: value }));
  };

  const placeOrder = async (e) => {
    e.preventDefault();
    let orderItems = [];
    all_products.forEach((item) => {
      if (cartItems[item._id] > 0) {
        let itemInfo = { ...item, quantity: cartItems[item._id] };
        orderItems.push(itemInfo);
      }
    });

    if (orderItems.length === 0) {
      alert("Your cart is empty. Please add items before proceeding.");
      return;
    }

    const orderData = {
      address: data,
      items: orderItems,
      amount: getTotalCartAmount() + 2,
    };

    console.log("Navigating to /checkout with orderData:", orderData); // Debug log
    navigate("/checkout", { state: { orderData } });
  };

  useEffect(() => {
    if (!token || getTotalCartAmount() === 0) {
      navigate("/cart");
    }
  }, [token, getTotalCartAmount, navigate]);

  return (
    <section className="max-padd-container py-28 xl:py-32">
      <form onSubmit={placeOrder} className="flex flex-col xl:flex-row gap-20 xl:gap-28">
        {/* thông tin vận chuyển */}
        <div className="flex flex-1 flex-col gap-3 text-[95%]">
          <h3 className="bold-28 mb-4">Delivery Information</h3>
          <div className="flex gap-3">
            <input
              required
              onChange={onChangeHandler}
              name="firstName"
              value={data.firstName}
              type="text"
              placeholder="First name"
              className="ring-1 ring-slate-900/15 p-1 pl-3 rounded-sm outline-none w-1/2"
            />
            <input
              required
              onChange={onChangeHandler}
              name="lastName"
              value={data.lastName}
              type="text"
              placeholder="Last name"
              className="ring-1 ring-slate-900/15 p-1 pl-3 rounded-sm outline-none w-1/2"
            />
          </div>
          <input
            required
            onChange={onChangeHandler}
            name="email"
            value={data.email}
            type="email"
            placeholder="Email address"
            className="ring-1 ring-slate-900/15 p-1 pl-3 rounded-sm outline-none"
          />
          <input
            required
            onChange={onChangeHandler}
            name="phone"
            value={data.phone}
            type="text"
            placeholder="Phone number"
            className="ring-1 ring-slate-900/15 p-1 pl-3 rounded-sm outline-none"
          />
          <input
            required
            onChange={onChangeHandler}
            name="street"
            value={data.street}
            type="text"
            placeholder="Street"
            className="ring-1 ring-slate-900/15 p-1 pl-3 rounded-sm outline-none"
          />
          <div className="flex gap-3">
            <input
              required
              onChange={onChangeHandler}
              name="city"
              value={data.city}
              type="text"
              placeholder="City"
              className="ring-1 ring-slate-900/15 p-1 pl-3 rounded-sm outline-none w-1/2"
            />
            <input
              required
              onChange={onChangeHandler}
              name="state"
              value={data.state}
              type="text"
              placeholder="State"
              className="ring-1 ring-slate-900/15 p-1 pl-3 rounded-sm outline-none w-1/2"
            />
          </div>
          <div className="flex gap-3">
            <input
              required
              onChange={onChangeHandler}
              name="zipcode"
              value={data.zipcode}
              type="text"
              placeholder="Zip Code"
              className="ring-1 ring-slate-900/15 p-1 pl-3 rounded-sm outline-none w-1/2"
            />
            <input
              required
              onChange={onChangeHandler}
              name="country"
              value={data.country}
              type="text"
              placeholder="Country"
              className="ring-1 ring-slate-900/15 p-1 pl-3 rounded-sm outline-none w-1/2"
            />
          </div>
        </div>

        {/* cart total */}
        <div className="flex flex-col flex-1">
          <div className="flex flex-col gap-2">
            <h4 className="bold-22">Summary:</h4>
            <div>
              <div className="flexBetween py-3">
                <h4 className="medium-16">Subtotal:</h4>
                <h4 className="text-gray-30 font-semibold">${getTotalCartAmount()}</h4>
              </div>
              <hr />
              <div className="flexBetween py-3">
                <h4 className="medium-16">Shipping Fee:</h4>
                <h4 className="text-gray-30 font-semibold">${getTotalCartAmount() === 0 ? 0 : 2}</h4>
              </div>
              <hr />
              <div className="flexBetween py-3">
                <h4 className="medium-18">Total:</h4>
                <h4 className="bold-18">${getTotalCartAmount() === 0 ? 0 : getTotalCartAmount() + 2}</h4>
              </div>
            </div>
            <button
              type="submit"
              className="btn-secondary w-52 rounded"
            >
              Proceed to Checkout
            </button>
          </div>
        </div>
      </form>
    </section>
  );
};

export default Order;