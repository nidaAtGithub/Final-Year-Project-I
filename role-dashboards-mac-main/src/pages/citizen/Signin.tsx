import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { toast } from "sonner";
import { User, Lock } from "lucide-react";
//import { useNavigate } from "react-router-dom";
import { useNavigate, useParams } from "react-router-dom"; 


const Signin = () => {
  const { role } = useParams<{ role: "citizen" | "police" | "admin" }>();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSignup, setIsSignup] = useState(false);
  const navigate = useNavigate();

  if (!role || !["citizen", "police", "admin"].includes(role)) {
    return <div>Invalid role!</div>;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  
    const passwordInput = (document.getElementById("password") as HTMLInputElement).value;

    // Password validation regex
    const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;

    if (!passwordRegex.test(passwordInput)) {
      toast.error(
        "Password must be at least 8 characters long and include 1 uppercase letter, 1 number, and 1 special character."
      );
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      toast.success(isSignup ? "Account created successfully!" : "Login successful!");

      if (role === "citizen") navigate("/citizen/dashboard");
      else if (role === "police") navigate("/police/dashboard");
      else if (role === "admin") navigate("/admin/dashboard");
    }, 1500);
  };


  return (
    <div className="flex items-center justify-center min-h-screen bg-muted/30">
      <Card className="w-full max-w-md shadow-md">
        <CardHeader>
          <CardTitle className="text-center text-2xl font-bold">
            {isSignup ? "Create Account" : "Welcome Back"}
          </CardTitle>
          <CardDescription className="text-center">
          {isSignup
            ? `Sign up to access the ${role[0].toUpperCase() + role.slice(1)} FIR Portal`
            : `Login to your ${role[0].toUpperCase() + role.slice(1)} FIR account`}
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {isSignup && (
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input id="name" placeholder="e.g., Ahmed Khan" className="pl-10" required />
                </div>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input id="email" type="email" placeholder="you@example.com" required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="password"
                  type="password"
                  placeholder="********"
                  className="pl-10"
                  required
                />
              </div>
            </div>

            {isSignup && (
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="********"
                  required
                />
              </div>
            )}

            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? "Processing..." : isSignup ? "Sign Up" : "Login"}
            </Button>

            <div className="text-center text-sm text-muted-foreground mt-3">
              {isSignup ? (
                <>
                  Already have an account?{" "}
                  <button
                    type="button"
                    onClick={() => setIsSignup(false)}
                    className="text-blue-600 hover:underline"
                  >
                    Login
                  </button>
                </>
              ) : (
                <>
                  Don’t have an account?{" "}
                  <button
                    type="button"
                    onClick={() => setIsSignup(true)}
                    className="text-blue-600 hover:underline"
                  >
                    Sign Up
                  </button>
                </>
              )}
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Signin;
