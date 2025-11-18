import React, { useEffect, useState } from "react";
import Axios from "../utils/Axios";
import SummaryApi from "../common/SummaryApi";
import toast from "react-hot-toast";

const PrintoutRequests = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState("all");

  // -----------------------------------------
  // Fetch Printout Orders (ADMIN)
  // -----------------------------------------
  const fetchOrders = async () => {
    try {
      const response = await Axios({ ...SummaryApi.adminPrintoutList });

      const sortedOrders = (response.data.orders || []).sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );

      setOrders(sortedOrders);
    } catch (error) {
      console.log("Fetch Error:", error);
      toast.error("Failed to fetch printout requests");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // -----------------------------------------
  // Update Order Status
  // -----------------------------------------
  const updateStatus = async (id, status) => {
    try {
      await Axios.patch(`/api/printout/${id}/status`, { status });
      toast.success("Status updated successfully");
      fetchOrders();
    } catch (error) {
      console.log(error);
      toast.error("Failed to update status");
    }
  };

  if (loading) return <p className="p-4 text-center">Loading...</p>;

  // -----------------------------------------
  // Filter Orders by Status
  // -----------------------------------------
  const filteredOrders = orders.filter((order) =>
    filterStatus === "all" ? true : order.status === filterStatus
  );

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4 text-center">
        🖨️ Printout Requests (Admin)
      </h2>

      {/* Filter Section */}
      <div className="mb-4 flex items-center gap-2 flex-wrap">
        <label className="font-semibold">Filter by Status:</label>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="p-2 border rounded"
        >
          <option value="all">All</option>
          <option value="pending">Pending</option>
          <option value="printed">Printed</option>
          <option value="out_for_delivery">Out for Delivery</option>
          <option value="delivered">Delivered</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      {/* Table Container */}
      <div className="overflow-x-auto bg-white shadow-lg rounded-lg">
        <div className="max-h-[600px] overflow-y-auto">
          <table className="w-full border-collapse text-left text-sm">
            <thead className="bg-gray-200 sticky top-0 z-20 text-gray-700">
              <tr>
                <th className="p-3 border">User</th>
                <th className="p-3 border">Phone</th>
                <th className="p-3 border">Pages</th>
                <th className="p-3 border">Type</th>
                <th className="p-3 border">Amount</th>
                <th className="p-3 border">Notes</th>
                <th className="p-3 border">File</th>
                <th className="p-3 border">Status</th>
                <th className="p-3 border">Sent At</th>
                <th className="p-3 border">Delivery Address</th>
                <th className="p-3 border">Action</th>
              </tr>
            </thead>

            <tbody>
              {filteredOrders.map((item, index) => {
                // Phone Priority: order.phone > user.phone > "Not provided"
                const phone =
                  item.phone ||
                  item.userId?.mobile ||
                  item.userId?.phone ||
                  "Not provided";

                // Address Priority: order.address > user.address_details > "Not provided"
                const address =
                  item.address ||
                  item.userId?.address ||
                  item.userId?.address_details?.[0]?.fullAddress ||
                  "Not provided";

                return (
                  <tr
                    key={item._id}
                    className={`border-b hover:bg-gray-50 ${
                      index % 2 === 0 ? "bg-white" : "bg-gray-50"
                    }`}
                  >
                    {/* Sticky User Column */}
                    <td className="p-3 border sticky left-0 bg-white z-10">
                      <b>{item.userId?.name || "Unknown User"}</b>
                      <br />
                      <span className="text-xs text-gray-500">
                        {item.userId?.email || "No Email"}
                      </span>
                    </td>

                    {/* Phone */}
                    <td className="p-3 border">{phone}</td>

                    {/* Pages */}
                    <td className="p-3 border">{item.pages}</td>

                    {/* Type */}
                    <td className="p-3 border uppercase">{item.printType}</td>

                    {/* Amount */}
                    <td className="p-3 border font-semibold">
                      ₹{item.totalAmount}
                    </td>

                    {/* Notes */}
                    <td className="p-3 border">
                      {item.notes ? item.notes : "-"}
                    </td>

                    {/* File Download */}
                    <td className="p-3 border">
                      <a
                        href={`${import.meta.env.VITE_API_URL}/${item.fileUrl.replaceAll(
                          "\\",
                          "/"
                        )}`}
                        target="_blank"
                        className="text-blue-600 underline"
                      >
                        Download
                      </a>
                    </td>

                    {/* Status */}
                    <td className="p-3 border capitalize">{item.status}</td>

                    {/* Timestamp */}
                    <td className="p-3 border">
                      {new Date(item.createdAt).toLocaleString()}
                    </td>

                    {/* Address */}
                    <td className="p-3 border">{address}</td>

                    {/* Status Update */}
                    <td className="p-3 border">
                      <select
                        value={item.status}
                        onChange={(e) =>
                          updateStatus(item._id, e.target.value)
                        }
                        className="p-1 border rounded"
                      >
                        <option value="pending">Pending</option>
                        <option value="printed">Printed</option>
                        <option value="out_for_delivery">
                          Out for Delivery
                        </option>
                        <option value="delivered">Delivered</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default PrintoutRequests;
