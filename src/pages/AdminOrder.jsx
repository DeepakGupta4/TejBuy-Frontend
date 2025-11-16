import React, { useEffect, useState } from "react";
import Axios from "../utils/Axios";
import SummaryApi from "../common/SummaryApi";
import AxiosToastError from "../utils/AxiosToastError";
import toast from "react-hot-toast";

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);

  console.log(
    "Statuses in DB:",
    orders.map((o) => o.payment_status)
  );

  // Filters
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await Axios({ ...SummaryApi.adminAllOrders });
      if (response.data.success) setOrders(response.data.data);
    } catch (err) {
      AxiosToastError(err);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (orderId, status) => {
    try {
      const response = await Axios(
        SummaryApi.adminUpdateOrderStatus(orderId, status)
      );

      if (response.data.success) {
        setOrders((prevOrders) =>
          prevOrders.map((order) =>
            order._id === orderId ? { ...order, payment_status: status } : order
          )
        );
        toast.success("Status Updated!");
      } else {
        toast.error("Failed to update status. Try again!");
      }
    } catch (err) {
      AxiosToastError(err);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // FILTER LOGIC
 const filteredOrders = orders.filter((order) => {
  const orderDate = new Date(order.createdAt);

  //  PENDING custom logic
 
  if (statusFilter === "PENDING") {
    return (
      order.payment_status === "CASH ON DELIVERY" ||
      order.payment_status === "PENDING"
    );
  }

  // Normal Status Filter

  if (
    statusFilter !== "ALL" &&
    order.payment_status?.toUpperCase() !== statusFilter.toUpperCase()
  ) {
    return false;
  }

  // Date Filter

  // Start Date
  if (startDate) {
    const start = new Date(startDate);
    start.setHours(0, 0, 0, 0); // 00:00:00 of selected day

    if (orderDate < start) return false;
  }

  // End Date
  if (endDate) {
    const end = new Date(endDate);
    end.setHours(23, 59, 59, 999); // 23:59:59 end of day

    if (orderDate > end) return false;
  }

  return true;
});




  if (loading) return <p className="p-5">Loading orders...</p>;

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">All Orders</h1>

      {/* FILTER SECTION */}
      <div className="mb-4 p-4 bg-white rounded shadow-md flex flex-wrap gap-4">
        {/* Status Filter */}
        <div>
          <label className="font-semibold">Status:</label>
          <select
            className="border p-2 rounded ml-2"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="ALL">ALL</option>
            <option value="PENDING">PENDING</option>
            <option value="PROCESSING">PROCESSING</option>
            <option value="SHIPPED">SHIPPED</option>
            <option value="DELIVERED">DELIVERED</option>
            <option value="CANCELLED">CANCELLED</option>
          </select>
        </div>

        {/* Start Date */}
        <div>
          <label className="font-semibold">Start Date:</label>
          <input
            type="date"
            className="border p-2 rounded ml-2"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
        </div>

        {/* End Date */}
        <div>
          <label className="font-semibold">End Date:</label>
          <input
            type="date"
            className="border p-2 rounded ml-2"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </div>
      </div>

      {/* TABLE */}
      <div className="bg-white rounded shadow-md p-4 overflow-x-auto">
        <table className="w-full border">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-2 border">Order ID</th>
              <th className="p-2 border">Date</th>
              <th className="p-2 border">User</th>
              <th className="p-2 border">Product</th>
              <th className="p-2 border">Image</th>
              <th className="p-2 border">Amount</th>
              <th className="p-2 border">Status</th>
              <th className="p-2 border">Action</th>
            </tr>
          </thead>

          <tbody>
            {filteredOrders.map((order) => {
              let imageUrl = null;
              const imgField = order?.product_details?.image;

              if (imgField) {
                if (typeof imgField === "string") {
                  imageUrl = imgField.split(",")[0].trim();
                } else if (Array.isArray(imgField)) {
                  imageUrl = imgField[0];
                }
              }

              return (
                <tr key={order._id} className="text-center">
                  <td className="p-2 border">{order.orderId}</td>
                  <td className="p-2 border">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </td>
                  <td className="p-2 border">{order?.userId?.name}</td>
                  <td className="p-2 border">{order?.product_details?.name}</td>

                  <td className="p-2 border">
                    {imageUrl ? (
                      <img
                        src={imageUrl}
                        className="w-10 h-10 object-cover rounded mx-auto"
                      />
                    ) : (
                      "No Image"
                    )}
                  </td>

                  <td className="p-2 border">₹{order.totalAmt}</td>

                  <td className="p-2 border">
                    <select
                      value={order.payment_status}
                      onChange={(e) => updateStatus(order._id, e.target.value)}
                      className="border p-1 rounded"
                    >
                      <option value="PENDING">PENDING</option>
                      <option value="PROCESSING">PROCESSING</option>
                      <option value="SHIPPED">SHIPPED</option>
                      <option value="DELIVERED">DELIVERED</option>
                      <option value="CANCELLED">CANCELLED</option>
                    </select>
                  </td>

                  <td className="p-2 border">
                    <button
                      className="bg-blue-600 text-white px-3 py-1 rounded"
                      onClick={() => setSelectedOrder(order)}
                    >
                      View
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Order Details Modal */}
      {selectedOrder && (
        <div className="fixed top-0 left-0 w-full h-full bg-black/40 flex justify-center items-center">
          <div className="bg-white p-5 rounded shadow-lg w-96 relative">
            <button
              onClick={() => setSelectedOrder(null)}
              className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded"
            >
              X
            </button>

            <h2 className="text-lg font-bold">Order Details</h2>
            <p>
              <b>Order ID:</b> {selectedOrder.orderId}
            </p>
            <p>
              <b>User:</b> {selectedOrder?.userId?.name}
            </p>
            <p>
              <b>Email:</b> {selectedOrder?.userId?.email}
            </p>
            <p>
              <b>Product:</b> {selectedOrder.product_details.name}
            </p>
            <p>
              <b>Amount:</b> ₹{selectedOrder.totalAmt}
            </p>
            <p>
              <b>Status:</b> {selectedOrder.payment_status}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminOrders;
