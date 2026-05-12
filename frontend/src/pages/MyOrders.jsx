import React, { useContext, useEffect, useState } from 'react'
import { ShopContext } from '../context/ShopContext'
import axios from 'axios'
import { FaBox, FaShippingFast, FaCheckCircle, FaClock } from 'react-icons/fa'

const MyOrders = () => {
  const { url, token } = useContext(ShopContext)
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchOrders = async () => {
    try {
      setLoading(true)
      const response = await axios.post(url + "/api/order/userorders", {}, { headers: { token } })
      setData(response.data.data)
    } catch (error) {
      console.error("Error fetching orders:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (token) {
      fetchOrders()
    }
  }, [token])

  const getStatusIcon = (status) => {
    switch (status.toLowerCase()) {
      case 'delivered':
        return <FaCheckCircle className="text-green-500" />
      case 'out for delivery':
        return <FaShippingFast className="text-blue-500" />
      case 'product loading':
        return <FaClock className="text-orange-500" />
      default:
        return <FaClock className="text-gray-500" />
    }
  }

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' }
    return new Date(dateString).toLocaleDateString(undefined, options)
  }

  return (
    <section className='max-padd-container pt-32 pb-16'>
      <div className='bg-white rounded-lg shadow-sm p-6'>
        <div className='flex justify-between items-center mb-6'>
          <h2 className='text-2xl font-bold text-gray-800'>My Orders</h2>
          <button 
            onClick={fetchOrders} 
            className='text-primary hover:text-primary-dark medium-14 flex items-center gap-2'
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-black" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
            </svg>
            <p className='h-5 w-5 text-black'>Refresh</p>
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : data.length === 0 ? (
          <div className="text-center py-12">
            <FaBox className="mx-auto text-4xl text-gray-300 mb-4" />
            <h3 className="text-lg font-medium text-gray-500">No orders found</h3>
            <p className="text-gray-400 mt-1">You haven't placed any orders yet</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className='w-full'>
              <thead>
                <tr className='border-b border-gray-200 text-gray-500 medium-14 text-left'>
                  <th className='pb-4 pl-2 hidden md:table-cell'>Order ID</th>
                  <th className='pb-4 pl-2'>Items</th>
                  <th className='pb-4 pl-2'>Date</th>
                  <th className='pb-4 pl-2'>Total</th>
                  <th className='pb-4 pl-2'>Status</th>
                  {/* <th className='pb-4 pl-2'>Actions</th> */}
                </tr>
              </thead>
              <tbody className='divide-y divide-gray-200'>
                {data.map((order, i) => (
                  <tr key={i} className='hover:bg-gray-10 transition-colors'>
                    <td className='py-4 pl-2 hidden md:table-cell'>
                      <p className='text-gray-500 text-sm'>#{order._id.slice(-8).toUpperCase()}</p>
                    </td>
                    <td className='py-4 pl-2'>
                      <div className='flex items-center gap-3'>
                        <div className='bg-gray-100 p-2 rounded-lg hidden sm:block'>
                          <FaBox className='text-xl text-secondary' />
                        </div>
                        <div>
                          {order.items.map((item, index) => (
                            <p key={index} className='text-gray-700 medium-14'>
                              {item.name} <span className='text-gray-400'>x{item.quantity}</span>
                              {index < order.items.length - 1 && ', '}
                            </p>
                          ))}
                        </div>
                      </div>
                    </td>
                    <td className='py-4 pl-2'>
                      <p className='text-gray-500 text-sm'>{formatDate(order.createdAt)}</p>
                    </td>
                    <td className='py-4 pl-2'>
                      <p className='text-gray-700 font-medium'>${order.amount.toFixed(2)}</p>
                    </td>
                    <td className='py-4 pl-2'>
                      <div className='flex items-center gap-2'>
                        {getStatusIcon(order.status)}
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          order.status.toLowerCase() === 'delivered' ? 'bg-green-100 text-green-800' :
                          order.status.toLowerCase() === 'out for delivery' ? 'bg-blue-100 text-blue-800' :
                          order.status.toLowerCase() === 'product loading' ? 'bg-orange-100 text-orange-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {order.status}
                        </span>
                      </div>
                    </td>
                    {/* <td className='py-4 pl-2'>
                      <button 
                        onClick={() => console.log('Track order:', order._id)}
                        className='btn-outline rounded-md !py-2 !px-3 text-sm hover:bg-primary hover:text-white transition-colors'
                      >
                        Track
                      </button>
                    </td> */}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </section>
  )
}

export default MyOrders