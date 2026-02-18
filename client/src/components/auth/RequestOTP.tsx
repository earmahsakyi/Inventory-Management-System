import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect, FormEvent, ChangeEvent } from "react";
import { requestOTP, clearError, clearMessage } from '@/store/authSlice';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAppDispatch, useAppSelector } from '../../store/store';
import { FaSpinner, FaEnvelope, FaPaperPlane } from "react-icons/fa";
import { useToast } from "@/hooks/use-toast";

// Define the shape of form data
interface ResetFormData {
  email: string;
}

const RequestOTP = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { toast } = useToast();
  const { loading, message } = useAppSelector(state => state.auth);

  const [formData, setFormData] = useState<ResetFormData>({
    email: '',
  });

  // Typed change handler
  const handleChange = (e: ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value
    }));
  };

  const onSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();

    if (formData.email === '') {
      toast({
        title: "Email is required!",
        description: "Please enter your email address"
      });
      return;
    }

    try {
      await dispatch(requestOTP(formData.email)).unwrap();
    } catch (err) {
      toast({
        title: "Error!",
        description: err as string
      });
    }
  };

  // Handle success message and navigation
  useEffect(() => {
    if (message) {
      toast({
        title: "Success!",
        description: message,
      });
      setTimeout(() => {
        dispatch(clearMessage());
        navigate('/account-unlock');
      }, 2000);
    }
  }, [message, navigate, dispatch, toast]);

  // Clear error on unmount
  useEffect(() => {
    return () => {
      dispatch(clearError());
      dispatch(clearMessage());
    };
  }, [dispatch]);

  return (
    <main className="container flex min-h-[80vh] items-center justify-center py-12">
      <section className="w-full max-w-md rounded-xl border bg-card p-8 shadow">

        <h1 className="text-center text-2xl font-bold font-heading">Rquest for OTP</h1>
        

        

        <form onSubmit={onSubmit} className="mt-6 space-y-5">
          <div className="space-y-2">
            <Label htmlFor="email">Email Address</Label>
            <div className="relative">
              <FaEnvelope className="absolute inset-y-0 left-4 top-2 pr-3 text-2xl flex items-center" />
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="pl-10 pr-10"
                required
              />
            </div>
            <p className="text-xs text-muted-foreground">
              We'll send a verification code to this email address
            </p>
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? (
              <div className="flex items-center justify-center">
                <FaSpinner className="animate-spin mr-2" />
                Sending Code...
              </div>
            ) : (
              <div className="flex items-center justify-center">
                <FaPaperPlane className="mr-2" />
                Request OTP
              </div>
            )}
          </Button>
        </form>

        
      </section>
    </main>
  );
};

export default RequestOTP;