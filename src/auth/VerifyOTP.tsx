import { useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, CheckCircle2, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import logo from "@/assets/logo.png";

const VerifyOTP = () => {
  const navigate = useNavigate();
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [isLoading, setIsLoading] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const handleChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, 6);
    const newOtp = [...otp];
    pasted.split("").forEach((char, i) => {
      newOtp[i] = char;
    });
    setOtp(newOtp);
    const focusIndex = Math.min(pasted.length, 5);
    inputRefs.current[focusIndex]?.focus();
  };

  const handleVerify = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setIsVerified(true);
      setTimeout(() => navigate("/auth/login"), 2000);
    }, 1500);
  };

  const otpFilled = otp.every((d) => d !== "");

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <div className="h-2 bg-gradient-primary w-full" />

      <div className="flex-1 flex flex-col items-center justify-center px-6 py-8">
        <div className="w-full max-w-sm space-y-6 animate-fade-in">
          <div className="text-center space-y-3">
            <img src={logo} alt="IREBE GROUP" className="h-14 mx-auto" />

            {!isVerified ? (
              <>
                <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
                  <ShieldCheck className="h-8 w-8 text-primary" />
                </div>
                <h1 className="text-2xl font-bold font-display text-foreground">
                  Verify Your Phone
                </h1>
                <p className="text-sm text-muted-foreground">
                  Enter the 6-digit code sent to your phone number
                </p>
              </>
            ) : (
              <>
                <div className="h-16 w-16 rounded-full bg-success/10 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="h-8 w-8 text-success" />
                </div>
                <h1 className="text-2xl font-bold font-display text-foreground">
                  Verified!
                </h1>
                <p className="text-sm text-muted-foreground">
                  Your account has been verified successfully. Redirecting...
                </p>
              </>
            )}
          </div>

          {!isVerified && (
            <>
              {/* OTP Input */}
              <div className="flex justify-center gap-3" onPaste={handlePaste}>
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    ref={(el) => {
                      inputRefs.current[index] = el;
                    }}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    className={`w-12 h-14 text-center text-xl font-bold rounded-xl border-2 transition-all bg-card text-foreground outline-none ${
                      digit
                        ? "border-primary shadow-sm"
                        : "border-border focus:border-primary"
                    }`}
                  />
                ))}
              </div>

              <Button
                onClick={handleVerify}
                disabled={!otpFilled || isLoading}
                className="w-full h-12 rounded-xl bg-gradient-primary text-primary-foreground font-semibold"
              >
                {isLoading ? (
                  <div className="h-5 w-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                ) : (
                  "Verify Code"
                )}
              </Button>

              <div className="text-center space-y-3">
                <p className="text-sm text-muted-foreground">
                  Didn't receive the code?{" "}
                  <button className="font-semibold text-primary hover:text-primary/80 transition-colors">
                    Resend Code
                  </button>
                </p>
                <p className="text-xs text-muted-foreground">
                  Code expires in 05:00
                </p>
              </div>

              <div className="flex items-center justify-center">
                <Link
                  to="/auth/login"
                  className="flex items-center gap-1 text-sm font-medium text-primary hover:text-primary/80 transition-colors"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Back to Sign In
                </Link>
              </div>
            </>
          )}
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

export default VerifyOTP;
