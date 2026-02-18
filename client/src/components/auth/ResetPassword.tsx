import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect, FormEvent, ChangeEvent } from "react";
import { resetPassword, clearError, clearMessage } from '@/store/authSlice';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAppDispatch, useAppSelector } from '../../store/store';
import { FaSpinner, FaEye, FaEyeSlash, FaLock, FaKey, FaCheck } from "react-icons/fa";
import { useToast } from "@/hooks/use-toast";

// Define the shape of form data
interface ResetFormData {
  email: string;
  token: string;
  newPassword: string;
  confirmPassword: string;
}

interface FormErrors {
  token?: string;
  newPassword?: string;
  confirmPassword?: string;
}

const ResetPassword = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { toast } = useToast();
  const { loading, message } = useAppSelector(state => state.auth);

  const [formData, setFormData] = useState<ResetFormData>({
    email: '',
    token: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [passwordStrength, setPasswordStrength] = useState(0);

  // Get email from localStorage (set in ForgotPassword page)
  useEffect(() => {
    const storedEmail = localStorage.getItem('email');
    if (!storedEmail) {
      toast({
        title: "Error!",
        description: "No email found. Please request a reset code first."
      });
      navigate('/forgot-password');
    } else {
      setFormData(prev => ({ ...prev, email: storedEmail }));
    }
  }, [navigate, toast]);

  // Password strength checker
  const checkPasswordStrength = (password: string): number => {
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;
    return strength;
  };

  // Handle input changes with validation
  const handleChange = (e: ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;
    
    setFormData((prevData) => ({
      ...prevData,
      [name]: value
    }));

    // Real-time validation
    if (name === 'newPassword') {
      if (value.length > 0 && value.length < 8) {
        setErrors(prev => ({ ...prev, newPassword: 'Password must be at least 8 characters' }));
      } else {
        setErrors(prev => ({ ...prev, newPassword: undefined }));
      }
      setPasswordStrength(checkPasswordStrength(value));
    }

    if (name === 'confirmPassword') {
      if (value !== formData.newPassword) {
        setErrors(prev => ({ ...prev, confirmPassword: 'Passwords do not match' }));
      } else {
        setErrors(prev => ({ ...prev, confirmPassword: undefined }));
      }
    }

    if (name === 'token') {
      setErrors(prev => ({ ...prev, token: undefined }));
    }
  };

  const onSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();

    // Validation
    if (!formData.token || !formData.newPassword || !formData.confirmPassword) {
      toast({
        title: "Error!",
        description: "All fields are required!"
      });
      return;
    }

    if (formData.newPassword.length < 8) {
      toast({
        title: "Error!",
        description: "Password must be at least 8 characters"
      });
      return;
    }

    if (formData.newPassword !== formData.confirmPassword) {
      toast({
        title: "Error!",
        description: "Passwords do not match!"
      });
      return;
    }

    try {
      //Pass the correct object structure
      await dispatch(resetPassword({
        email: formData.email,
        token: formData.token,
        newPassword: formData.newPassword
      })).unwrap();
      
      // Don't show toast here, let useEffect handle it
    } catch (err) {
      toast({
        title: "Reset Failed!",
        description: err as string
      });
    }
  };

  // Handle success message
  useEffect(() => {
    if (message) {
      toast({
        title: "Success!",
        description: message,
      });
      
      // Clear localStorage and navigate
      setTimeout(() => {
        localStorage.removeItem('email');
        dispatch(clearMessage());
        navigate('/login');
      }, 2000);
    }
  }, [message, navigate, dispatch, toast]);

  // Clear errors on unmount
  useEffect(() => {
    return () => {
      dispatch(clearError());
      dispatch(clearMessage());
    };
  }, [dispatch]);

  const strengthColors = ['bg-red-500', 'bg-orange-500', 'bg-yellow-500', 'bg-green-500'];
  const strengthText = ['Weak', 'Fair', 'Good', 'Strong'];

  return (
    <main className="container flex min-h-[80vh] items-center justify-center py-12">
      <section className="w-full max-w-md rounded-xl border bg-card p-8 shadow">

        <h1 className="text-center text-2xl font-bold font-heading">Reset Your Password</h1>
        <p className="mt-2 text-center text-sm text-muted-foreground">
          Enter the verification code and your new password
        </p>

    

        <form onSubmit={onSubmit} className="mt-6 space-y-5">
          {/* Verification Code */}
          <div className="space-y-2">
            <Label htmlFor="token">Verification Code</Label>
            <div className="relative">
              <FaKey className="absolute inset-y-0 left-4 top-2 pr-3 text-2xl flex items-center text-muted-foreground" />
              <Input
                id="token"
                type="text"
                placeholder="Enter 6-digit code"
                name="token"
                value={formData.token}
                onChange={handleChange}
                className="pl-10 pr-10"
                required
              />
              {formData.token && !errors.token && (
                <FaCheck className="absolute inset-y-0 right-4 top-3 text-green-500" />
              )}
            </div>
            {errors.token && (
              <p className="text-xs text-red-500">{errors.token}</p>
            )}
          </div>

          {/* New Password */}
          <div className="space-y-2">
            <Label htmlFor="newPassword">New Password</Label>
            <div className="relative">
              <FaLock className="absolute inset-y-0 left-4 top-2 pr-3 text-2xl flex items-center text-muted-foreground" />
              <Input
                id="newPassword"
                type={showPassword ? "text" : "password"}
                name="newPassword"
                value={formData.newPassword}
                onChange={handleChange}
                className="pr-10 pl-10"
                placeholder="Minimum 8 characters"
                required
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
            
            {/* Password Strength Indicator */}
            {formData.newPassword && (
              <div className="mt-2">
                <div className="flex justify-between mb-1">
                  <span className="text-xs text-muted-foreground">Password Strength</span>
                  <span className={`text-xs font-semibold ${
                    passwordStrength === 1 ? 'text-red-500' :
                    passwordStrength === 2 ? 'text-orange-500' :
                    passwordStrength === 3 ? 'text-yellow-500' :
                    'text-green-500'
                  }`}>
                    {passwordStrength > 0 ? strengthText[passwordStrength - 1] : ''}
                  </span>
                </div>
                <div className="flex gap-1">
                  {[1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      className={`h-1.5 flex-1 rounded-full transition-colors ${
                        passwordStrength >= i ? strengthColors[passwordStrength - 1] : 'bg-gray-200'
                      }`}
                    />
                  ))}
                </div>
              </div>
            )}
            
            {errors.newPassword && (
              <p className="text-xs text-red-500">{errors.newPassword}</p>
            )}
          </div>

          {/* Confirm Password */}
          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirm Password</Label>
            <div className="relative">
              <FaLock className="absolute inset-y-0 left-4 top-2 pr-3 text-2xl flex items-center text-muted-foreground" />
              <Input
                id="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="pr-10 pl-10"
                placeholder="Re-enter password"
                required
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
              {formData.confirmPassword && !errors.confirmPassword && formData.confirmPassword === formData.newPassword && (
                <FaCheck className="absolute inset-y-0 right-10 top-3 text-green-500" />
              )}
            </div>
            {errors.confirmPassword && (
              <p className="text-xs text-red-500">{errors.confirmPassword}</p>
            )}
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? (
              <div className="flex items-center justify-center">
                <FaSpinner className="animate-spin mr-2" />
                Resetting Password...
              </div>
            ) : (
              <div className="flex items-center justify-center">
                Reset Password
              </div>
            )}
          </Button>
        </form>

        <p className="mt-4 text-sm text-muted-foreground text-center">
          Remember your password? <Link to="/login" className="underline">Login here</Link>
        </p>
      </section>
    </main>
  );
};

export default ResetPassword;