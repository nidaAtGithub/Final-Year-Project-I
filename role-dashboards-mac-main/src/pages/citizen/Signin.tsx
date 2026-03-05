import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { toast } from "sonner";
import { User, Lock } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

const Signin = () => {
  const { role } = useParams<{ role: "citizen" | "police" | "admin" }>();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSignup, setIsSignup] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [pendingData, setPendingData] = useState<any>(null);
  const navigate = useNavigate();

  if (!role || !["citizen", "police", "admin"].includes(role)) {
    return <div>Invalid role!</div>;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const emailInput = (document.getElementById("email") as HTMLInputElement).value;
    const passwordInput = (document.getElementById("password") as HTMLInputElement).value;

    if (isSignup) {
      // Step 1 — validate and send OTP
      if (!otpSent) {
        const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;
        if (!passwordRegex.test(passwordInput)) {
          toast.error("Password must be at least 8 characters with 1 uppercase, 1 number, 1 special character.");
          return;
        }

        const confirmPassword = (document.getElementById("confirmPassword") as HTMLInputElement).value;
        if (passwordInput !== confirmPassword) {
          toast.error("Passwords do not match!");
          return;
        }

        const nameInput = (document.getElementById("name") as HTMLInputElement).value;
        setPendingData({ full_name: nameInput, email: emailInput, password: passwordInput, role });

        setIsSubmitting(true);
        const res = await axios.post("http://localhost:8003/send-otp", { email: emailInput });
        setIsSubmitting(false);

        if (res.data.error) {
          toast.error(res.data.error);
          return;
        }

        toast.success("OTP sent to your email!");
        setOtpSent(true);
        return;
      }

      // Step 2 — verify OTP then register
      setIsSubmitting(true);
      const verifyRes = await axios.post("http://localhost:8003/verify-otp", {
        email: pendingData.email,
        otp: otp,
      });

      if (verifyRes.data.error) {
        toast.error(verifyRes.data.error);
        setIsSubmitting(false);
        return;
      }

      const response = await axios.post("http://localhost:8003/register", pendingData);
      setIsSubmitting(false);

      if (response.data.error) {
        toast.error(response.data.error);
        return;
      }

      toast.success("Account created successfully!");
      localStorage.setItem("userEmail", pendingData.email);
      localStorage.setItem("userRole", role);
      localStorage.setItem("userFullName", pendingData.full_name);

      if (role === "citizen") navigate("/citizen/dashboard");
      else if (role === "police") navigate("/police/dashboard");
      else if (role === "admin") navigate("/admin/dashboard");

    } else {
      // ✅ Login block
      setIsSubmitting(true);
      const response = await axios.post("http://localhost:8003/login", {
        email: emailInput,
        password: passwordInput,
        role: role,
      });
      setIsSubmitting(false);

      if (response.data.error) {
        toast.error(response.data.error);
        return;
      }

      toast.success(response.data.message);
      localStorage.setItem("userEmail", emailInput);
      localStorage.setItem("userRole", response.data.role);
      localStorage.setItem("userFullName", response.data.full_name);

      if (response.data.role === "citizen") navigate("/citizen/dashboard");
      else if (response.data.role === "police") navigate("/police/dashboard");
      else if (response.data.role === "admin") navigate("/admin/dashboard");
    }
  };  // ✅ handleSubmit properly closed here

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
                <Input id="password" type="password" placeholder="********" className="pl-10" required />
              </div>
            </div>

            {/* ✅ Confirm Password */}
            {isSignup && !otpSent && (
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input id="confirmPassword" type="password" placeholder="********" required />
              </div>
            )}

            {/* ✅ OTP field shown after OTP is sent */}
            {isSignup && otpSent && (
              <div className="space-y-2">
                <Label htmlFor="otp">Enter OTP sent to your email</Label>
                <Input
                  id="otp"
                  placeholder="e.g. 123456"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  required
                />
                <p className="text-xs text-muted-foreground">OTP expires in 5 minutes</p>
              </div>
            )}

            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting
                ? "Processing..."
                : isSignup
                ? otpSent ? "Verify OTP" : "Send OTP"
                : "Login"}
            </Button>

            <div className="text-center text-sm text-muted-foreground mt-3">
              {isSignup ? (
                <>
                  Already have an account?{" "}
                  <button type="button" onClick={() => { setIsSignup(false); setOtpSent(false); setOtp(""); }}
                    className="text-blue-600 hover:underline">
                    Login
                  </button>
                </>
              ) : (
                <>
                  Don't have an account?{" "}
                  <button type="button" onClick={() => setIsSignup(true)}
                    className="text-blue-600 hover:underline">
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