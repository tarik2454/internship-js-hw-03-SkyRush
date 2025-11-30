import type {
  LoginFormData,
  RegisterFormData,
  UpdateUserFormData,
} from "../lib/validation";
import axios from "axios";

export const API = axios.create({
  baseURL: "https://backend-internship-js-hw-03-sky-rus.vercel.app/api",
});

export const hasToken = () => localStorage.getItem("token") !== null;

export const initAuthToken = () => {
  const token = localStorage.getItem("token");
  if (token) API.defaults.headers.common.Authorization = `Bearer ${token}`;
};

export interface AuthResponse {
  token: string;
}

export interface User {
  _id: string;
  username: string;
  gamesPlayed: number;
  balance: number;
  totalWagered: number;
  totalWon: number;
}

export const registerUser = async (data: RegisterFormData) =>
  (await API.post("/users/register", data)).data;

export const loginUser = async (data: LoginFormData) => {
  const response = await API.post("/users/login", data);
  localStorage.setItem("token", response.data.token);
  API.defaults.headers.common.Authorization = `Bearer ${response.data.token}`;
  return response.data;
};

export const getCurrentUser = async () =>
  (await API.get("/users/current")).data;

export const logoutUser = async () => {
  const response = await API.post("/users/logout");
  localStorage.removeItem("token");
  API.defaults.headers.common.Authorization = "";
  return response.data;
};

export const updateUser = async (data: UpdateUserFormData) =>
  (await API.patch("/users/update", data)).data;

export const getAllUsers = async (): Promise<User[]> =>
  (await API.get("/users/users")).data;
