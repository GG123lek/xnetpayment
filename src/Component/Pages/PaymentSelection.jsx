import React from 'react';
import { useState } from 'react';
import { CreditCard, ChevronLeft } from 'lucide-react';

export default function PaymentSelection() {
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [cardNumber, setCardNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');

  const formatCardNumber = (value) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || '';
    const parts = [];

    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }

    if (parts.length) {
      return parts.join(' ');
    } else {
      return value;
    }
  };

  const handleCardNumberChange = (e) => {
    const formatted = formatCardNumber(e.target.value);
    if (formatted.replace(/\s/g, '').length <= 16) {
      setCardNumber(formatted);
    }
  };

  const formatExpiryDate = (value) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    if (v.length >= 2) {
      return v.slice(0, 2) + ' / ' + v.slice(2, 4);
    }
    return v;
  };

  const handleExpiryChange = (e) => {
    const formatted = formatExpiryDate(e.target.value);
    if (formatted.replace(/\s+\/\s+/g, '').length <= 4) {
      setExpiryDate(formatted);
    }
  };

  const handleCvvChange = (e) => {
    const value = e.target.value.replace(/[^0-9]/gi, '');
    if (value.length <= 3) {
      setCvv(value);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Payment submitted');
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-lg shadow-sm">
          {/* Header */}
          <div className="border-b-4 border-gray-900 px-6 py-4">
            <h1 className="text-2xl font-bold text-gray-900">
              Payment Selection
            </h1>
          </div>

          {/* Content */}
          <div className="p-6 space-y-6">
            {/* UNIFIEDNIS Title */}
            <div className="text-center">
              <h2 className="text-2xl font-light tracking-wider text-gray-700">
                XNET PAY
              </h2>
            </div>

            {/* Payment Detail */}
            <div className="border border-gray-200 rounded-lg overflow-hidden">
              <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
                <h3 className="font-semibold text-gray-900">Payment Detail</h3>
              </div>
              <div className="divide-y divide-gray-200">
                <div className="flex justify-between px-4 py-3">
                  <span className="text-gray-700">Amount</span>
                  <span className="font-medium text-gray-900">₦ 1,000.00</span>
                </div>
                <div className="flex justify-between px-4 py-3">
                  <span className="text-gray-700">Fee</span>
                  <span className="font-medium text-gray-900">₦ 0.00</span>
                </div>
                <div className="flex justify-between px-4 py-3">
                  <span className="font-semibold text-gray-900">Total</span>
                  <span className="font-semibold text-gray-900">₦ 1,000.00</span>
                </div>
              </div>
            </div>

            {/* Payment Methods */}
            <div className="space-y-4">
              {/* Phone Number Option */}
             

              {/* Card Option */}
              <div className="border border-blue-500 rounded-lg p-4">
                <label className="flex items-start cursor-pointer">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="card"
                    checked={paymentMethod === 'card'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="mt-1 h-4 w-4 text-blue-600 border-gray-300"
                  />
                  <div className="ml-3 flex-1">
                    <div className="flex items-center gap-2 font-semibold text-gray-900 mb-2">
                      <CreditCard className="w-5 h-5" />
                      <span>Card</span>
                    </div>
                    <p className="text-sm text-gray-600 mb-4">
                      Pay with debit or credit card. Visa, mastercard, Verve, American Express.
                    </p>

                    {paymentMethod === 'card' && (
                      <div className="space-y-4">
                        {/* Card Number */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            CARD NUMBER
                          </label>
                          <div className="relative">
                            <input
                              type="text"
                              value={cardNumber}
                              onChange={handleCardNumberChange}
                              placeholder="0000 0000 0000 0000"
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            <CreditCard className="absolute right-3 top-2.5 w-5 h-5 text-gray-400" />
                          </div>
                        </div>

                        {/* Expiry and CVV */}
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              EXPIRY DATE
                            </label>
                            <input
                              type="text"
                              value={expiryDate}
                              onChange={handleExpiryChange}
                              placeholder="MM / YY"
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              CVV
                            </label>
                            <input
                              type="text"
                              value={cvv}
                              onChange={handleCvvChange}
                              placeholder="CVV (3 Digits)"
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </label>
              </div>
            </div>

            {/* Footer Buttons */}
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-4">
              <button
                type="button"
                className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors order-2 sm:order-1"
              >
                <ChevronLeft className="w-5 h-5" />
                <span>Back</span>
              </button>
              <button
                type="submit"
                onClick={handleSubmit}
                className="w-full sm:w-auto bg-green-600 hover:bg-green-700 text-white font-medium px-8 py-2.5 rounded-md transition-colors order-1 sm:order-2"
              >
                SUBMIT
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}