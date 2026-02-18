import {createSlice, createAsyncThunk, PayloadAction, } from '@reduxjs/toolkit';
import axios from 'axios';




 //type definitions 


 //user  interface matching my backend
 interface User {
    _id: string;
    email:string;
    role: 'Student' | 'Admin';
    name?: string;
 }

 //Auth state interface
interface AuthState {
    isAuthenticated: boolean;
    loading: boolean;
    user : User | null;
    error: string | null;
    message: string | null;
    username: string | null;
}

//API response Type
interface AuthResponse {
    role: string;
    admin: string;
    name: string
}

//user response interface
interface UserResponse {
    success: boolean;
    _id: string;
    email:string;
    role: 'Student' | 'Admin';
    name: string
}

interface MessageResponse {
    message: string;
    email:string;
}

interface ResetResponse {
  success: boolean;
  message: string;
}

interface UnlockResponse {
  success: boolean;
  message: string;
  wasLocked: boolean;
}

// Request payload types
interface LoginCredentials {
  email: string;
  password: string;
}

interface RegisterData {
  name: string;
  email: string;
  password: string;
  role?: 'Student' | 'Admin';
}

interface ResetPasswordData {
  email: string;
  token: string;
  newPassword: string;
}

interface UnlockAccountData {
  email: string;
  OTP: string;
  secretKey: string;
}



//helper function 
const configureAxios = (): void => {
  axios.defaults.withCredentials = true;
} 

//helper to extract error messages
const getErrorMessage = (error :unknown): string => {
    if (axios.isAxiosError(error)){
        const axiosError = error 
        return (
            axiosError.response?.data?.msg ||
            axiosError.response?.data?.error ||
            axiosError.response?.data?.Error ||
            axiosError.response.data?.message ||
            axiosError.response?.data?.errors?.[0]?.msg ||
            'An error occurred'
        )
    }
    return 'An unexpected error occurred';
};

//initial state
const initialState: AuthState = {
    isAuthenticated: false,
    loading: false,
    user: null,
    error: null,
    message: null,
    username: null,

}

//async thunks

//load user
export const loadUser = createAsyncThunk<
    UserResponse,
   void,
   { rejectValue: string}>
   (
    'auth/loadUser',
    async (_, {rejectWithValue }) => {
       try {
        configureAxios()
        const res = await axios.get<UserResponse>('/api/auth');
        return res.data;

       } catch(err){
        return rejectWithValue(getErrorMessage(err))
       }
    }
   );

 //Register
export const register = createAsyncThunk<
    AuthResponse,
    RegisterData,
    {rejectValue : string}>
    (
        'auth/register',
        async(formData, { rejectWithValue }) => {
            try {
            const config = {
                headers : {'Content-Type' : 'application/json'}
            };
            const res = await axios.post<AuthResponse>('/api/auth/register',formData,config);
            return res.data
        }catch(err){
            return rejectWithValue(getErrorMessage(err))
        }

        }

    );

    //login
     export const login = createAsyncThunk<AuthResponse,LoginCredentials, {rejectValue: string}>
     (
        'auth/login',
        async(formData, { rejectWithValue }) => {
            try {
                const config = {
                headers : {'Content-Type' : 'application/json'}
            };
            const res = await axios.post<AuthResponse>('/api/auth/login',formData,config)
            return res.data;
            }catch(err){
                return rejectWithValue(getErrorMessage(err))
            }
        }
     );

     // Forgot Password
export const forgotPassword = createAsyncThunk<
  MessageResponse,
  string,
  { rejectValue: string }
>(
  'auth/forgotPassword',
  async (email, { rejectWithValue }) => {
    try {
      const config = {
        headers: { 'Content-Type': 'application/json' }
      };
      
      const res = await axios.post<MessageResponse>(
        '/api/auth/forgot-password',
        { email },
        config
      );
      localStorage.setItem('email',email);
      return res.data;
    } catch (err) {
      return rejectWithValue(getErrorMessage(err));
    }
  }
);

// Reset Password
export const resetPassword = createAsyncThunk<
  ResetResponse,
  ResetPasswordData,
  { rejectValue: string }
>(
  'auth/resetPassword',
  async (resetData, { rejectWithValue }) => {
    try {
      const config = {
        headers: { 'Content-Type': 'application/json' }
      };
      const res = await axios.post<ResetResponse>(
        '/api/auth/reset-password',
        resetData,
        config
      );
      return res.data;
    } catch (err) {
      return rejectWithValue(getErrorMessage(err));
    }
  }
);

// Request OTP
export const requestOTP = createAsyncThunk<
  MessageResponse,
  string,
  { rejectValue: string }
>(
  'auth/requestOTP',
  async (email, { rejectWithValue }) => {
    try {
      const config = {
        headers: { 'Content-Type': 'application/json' }
      };
      const res = await axios.post<MessageResponse>(
        '/api/auth/otp',
        { email },
        config
      );
      localStorage.setItem('unlockEmail',email)
      return res.data;
    } catch (err) {
      return rejectWithValue(getErrorMessage(err));
    }
  }
);

// Unlock Account
export const unlockAccount = createAsyncThunk<
  UnlockResponse,
  UnlockAccountData,
  { rejectValue: string }
>(
  'auth/unlockAccount',
  async (unlockData, { rejectWithValue }) => {
    try {
      const config = {
        headers: {
          'Content-Type': 'application/json',
        }
      };
      const res = await axios.post<UnlockResponse>(
        '/api/auth/unlock',
        { email: unlockData.email, OTP: unlockData.OTP, secretKey: unlockData.secretKey },
        config
      );
      return res.data;
    } catch (err) {
      return rejectWithValue(getErrorMessage(err));
    }
  }
);


//slice(Reducer)

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        logout: (state )=> {
            axios.post('/api/auth/logout').catch(console.error)
            localStorage.removeItem('email');
            state.isAuthenticated = false;
            state.user = null;
            state.loading = false;
            state.error = null;
            state.message = null
        },
        clearError: (state) => {
            state.error = null;
        },
        clearMessage: (state)=> {
            state.message = null;
        }

    },
    extraReducers: (builder)=> {
        builder

        //loadUser
        .addCase(loadUser.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(loadUser.fulfilled, (state,action: PayloadAction<UserResponse>)=> {
            state.loading = false;
            state.isAuthenticated = true;
            state.user = {
                _id: action.payload._id,
                email: action.payload.email,
                role: action.payload.role,
                name: action.payload.name
            }
        })
        .addCase(loadUser.rejected, (state, action) => {
        state.loading = false;
        state.isAuthenticated = false;
        state.user = null;
        state.error = action.payload || 'Failed to load user';
      })
      // Register
      .addCase(register.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state, action: PayloadAction<AuthResponse>) => {
        state.loading = false;
        state.isAuthenticated = false;
        state.username = action.payload.name;
        
      
      })
      .addCase(register.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Registration failed';
      })

      //login
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action: PayloadAction<AuthResponse>) => {
        state.loading = false;
        state.username = action.payload.name;
        state.isAuthenticated = true;
        
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Login failed';
      })
      // Forgot Password
      .addCase(forgotPassword.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.message = null;
      })
      .addCase(forgotPassword.fulfilled, (state, action: PayloadAction<MessageResponse>) => {
        state.loading = false;
        state.message = action.payload.message;
      })
      .addCase(forgotPassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to send reset code';
      })

      // Reset Password
      .addCase(resetPassword.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.message = null;
      })
      .addCase(resetPassword.fulfilled, (state, action: PayloadAction<ResetResponse>) => {
        state.loading = false;
        state.message = action.payload.message;
        localStorage.removeItem('email');
      })
      .addCase(resetPassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to reset password';
      })
      
      // Request OTP
      .addCase(requestOTP.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.message = null;
      })
      .addCase(requestOTP.fulfilled, (state, action: PayloadAction<MessageResponse>) => {
        state.loading = false;
        state.message = action.payload.message;
      })
      .addCase(requestOTP.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to send OTP';
      })
      
      // Unlock Account
      .addCase(unlockAccount.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.message = null;
      })
      .addCase(unlockAccount.fulfilled, (state, action: PayloadAction<UnlockResponse>) => {
        state.loading = false;
        state.message = action.payload.message;
      })
      .addCase(unlockAccount.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to unlock account';
      });
    }
    
});

export const { logout, clearError, clearMessage } = authSlice.actions;
export default authSlice.reducer
    

