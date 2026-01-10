import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { FileText, Loader2, ArrowLeft, Mail, CheckCircle, Phone } from "lucide-react";
import { Link } from "react-router-dom";
import { PhoneInput } from "@/components/ui/phone-input";
import { motion, AnimatePresence } from "framer-motion";

const signInSchema = z.object({
  email: z.string().trim().email({ message: "Please enter a valid email" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
});

const signUpSchema = z.object({
  fullName: z.string().trim().min(2, { message: "Name must be at least 2 characters" }),
  email: z.string().trim().email({ message: "Please enter a valid email" }),
  phone: z.string().optional(),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

const forgotPasswordSchema = z.object({
  email: z.string().trim().email({ message: "Please enter a valid email" }),
});

type SignInFormData = z.infer<typeof signInSchema>;
type SignUpFormData = z.infer<typeof signUpSchema>;
type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;

type AuthView = "signIn" | "signUp" | "forgotPassword";

const GoogleIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24">
    <path
      fill="currentColor"
      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
    />
    <path
      fill="currentColor"
      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
    />
    <path
      fill="currentColor"
      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
    />
    <path
      fill="currentColor"
      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
    />
  </svg>
);

const Auth = () => {
  const [view, setView] = useState<AuthView>("signIn");
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [resetEmailSent, setResetEmailSent] = useState(false);
  const { signIn, signUp, signInWithGoogle, resetPassword, user, loading } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const signInForm = useForm<SignInFormData>({
    resolver: zodResolver(signInSchema),
    defaultValues: { email: "", password: "" },
  });

  const signUpForm = useForm<SignUpFormData>({
    resolver: zodResolver(signUpSchema),
    defaultValues: { fullName: "", email: "", phone: "", password: "", confirmPassword: "" },
  });

  const forgotPasswordForm = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: "" },
  });

  useEffect(() => {
    if (!loading && user) {
      navigate("/");
    }
  }, [user, loading, navigate]);

  const handleSignIn = async (data: SignInFormData) => {
    setIsLoading(true);
    const { error } = await signIn(data.email, data.password);
    setIsLoading(false);

    if (error) {
      let message = "An error occurred during sign in";
      if (error.message.includes("Invalid login credentials")) {
        message = "Invalid email or password. Please try again.";
      } else if (error.message.includes("Email not confirmed")) {
        message = "Please confirm your email before signing in.";
      }
      toast({ title: "Sign In Failed", description: message, variant: "destructive" });
    } else {
      toast({ title: "Welcome back!", description: "You've signed in successfully." });
      navigate("/");
    }
  };

  const handleSignUp = async (data: SignUpFormData) => {
    setIsLoading(true);
    const { error } = await signUp(data.email, data.password, data.fullName, data.phone || undefined);
    setIsLoading(false);

    if (error) {
      let message = "An error occurred during sign up";
      if (error.message.includes("already registered")) {
        message = "This email is already registered. Try signing in instead.";
      } else if (error.message.includes("password")) {
        message = "Password is too weak. Please use a stronger password.";
      }
      toast({ title: "Sign Up Failed", description: message, variant: "destructive" });
    } else {
      toast({ title: "Account Created!", description: "Welcome to EZFOIA! You're now signed in." });
      navigate("/");
    }
  };

  const handleForgotPassword = async (data: ForgotPasswordFormData) => {
    setIsLoading(true);
    const { error } = await resetPassword(data.email);
    setIsLoading(false);

    if (error) {
      toast({
        title: "Request Failed",
        description: "Could not send reset email. Please check your email and try again.",
        variant: "destructive",
      });
    } else {
      setResetEmailSent(true);
    }
  };

  const handleGoogleSignIn = async () => {
    setIsGoogleLoading(true);
    const { error } = await signInWithGoogle();
    setIsGoogleLoading(false);

    if (error) {
      toast({ 
        title: "Google Sign In Failed", 
        description: "Could not sign in with Google. Please try again.", 
        variant: "destructive" 
      });
    }
  };

  const switchView = (newView: AuthView) => {
    setView(newView);
    setResetEmailSent(false);
    signInForm.reset();
    signUpForm.reset();
    forgotPasswordForm.reset();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  const getTitle = () => {
    switch (view) {
      case "signUp":
        return "Create an account";
      case "forgotPassword":
        return "Reset your password";
      default:
        return "Welcome back";
    }
  };

  const getSubtitle = () => {
    switch (view) {
      case "signUp":
        return "Start making FOIA requests in minutes";
      case "forgotPassword":
        return "Enter your email and we'll send you a reset link";
      default:
        return "Sign in to track your FOIA requests";
    }
  };

  return (
    <div className="min-h-screen flex bg-background">
      {/* Left Panel - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-hero-gradient items-center justify-center p-12 relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 -left-32 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse-slow" />
          <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-pulse-slow" />
        </div>
        <div className="relative z-10 text-center">
          <div className="flex items-center justify-center gap-3 mb-8">
            <div className="w-14 h-14 rounded-xl bg-primary flex items-center justify-center">
              <FileText className="w-7 h-7 text-primary-foreground" />
            </div>
            <span className="font-display text-3xl font-bold">EZFOIA</span>
          </div>
          <h1 className="font-display text-4xl font-bold mb-4">
            Access Public Records<br />
            <span className="text-gradient">With Ease</span>
          </h1>
          <p className="text-muted-foreground text-lg max-w-md mx-auto">
            Join thousands of journalists, researchers, and citizens who trust EZFOIA for their FOIA requests.
          </p>
        </div>
      </div>

      {/* Right Panel - Auth Form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <Link to="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-8">
            <ArrowLeft className="w-4 h-4" />
            Back to home
          </Link>

          <AnimatePresence mode="wait">
            <motion.div
              key={view + (resetEmailSent ? "-sent" : "")}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {/* Forgot Password - Email Sent Success */}
              {view === "forgotPassword" && resetEmailSent ? (
                <div className="text-center">
                  <div className="w-16 h-16 rounded-full bg-emerald-500/20 flex items-center justify-center mx-auto mb-6">
                    <Mail className="w-8 h-8 text-emerald-500" />
                  </div>
                  <h2 className="font-display text-3xl font-bold mb-2">Check your email</h2>
                  <p className="text-muted-foreground mb-6">
                    We've sent a password reset link to<br />
                    <span className="text-foreground font-medium">{forgotPasswordForm.getValues("email")}</span>
                  </p>
                  <p className="text-sm text-muted-foreground mb-8">
                    Didn't receive the email? Check your spam folder or{" "}
                    <button
                      type="button"
                      onClick={() => setResetEmailSent(false)}
                      className="text-primary hover:underline"
                    >
                      try again
                    </button>
                  </p>
                  <Button variant="outline" onClick={() => switchView("signIn")}>
                    Back to Sign In
                  </Button>
                </div>
              ) : (
                <>
                  <div className="mb-8">
                    <h2 className="font-display text-3xl font-bold mb-2">{getTitle()}</h2>
                    <p className="text-muted-foreground">{getSubtitle()}</p>
                  </div>

                  {/* Google Sign In Button - Hide on forgot password */}
                  {view !== "forgotPassword" && (
                    <>
                      <Button
                        type="button"
                        variant="outline"
                        size="lg"
                        className="w-full mb-6 gap-3"
                        onClick={handleGoogleSignIn}
                        disabled={isGoogleLoading}
                      >
                        {isGoogleLoading ? (
                          <Loader2 className="w-5 h-5 animate-spin" />
                        ) : (
                          <>
                            <GoogleIcon />
                            Continue with Google
                          </>
                        )}
                      </Button>

                      <div className="relative mb-6">
                        <div className="absolute inset-0 flex items-center">
                          <div className="w-full border-t border-border" />
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                          <span className="bg-background px-2 text-muted-foreground">Or continue with email</span>
                        </div>
                      </div>
                    </>
                  )}

                  {/* Sign Up Form */}
                  {view === "signUp" && (
                    <Form {...signUpForm} key="signup-form">
                      <form onSubmit={signUpForm.handleSubmit(handleSignUp)} className="space-y-4">
                        <FormField
                          control={signUpForm.control}
                          name="fullName"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Full Name</FormLabel>
                              <FormControl>
                                <Input 
                                  placeholder="John Doe" 
                                  className="bg-card border-border" 
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={signUpForm.control}
                          name="email"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Email</FormLabel>
                              <FormControl>
                                <Input 
                                  type="email" 
                                  placeholder="john@example.com" 
                                  className="bg-card border-border" 
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={signUpForm.control}
                          name="phone"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="flex items-center gap-2">
                                <Phone className="w-4 h-4" />
                                Phone Number
                                <span className="text-xs text-muted-foreground font-normal">(optional)</span>
                              </FormLabel>
                              <FormControl>
                                <PhoneInput
                                  value={field.value || ""}
                                  onChange={field.onChange}
                                  className="bg-card border-border"
                                />
                              </FormControl>
                              <p className="text-xs text-muted-foreground">
                                For SMS status updates on your requests
                              </p>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={signUpForm.control}
                          name="password"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Password</FormLabel>
                              <FormControl>
                                <Input 
                                  type="password" 
                                  placeholder="••••••••" 
                                  className="bg-card border-border" 
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={signUpForm.control}
                          name="confirmPassword"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Confirm Password</FormLabel>
                              <FormControl>
                                <Input 
                                  type="password" 
                                  placeholder="••••••••" 
                                  className="bg-card border-border" 
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <Button type="submit" variant="hero" size="lg" className="w-full" disabled={isLoading}>
                          {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Create Account"}
                        </Button>
                      </form>
                    </Form>
                  )}

                  {/* Sign In Form */}
                  {view === "signIn" && (
                    <Form {...signInForm} key="signin-form">
                      <form onSubmit={signInForm.handleSubmit(handleSignIn)} className="space-y-4">
                        <FormField
                          control={signInForm.control}
                          name="email"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Email</FormLabel>
                              <FormControl>
                                <Input 
                                  type="email" 
                                  placeholder="john@example.com" 
                                  className="bg-card border-border" 
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={signInForm.control}
                          name="password"
                          render={({ field }) => (
                            <FormItem>
                              <div className="flex items-center justify-between">
                                <FormLabel>Password</FormLabel>
                                <button
                                  type="button"
                                  onClick={() => switchView("forgotPassword")}
                                  className="text-sm text-primary hover:underline"
                                >
                                  Forgot password?
                                </button>
                              </div>
                              <FormControl>
                                <Input 
                                  type="password" 
                                  placeholder="••••••••" 
                                  className="bg-card border-border" 
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <Button type="submit" variant="hero" size="lg" className="w-full" disabled={isLoading}>
                          {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Sign In"}
                        </Button>
                      </form>
                    </Form>
                  )}

                  {/* Forgot Password Form */}
                  {view === "forgotPassword" && (
                    <Form {...forgotPasswordForm} key="forgot-password-form">
                      <form onSubmit={forgotPasswordForm.handleSubmit(handleForgotPassword)} className="space-y-4">
                        <FormField
                          control={forgotPasswordForm.control}
                          name="email"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Email</FormLabel>
                              <FormControl>
                                <Input 
                                  type="email" 
                                  placeholder="john@example.com" 
                                  className="bg-card border-border" 
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <Button type="submit" variant="hero" size="lg" className="w-full" disabled={isLoading}>
                          {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Send Reset Link"}
                        </Button>
                      </form>
                    </Form>
                  )}

                  {/* Footer Links */}
                  <div className="mt-6 text-center">
                    {view === "forgotPassword" ? (
                      <button
                        type="button"
                        onClick={() => switchView("signIn")}
                        className="text-primary hover:underline"
                      >
                        Back to Sign In
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => switchView(view === "signUp" ? "signIn" : "signUp")}
                        className="text-primary hover:underline"
                      >
                        {view === "signUp" ? "Already have an account? Sign in" : "Don't have an account? Sign up"}
                      </button>
                    )}
                  </div>
                </>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default Auth;
