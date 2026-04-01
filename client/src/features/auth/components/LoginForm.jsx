import { useContext } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { AuthContext } from '../context/AuthContext'
import { loginSchema } from '@open-doc/shared';
import InputField from '../../../components/ui/InputField';

const LoginForm = () => {
  const { login } = useContext(AuthContext);

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(loginSchema),
    mode: 'onTouched', 
  });

  const onSubmit = async (data) => {
    try {
      await login(data.email, data.password);
    } catch (err) {
     
      setError('root', { 
        type: 'manual', 
        message: err.message || 'Invalid credentials. Please try again.' 
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
            Signing In...
          </span>
        ) : (
          'Sign In'
        )}
      </button>
    </form>
  );
};

export default LoginForm;