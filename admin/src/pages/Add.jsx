import React, { useEffect, useState } from 'react'
import upload_area from '../assets/upload_area1.svg'
import { FaPlus } from "react-icons/fa6" 
import axios from "axios"
import { ToastContainer, toast } from 'react-toastify';

const Add = ({url}) => {
  const [image, setImage] = useState(false)
  const [data, setData] = useState({
    name: "",
    description: "",
    price: "",
    category: "Women",
  })

  const onChangeHandler = (e)=>{
    const name = e.target.name;
    const value = e.target.value;
    setData((data)=>({ ...data, [name]:value}))
  }

  // useEffect(()=>{
  //   console.log(data)
  // }, [data])

  const onSubmitHandler = async (event)=> {
    event.preventDefault();
    const formData = new FormData();
    formData.append("name", data.name)
    formData.append("description", data.description)
    formData.append("price", Number(data.price))
    formData.append("category", data.category)
    formData.append("image", image);
    const response = await axios.post(`${url}/api/product/add`, formData);
    if(response.data.success){
      setData({
        name:"",
        description: "",
        price: "",
        category: "Women"
      })
      setImage(false)
      toast.success(response.data.message)
    } else {
      toast.error(response.data.message)
    }
  }

  

  return (
    <section className="p-6 sm:p-10 w-full bg-gray-100 min-h-screen">
      <form onSubmit={onSubmitHandler} action="" className="flex flex-col gap-6 max-w-2xl mx-auto bg-white p-6 rounded-2xl shadow-md">
        <h4 className="text-2xl font-semibold text-gray-800 uppercase">Products Upload</h4>

        <div className="flex flex-col gap-2">
          <p className="text-sm font-medium text-gray-700">Upload image</p>
          <label htmlFor="image">
            <div className="w-24 h-24 cursor-pointer border-2 border-dashed border-gray-300 rounded-md flex items-center justify-center">
            <img src={image? URL.createObjectURL(image) : upload_area} alt="Upload" className="h-16 object-contain" />
          </div>
          </label>
          
          <input onChange={(e)=>setImage(e.target.files[0])} type="file" id="image" hidden required />
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="name" className="text-sm font-medium text-gray-700">Product name</label>
          <input
          onChange={onChangeHandler}
          value={data.name}
            type="text"
            name="name"
            id="name"
            placeholder="Type here..."
            className="border border-gray-300 rounded-md py-2 px-3 focus:ring-2 focus:ring-primary-500 focus:outline-none"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="description" className="text-sm font-medium text-gray-700">Product Description</label>
          <textarea
          onChange={onChangeHandler}
          value={data.description}
            name="description"
            id="description"
            rows="6"
            placeholder="Write content here..."
            required
            className="border border-gray-300 rounded-md py-2 px-3 resize-none focus:ring-2 focus:ring-primary-500 focus:outline-none"
          ></textarea>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="flex flex-col gap-2">
            <label htmlFor="category" className="text-sm font-medium text-gray-700">Product category</label>
            <select
            onChange={onChangeHandler}
            value={data.category}
              name="category"
              id="category"
              className="border border-gray-300 rounded-md py-2 px-3 focus:ring-2 focus:ring-primary-500 focus:outline-none"
            >
              <option value="Women">Women</option>
              <option value="Men">Men</option>
              <option value="Kids">Kids</option>
              <option value="Unisex">Unisex</option>
            </select>
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="price" className="text-sm font-medium text-gray-700">Product price</label>
            <input
            onChange={onChangeHandler}
            value={data.price}
              type="number"
              name="price"
              id="price"
              placeholder="$20"
              className="border border-gray-300 rounded-md py-2 px-3 focus:ring-2 focus:ring-primary-500 focus:outline-none"
            />
          </div>
        </div>

        <button
          type="submit"
          className="mt-4 bg-gray-900 text-white py-2 px-4 rounded-md hover:bg-gray-800 flex items-center justify-center gap-2 transition-all duration-200"
        >
          <FaPlus />
          Add Product
        </button>
      </form>
    </section>
  )
}

export default Add
