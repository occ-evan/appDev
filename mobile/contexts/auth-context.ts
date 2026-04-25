// import axios from "@/api/axios";
// import { setToken } from "@/services/auth-storage";
// import { Alert } from "react-native";
// import { create } from "zustand";

// interface User {
//   name: string;
//   email: string;  
//   profile_photo?: string;
// }

// interface LoginData {
//   email: string;
//   password: string;
// }

// interface RegisterData {
//   name: string;
//   email: string;
//   password: string;
//   password_confirmation: string;
// }

// interface UpdateProfile {
//   image:string;
// }

// interface DeleteProfile {
//   id:number;
// }

// interface AuthState {
//   user: User | null;
//   getUser: () => Promise<void>;
//   login: (data: LoginData) => Promise<void>;
//   register: (data: RegisterData) => Promise<void>;
//   logout: () => Promise<void>;
//   updateProfile: (data: UpdateProfile) => Promise<void>;
//   deleteProfile: (data: DeleteProfile) => Promise<void>;
// }

// export const useAuth = create<AuthState>((set, get) => ({
//   user: null,

//   getUser: async () => {
//     try {
//       const { data } = await axios.get("/user");
//       set({ user: data });
//     } catch (error) {
//       console.log(error);
//     }
//   },

//   login: async (data) => {
//     try {
//       const response = await axios.post("/login", data);
//       await setToken(response.data.token);  
//       get().getUser();
//     } catch (error: any) {
//       alert(error)
//     }
//   },

//   register: async (data) => {
//     try {
//       await axios.post("/register", data);
//     } catch (error: any) {
//       alert(error.response.data.errors.password[0])
//     }
//   },

//   logout: async () => {
//     try {
//       await axios.post("/logout");
//       await setToken(null);
//       set({ user: null });
//     } catch (error) {
//       console.log(error);
//     }
//   },

//   updateProfile: async (data:UpdateProfile) => {
//     try{
//       await axios.post("/update/profile",data);
//     }catch (error){
//       console.log(error);
//       alert("error");
//     }
//   },
 
//   deleteProfile: async (data:DeleteProfile) => {
//     try{
//       await axios.delete("/delete/profile",{
//         data:{id:data.id}
//       });
//     }catch (error){ 
//     console.log(error);
//     alert('error');
//   }
//   }
// }));
import axios from "@/api/axios";
import { getToken, setToken } from "@/services/auth-storage";
import { create } from "zustand";

interface User {
  name: string;
  email: string;
  profile_photo?: string;
}

interface LoginData {
  email: string;
  password: string;
}

interface RegisterData {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
}

interface AuthState {
  user: User | null;
  getUser: () => Promise<void>;
  login: (data: LoginData) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => Promise<void>;
}

export const useAuth = create<AuthState>((set, get) => ({
  user: null,

  getUser: async () => {
    try {
      const token = await getToken();
      if (!token) return; // ✅ don't fetch if no token
      const { data } = await axios.get("/user");
      set({ user: data });
    } catch (error) {
      console.log("getUser error:", error);
    }
  },

  login: async (data) => {
    try {
      const response = await axios.post("/login", data);
      await setToken(response.data.token);
      await get().getUser(); // ✅ await so user is set before navigating
    } catch (error: any) {
      alert(error.response?.data?.message ?? "Login failed");
    }
  },

  register: async (data) => {
    try {
      await axios.post("/register", data);
    } catch (error: any) {
      alert(error.response?.data?.errors?.password?.[0] ?? "Register failed");
    }
  },

  logout: async () => {
    try {
      await axios.post("/logout");
    } catch (error) {
      console.log("logout error:", error);
    } finally {
      // ✅ always clear token and user even if request fails
      await setToken(null);
      set({ user: null });
    }
  },
}));