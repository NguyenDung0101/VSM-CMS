"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { mockUsers, type User } from "@/lib/mock-data";

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  logout: () => void;
  loading: boolean;
  updateProfile: (data: Partial<User>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock credentials for demo
const DEMO_CREDENTIALS = [
  { email: "admin@vsm.org.vn", password: "password", role: "admin" },
  { email: "editor@vsm.org.vn", password: "password", role: "editor" },
  { email: "user1@vsm.org.vn", password: "password", role: "user" },
  { email: "user2@vsm.org.vn", password: "password", role: "user" },
];

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const savedUser = localStorage.getItem("vsm_user");
      if (savedUser) {
        const userData = JSON.parse(savedUser);
        setUser(userData);
      }
    } catch (error) {
      localStorage.removeItem("vsm_user");
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Check demo credentials
    const credential = DEMO_CREDENTIALS.find(
      (cred) => cred.email === email && cred.password === password
    );

    if (!credential) {
      throw new Error("Email hoặc mật khẩu không đúng");
    }

    // Find user in mock data
    const userData = mockUsers.find((u) => u.email === email);
    if (!userData) {
      throw new Error("Không tìm thấy thông tin người dùng");
    }

    // Save to localStorage
    localStorage.setItem("vsm_user", JSON.stringify(userData));
    setUser(userData);

    toast({
      title: "Đăng nhập thành công",
      description: `Chào mừng ${userData.name}!`,
    });

    // Redirect based on role
    if (userData.role === "admin" || userData.role === "editor") {
      router.push("/admin");
    } else {
      router.push("/");
    }
  };

  const register = async (email: string, password: string, name: string) => {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Check if email already exists
    const existingUser = mockUsers.find((u) => u.email === email);
    if (existingUser) {
      throw new Error("Email đã được sử dụng");
    }

    // Create new user
    const newUser: User = {
      id: `user-${Date.now()}`,
      name,
      email,
      avatar: `https://randomuser.me/api/portraits/men/${
        Math.floor(Math.random() * 99) + 1
      }.jpg`,
      role: "user",
      createdAt: new Date().toISOString(),
      isActive: true,
    };

    // Add to mock users (in real app, this would be saved to database)
    mockUsers.push(newUser);

    // Save to localStorage
    localStorage.setItem("vsm_user", JSON.stringify(newUser));
    setUser(newUser);

    toast({
      title: "Đăng ký thành công",
      description: `Chào mừng ${newUser.name} đến với VSM!`,
    });

    router.push("/");
  };

  const updateProfile = async (data: Partial<User>) => {
    try {
      if (!user) throw new Error("Chưa đăng nhập");

      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 500));

      const updatedUser = { ...user, ...data };
      localStorage.setItem("vsm_user", JSON.stringify(updatedUser));
      setUser(updatedUser);

      toast({
        title: "Cập nhật thành công",
        description: "Thông tin cá nhân đã được cập nhật.",
      });
    } catch (error: any) {
      throw new Error(error.message || "Cập nhật thất bại");
    }
  };

  const logout = () => {
    localStorage.removeItem("vsm_user");
    setUser(null);
    router.push("/");
    toast({
      title: "Đăng xuất thành công",
      description: "Hẹn gặp lại bạn!",
    });
  };

  return (
    <AuthContext.Provider
      value={{ user, login, register, logout, loading, updateProfile }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
