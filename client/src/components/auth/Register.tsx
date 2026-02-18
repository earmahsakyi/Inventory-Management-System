import { Link, useNavigate } from "react-router-dom";
import { useState,useEffect, FormEvent, ChangeEvent } from "react";
import { register,clearError,clearMessage } from '../../store/authSlice'
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAppDispatch , useAppSelector } from '../../store/store'
import { FaSpinner, FaEye, FaEyeSlash,  FaLock, FaEnvelope, FaUser } from "react-icons/fa";
import { useToast } from "@/hooks/use-toast";


// Define the shape of form data
interface RegisterFormData {
  email: string;
  password: string;
  name: string;
}




const Register = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { toast } = useToast();
  const { loading, } = useAppSelector(state => state.auth)


   const [formData, setFormData] = useState<RegisterFormData>({
    email: '',
    password: '',
    name: ''
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
    if (!formData.email || !formData.password || !formData.name){
           toast({
            title: "All fields are required!",
            description: "Enter a valid email, password and name"
    })
    return;
    }
    try{
        await dispatch(register(formData)).unwrap()
        setTimeout(()=> {
            navigate('/login');
        },1500)
    }catch(err){
         toast({
            title: "Register failed!",
            description: err as string
    })
    }
    
  };
 

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

        <h1 className=" text-center text-2xl font-bold font-heading">Sign Up</h1>
       
       
        <form onSubmit={onSubmit} className="mt-6 space-y-5">
          <div className="space-y-2"> 
            <Label htmlFor="name">Name</Label>
            <div className="relative">
            <FaUser className="absolute inset-y-0 left-4 top-2 pr-3  text-2xl flex items-center" />
            <Input id="name" type="text" placeholder="burnaboy" name="name"
            value={formData.name}
            onChange={handleChange} className="pl-10 pr-10" />
            </div>
          </div>
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
                      creating account...
              </div>
            ): (
              <div className=" flex items-center justify-center ">
                      Sign Up
              </div>
            )

            }
            </Button>
        </form>

        <p className="mt-4 text-sm text-muted-foreground">
          Account locked? <Link to="/otp-request" className="underline">Unlock it</Link>
        </p>
      </section>
    </main>
  );
};

export default Register;
