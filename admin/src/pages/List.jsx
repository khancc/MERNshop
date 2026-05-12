import axios from "axios";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { TbTrash } from "react-icons/tb";

const List = ({ url }) => {
  const [list, setList] = useState([]);

  const fetchList = async () => {
    try {
      const response = await axios.get(`${url}/api/product/list`);
      if (response.data.success) {
        setList(response.data.data);
      } else {
        toast.error("Error fetching products");
      }
    } catch (error) {
      toast.error("Network error");
      console.error(error);
    }
  };

  const removeProduct = async (productId) => {
    try {
      const response = await axios.post(`${url}/api/product/remove`, {
        id: productId,
      });
      await fetchList();
      if (response.data.success) {
        toast.success(response.data.message);
      } else {
        toast.error("Failed to remove product");
      }
    } catch (error) {
      toast.error("Network error");
      console.error(error);
    }
  };

  useEffect(() => {
    fetchList();
  }, []);

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Main Content - Scrollable */}
      <div className="flex-1 overflow-y-auto">
        <section className="p-6 sm:p-8">
          <div className="flex justify-between items-center mb-6">
            <h4 className="text-2xl font-bold text-gray-800">Products List</h4>
            <button
              onClick={fetchList}
              className="flex items-center gap-2 text-sm bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-md transition-colors"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z"
                  clipRule="evenodd"
                />
              </svg>
              Refresh
            </button>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[900px]">
                <thead className="bg-gray-10">
                  <tr className="text-left text-gray-600 text-sm font-medium">
                    <th className="px-6 py-3 w-24">Image</th>
                    <th className="px-6 py-3 w-80">Title</th>
                    <th className="px-6 py-3 w-32">Price</th>
                    <th className="px-6 py-3 w-32">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {list.map((product) => (
                    <tr
                      key={product._id}
                      className="hover:bg-gray-10 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div className="w-12 h-12 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
                          <img
                            src={`${url}/images/` + product.image}
                            alt={product.name}
                            className="object-cover w-full h-full"
                          />
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <p className="font-medium text-gray-800 line-clamp-2">
                          {product.name}
                        </p>
                      </td>
                      <td className="px-6 py-4 font-semibold text-green-600">
                        ${product.price}
                      </td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => removeProduct(product._id)}
                          className="text-red-500 hover:text-red-700 p-2 rounded-full hover:bg-red-50 transition-colors"
                          title="Delete product"
                        >
                          <TbTrash className="text-xl" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default List;
