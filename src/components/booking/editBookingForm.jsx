import React, { useState, useEffect } from 'react';

const EditBookingForm = ({ bookingData, onSubmit }) => {
  const [customerId, setCustomerId] = useState(bookingData.customer || "");
  const [bookingDate, setBookingDate] = useState(bookingData.bookingDate || "");
  const [bookingTime, setBookingTime] = useState(bookingData.bookingTime || "");
  const [bookingDuration, setBookingDuration] = useState(bookingData.bookingDuration || 1);
  const [bookingPrice, setBookingPrice] = useState(bookingData.bookingPrice || 0);
  const [bookingStatus, setBookingStatus] = useState(bookingData.bookingStatus || "pending");
  const [paymentMethod, setPaymentMethod] = useState(bookingData.paymentMethod || "");
  const [paymentStatus, setPaymentStatus] = useState(bookingData.paymentStatus || "pending");
  const [paymentDate, setPaymentDate] = useState(bookingData.paymentDate || "");
  const [ground, setGround] = useState(bookingData.ground || "");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

 
  useEffect(() => {
    if (bookingData) {
      setCustomerId(bookingData.customer);
      setBookingDate(bookingData.bookingDate);
      setBookingTime(bookingData.bookingTime);
      setBookingDuration(bookingData.bookingDuration);
      setBookingPrice(bookingData.bookingPrice);
      setBookingStatus(bookingData.bookingStatus);
      setPaymentMethod(bookingData.paymentMethod);
      setPaymentStatus(bookingData.paymentStatus);
      setPaymentDate(bookingData.paymentDate);
      setGround(bookingData.ground);
    }
  }, [bookingData]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const updatedBooking = {
        id: bookingData.id,
        customer: customerId,
        bookingDate: new Date(bookingDate),
        bookingTime,
        bookingDuration,
        bookingPrice,
        bookingStatus,
        paymentMethod,
        paymentStatus,
        paymentDate: paymentDate ? new Date(paymentDate) : null,
        ground,
      };

      console.log('Booking updated successfully', updatedBooking);
      onSubmit(updatedBooking); 
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <h1 className="text-2xl font-bold">Edit Booking</h1>

      {/* Form inputs for booking details */}
      <div className="flex gap-2">
        <div className="flex flex-col gap-2 w-1/2">
          <label className="text-gray-500">Customer ID</label>
          <input
            type="text"
            value={customerId}
            onChange={(e) => setCustomerId(e.target.value)}
            placeholder="Enter Customer ID"
            className="rounded-md p-3 border border-gray-300"
            required
          />
        </div>
        <div className="flex flex-col gap-2 w-1/2">
          <label className="text-gray-500">Booking Date</label>
          <input
            type="date"
            value={bookingDate}
            onChange={(e) => setBookingDate(e.target.value)}
            className="rounded-md p-3 border border-gray-300"
            required
          />
        </div>
      </div>

      <div className="flex gap-2">
        <div className="flex flex-col gap-2 w-1/2">
          <label className="text-gray-500">Booking Time</label>
          <input
            type="time"
            value={bookingTime}
            onChange={(e) => setBookingTime(e.target.value)}
            className="rounded-md p-3 border border-gray-300"
            required
          />
        </div>
        <div className="flex flex-col gap-2 w-1/2">
          <label className="text-gray-500">Booking Duration (hours)</label>
          <input
            type="number"
            value={bookingDuration}
            onChange={(e) => setBookingDuration(Number(e.target.value))}
            className="rounded-md p-3 border border-gray-300"
            min="1"
            required
          />
        </div>
      </div>

      <div className="flex gap-2">
        <div className="flex flex-col gap-2 w-1/2">
          <label className="text-gray-500">Booking Price</label>
          <input
            type="number"
            value={bookingPrice}
            onChange={(e) => setBookingPrice(Number(e.target.value))}
            className="rounded-md p-3 border border-gray-300"
            min="0"
            required
          />
        </div>
        <div className="flex flex-col gap-2 w-1/2">
          <label className="text-gray-500">Payment Method</label>
          <input
            type="text"
            value={paymentMethod}
            onChange={(e) => setPaymentMethod(e.target.value)}
            placeholder="Enter Payment Method"
            className="rounded-md p-3 border border-gray-300"
            required
          />
        </div>
      </div>

      <div className="flex gap-2">
        <div className="flex flex-col gap-2 w-1/2">
          <label className="text-gray-500">Payment Status</label>
          <input
            type="text"
            value={paymentStatus}
            onChange={(e) => setPaymentStatus(e.target.value)}
            placeholder="Enter Payment Status"
            className="rounded-md p-3 border border-gray-300"
            required
          />
        </div>
        <div className="flex flex-col gap-2 w-1/2">
          <label className="text-gray-500">Payment Date</label>
          <input
            type="date"
            value={paymentDate}
            onChange={(e) => setPaymentDate(e.target.value)}
            className="rounded-md p-3 border border-gray-300"
          />
        </div>
      </div>

      <div className="flex gap-2">
        <div className="flex flex-col gap-2 w-1/2">
          <label className="text-gray-500">Ground</label>
          <input
            type="text"
            value={ground}
            onChange={(e) => setGround(e.target.value)}
            placeholder="Enter Ground Name"
            className="rounded-md p-3 border border-gray-300"
            required
          />
        </div>
      </div>

      {error && <p className="text-red-500">{error}</p>}

      <button
        className={`mt-5 w-full bg-primary text-white rounded-md py-2 ${loading ? "cursor-not-allowed" : ""}`}
        type="submit"
        disabled={loading}
      >
        {loading && <span className="loading loading-spinner"></span>}
        {loading ? "Updating Booking..." : "Update Booking"}
      </button>
    </form>
  );
};

export default EditBookingForm;
