import { Routes, Route } from 'react-router-dom';
import HeroSection from './features/marketplace/HeroSection';
import LoginForm from './features/auth/components/login-form';
import RegisterForm from './features/auth/components/register-form';
import ForgetPasswordForm from './features/auth/components/forgot-password-form';
import VerifyOtpForm from './features/auth/components/otp-form'
import ResetPasswordForm from './features/auth/components/ResetPassword'

function App() {
  return (
    <Routes>
      <Route path='/' element={<HeroSection />}></Route>
      <Route path='/login' element={<LoginForm />}></Route>
      <Route path='/register' element={<RegisterForm />}></Route>
      <Route path='/forget-password' element={<ForgetPasswordForm />}></Route>
      <Route path='/VerifyOtpForm' element={<VerifyOtpForm />}></Route>
      <Route path='/ResetPassword' element={<ResetPasswordForm />}></Route>
    </Routes>
  );
}

export default App;
