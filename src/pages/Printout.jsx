import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FiUpload } from "react-icons/fi";
import Axios from "../utils/Axios";
import SummaryApi from "../common/SummaryApi";
import { useSelector } from "react-redux";

const Printout = () => {
  const user = useSelector((state) => state.user);

  const [file, setFile] = useState(null);
  const [pageCount, setPageCount] = useState(1);
  const [printColor, setPrintColor] = useState("bw");
  const [printSide, setPrintSide] = useState("single");
  const [printQuality, setPrintQuality] = useState("normal");

  const [loading, setLoading] = useState(false);

  // POPUP
  const [showPopup, setShowPopup] = useState(false);
  const [mobile, setMobile] = useState(user?.mobile || "");
  const [address, setAddress] = useState(
    user?.address_details?.[0]?.fullAddress || ""
  );

  const PRICE_BW = 3;
  const PRICE_COLOR = 10;

  const totalPrice =
    printColor === "bw" ? pageCount * PRICE_BW : pageCount * PRICE_COLOR;

  const handleFileChange = (e) => setFile(e.target.files[0]);

  // STEP 1 → ORDER BUTTON PRESS CHECK
  const handleOrderSubmit = async () => {
  if (!file) return alert("Please upload a file!");

  const mobileDB = user?.mobile;
  const addressDB = user?.address_details?.[0]?.fullAddress;

  // Convert both to string safely
  const mobileStr = String(mobileDB || "").trim();
  const addressStr = String(addressDB || "").trim();

  // 👉 Mobile ya Address missing ho to popup open
  if (!mobileStr || !addressStr) {
    setShowPopup(true);
    return;
  }

  createOrder();
};


  //  STEP 2 → POPUP ME DETAILS UPDATE
  const handleDetailsSubmit = async () => {
  try {
    const mobileStr = String(mobile || "").trim();
    const addressStr = String(address || "").trim();

    // Validation
    if (!mobileStr || !addressStr) {
      alert("Mobile number or Address cannot be empty!");
      return;
    }

    const res = await Axios.put(
      "/api/user/update-print-details",
      { mobile: mobileStr, address: addressStr },
      { headers: { Authorization: localStorage.getItem("token") } }
    );

    if (res.data.success) {
      setShowPopup(false);
      createOrder();
    }
  } catch (err) {
    console.log(err);
    alert("Details update me error!");
  }
};


  // STEP 3 → FINAL ORDER CREATE FUNCTION
  const createOrder = async () => {
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("deliveryAddress", address);
      formData.append("phoneNumber", mobile);
      formData.append("printColor", printColor);
      formData.append("printSide", printSide);
      formData.append("printQuality", printQuality);
      formData.append("file", file);

      const response = await Axios({
        ...SummaryApi.printoutOrder,
        data: formData,
        headers: { "Content-Type": "multipart/form-data" },
      });

      alert("Printout Order Placed Successfully!");
      console.log(response.data);

    } catch (error) {
      console.log(error);

      // Backend error: address or mobile missing => popup open
      if (
        error?.response?.data?.message === "Delivery address not provided" ||
        error?.response?.data?.message === "Phone number is required"
      ) {
        setShowPopup(true);
        return;
      }

      alert("Order me error!");
    }

    setLoading(false);
  };

  return (
    <>
      {/* POPUP */}
      {showPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center">
          <div className="bg-white w-80 p-4 rounded-xl shadow-lg">
            <h2 className="text-lg font-bold text-center mb-2">
              Enter Delivery Details
            </h2>

            <input
              className="w-full p-2 border rounded mb-2"
              placeholder="Mobile Number"
              value={mobile}
              onChange={(e) => setMobile(e.target.value)}
            />

            <textarea
              className="w-full p-2 border rounded mb-2"
              placeholder="Full Address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />

            <button
              onClick={handleDetailsSubmit}
              className="w-full bg-blue-600 text-white p-2 rounded"
            >
              Save & Continue
            </button>
          </div>
        </div>
      )}

      {/* MAIN PAGE */}
      <div className="w-full max-w-2xl mx-auto p-4 mt-6">
        <h1 className="text-2xl font-bold mb-4 text-center">
          🖨️ Printout Suvidha
        </h1>

        {/* FILE UPLOAD */}
        <label className="flex flex-col items-center justify-center w-full border-2 border-dashed border-blue-400 bg-blue-50 p-6 rounded-xl cursor-pointer hover:bg-blue-100 transition">
          <FiUpload size={40} className="text-blue-600" />
          <p className="text-gray-700 mt-2">
            {file ? file.name : "PDF ya Image Upload Karein"}
          </p>
          <input
            type="file"
            accept="image/*,.pdf"
            className="hidden"
            onChange={handleFileChange}
          />
        </label>

        {file && file.type.startsWith("image/") && (
          <div className="mt-4">
            <img
              src={URL.createObjectURL(file)}
              alt="preview"
              className="w-full h-52 object-contain rounded-lg bg-white shadow"
            />
          </div>
        )}

        {/* OPTIONS */}
        <div className="mt-6 bg-white p-4 rounded-xl shadow">
          <div className="mb-4">
            <label className="font-medium">Pages</label>
            <input
              type="number"
              min="1"
              value={pageCount}
              onChange={(e) => setPageCount(Number(e.target.value))}
              className="w-full p-2 border rounded mt-1"
            />
          </div>

          <div className="mb-4">
            <label className="font-medium">Print Color</label>
            <select
              value={printColor}
              onChange={(e) => setPrintColor(e.target.value)}
              className="w-full p-2 border rounded mt-1"
            >
              <option value="bw">Black & White</option>
              <option value="color">Color</option>
            </select>
          </div>

          <div className="mb-4">
            <label className="font-medium">Print Side</label>
            <select
              value={printSide}
              onChange={(e) => setPrintSide(e.target.value)}
              className="w-full p-2 border rounded mt-1"
            >
              <option value="single">Single Side</option>
              <option value="double">Double Side</option>
            </select>
          </div>

          <div className="mb-4">
            <label className="font-medium">Print Quality</label>
            <select
              value={printQuality}
              onChange={(e) => setPrintQuality(e.target.value)}
              className="w-full p-2 border rounded mt-1"
            >
              <option value="normal">Normal</option>
              <option value="high">High Quality</option>
            </select>
          </div>

          <div className="p-3 bg-gray-100 rounded-lg text-lg font-semibold text-center">
            Total: ₹{totalPrice}
          </div>

          <button
            onClick={handleOrderSubmit}
            disabled={loading}
            className="w-full mt-4 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
          >
            {loading ? "Processing..." : "Order Place Karein"}
          </button>
        </div>

        <Link to="/" className="block text-center mt-4 text-blue-600">
          ⬅ Back to Home
        </Link>
      </div>
    </>
  );
};

export default Printout;
