import { useContext } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { AuthContext } from '../context/AuthContext';
import { registrationSchema } from '@open-doc/shared'; 
import InputField from '../../../components/ui/InputField';
import { useNavigate } from 'react-router-dom'; 

const SignupForm = () => {
  const { register: signupUser, login } = useContext(AuthContext);
  const navigate = useNavigate(); 

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(registrationSchema),
    mode: 'onTouched', 
  });

  const onSubmit = async (data) => {
    try {
      await signupUser(data.email, data.username, data.password);
      await login(data.email, data.password);
      navigate('/dashboard'); 
    } catch (err) {
      setError('root', { 
        type: 'manual', 
        message: err.message || 'An error occurred during account setup.' 
      });
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      
      {errors.root && (
        <div className="p-3 bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg">
          {errors.root.message}
        </div>
      )}

      <InputField
        label="Full Name"
        type="text"
        placeholder="Enter your full name"
        error={errors.username}
        {...register('username')}
      />

      <InputField
        label="Email"
        type="text"
        placeholder="Enter your email"
        error={errors.email}
        {...register('email')}
      />

      <InputField
        label="Password"
        type="password"
        placeholder="••••••••"
        error={errors.password}
        {...register('password')}
      />

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-primary text-white p-2.5 rounded-lg font-semibold hover:bg-primary-hover disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors duration-150"
      >
        {isSubmitting ? (
          <span className="flex items-center justify-center gap-2">
            <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
            Setting up your account... 
          </span>
        ) : (
          'Create Account'
        )}
      </button>
    </form>
  );
};

export default SignupForm;