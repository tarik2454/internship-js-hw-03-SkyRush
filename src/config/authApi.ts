import type { LoginFormData, RegisterFormData } from "@/lib/validation";
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

export const loginUser = async (data: LoginFormData): Promise<AuthResponse> => {
  const res = await API.post("/users/login", data);
  return res.data;
};

export const getCurrentUser = async (token: string): Promise<CurrentUserResponse> => {
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

export interface UpdateUsernamePayload {
  username: string;
}

export interface UpdateUsernameResponse {
  username: string;
  email: string;
}

export interface UpdateUserStatsPayload {
  balance?: number;
  totalWagered?: number;
  gamesPlayed?: number;
  totalWon?: number;
}

export interface UpdateUserStatsResponse {
  balance: number;
  totalWagered: number;
  gamesPlayed: number;
  totalWon: number;
}

export interface CurrentUserResponse {
  username: string;
  email: string;
  balance: number;
  totalWagered: number;
  gamesPlayed: number;
  totalWon: number;
}

export const updateUsername = async (data: UpdateUsernamePayload, token: string): Promise<UpdateUsernameResponse> => {
  const res = await API.patch("/users/username", data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
};

export const updateUserStats = async (data: UpdateUserStatsPayload, token: string): Promise<UpdateUserStatsResponse> => {
  const res = await API.patch("/users/stats", data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
};

// Note: Backend should be updated to:
// 1. Return user statistics in getCurrentUser response:
//    res.json({
//      username: user.username,
//      email: user.email,
//      balance: user.balance,
//      totalWagered: user.totalWagered,
//      gamesPlayed: user.gamesPlayed,
//      totalWon: user.totalWon,
//    });
//
// 2. Create PATCH /users/stats endpoint for updating statistics:
//    const updateUserStats = async (req, res) => {
//      const { _id } = req.user;
//      const { balance, totalWagered, gamesPlayed, totalWon } = req.body;
//
//      const updatedUser = await User.findByIdAndUpdate(
//        _id,
//        { balance, totalWagered, gamesPlayed, totalWon },
//        { new: true }
//      );
//
//      if (!updatedUser) {
//        throw HttpError(404, "User not found");
//      }
//
//      res.json({
//        balance: updatedUser.balance,
//        totalWagered: updatedUser.totalWagered,
//        gamesPlayed: updatedUser.gamesPlayed,
//        totalWon: updatedUser.totalWon,
//      });
//    };

// export const API = axios.create({
//   baseURL: "https://drink-master-project.onrender.com/",
// });

// export const setToken = (token) => {
//   API.defaults.headers.common.Authorization = `Bearer ${token}`;
// };

// export const clearToken = () => {
//   API.defaults.headers.common.Authorization = ``;
// };
