import { useRef, useState } from "react";
import { useAuth } from "../auth/AuthContext";
import { useLocation, useNavigate } from "react-router-dom";
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

  const location = useLocation();
  const comesFrom = location.state?.from?.pathname || "/";
  const message = comesFrom  !== "/" ?
     "You mwust be wogged in to use twis fweature"
    : "Pwease wogin to continue";
  return (
    <div className="flex w-full  py-24 items-center justify-center  ">
      <form onSubmit={handleSubmit}>
        <Card>
          <Card className={cn("w-[380px] bg-muted")}>
            <CardHeader>
              
              <CardTitle>Login Fowm (ewe) 🌟🔑</CardTitle>

              <CardDescription>
                {message} 
              </CardDescription>
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
              <Button
                className="w-full py-2 bg-indigo-800 hover:bg-indigo-700 text-white rounded"
                type="submit"
              >
                Login 🌈✨
              </Button>
            </CardFooter>
          </Card>
        </Card>
      </form>
    </div>
  );
}
