import { Routes, Route } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import HeroSection from './features/marketplace/HeroSection';
import LoginForm from './features/auth/components/login-form';
import RegisterForm from './features/auth/components/register-form';
import ForgetPasswordForm from './features/auth/components/forgot-password-form';
import VerifyOtpForm from './features/auth/components/otp-form';
import ResetPasswordForm from './features/auth/components/ResetPassword';
import Marketplace from './features/marketplace/MarketPlace';
import DeviceDetailsPage from './features/marketplace/pages/device-details-page';
import ToastNotification from './features/marketplace/ToastNotification'

function App() {
  return (
    <CartProvider>
      <ToastNotification />
      <Routes>
        <Route path='/' element={<HeroSection />}></Route>
        <Route path='/login' element={<LoginForm />}></Route>
        <Route path='/register' element={<RegisterForm />}></Route>
        <Route path='/forget-password' element={<ForgetPasswordForm />}></Route>
        <Route path='/VerifyOtpForm' element={<VerifyOtpForm />}></Route>
        <Route path='/ResetPassword' element={<ResetPasswordForm />}></Route>
        <Route path='/marketplace' element={<Marketplace />}></Route>
        <Route path='/marketplace/:id' element={<DeviceDetailsPage />} />

        
      </Routes>
    </CartProvider>
  );
}

export default App;
