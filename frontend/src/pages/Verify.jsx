import React, { use, useContext } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { ShopContext } from "../context/ShopContext";
import axios from "axios";
import { useEffect } from "react";

const Verify = () => {

    const [searchParams, serSearchParams] = useSearchParams()
    const success = searchParams.get("success")
    const orderId = searchParams.get("orderId")
    //console.log(success, orderId)
    const {url} = useContext(ShopContext)
    const navigate = useNavigate()

    const verifyPayment = async () => {
        try {
            const response = await axios.post(url + "/api/order/verify", { success, orderId });
            console.log("VERIFY RESPONSE:", response.data); // Thêm dòng này để kiểm tra
            if (response.data.success) {
                navigate("/myorders");
            } else {
                navigate("/");
            }
        } catch (error) {
            console.log("VERIFY ERROR:", error);
            navigate("/");
        }
    };
    

    useEffect(() => {
        verifyPayment()
    },[])

    return (
        <section>
            <div className="min-h-[60vh] grid">
                <div className="w-24 h-24 place-self-center border-4 border-t-secondary rounded-full animate-spin"></div>
            </div>
        </section>
    )
}

export default Verify