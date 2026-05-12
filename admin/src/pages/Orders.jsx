import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import { FaBox, FaTruck, FaCheckCircle, FaUser, FaPhone } from 'react-icons/fa'

const Orders = ({ url }) => {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchAllOrders = async () => {
    try {
      setLoading(true)
      const response = await axios.get(`${url}/api/order/list`)
      if (response.data.success) {
        setOrders(response.data.data)
      } else {
        toast.error("Failed to fetch orders")
      }
    } catch (error) {
      toast.error("Error fetching orders")
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const statusHandler = async (event, orderId) => {
    try {
      const response = await axios.post(`${url}/api/order/status`, {
        orderId,
        status: event.target.value
      })
      if (response.data.success) {
        toast.success("Order status updated")
        await fetchAllOrders()
      } else {
        toast.error("Failed to update order status")
      }
    } catch (error) {
      toast.error("Error updating status")
      console.error(error)
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'Product Loading':
        return 'bg-orange-50 text-orange-600'
      case 'Out for delivery':
        return 'bg-blue-50 text-blue-600'
      case 'Delivered':
        return 'bg-green-50 text-green-600'
      default:
        return 'bg-gray-50 text-gray-600'
    }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Product Loading':
        return <FaBox className="text-orange-400" />
      case 'Out for delivery':
        return <FaTruck className="text-blue-400" />
      case 'Delivered':
        return <FaCheckCircle className="text-green-400" />
      default:
        return <FaBox className="text-gray-400" />
    }
  }

  useEffect(() => {
    fetchAllOrders()
  }, [])

  return (
    <div className="flex h-screen overflow-hidden">

      <div className="flex-1 overflow-y-auto">
        <section className="p-6 sm:p-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Order Management</h2>
            <button 
              onClick={fetchAllOrders}
              className="flex items-center gap-2 text-sm bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-md transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
              </svg>
              Refresh
            </button>
          </div>

          {loading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
            </div>
          ) : orders.length === 0 ? (
            <div className="text-center py-12">
              <FaBox className="mx-auto text-4xl text-gray-200 mb-4" />
              <h3 className="text-lg font-medium text-gray-500">No orders found</h3>
              <p className="text-gray-400 mt-1">There are currently no orders to display</p>
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-10">
                    <tr className="text-left text-gray-600 text-sm font-medium">
                      <th className="px-6 py-3">Order ID</th>
                      <th className="px-6 py-3">Customer & Items</th>
                      <th className="px-6 py-3">Total</th>
                      <th className="px-6 py-3">Status</th>
                      <th className="px-6 py-3">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {orders.map((order) => (
                      <tr key={order._id} className="hover:bg-gray-10 transition-colors">
                        <td className="px-6 py-4">
                          <p className="text-gray-500 text-sm">#{order._id.slice(-8).toUpperCase()}</p>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-start gap-4">
                            <div className="bg-gray-100 p-3 rounded-lg">
                              <FaBox className="text-lg text-gray-400" />
                            </div>
                            <div>
                              <div className="mb-3">
                                <h4 className="font-medium text-gray-800 flex items-center gap-2">
                                  <FaUser className="text-gray-400 text-sm" />
                                  {order.address.firstName} {order.address.lastName}
                                </h4>
                                <p className="text-gray-500 text-sm flex items-center gap-2 mt-1">
                                  <FaPhone className="text-gray-400 text-sm" />
                                  {order.address.phone}
                                </p>
                              </div>
                              <div className="text-gray-700 text-sm">
                                {order.items.map((item, index) => (
                                  <p key={index}>
                                    {item.name} <span className="text-gray-400">x{item.quantity}</span>
                                    {index < order.items.length - 1 && ', '}
                                  </p>
                                ))}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <p className="text-gray-700 font-medium">${order.amount.toFixed(2)}</p>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            {getStatusIcon(order.status)}
                            <span className={`px-3 py-1 rounded-full text-xs ${getStatusColor(order.status)}`}>
                              {order.status}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <select
                            onChange={(event) => statusHandler(event, order._id)}
                            value={order.status}
                            className="bg-white border border-gray-300 rounded-md px-3 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-primary/30 focus:border-primary/30"
                          >
                            <option value="Product Loading">Product Loading</option>
                            <option value="Out for delivery">Out for delivery</option>
                            <option value="Delivered">Delivered</option>
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </section>
      </div>
    </div>
  )
}

export default Orders