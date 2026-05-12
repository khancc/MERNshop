import React, { useState } from "react";

const ProductDescription = () => {
    const [activeTab, setActiveTab] = useState("description");

    const renderContent = () => {
        if (activeTab === "description") {
            return (
                <>
                    <p className="text-gray-700 text-base leading-7 mb-4">
                        This premium winter jacket combines both style and warmth, crafted with high-quality materials to ensure maximum comfort during cold seasons. It features a water-resistant outer shell, a cozy fleece lining, and a stylish tailored fit that complements any outfit.
                    </p>
                    <p className="text-gray-700 text-base leading-7">
                        Perfect for casual outings or outdoor adventures, this jacket is available in multiple colors and sizes to suit your personal style.
                    </p>
                </>
            )
        } else if (activeTab === "care") {
            return (
                <p className="text-gray-700 text-base leading-7">
                    Hand wash cold separately. Do not bleach. Lay flat to dry. Cool iron if needed. Dry clean recommended for best results.
                </p>
            )
        } else if (activeTab === "size") {
            return (
                <p className="text-gray-700 text-base leading-7">
                    Fits true to size. For a more relaxed fit, consider sizing up. Please refer to our size chart for exact measurements.
                </p>
            )
        }
    }

    return (
        <div className="max-padd-container mt-16">
            <div className="flex gap-4 mb-6">
                <button onClick={() => setActiveTab("description")} className={`btn-dark rounded-md px-4 py-2 text-xs ${activeTab === "description" ? "" : "opacity-50"}`}>
                    Description
                </button>
                <button onClick={() => setActiveTab("care")} className={`btn-dark rounded-md px-4 py-2 text-xs ${activeTab === "care" ? "" : "opacity-50"}`}>
                    Care Guide
                </button>
                <button onClick={() => setActiveTab("size")} className={`btn-dark rounded-md px-4 py-2 text-xs ${activeTab === "size" ? "" : "opacity-50"}`}>
                    Size Guide
                </button>
            </div>
            <div className="flex flex-col pb-16">
                {renderContent()}
            </div>
        </div>
    )
}

export default ProductDescription;
