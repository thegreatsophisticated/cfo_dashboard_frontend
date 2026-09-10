import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Eye,
  EyeOff,
  Phone,
  Lock,
  User,
  Mail,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import logo from "@/assets/logo.png";

const Register = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    fullName: "",
    phone: "",
    email: "",
    nidaId: "",
    role: "",
    password: "",
    confirmPassword: "",
  });

  const updateForm = (key: string, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleNext = () => setStep(2);
  const handleBack = () => setStep(1);

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      navigate("/auth/verify-otp");
    }, 1500);
  };

  const roles = [
    { value: "worker", label: "Worker / Freelancer" },
    { value: "employer", label: "Employer" },
    { value: "company", label: "Company" },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <div className="h-2 bg-gradient-primary w-full" />

      <div className="flex-1 flex flex-col items-center justify-center px-6 py-8">
        <div className="w-full max-w-sm space-y-6 animate-fade-in">
          {/* Logo */}
          <div className="text-center space-y-3">
            <img src={logo} alt="IREBE GROUP" className="h-14 mx-auto" />
            <h1 className="text-2xl font-bold font-display text-foreground">
              Create Account
            </h1>
            <p className="text-sm text-muted-foreground">
              Join IREBE GROUP and get started
            </p>
          </div>

          {/* Step Indicator */}
          <div className="flex items-center gap-2 justify-center">
            {[1, 2].map((s) => (
              <div key={s} className="flex items-center gap-2">
                <div
                  className={`h-8 w-8 rounded-full flex items-center justify-center text-sm font-semibold transition-all ${
                    step >= s
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  {step > s ? <CheckCircle2 className="h-4 w-4" /> : s}
                </div>
                {s < 2 && (
                  <div
                    className={`w-12 h-0.5 ${step > 1 ? "bg-primary" : "bg-border"} transition-all`}
                  />
                )}
              </div>
            ))}
          </div>

          <form
            onSubmit={
              step === 2
                ? handleRegister
                : (e) => {
                    e.preventDefault();
                    handleNext();
                  }
            }
            className="space-y-4"
          >
            {step === 1 ? (
              <>
                <div className="space-y-2">
                  <Label htmlFor="fullName">Full Name</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="fullName"
                      placeholder="Enter your full name"
                      value={form.fullName}
                      onChange={(e) => updateForm("fullName", e.target.value)}
                      className="pl-10 h-12 rounded-xl"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="+250 7XX XXX XXX"
                      value={form.phone}
                      onChange={(e) => updateForm("phone", e.target.value)}
                      className="pl-10 h-12 rounded-xl"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email (Optional)</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="email@example.com"
                      value={form.email}
                      onChange={(e) => updateForm("email", e.target.value)}
                      className="pl-10 h-12 rounded-xl"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="nidaId">NIDA ID Number</Label>
                  <Input
                    id="nidaId"
                    placeholder="1 XXXX X XXXXXXX X XX"
                    value={form.nidaId}
                    onChange={(e) => updateForm("nidaId", e.target.value)}
                    className="h-12 rounded-xl"
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full h-12 rounded-xl bg-gradient-primary text-primary-foreground font-semibold"
                >
                  Continue
                  <ArrowRight className="h-4 w-4 ml-1" />
                </Button>
              </>
            ) : (
              <>
                <div className="space-y-2">
                  <Label>Account Type</Label>
                  <Select
                    value={form.role}
                    onValueChange={(v) => updateForm("role", v)}
                  >
                    <SelectTrigger className="h-12 rounded-xl">
                      <SelectValue placeholder="Select your role" />
                    </SelectTrigger>
                    <SelectContent>
                      {roles.map((r) => (
                        <SelectItem key={r.value} value={r.value}>
                          {r.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Create a password"
                      value={form.password}
                      onChange={(e) => updateForm("password", e.target.value)}
                      className="pl-10 pr-10 h-12 rounded-xl"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="confirmPassword"
                      type="password"
                      placeholder="Confirm your password"
                      value={form.confirmPassword}
                      onChange={(e) =>
                        updateForm("confirmPassword", e.target.value)
                      }
                      className="pl-10 h-12 rounded-xl"
                    />
                  </div>
                </div>

                {/* Password strength hints */}
                <div className="space-y-1.5">
                  {[
                    {
                      label: "At least 8 characters",
                      met: form.password.length >= 8,
                    },
                    {
                      label: "Contains uppercase letter",
                      met: /[A-Z]/.test(form.password),
                    },
                    {
                      label: "Contains a number",
                      met: /[0-9]/.test(form.password),
                    },
                  ].map((rule) => (
                    <div
                      key={rule.label}
                      className="flex items-center gap-2 text-xs"
                    >
                      <CheckCircle2
                        className={`h-3.5 w-3.5 ${rule.met ? "text-success" : "text-muted-foreground/40"}`}
                      />
                      <span
                        className={
                          rule.met ? "text-foreground" : "text-muted-foreground"
                        }
                      >
                        {rule.label}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="flex gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleBack}
                    className="flex-1 h-12 rounded-xl"
                  >
                    <ArrowLeft className="h-4 w-4 mr-1" />
                    Back
                  </Button>
                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="flex-1 h-12 rounded-xl bg-gradient-primary text-primary-foreground font-semibold"
                  >
                    {isLoading ? (
                      <div className="h-5 w-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                    ) : (
                      <>
                        Register
                        <ArrowRight className="h-4 w-4 ml-1" />
                      </>
                    )}
                  </Button>
                </div>
              </>
            )}
          </form>

          <p className="text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link
              to="/auth/login"
              className="font-semibold text-primary hover:text-primary/80 transition-colors"
            >
              Sign In
            </Link>
          </p>
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

export default Register;
