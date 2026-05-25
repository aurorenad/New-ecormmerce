import React, { useState } from 'react';
import { useCart } from '../../../context/useCart';
import { ShieldCheck, CreditCard, Truck, ArrowLeft, ShoppingBag } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function CheckoutPage() {
  const { cart, cartTotal } = useCart();
  const navigate = useNavigate();

  // Form Field States
  const [shippingInfo, setShippingInfo] = useState({ name: '', email: '', address: '', city: '', zip: '' });
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'wallet'>('card');
  const [cardInfo, setCardInfo] = useState({ number: '', expiry: '', cvc: '' });
  const [isProcessing, setIsProcessing] = useState(false);

  // Financial Breakdown Calculations
  const shippingFee = cartTotal > 500 ? 0 : 15; // Free shipping over $500
  const estimatedTax = Math.round(cartTotal * 0.08); // 8% calculated tax
  const finalTotal = cartTotal + shippingFee + estimatedTax;

  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0) return;

    setIsProcessing(true);

    // Simulate standard payment gateway validation & API submission delay
    setTimeout(() => {
      setIsProcessing(false);
      alert('🎉 Payment Successful! Your order has been placed securely.');
      // Here you would clear the cart using a context handler and redirect to a success page
      navigate('/marketplace');
    }, 2500);
  };

  if (cart.length === 0) {
    return (
      <div className='min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6 text-center'>
        <ShoppingBag size={64} className='text-gray-300 mb-4' />
        <h2 className='text-2xl font-black text-gray-950 mb-2'>Your cart is empty</h2>
        <p className='text-gray-500 mb-6 max-w-sm'>You can't proceed to checkout without adding items to your basket first.</p>
        <button onClick={() => navigate('/marketplace')} className='bg-[#127058] text-white font-bold px-6 py-3 rounded-xl hover:bg-[#0e5845] transition-all text-sm'>
          Browse Marketplace Devices
        </button>
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-gray-50/50 pb-24 pt-8'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        {/* Back navigation button */}
        <button onClick={() => navigate(-1)} className='inline-flex items-center gap-2 text-sm font-semibold text-gray-600 hover:text-[#127058] transition-colors mb-8 group'>
          <ArrowLeft size={16} className='transition-transform group-hover:-translate-x-1' />
          <span>Back to previous page</span>
        </button>

        <h1 className='text-3xl font-black text-gray-950 tracking-tight mb-8'>Secure Checkout</h1>

        {/* ✅ FIX: form now wraps BOTH columns so the submit button is inside the form */}
        <form onSubmit={handlePlaceOrder} className='grid grid-cols-1 lg:grid-cols-12 gap-8 items-start'>
          {/* LEFT COLUMN: Shipping & Payment Entry Inputs (7/12 wide) */}
          <div className='lg:col-span-7 space-y-6'>
            {/* Shipping Information Section Card */}
            <div className='bg-white border border-gray-100 rounded-3xl p-6 shadow-xs'>
              <div className='flex items-center gap-2 text-[#127058] mb-5'>
                <Truck size={20} />
                <h2 className='font-black text-gray-950 text-lg'>Shipping Address</h2>
              </div>
              <div className='space-y-4'>
                <div>
                  <label className='block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5'>Full Name</label>
                  <input type='text' required placeholder='John Doe' value={shippingInfo.name} onChange={(e) => setShippingInfo({ ...shippingInfo, name: e.target.value })} className='w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-sm font-medium focus:outline-none focus:border-[#127058] focus:bg-white transition-all' />
                </div>
                <div>
                  <label className='block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5'>Email Address</label>
                  <input type='email' required placeholder='john@example.com' value={shippingInfo.email} onChange={(e) => setShippingInfo({ ...shippingInfo, email: e.target.value })} className='w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-sm font-medium focus:outline-none focus:border-[#127058] focus:bg-white transition-all' />
                </div>
                <div>
                  <label className='block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5'>Street Address</label>
                  <input type='text' required placeholder='123 Main St, Apt 4B' value={shippingInfo.address} onChange={(e) => setShippingInfo({ ...shippingInfo, address: e.target.value })} className='w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-sm font-medium focus:outline-none focus:border-[#127058] focus:bg-white transition-all' />
                </div>
                <div className='grid grid-cols-2 gap-4'>
                  <div>
                    <label className='block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5'>City</label>
                    <input type='text' required placeholder='Nairobi' value={shippingInfo.city} onChange={(e) => setShippingInfo({ ...shippingInfo, city: e.target.value })} className='w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-sm font-medium focus:outline-none focus:border-[#127058] focus:bg-white transition-all' />
                  </div>
                  <div>
                    <label className='block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5'>ZIP / Postal Code</label>
                    <input type='text' required placeholder='00100' value={shippingInfo.zip} onChange={(e) => setShippingInfo({ ...shippingInfo, zip: e.target.value })} className='w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-sm font-medium focus:outline-none focus:border-[#127058] focus:bg-white transition-all' />
                  </div>
                </div>
              </div>
            </div>

            {/* Payment Verification Section Card */}
            <div className='bg-white border border-gray-100 rounded-3xl p-6 shadow-xs'>
              <div className='flex items-center gap-2 text-[#127058] mb-5'>
                <CreditCard size={20} />
                <h2 className='font-black text-gray-950 text-lg'>Payment Method</h2>
              </div>

              {/* Payment Method Switch Toggles */}
              <div className='grid grid-cols-2 gap-4 mb-6'>
                <button type='button' onClick={() => setPaymentMethod('card')} className={`p-4 border rounded-2xl flex flex-col items-start gap-1 transition-all text-left ${paymentMethod === 'card' ? 'border-[#127058] bg-[#127058]/5 ring-2 ring-[#127058]/20' : 'border-gray-100 bg-white hover:bg-gray-50'}`}>
                  <span className='font-bold text-sm text-gray-950'>Credit / Debit Card</span>
                  <span className='text-[11px] font-medium text-gray-400'>Visa, Mastercard, Amex</span>
                </button>
                <button type='button' onClick={() => setPaymentMethod('wallet')} className={`p-4 border rounded-2xl flex flex-col items-start gap-1 transition-all text-left ${paymentMethod === 'wallet' ? 'border-[#127058] bg-[#127058]/5 ring-2 ring-[#127058]/20' : 'border-gray-100 bg-white hover:bg-gray-50'}`}>
                  <span className='font-bold text-sm text-gray-950'>Digital Wallet</span>
                  <span className='text-[11px] font-medium text-gray-400'>Simulated Quick Account Pay</span>
                </button>
              </div>

              {/* Dynamic Payment Option Entry Fields */}
              {paymentMethod === 'card' ? (
                <div className='space-y-4'>
                  <div>
                    <label className='block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5'>Card Number</label>
                    <input type='text' required placeholder='4111 2222 3333 4444' value={cardInfo.number} onChange={(e) => setCardInfo({ ...cardInfo, number: e.target.value })} className='w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-sm font-medium focus:outline-none focus:border-[#127058] focus:bg-white transition-all' />
                  </div>
                  <div className='grid grid-cols-2 gap-4'>
                    <div>
                      <label className='block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5'>Expiration Date</label>
                      <input type='text' required placeholder='MM/YY' value={cardInfo.expiry} onChange={(e) => setCardInfo({ ...cardInfo, expiry: e.target.value })} className='w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-sm font-medium focus:outline-none focus:border-[#127058] focus:bg-white transition-all' />
                    </div>
                    <div>
                      <label className='block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5'>Security Code (CVC)</label>
                      <input type='text' required placeholder='123' value={cardInfo.cvc} onChange={(e) => setCardInfo({ ...cardInfo, cvc: e.target.value })} className='w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-sm font-medium focus:outline-none focus:border-[#127058] focus:bg-white transition-all' />
                    </div>
                  </div>
                </div>
              ) : (
                <div className='p-4 bg-emerald-50/50 border border-emerald-100 rounded-2xl text-center text-sm font-medium text-emerald-800'>
                  Your available wallet balance covers this transaction. No input required!
                </div>
              )}
            </div>
          </div>

          {/* RIGHT COLUMN: Order Review Item Card Summary (5/12 wide) */}
          <div className='lg:col-span-5 space-y-6 lg:sticky lg:top-24'>
            <div className='bg-white border border-gray-100 rounded-3xl p-6 shadow-sm flex flex-col max-h-[85vh]'>
              <h2 className='font-black text-gray-950 text-lg mb-4'>Order Review</h2>

              {/* Product list array container scrolling panel */}
              <div className='flex-grow overflow-y-auto divide-y divide-gray-50 pr-1 max-h-[250px] lg:max-h-[350px] mb-4 space-y-3'>
                {cart.map((item) => (
                  <div key={item.id} className='flex gap-4 pt-3 first:pt-0 items-center justify-between'>
                    <div className='flex gap-3 items-center'>
                      <div className='w-12 h-12 bg-gray-50 border border-gray-100 rounded-xl p-1 flex-shrink-0 flex items-center justify-center overflow-hidden'>
                        <img src={item.img} alt={item.title} className='object-contain w-full h-full' />
                      </div>
                      <div>
                        <h4 className='font-bold text-gray-900 text-xs line-clamp-1 max-w-[180px]'>{item.title}</h4>
                        <span className='text-[10px] text-gray-400 font-bold'>Qty: {item.quantity}</span>
                      </div>
                    </div>
                    <span className='text-xs font-black text-gray-950'>${item.current_price * item.quantity}</span>
                  </div>
                ))}
              </div>

              {/* Subtotal cost summaries section */}
              <div className='border-t border-gray-100 pt-4 space-y-2.5'>
                <div className='flex justify-between text-xs font-semibold text-gray-500'>
                  <span>Items Subtotal:</span>
                  <span className='text-gray-950 font-bold'>${cartTotal}</span>
                </div>
                <div className='flex justify-between text-xs font-semibold text-gray-500'>
                  <span>Shipping Delivery:</span>
                  <span className='text-gray-950 font-bold'>{shippingFee === 0 ? 'FREE' : `$${shippingFee}`}</span>
                </div>
                <div className='flex justify-between text-xs font-semibold text-gray-500'>
                  <span>Estimated Local Tax:</span>
                  <span className='text-gray-950 font-bold'>${estimatedTax}</span>
                </div>
                <div className='border-t border-gray-100 pt-3 flex justify-between items-baseline'>
                  <span className='text-sm font-bold text-gray-950'>Final Amount:</span>
                  <span className='text-2xl font-black text-[#127058]'>${finalTotal}</span>
                </div>
              </div>

              {/* Form submit button wrapper layout */}
              <div className='mt-6 space-y-3'>
                <button
                  type='submit'
                  disabled={isProcessing}
                  className='w-full bg-[#127058] hover:bg-[#0e5845] text-white font-bold py-4 px-6 rounded-2xl transition-all shadow-sm flex items-center justify-center gap-2.5 text-base disabled:opacity-50 disabled:cursor-not-allowed'
                >
                  {isProcessing ? (
                    <span className='animate-pulse'>Processing Transaction...</span>
                  ) : (
                    <>
                      <ShieldCheck size={20} />
                      <span>Authorize Payment</span>
                    </>
                  )}
                </button>

                <div className='flex items-center justify-center gap-1.5 text-gray-400 text-[10px] font-bold uppercase tracking-wider text-center'>
                  <ShieldCheck size={14} className='text-emerald-600' />
                  <span>256-Bit SSL Encrypted Endpoint Protection</span>
                </div>
              </div>
            </div>
          </div>
        </form> 
      </div>
    </div>
  );
}