import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect, FormEvent, ChangeEvent } from "react";
import { unlockAccount, clearError, clearMessage } from '@/store/authSlice';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAppDispatch, useAppSelector } from '../../store/store';
import { FaSpinner, FaShieldAlt, FaEye, FaEyeSlash, FaKey, FaCheck } from "react-icons/fa";
import { useToast } from "@/hooks/use-toast";

// Define the shape of form data
interface UnlockFormData {
  email: string;
  OTP: string;
  secretKey: string;
}


interface FormErrors {
  OTP?: string;
  secretKey?: string;
}

const UnlockAccount = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { toast } = useToast();
  const { loading, message } = useAppSelector(state => state.auth);

  const [formData, setFormData] = useState<UnlockFormData>({
    email: '',
    OTP: '',
    secretKey: '',
  });
  const [showKey, setShowKey] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});

  // Get email from localStorage (set in OTP request page)
  useEffect(() => {
    const storedEmail = localStorage.getItem('unlockEmail');
    if (!storedEmail) {
      toast({
        title: "Error!",
        description: "No email found. Please request an OTP first."
      });
      navigate('/otp-request');
    } else {
      setFormData(prev => ({ ...prev, email: storedEmail }));
    }
  }, [navigate, toast]);

  // Handle input changes with validation
  const handleChange = (e: ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;
    
    setFormData((prevData) => ({
      ...prevData,
      [name]: value
    }));

    // Real-time validation
    if (name === 'OTP') {
      if (value.length > 0 && value.length < 6) {
        setErrors(prev => ({ ...prev, OTP: 'OTP must be 6 characters' }));
      } else {
        setErrors(prev => ({ ...prev, OTP: undefined }));
      }
    }

    if (name === 'secretKey') {
      if (value.length > 0 && value.length < 8) {
        setErrors(prev => ({ ...prev, secretKey: 'Secret key must be at least 8 characters' }));
      } else {
        setErrors(prev => ({ ...prev, secretKey: undefined }));
      }
    }
  };

  const onSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();

    // Validation
    if (!formData.OTP || !formData.secretKey) {
      toast({
        title: "Error!",
        description: "All fields are required!"
      });
      return;
    }

    if (formData.OTP.length < 6) {
      toast({
        title: "Error!",
        description: "Please enter a valid 6-digit OTP"
      });
      return;
    }

    try {
      // Pass the correct object structure
      await dispatch(unlockAccount({
        email: formData.email,
        OTP: formData.OTP,
        secretKey: formData.secretKey
      })).unwrap();
      
      // Success handled in useEffect below
    } catch (err) {
      toast({
        title: "Unlock Failed!",
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
        localStorage.removeItem('unlockEmail');
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

  return (
    <main className="container flex min-h-[80vh] items-center justify-center py-12">
      <section className="w-full max-w-md rounded-xl border bg-card p-8 shadow">

        <h1 className="text-center text-2xl font-bold font-heading">Unlock Your Account</h1>
        <p className="mt-2 text-center text-sm text-muted-foreground">
          Enter the OTP and your secret key to unlock your account
        </p>

     

        <form onSubmit={onSubmit} className="mt-6 space-y-5">
          {/* OTP Code */}
          <div className="space-y-2">
            <Label htmlFor="otp">One Time Passcode (OTP)</Label>
            <div className="relative">
              <FaKey className="absolute inset-y-0 left-4 top-2 pr-3 text-2xl flex items-center text-muted-foreground" />
              <Input
                id="otp"
                type="text"
                placeholder="Enter 6-digit OTP"
                name="OTP"
                value={formData.OTP}
                onChange={handleChange}
                className="pl-10 pr-10"
                maxLength={6}
                required
              />
              {formData.OTP && !errors.OTP && formData.OTP.length === 6 && (
                <FaCheck className="absolute inset-y-0 right-4 top-3 text-green-500" />
              )}
            </div>
            {errors.OTP && (
              <p className="text-xs text-red-500">{errors.OTP}</p>
            )}
          </div>

          {/* Secret Key */}
          <div className="space-y-2">
            <Label htmlFor="secretKey">Secret Key</Label>
            <div className="relative">
              <FaShieldAlt className="absolute inset-y-0 left-4 top-2 pr-3 text-2xl flex items-center text-muted-foreground" />
              <Input
                id="secretKey"
                type={showKey ? "text" : "password"}
                name="secretKey"
                value={formData.secretKey}
                onChange={handleChange}
                className="pr-10 pl-10"
                placeholder="Enter your secret key"
                required
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                onClick={() => setShowKey(!showKey)}
              >
                {showKey ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
            {errors.secretKey && (
              <p className="text-xs text-red-500">{errors.secretKey}</p>
            )}
            <p className="text-xs text-muted-foreground">
              This is the secret key provided by your administrator
            </p>
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? (
              <div className="flex items-center justify-center">
                <FaSpinner className="animate-spin mr-2" />
                Unlocking Account...
              </div>
            ) : (
              <div className="flex items-center justify-center">
                Unlock Account
              </div>
            )}
          </Button>
        </form>

        <p className="mt-4 text-sm text-muted-foreground text-center">
          Don't have an OTP? <Link to="/otp-request" className="underline">Request one</Link>
        </p>
      </section>
    </main>
  );
};

export default UnlockAccount;