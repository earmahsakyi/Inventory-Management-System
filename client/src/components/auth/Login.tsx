import { Link, useNavigate } from "react-router-dom";
import { useState,useEffect, FormEvent, ChangeEvent } from "react";
import { login,clearError,clearMessage } from '../../store/authSlice'
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAppDispatch , useAppSelector } from '../../store/store'
import { FaSpinner, FaEye, FaEyeSlash,  FaLock, FaEnvelope } from "react-icons/fa";
import { useToast } from "@/hooks/use-toast";


// Define the shape of form data
interface LoginFormData {
  email: string;
  password: string;
}




const Login = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { toast } = useToast();
  const { loading, isAuthenticated } = useAppSelector(state => state.auth)


   const [formData, setFormData] = useState<LoginFormData>({
    email: '',
    password: '',
  });
   const [showPassword, setShowPassword] = useState(false);




  // Typed change handler
  const handleChange = (e: ChangeEvent<HTMLInputElement>): void => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const onSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    if (!formData.email || !formData.password){
           toast({
            title: "All fields are required!",
            description: "Enter a valid email and password"
    })
    return;
    }
    try{
        await dispatch(login(formData)).unwrap()
    }catch(err){
         toast({
            title: "Login failed!",
            description: err as string
    })
    }
    
  };
  // Redirect if authenticated
  useEffect(() => {
    if (isAuthenticated) {
       toast({
        title: "Login Successful!",
        description: "Navigating to dashboard...",
       
      }); 
      setTimeout(()=>{
        dispatch(clearMessage())
        navigate('/dashboard');
      },1000)
      
    }
  }, [isAuthenticated, navigate,toast,dispatch]);

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

        <h1 className=" text-center text-2xl font-bold font-heading">Login to Admin Dashboard</h1>
        <p className="mt-2 text-center text-sm text-muted-foreground">
          Forgot password? <Link to="/forgot-password" className="underline">Reset it</Link>
        </p>
       
        <form onSubmit={onSubmit} className="mt-6 space-y-5">
          <div className="space-y-2"> 
            <Label htmlFor="email">Email</Label>
            <div className="relative">
            <FaEnvelope className="absolute inset-y-0 left-4 top-2 pr-3  text-2xl flex items-center" />
            <Input id="email" type="email" placeholder="you@example.com" name="email"
            value={formData.email}
            onChange={handleChange} className="pl-10 pr-10" />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
             <FaLock className="absolute inset-y-0 left-4 top-2 pr-3  text-2xl flex items-center" /> 
            <Input id="password" type={showPassword ? "text" : "password"} name="password"
            value={formData.password}
            onChange={handleChange} className="pr-10 pl-10"  />
            <button
              type="button"
              className="absolute inset-y-0 right-0 pr-3  flex items-center"
              onClick={() => setShowPassword(!showPassword)}
                >
                {showPassword ? <FaEyeSlash /> : <FaEye />}   
                </button>
          </div>
          </div>
          <Button  type="submit" className="w-full" disabled={loading}>
            {loading ? 
            (
              <div className="flex items-center justify-center ">
                  <FaSpinner className="animate-spin mr-2" />
                      Logging in...
              </div>
            ): (
              <div className=" flex items-center justify-center ">
                      Login
              </div>
            )

            }
            </Button>
        </form>

        <p className="mt-4 text-sm text-muted-foreground">
          Account locked? <Link to="/otp-request" className="underline">Unlock it</Link>
        </p>
        <p className="mt-4 text-sm text-muted-foreground">
          New here ? <Link to="/register" className="underline">Sign up here</Link>
        </p>
      </section>
    </main>
  );
};

export default Login;
