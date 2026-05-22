import { CheckCircle2 } from 'lucide-react';
import { useCart } from '../../context/useCart';

export default function ToastNotification() {
  const { toast } = useCart();

  return (
    <div
      className={`fixed top-5 left-1/2 transform -translate-x-1/2 z-[100] bg-gray-950 text-white font-semibold text-sm px-5 py-3.5 rounded-2xl shadow-xl flex items-center gap-3 transition-all duration-300 ease-out border border-gray-800 ${
        toast.show
          ? 'translate-y-0 opacity-100 scale-100'
          : '-translate-y-6 opacity-0 scale-95 pointer-events-none'
      }`}
    >
      <CheckCircle2 size={18} className='text-emerald-400' />
      <span>{toast.message}</span>
    </div>
  );
}
