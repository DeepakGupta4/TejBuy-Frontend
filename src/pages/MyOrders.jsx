import React, { useState, useMemo } from "react";
import { useSelector } from "react-redux";
import NoData from "../components/NoData";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const MyOrders = () => {
  const orders = useSelector((state) => state.orders.order);
  const [expandedOrderId, setExpandedOrderId] = useState(null);

  // Sort orders by latest first
  const sortedOrders = useMemo(
    () => [...orders].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)),
    [orders]
  );

  // -------------------- PDF Receipt --------------------
  const downloadReceipt = (order) => {
    const doc = new jsPDF();

    // ----------- BRANDING -----------
    const logo = "https://res.cloudinary.com/dqqengkjo/image/upload/v1763220502/tejbuylogo_go2qvg.png";
    doc.addImage(logo, "PNG", 14, 10, 30, 30);

    doc.setFontSize(22);
    doc.setFont("helvetica", "bold");
    doc.text("TejBuy", 50, 25);

    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    doc.text("Order Receipt", 50, 32);

    doc.setDrawColor(180, 180, 180);
    doc.line(14, 42, 195, 42);

    // SAFE USER + PRODUCT FETCH
    const user = typeof order.userId === "object" && order.userId !== null ? order.userId : {
      name: "-",
      email: "-",
      mobile: "-",
      address: "-"
    };

    const product = order.product_details || {
      name: "-",
      price: 0,
      category: "-"
    };

    const quantity = order.quantity || 1;
    const price = Number(product.price) || 0;
    const totalAmount = quantity * price;

    // ---------- ORDER DETAILS ----------
    autoTable(doc, {
      startY: 50,
      headStyles: { fillColor: [0, 92, 185], halign: "center" },
      head: [["Order Details", "Information"]],
      body: [
        ["Order ID", order.orderId],
        ["Order Date", new Date(order.createdAt).toLocaleString()],
        [
          "Delivery Date",
          order.deliveryDate ? new Date(order.deliveryDate).toLocaleString() : "Not Delivered",
        ],
        ["Payment Status", order.payment_status],
        ["Quantity", quantity],
        ["Category", product.category],
        ["Total Amount", `₹${totalAmount}`],
      ],
      theme: "grid",
      styles: { fontSize: 11 },
    });

    // ---------- CUSTOMER DETAILS ----------
    autoTable(doc, {
      startY: doc.lastAutoTable.finalY + 10,
      headStyles: { fillColor: [0, 92, 185], halign: "center" },
      head: [["Customer Details", "Information"]],
      body: [
        ["Name", user.name],
        ["Email", user.email],
        ["Phone", user.mobile],
        ["Address", user.address],
      ],
      theme: "grid",
      styles: { fontSize: 11 },
    });

    // ---------- PRODUCT DETAILS ----------
    autoTable(doc, {
      startY: doc.lastAutoTable.finalY + 10,
      headStyles: { fillColor: [0, 92, 185], halign: "center" },
      head: [["Product Details", "Information"]],
      body: [
        ["Product Name", product.name],
        ["Price", `₹${price}`],
      ],
      theme: "grid",
      styles: { fontSize: 11 },
    });

    // ----------- FOOTER -----------
    doc.setFontSize(11);
    doc.setFont("helvetica", "italic");
    doc.text("Thank you for shopping with TejBuy!", 14, doc.lastAutoTable.finalY + 20);
    doc.text("For support: support@tejbuy.com", 14, doc.lastAutoTable.finalY + 27);

    doc.save(`TejBuy_Receipt_${order.orderId}.pdf`);
  };

  return (
    <div className="p-4">
      <div className="bg-white shadow-md p-3 rounded font-semibold mb-4">
        <h1 className="text-lg">My Orders</h1>
      </div>

      {!orders.length && <NoData />}

      <div className="flex flex-col gap-4">
        {sortedOrders.map((order, index) => {
          const product = order.product_details || {};
          const img = product.image;

          let imageUrl = null;
          if (img) {
            if (typeof img === "string") imageUrl = img.split(",")[0].trim();
            if (Array.isArray(img)) imageUrl = img[0];
          }

          const isExpanded = expandedOrderId === order._id;

          const statusClasses = {
            DELIVERED: "bg-green-100 text-green-800",
            CANCELLED: "bg-red-100 text-red-800",
            PROCESSING: "bg-yellow-100 text-yellow-800",
            PENDING: "bg-blue-100 text-blue-800",
          };

          const statusClass = statusClasses[order.payment_status] || "bg-gray-100 text-gray-700";

          return (
            <div
              key={order._id + index}
              className="bg-white shadow-sm rounded p-4 flex flex-col gap-4 border hover:shadow-lg transition-transform transform hover:scale-105"
            >
              {/* Product Row */}
              <div
                className="flex items-center gap-3 cursor-pointer"
                onClick={() => setExpandedOrderId(isExpanded ? null : order._id)}
              >
                {imageUrl ? (
                  <img src={imageUrl} alt={product.name} className="w-16 h-16 object-cover rounded" />
                ) : (
                  <div className="w-16 h-16 bg-gray-200 rounded flex items-center justify-center text-gray-400 text-xs">
                    No Image
                  </div>
                )}

                <div className="flex flex-col">
                  <p className="font-medium">{product.name || "Unnamed Product"}</p>
                  <p className="text-xs text-gray-500">Order No: {order.orderId}</p>
                  <p className="text-sm">
                    Amount: <span className="font-semibold">₹{order.totalAmt}</span>
                  </p>
                </div>
              </div>

              {/* Status Badge */}
              <div className="mt-2 md:mt-0 md:ml-auto">
                <span className={`px-3 py-1 text-sm font-medium rounded-full ${statusClass}`}>
                  {order.payment_status}
                </span>
              </div>

              {/* Expanded */}
              {isExpanded && (
                <div className="mt-3 border-t pt-3 flex flex-col gap-2 text-sm">
                  <p><b>Order Date:</b> {new Date(order.createdAt).toLocaleString()}</p>
                  <p><b>Delivery Date:</b> {order.deliveryDate ? new Date(order.deliveryDate).toLocaleString() : "Not Delivered"}</p>
                  <p><b>Payment Status:</b> {order.payment_status}</p>
                  <p><b>Quantity:</b> {order.quantity || 1}</p>
                  <p><b>Category:</b> {product.category || "-"}</p>
                  <p><b>Total Amount:</b> ₹{order.totalAmt}</p>

                  {/* User */}
                  <p><b>User Name:</b> {order?.userId?.name || "-"}</p>
                  <p><b>Email:</b> {order?.userId?.email || "-"}</p>
                  <p><b>Phone:</b> {order?.userId?.mobile || "-"}</p>
                  <p><b>Address:</b> {order?.userId?.address || "-"}</p>

                  {order.payment_status === "DELIVERED" && (
                    <button
                      onClick={() => downloadReceipt(order)}
                      className="mt-3 bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
                    >
                      Download Receipt (PDF)
                    </button>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MyOrders;
