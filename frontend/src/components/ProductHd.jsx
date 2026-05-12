import React from "react";
import { TbArrowRight } from "react-icons/tb";

const ProductHd = ({ product }) => {
    return (
        <div className="max-padd-container flex items-center gap-2 text-sm sm:text-base py-6 capitalize bg-primary font-semibold text-gray-700">
            Home <TbArrowRight className="text-lg" /> {product.name}
        </div>
    )
}

export default ProductHd;
