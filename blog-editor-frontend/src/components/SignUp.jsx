import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { PenLine } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function SignupPage() {

  const navigate = useNavigate();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Simulate a signup request
    try {
      const response = await fetch("https://blog-editor-service.onrender.com/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ firstName, lastName, email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        console.error(data.message || "Signup failed");
        return;
      }

      // Save token and redirect
      localStorage.setItem("token", data.token);
      if (data.email) {
        localStorage.setItem("userEmail", data.email);
      }
      if (data.username) {
        const username = `${data.username}`.trim();
        localStorage.setItem("username", username);
      }
      navigate("/dashboard");
    } catch (error) {
      console.error("Signup error:", error);
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-orange-50 to-white">
      <div className="flex flex-1 flex-col items-center justify-center px-4 py-12">
        <Link to="/" className="mb-8 flex items-center gap-2 text-2xl font-bold group">
          <div className="bg-gradient-to-r from-orange-500 to-amber-400 p-2 rounded-lg shadow-md group-hover:shadow-lg transition-all">
            <PenLine className="h-6 w-6 text-white" />
          </div>
          <span className="bg-gradient-to-r from-orange-600 to-amber-500 bg-clip-text text-transparent">
            Blogger
          </span>
        </Link>
        <div className="w-full max-w-sm space-y-8">
          <div className="space-y-2 text-center">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-orange-600 to-amber-500 bg-clip-text text-transparent">
              Create an account
            </h1>
            <p className="text-gray-600">
              Enter your information to get started
            </p>
          </div>
          <form onSubmit={handleSubmit} className="space-y-6 bg-white p-8 rounded-xl shadow-lg border border-orange-100">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="first-name" className="text-gray-700">
                  First name
                </Label>
                <Input
                  id="first-name"
                  placeholder="Jatin"
                  required
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="border-orange-200 bg-orange-50/50 placeholder:text-orange-300 focus:ring-orange-200"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="last-name" className="text-gray-700">
                  Last name
                </Label>
                <Input
                  id="last-name"
                  placeholder="Dubey"
                  required
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="border-orange-200 bg-orange-50/50 placeholder:text-orange-300 focus:ring-orange-200"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="email" className="text-gray-700">
                Email
              </Label>
              <Input
                id="email"
                placeholder="name@example.com"
                required
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="border-orange-200 bg-orange-50/50 placeholder:text-orange-300 focus:ring-orange-200"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-gray-700">
                Password
              </Label>
              <Input
                id="password"
                required
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="border-orange-200 bg-orange-50/50 focus:ring-orange-200"
              />
            </div>
            <Button
              className="w-full bg-gradient-to-r from-orange-500 to-amber-400 hover:from-orange-600 hover:to-amber-500 text-white font-medium py-2 shadow-md hover:shadow-lg transition-all"
              type="submit"
            >
              Create Account
            </Button>
          </form>
          <div className="text-center text-sm">
            Already have an account?{" "}
            <Link 
              to="/login" 
              className="text-orange-600 hover:text-orange-700 underline-offset-4 hover:underline font-medium"
            >
              Sign in
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
// This code defines a SignUpPage component that renders a sign-up form for a web application.