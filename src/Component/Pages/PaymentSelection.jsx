import React from 'react';
import { useState, useEffect } from 'react';
import { CreditCard, ChevronLeft, Loader2 } from 'lucide-react';

export default function PaymentSelection() {
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [cardNumber, setCardNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
  
  // API states
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [transactionData, setTransactionData] = useState(null);

  // ✅ CORRECT API URL WITH HYPHEN: pg-payment (not pgpayment)
  const API_BASE_URL = 'https://pg-payment.xnettpay.com/api/v1';

  // Extract transaction data from URL
  useEffect(() => {
    const testData = {
      transactionId: 'TEST123', // Any ID works for testing
      transactionAmount: 1500.00
    };
    setTransactionData(testData);
    console.log('✅ Transaction data loaded:', testData);
  }, []);

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
    // ✅ FOR TESTING: You can type anything, just basic format checks
    if (!cardNumber || cardNumber.replace(/\s/g, '').length === 0) {
      return 'Please enter a card number (any 16 digits for testing)';
    }
    if (!expiryDate || expiryDate.length === 0) {
      return 'Please enter an expiry date (any date for testing)';
    }
    if (!cvv || cvv.length === 0) {
      return 'Please enter a CVV (any 3 digits for testing)';
    }
    return null;
  };

  // API call to confirm transaction
  const confirmTransaction = async (transactionId, cardData) => {
    try {
      setIsLoading(true);
      setError('');
      
      const apiUrl = `${API_BASE_URL}/confirm/test/transaction/${transactionId}`;
      console.log('🔄 Making API call to:', apiUrl);
      console.log('📦 Request payload:', cardData);
      
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(cardData),
      });

      console.log('📡 Response status:', response.status);
      console.log('📡 Response ok:', response.ok);

      // ✅ For test endpoint, we only care about HTTP status 200
      if (response.ok) {
        setSuccess(true);
        console.log('🎉 Payment successful! Got 200 response');
        
        // Try to parse response if available
        try {
          const result = await response.json();
          console.log('✅ API response data:', result);
        } catch (e) {
          console.log('✅ API returned 200 (success)');
        }
      } else {
        throw new Error(`Payment failed with status: ${response.status}`);
      }
      
    } catch (err) {
      console.error('❌ API Error:', err);
      setError(err.message || 'Failed to process payment. Please try again.');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('🎯 Submit button clicked');
    
    if (!transactionData) {
      setError('Transaction data not available');
      return;
    }

    // Validate card details (basic format only for testing)
    const validationError = validateCardDetails();
    if (validationError) {
      setError(validationError);
      return;
    }

    // Prepare card data for API
    const cardData = {
      cardNumber: cardNumber.replace(/\s/g, ''),
      expiryDate: formatExpiryForAPI(expiryDate),
      cvv: cvv
    };

    console.log('🚀 Sending to API:', cardData);

    try {
      await confirmTransaction(transactionData.transactionId, cardData);
    } catch (err) {
      console.error('Submission error:', err);
    }
  };

  // Test function - auto-fills with sample data
  const testAPICall = () => {
    console.log('🧪 Testing API call with sample data');
    
    // Set sample card data (you can change these to anything)
    setCardNumber('4111 1111 1111 1111');
    setExpiryDate('12 / 25');
    setCvv('123');
    
    // Clear any previous errors
    setError('');
    
    // Trigger submit
    setTimeout(() => {
      const testEvent = { preventDefault: () => {} };
      handleSubmit(testEvent);
    }, 100);
  };

  const formatAmount = (amount) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN'
    }).format(amount);
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-lg shadow-sm p-6 text-center">
            <div className="text-green-500 text-6xl mb-4">✓</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Payment Successful!
            </h2>
            <p className="text-gray-600 mb-4">
              Your payment of {formatAmount(transactionData?.transactionAmount || 0)} has been processed successfully.
            </p>
            <p className="text-sm text-gray-500">
              Transaction ID: {transactionData?.transactionId}
            </p>
            <p className="text-sm text-green-600 mt-2">
              ✅ Received 200 OK response from payment gateway
            </p>
            <button
              onClick={() => setSuccess(false)}
              className="mt-4 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
            >
              Make Another Payment
            </button>
          </div>
        </div>
      </div>
    );
  }

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

            {/* Testing Instructions */}
            <div className="bg-green-50 border border-green-200 rounded-md p-4">
              <h3 className="font-semibold text-green-800 mb-2">Testing Instructions</h3>
              <ul className="text-sm text-green-700 list-disc list-inside space-y-1">
                <li>✅ Type <strong>any card number</strong> (16 digits)</li>
                <li>✅ Type <strong>any expiry date</strong> (MM/YY format)</li>
                <li>✅ Type <strong>any CVV</strong> (3 digits)</li>
                <li>✅ Click SUBMIT to trigger API call</li>
                <li>✅ Check Network tab for POST request to payment gateway</li>
              </ul>
              <div className="mt-3 p-3 bg-blue-50 rounded">
                <p className="text-sm text-blue-700">
                  <strong>API Endpoint:</strong><br />
                  <code className="text-xs">{API_BASE_URL}/confirm/test/transaction/{transactionData?.transactionId}</code>
                </p>
              </div>
              <button
                onClick={testAPICall}
                className="mt-3 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded text-sm"
              >
                🧪 Auto-fill Sample Data & Test
              </button>
            </div>

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
                              placeholder="Type any 16 digits (e.g., 4111 1111 1111 1111)"
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                              disabled={isLoading}
                            />
                            <CreditCard className="absolute right-3 top-2.5 w-5 h-5 text-gray-400" />
                          </div>
                          <p className="text-xs text-gray-500 mt-1">For testing: Any 16-digit number works</p>
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
                              placeholder="MM / YY (e.g., 12 / 25)"
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                              disabled={isLoading}
                            />
                            <p className="text-xs text-gray-500 mt-1">Any future date works</p>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              CVV
                            </label>
                            <input
                              type="text"
                              value={cvv}
                              onChange={handleCvvChange}
                              placeholder="Any 3 digits (e.g., 123)"
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                              disabled={isLoading}
                            />
                            <p className="text-xs text-gray-500 mt-1">Any 3-digit number works</p>
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
                  'SUBMIT PAYMENT'
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}