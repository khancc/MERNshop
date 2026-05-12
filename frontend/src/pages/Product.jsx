import React, { useContext, useState } from "react";
import { ShopContext } from "../context/ShopContext";
import { useParams } from "react-router-dom";
import ProductDescription from "../components/ProductDescription";
import ProductHD from "../components/ProductHd";
import ProductMD from "../components/ProductMd";
// import CommentSection from "../components/CommentSection";
import ReviewSection from "../components/ReviewSection";

const Product = () => {
  const [refreshFlag, setRefreshFlag] = useState(false);
  const { all_products } = useContext(ShopContext);
  const { productId } = useParams();
  const product = all_products.find((e) => e._id === productId);
  if (!product) {
    return <div className="h1 pt-28">Product not Found</div>;
  }

  return (
    <section className="max-padd-container py-20">
      <div>
        <ProductHD product={product} />
        <ProductMD product={product} refreshTrigger={refreshFlag}/>
        <ProductDescription product={product} />
        {/* <CommentSection productId={productId} /> */}
        <ReviewSection productId={productId} onReviewSubmitted={() => setRefreshFlag((prev) => !prev)} />
      </div>
    </section>
  );
};

export default Product;