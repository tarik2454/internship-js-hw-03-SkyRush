import type {
  LoginFormData,
  RegisterFormData,
  UpdateUserFormData,
} from "@/lib/validation";
import axios from "axios";

const API = axios.create({
  baseURL: "https://backend-internship-js-hw-03-sky-rus.vercel.app/api",
});

export interface AuthResponse {
  token: string;
}

export const registerUser = async (data: RegisterFormData) => {
  const res = await API.post("/users/register", data);
  return res.data;
};

export const loginUser = async (data: LoginFormData) => {
  const res = await API.post("/users/login", data);
  return res.data;
};

export const getCurrentUser = async (token: string) => {
  const res = await API.get("/users/current", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
};

export const logoutUser = async (token: string) => {
  const res = await API.post(
    "/users/logout",
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return res.data;
};

export const updateUser = async (data: UpdateUserFormData, token: string) => {
  const res = await API.patch("/users/update", data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
};

// export const API = axios.create({
//   baseURL: "https://drink-master-project.onrender.com/",
// });

// export const setToken = (token) => {
//   API.defaults.headers.common.Authorization = `Bearer ${token}`;
// };

// export const clearToken = () => {
//   API.defaults.headers.common.Authorization = ``;
// };
