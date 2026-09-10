import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Phone, ArrowRight, ArrowLeft, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import logo from "@/assets/logo.png";

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [phone, setPhone] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setSent(true);
    }, 1500);
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <div className="h-2 bg-gradient-primary w-full" />

      <div className="flex-1 flex flex-col items-center justify-center px-6 py-8">
        <div className="w-full max-w-sm space-y-6 animate-fade-in">
          <div className="text-center space-y-3">
            <img src={logo} alt="IREBE GROUP" className="h-14 mx-auto" />
            {!sent ? (
              <>
                <h1 className="text-2xl font-bold font-display text-foreground">
                  Forgot Password?
                </h1>
                <p className="text-sm text-muted-foreground">
                  Enter your phone number and we'll send you a verification code
                  to reset your password.
                </p>
              </>
            ) : (
              <>
                <div className="h-16 w-16 rounded-full bg-success/10 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="h-8 w-8 text-success" />
                </div>
                <h1 className="text-2xl font-bold font-display text-foreground">
                  Code Sent!
                </h1>
                <p className="text-sm text-muted-foreground">
                  We've sent a 6-digit verification code to{" "}
                  <span className="font-semibold text-foreground">{phone}</span>
                </p>
              </>
            )}
          </div>

          {!sent ? (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="+250 7XX XXX XXX"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="pl-10 h-12 rounded-xl"
                  />
                </div>
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full h-12 rounded-xl bg-gradient-primary text-primary-foreground font-semibold"
              >
                {isLoading ? (
                  <div className="h-5 w-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                ) : (
                  <>
                    Send Reset Code
                    <ArrowRight className="h-4 w-4 ml-1" />
                  </>
                )}
              </Button>
            </form>
          ) : (
            <div className="space-y-4">
              <Button
                onClick={() => navigate("/auth/verify-otp")}
                className="w-full h-12 rounded-xl bg-gradient-primary text-primary-foreground font-semibold"
              >
                Enter Verification Code
                <ArrowRight className="h-4 w-4 ml-1" />
              </Button>
              <Button
                variant="ghost"
                onClick={() => setSent(false)}
                className="w-full text-muted-foreground"
              >
                Didn't receive code? Resend
              </Button>
            </div>
          )}

          <div className="flex items-center justify-center">
            <Link
              to="/auth/login"
              className="flex items-center gap-1 text-sm font-medium text-primary hover:text-primary/80 transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Sign In
            </Link>
          </div>
        </div>
      </div>

      <div className="pb-4 text-center">
        <p className="text-xs text-muted-foreground">
          © 2024 IREBE GROUP. All rights reserved.
        </p>
      </div>
    </div>
  );
};

export default ForgotPassword;
