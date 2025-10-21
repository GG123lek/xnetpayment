import React from 'react';
import { useState, useEffect } from 'react';
import { CreditCard, ChevronLeft, Loader2 } from 'lucide-react';

// Custom hook to extract transaction data from URL
function useTransactionFromURL() {
  const [transactionData, setTransactionData] = useState(null);

  useEffect(() => {
    const pathSegments = window.location.pathname.split('/').filter(segment => segment);
    
    if (pathSegments.length >= 2) {
      const transactionId = pathSegments[0];
      const amount = parseFloat(pathSegments[1]);
      
      if (transactionId && !isNaN(amount)) {
        setTransactionData({
          transactionId,
          transactionAmount: amount
        });
        return;
      }
    }
    
    // Fallback to test data if no URL params or invalid format
    setTransactionData({
      transactionId: 'TEST123',
      transactionAmount: 1500.00
    });
  }, []);

  return transactionData;
}

export default function PaymentSelection() {
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [cardNumber, setCardNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
  
  // API states
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Get transaction data from URL
  const transactionData = useTransactionFromURL();

  // API URL
  const API_BASE_URL = 'https://pg-payment.xnettpay.com/api/v1';

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

  const formatExpiryForAPI = (expiry) => {
    const [month, year] = expiry.split(' / ');
    if (month && year) {
      return `20${year}-${month.padStart(2, '0')}`;
    }
    return '';
  };

  const validateCardDetails = () => {
    if (!cardNumber || cardNumber.replace(/\s/g, '').length !== 16) {
      return 'Please enter a valid 16-digit card number';
    }
    if (!expiryDate || expiryDate.length !== 7) {
      return 'Please enter a valid expiry date (MM / YY)';
    }
    if (!cvv || cvv.length !== 3) {
      return 'Please enter a valid 3-digit CVV';
    }
    return null;
  };

  // API call to confirm transaction
  const confirmTransaction = async (transactionId, cardData) => {
    try {
      setIsLoading(true);
      setError('');
      
      const apiUrl = `${API_BASE_URL}/confirm/test/transaction/${transactionId}`;
      
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(cardData),
      });

      if (response.ok) {
        // Backend will handle the redirect, so we don't show success page
        console.log('Payment processed successfully, backend will redirect');
      } else {
        throw new Error(`Payment failed with status: ${response.status}`);
      }
      
    } catch (err) {
      setError(err.message || 'Failed to process payment. Please try again.');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!transactionData) {
      setError('Transaction data not available');
      return;
    }

    const validationError = validateCardDetails();
    if (validationError) {
      setError(validationError);
      return;
    }

    const cardData = {
      cardNumber: cardNumber.replace(/\s/g, ''),
      expiryDate: formatExpiryForAPI(expiryDate),
      cvv: cvv
    };

    try {
      await confirmTransaction(transactionData.transactionId, cardData);
    } catch (err) {
      console.error('Submission error:', err);
    }
  };

  const formatAmount = (amount) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN'
    }).format(amount);
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
            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-md p-4">
                <p className="text-red-700 text-sm">{error}</p>
              </div>
            )}

            {/* XNET PAY Title */}
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
                  <span className="font-medium text-gray-900">
                    {transactionData ? formatAmount(transactionData.transactionAmount) : 'Loading...'}
                  </span>
                </div>
                <div className="flex justify-between px-4 py-3">
                  <span className="text-gray-700">Fee</span>
                  <span className="font-medium text-gray-900">₦ 0.00</span>
                </div>
                <div className="flex justify-between px-4 py-3">
                  <span className="font-semibold text-gray-900">Total</span>
                  <span className="font-semibold text-gray-900">
                    {transactionData ? formatAmount(transactionData.transactionAmount) : 'Loading...'}
                  </span>
                </div>
              </div>
            </div>

            {/* Transaction Info */}
            {transactionData && (
              <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
                <p className="text-sm text-blue-700">
                  Transaction ID: <span className="font-mono">{transactionData.transactionId}</span>
                </p>
                <p className="text-sm text-blue-700 mt-1">
                  Amount: <span className="font-mono">{formatAmount(transactionData.transactionAmount)}</span>
                </p>
                <p className="text-xs text-blue-600 mt-2">
                  URL Parameters Detected: {window.location.pathname}
                </p>
              </div>
            )}

            {/* Payment Methods */}
            <div className="space-y-4">
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
                              disabled={isLoading}
                            />
                            <CreditCard className="absolute right-3 top-2.5 w-5 h-5 text-gray-400" />
                          </div>
                        </div>

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
                              disabled={isLoading}
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
                              disabled={isLoading}
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
                disabled={isLoading}
              >
                <ChevronLeft className="w-5 h-5" />
                <span>Back</span>
              </button>
              <button
                type="button"
                onClick={handleSubmit}
                disabled={isLoading || !transactionData}
                className="w-full sm:w-auto bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white font-medium px-8 py-2.5 rounded-md transition-colors order-1 sm:order-2 flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  'SUBMIT'
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}