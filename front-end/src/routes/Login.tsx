import { useRef, useState } from "react";
import { useAuth } from "../auth/AuthContext";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/Button/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/Card/card";
import { BellRing, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/input/input";

export default function LoginPage() {
  const emailRef = useRef<HTMLInputElement | null>(null);
  const passwordRef = useRef<HTMLInputElement | null>(null);

  const { login } = useAuth();
  const navigate = useNavigate();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const res = await login(
      emailRef.current?.value || "",
      passwordRef.current?.value || ""
    );
    if (!res.data.session || !res.data.session.user) {
      return;
    }
    navigate("/write");
  }

  return (
    <div className="flex w-screen py-24 items-center justify-center  ">
      <form onSubmit={handleSubmit}>
        <Card>
          <Card className={cn("w-[380px] bg-muted")}>
            <CardHeader>
              <CardTitle>Login Fowm (ewe) 🌟🔑</CardTitle>
              <CardDescription>
                I pwomise I won't stowe youw pwivate infowmation (´・ω・`)
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4">
              <label className="block text-white mb-2" htmlFor="email">
                Usuwname (OwO)
              </label>
              <Input
                id="input-email"
                type="email"
                placeholder="Yuw email hewe"
                ref={emailRef}
              />
              <label htmlFor="input-password">Password</label>
              <Input
                id="input-password"
                placeholder="Yuw passwowd hewe"
                type="password"
                ref={passwordRef}
              />
              <br />
            </CardContent>
            <CardFooter>
              <Button           className="w-full py-2 bg-indigo-800 hover:bg-indigo-700 text-white rounded" type="submit">
                Login 🌈✨
              </Button>
            </CardFooter>
          </Card>
        </Card>
      </form>
    </div>
  );
}

export const UwuLoginForm = () => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.ChangeEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Submit form data here
    console.log(formData);
    setFormData({
      username: "",
      password: "",
    });
  };

  return (
    <div className="container mx-auto max-w-md p-6 bg-purple-900 bg-opacity-70 rounded-xl shadow-lg mt-8">
      <h2 className="text-2xl font-bold text-white mb-4">
        UwU Login Fowm 🌟🔑
      </h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-white mb-2" htmlFor="username">
            Usuwname (OwO)
          </label>
          <input
            type="text"
            name="username"
            id="username"
            value={formData.username}
            onChange={handleChange}
            className="w-full px-3 py-2 bg-purple-800 text-white rounded"
            placeholder="Yuw usuwname hewe"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-white mb-2" htmlFor="password">
            Passwowd (UwU)
          </label>
          <input
            type="password"
            name="password"
            id="password"
            value={formData.password}
            onChange={handleChange}
            className="w-full px-3 py-2 bg-purple-800 text-white rounded"
            placeholder="Yuw passwowd hewe"
            required
          />
        </div>
        <button
          type="submit"
          className="w-full py-2 bg-indigo-800 hover:bg-indigo-700 text-white rounded"
        >
          Login UwU 🌈✨
        </button>
      </form>
    </div>
  );
};
