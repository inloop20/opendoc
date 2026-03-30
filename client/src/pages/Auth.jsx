import { useState } from 'react';
import BrandHeader from '../features/auth/components/BrandHeader';
import AuthTabs from '../features/auth/components/AuthTab';
import LoginForm from '../features/auth/components/LoginForm';
import SignupForm from '../features/auth/components/SignupForm';

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className="min-h-screen flex">
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 md:p-12 lg:p-16">
        <div className="w-full max-w-md">
          <BrandHeader />
          
          <AuthTabs isLogin={isLogin} setIsLogin={setIsLogin} />

          {isLogin ? (
            <LoginForm/>
          ) : (
            <SignupForm/>
          )}
          <div className="mt-8 text-center">
            <p className="text-sm text-text-secondary">
              {isLogin ? "Don't have an account? " : "Already have an account? "}
              <button
                onClick={() => setIsLogin(!isLogin)}
                className="text-primary hover:text-primary-hover font-semibold transition-colors duration-150"
              >
                {isLogin ? 'Sign up' : 'Sign in'}
              </button>
            </p>
          </div>
        </div>
      </div>

      <div className="hidden lg:block lg:w-1/2 relative overflow-hidden border-l border-border">
        <img
          src="https://images.pexels.com/photos/29404570/pexels-photo-29404570.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940"
          alt="Abstract geometric art"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-linear-to-br from-primary/10 to-transparent"></div>
      </div>
    </div>
  );
};

export default Auth;