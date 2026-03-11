// import React, { useState } from "react";
// import { useNavigate, useLocation } from "react-router-dom";
// import { Formik, Form, Field, ErrorMessage } from "formik";
// import * as Yup from "yup";
// import axios from "axios";
// import { useCookies } from "react-cookie";
// import { toast } from "react-toastify";

// import {
//   Card,
//   CardContent,
//   CardFooter,
//   CardHeader,
// } from "@/components/ui/card";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";

// import { Eye, EyeOff, Building2, Shield, ArrowLeft } from "lucide-react";
// import { ThemeToggle } from "@/components/ThemeToggle";
// import LanguageSwitcher from "@/components/LanguageSwitcher";
// import BASE_URL from "@/config/config";

// /* ================= VALIDATION ================= */

// const loginSchema = Yup.object({
//   email: Yup.string().email("Invalid email").required("Email required"),
//   password: Yup.string().min(6).required("Password required"),
// });

// /* ================= TYPES ================= */

// type LoginType = "SUPER_USER" | "ADMIN" | "STAFF" | "BUSINESS";

// interface JwtPayload {
//   roles?: string[];
//   exp: number;
// }

// /* ================= COMPONENT ================= */

// const Auth: React.FC = () => {
//   const navigate = useNavigate();
//   const location = useLocation();
//   const [, setCookie] = useCookies([
//     "token",
//     "refreshToken",
//     "role",
//     "tempToken",
//     "twoFactorMethod",
//     "fullName",
//   ]);

//   const [showPassword, setShowPassword] = useState(false);
//   const [loginType, setLoginType] = useState<LoginType>("SUPER_USER");

//   const from = location.state?.from?.pathname;

//   /* ================= LOGIN HANDLER ================= */

//   const handleLogin = async (values: any, { setSubmitting }: any) => {
//     let apiUrl = "";

//     switch (loginType) {
//       case "STAFF":
//         apiUrl = `${BASE_URL}/api/v3/staff-auth/login`;
//         break;
//       case "BUSINESS":
//         apiUrl = `${BASE_URL}/api/v3/business-auth/login`;
//         break;
//       case "SUPER_USER":
//         apiUrl = `${BASE_URL}/api/v3/auth/login`;
//         break;
//       default:
//         apiUrl = `${BASE_URL}/api/v3/auth/admin-login`;
//     }

//     try {
//       const res = await axios.post(apiUrl, values, {
//         headers: { "Content-Type": "application/json" },
//         withCredentials: true,
//       });

//       if (!res.data?.status) {
//         toast.error(res.data.message || "Invalid credentials");
//         return;
//       }

//       const {
//         requiresTwoFactor,
//         tempToken,
//         twoFactorMethod,
//         accessToken,
//         refreshToken,
//         fullName,
//       } = res.data.data;

//       /* ===== 2FA FLOW ===== */
//       if (requiresTwoFactor !== undefined && tempToken) {
//         const payload = JSON.parse(atob(tempToken.split(".")[1])) as JwtPayload;
//         const maxAge = payload.exp - Math.floor(Date.now() / 1000);

//         setCookie("tempToken", tempToken, { path: "/", maxAge });
//         setCookie("twoFactorMethod", twoFactorMethod, { path: "/", maxAge });

//         if (loginType === "STAFF") {
//           navigate(requiresTwoFactor ? "/verify-2fa-login" : "/generateqr");
//           return;
//         }

//         if (loginType === "BUSINESS") {
//           navigate(
//             requiresTwoFactor ? "/business/2fa/login" : "/business/2fa/qr",
//           );
//           return;
//         }
//       }

//       /* ===== NORMAL LOGIN ===== */
//       const payload = JSON.parse(atob(accessToken.split(".")[1])) as JwtPayload;
//       const role = payload.roles?.[0];
//       const maxAge = payload.exp - Math.floor(Date.now() / 1000);

//       setCookie("token", accessToken, { path: "/", maxAge });
//       setCookie("role", role, { path: "/" });
//       setCookie("fullName", fullName, { path: "/", maxAge });

//       if (refreshToken) {
//         setCookie("refreshToken", refreshToken, { path: "/" });
//       }

//       toast.success("Login successful");

//       if (from) {
//         navigate(from, { replace: true });
//       } else {
//         switch (role) {
//           case "ROLE_SUPER_USER":
//             navigate("/admin");
//             break;
//           case "ROLE_EXCHANGE_ADMIN":
//             navigate("/exchange");
//             break;
//           default:
//             navigate(loginType === "BUSINESS" ? "/portal" : "/branch");
//         }
//       }
//     } catch (err: any) {
//       toast.error(err?.response?.data?.message || "Login failed");
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   /* ================= UI ================= */

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/5 flex flex-col">
//       {/* HEADER */}
//       <header className="border-b bg-background/80 backdrop-blur">
//         <div className="container mx-auto px-4 py-4 flex justify-between">
//           <Button variant="ghost" size="sm" onClick={() => navigate("/")}>
//             <ArrowLeft className="h-4 w-4 mr-2" /> Back
//           </Button>
//           <div className="flex gap-2">
//             <LanguageSwitcher />
//             <ThemeToggle />
//           </div>
//         </div>
//       </header>

//       {/* MAIN */}
//       <main className="flex-1 flex items-center justify-center p-4">
//         <div className="w-full max-w-md">
//           <div className="text-center mb-8">
//             <div className="inline-flex w-16 h-16 rounded-2xl bg-primary text-primary-foreground items-center justify-center mb-4">
//               <Building2 className="h-8 w-8" />
//             </div>
//             <h1 className="text-2xl font-bold">B2B Remit Portal</h1>
//             <p className="text-muted-foreground">
//               Secure cross-border payment platform
//             </p>
//           </div>

//           <Card className="shadow-xl">
//             <Tabs defaultValue="login">
//               <CardHeader>
//                 <TabsList className="grid grid-cols-2">
//                   <TabsTrigger value="login">Sign In</TabsTrigger>
//                   <TabsTrigger value="signup">Sign Up</TabsTrigger>
//                 </TabsList>
//               </CardHeader>

//               {/* ================= LOGIN ================= */}
//               <TabsContent value="login">
//                 <Formik
//                   initialValues={{ email: "", password: "" }}
//                   validationSchema={loginSchema}
//                   onSubmit={handleLogin}
//                 >
//                   {({ isSubmitting }) => (
//                     <Form>
//                       <CardContent className="space-y-4">
//                         <div>
//                           <Label>Email Address</Label>
//                           <Field as={Input} name="email" />
//                           <ErrorMessage
//                             name="email"
//                             component="div"
//                             className="text-red-500 text-sm"
//                           />
//                         </div>

//                         <div>
//                           <Label>Password</Label>
//                           <div className="relative">
//                             <Field
//                               as={Input}
//                               name="password"
//                               type={showPassword ? "text" : "password"}
//                             />
//                             <Button
//                               type="button"
//                               variant="ghost"
//                               size="sm"
//                               className="absolute right-0 top-0 h-full px-3"
//                               onClick={() => setShowPassword(!showPassword)}
//                             >
//                               {showPassword ? <EyeOff /> : <Eye />}
//                             </Button>
//                           </div>
//                         </div>

//                         <div>
//                           <Label>Portal Access</Label>
//                           <Select
//                             value={loginType}
//                             onValueChange={(v: LoginType) => setLoginType(v)}
//                           >
//                             <SelectTrigger>
//                               <SelectValue />
//                             </SelectTrigger>
//                             <SelectContent>
//                               <SelectItem value="SUPER_USER">
//                                 Super Admin Portal
//                               </SelectItem>
//                               <SelectItem value="ADMIN">
//                                 Exchange Admin Portal
//                               </SelectItem>
//                               <SelectItem value="STAFF">
//                                 Branch User Portal
//                               </SelectItem>
//                               <SelectItem value="BUSINESS">
//                                 Business User Portal
//                               </SelectItem>
//                             </SelectContent>
//                           </Select>

//                           <p className="text-xs text-muted-foreground mt-2">
//                             Select the portal you want to access
//                           </p>
//                         </div>
//                         <div
//                           className={`flex items-center justify-between text-sm`}
//                         >
//                           <Button
//                             type="button"
//                             variant="link"
//                             className="p-0 h-auto text-primary"
//                           >
//                             forgot Password
//                           </Button>
//                         </div>
//                       </CardContent>

//                       <CardFooter className="flex-col gap-4">
//                         <Button
//                           type="submit"
//                           className="w-full"
//                           disabled={isSubmitting}
//                         >
//                           {isSubmitting ? "Logging in..." : "Sign In"}
//                         </Button>

//                         <div className="flex items-center gap-2 text-xs text-muted-foreground">
//                           <Shield className="h-3 w-3" />
//                           Secured with enterprise-grade encryption
//                         </div>
//                       </CardFooter>
//                     </Form>
//                   )}
//                 </Formik>
//               </TabsContent>

//               {/* ================= SIGNUP (DESIGN ONLY) ================= */}
//               <TabsContent value="signup">
//                 <CardContent className="space-y-4">
//                   <div>
//                     <Label>Company Name</Label>
//                     <Input placeholder="Your Company Ltd." />
//                   </div>
//                   <div>
//                     <Label>Full Name</Label>
//                     <Input placeholder="John Smith" />
//                   </div>
//                   <div>
//                     <Label>Email</Label>
//                     <Input placeholder="you@company.com" />
//                   </div>
//                   <div>
//                     <Label>Password</Label>
//                     <Input type="password" placeholder="••••••••" />
//                   </div>
//                   <div>
//                     <Label>Confirm Password</Label>
//                     <Input type="password" placeholder="••••••••" />
//                   </div>
//                 </CardContent>

//                 <CardFooter className="flex-col gap-4">
//                   <Button className="w-full">Create Account</Button>
//                   <p className="text-xs text-muted-foreground text-center">
//                     By signing up, you agree to Terms & Privacy Policy
//                   </p>
//                 </CardFooter>
//               </TabsContent>
//             </Tabs>
//           </Card>
//         </div>
//       </main>

//       {/* FOOTER */}
//       <footer className="border-t py-4 text-center text-sm text-muted-foreground">
//         © 2026 B2B Remit Portal. All rights reserved.
//       </footer>
//     </div>
//   );
// };

// export default Auth;

import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { useCookies } from "react-cookie";
import { toast } from "react-toastify";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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

import { Eye, EyeOff, Building2, Shield, ArrowLeft } from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import BASE_URL from "@/config/config";

/* ================= VALIDATION ================= */

const loginSchema = Yup.object({
  email: Yup.string().email("Invalid email").required("Email required"),
  password: Yup.string().min(6).required("Password required"),
});

/* ================= TYPES ================= */

type LoginType =
  | "SUPER_USER"
  | "ADMIN"
  | "EXCHANGE_USER"
  | "STAFF"
  | "BUSINESS"
  | "BUSINESS_USER";

interface JwtPayload {
  roles?: string[];
  exp: number;
}

/* ================= ROLE CONSTANTS ================= */

const BRANCH_ROLES = [
  "ROLE_STAFF",
  "ROLE_KYB_OFFICER",
  "ROLE_SENIOR_KYB_OFFICER",
  "ROLE_BRANCH_MANAGER",
];

const BUSINESS_ROLES = ["ROLE_USER", "ROLE_BUSINESS_USER"];

/* ================= COMPONENT ================= */

const Auth: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [, setCookie] = useCookies([
    "token",
    "refreshToken",
    "role",
    "tempToken",
    "twoFactorMethod",
    "fullName",
  ]);

  const [showPassword, setShowPassword] = useState(false);
  const [loginType, setLoginType] = useState<LoginType>("SUPER_USER");
  const [errorMessage, setErrorMessage] = useState<string>("");

  const from = location.state?.from?.pathname;

  /* ================= LOGIN HANDLER ================= */

  const handleLogin = async (values: any, { setSubmitting }: any) => {
    setErrorMessage(""); // Clear previous error
    let apiUrl = "";

    switch (loginType) {
      case "STAFF":
        apiUrl = `${BASE_URL}/api/v3/staff-auth/login`;
        break;
      case "BUSINESS":
        apiUrl = `${BASE_URL}/api/v3/business-auth/login`;
        break;
      case "SUPER_USER":
        apiUrl = `${BASE_URL}/api/v3/auth/login`;
        break;
      case "EXCHANGE_USER":
        apiUrl = `${BASE_URL}/api/v3/auth/user-login`;
        break;
      case "BUSINESS_USER":
        apiUrl = `${BASE_URL}/api/v3/business-user-auth/login`;
        break;
      default:
        apiUrl = `${BASE_URL}/api/v3/auth/admin-login`;
    }

    try {
      const res = await axios.post(apiUrl, values, {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      });

      if (!res.data?.status) {
        setErrorMessage(res.data.message || "email or password do not match!");
        return;
      }
      const {
        requiresTwoFactor,
        tempToken,
        twoFactorMethod,
        accessToken,
        refreshToken,
        fullName,
      } = res.data.data;

      /* ===== 2FA FLOW ===== */
      if (requiresTwoFactor !== undefined && tempToken) {
        const payload = JSON.parse(atob(tempToken.split(".")[1])) as JwtPayload;
        const maxAge = payload.exp - Math.floor(Date.now() / 1000);

        setCookie("tempToken", tempToken, { path: "/", maxAge });
        setCookie("twoFactorMethod", twoFactorMethod, { path: "/", maxAge });

        if (loginType === "STAFF") {
          navigate(requiresTwoFactor ? "/verify-2fa-login" : "/generateqr");
          return;
        }

        if (loginType === "BUSINESS") {
          navigate(
            requiresTwoFactor ? "/business/2fa/login" : "/business/2fa/qr",
          );
          return;
        }

        if (loginType === "BUSINESS_USER") {
          navigate(
            requiresTwoFactor
              ? "/business-user-2fa-login"
              : "/business-user-generateqr",
          );
          return;
        }
      }

      /* ===== NORMAL LOGIN ===== */
      const payload = JSON.parse(atob(accessToken.split(".")[1])) as JwtPayload;
      const role = payload.roles?.[0];
      const maxAge = payload.exp - Math.floor(Date.now() / 1000);

      setCookie("token", accessToken, { path: "/", maxAge });
      setCookie("role", role, { path: "/", maxAge });
      setCookie("fullName", fullName, { path: "/", maxAge });

      if (refreshToken) {
        setCookie("refreshToken", refreshToken, { path: "/" });
      }

      toast.success("Login successful");
      console.log("Detected Role from JWT:", role);
      console.log("Current Login Type:", loginType);
      if (from) {
        navigate(from, { replace: true });
      } else {
        console.log("Detected Role from JWT:", role);
        console.log("Current Login Type:", loginType);
        console.log(JSON.parse(atob(accessToken.split(".")[1])));

        switch (role) {
          case "ROLE_SUPER_USER":
            navigate("/admin");
            break;
          case "ROLE_EXCHANGE_ADMIN":
            navigate("/exchange");
            break;
          case "ROLE_EXCHANGE_USER":
            navigate("/exchange");
            break;
          case "ROLE_BUSINESS_ADMIN":
            navigate("/portal");
            break;

          case "ROLE_BUSINESS_USER":
            navigate("/portal");
            break;

          default:
            if (BRANCH_ROLES.includes(role)) {
              navigate("/branch");
            } else {
              console.warn("Unknown role:", role);
              toast.error("Unknown role. Please contact support.");
              navigate("/login");
            }
            break;
        }
      }
    } catch (err: any) {
      const statusCode = err?.response?.data?.statusCode;
      const uuid = err?.response?.data?.data?.uuid;

      if (statusCode === 428) {
        if (loginType === "EXCHANGE_USER") {
          navigate(`/ExchangeUser-ChangePassword?uuid=${uuid}`);
        } else {
          navigate(`/change-password?uuid=${uuid}`);
        }
        return;
      }

      setErrorMessage(
        err?.response?.data?.message || "Invalid email or password",
      );
    } finally {
      setSubmitting(false);
    }
  };

  /* ================= UI ================= */

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/5 flex flex-col">
      {/* HEADER */}
      <header className="border-b bg-background/80 backdrop-blur">
        <div className="container mx-auto px-4 py-4 flex justify-between">
          <Button variant="ghost" size="sm" onClick={() => navigate("/")}>
            <ArrowLeft className="h-4 w-4 mr-2" /> Back
          </Button>
          <div className="flex gap-2">
            <LanguageSwitcher />
            <ThemeToggle />
          </div>
        </div>
      </header>

      {/* MAIN */}
      <main className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <div className="inline-flex w-16 h-16 rounded-2xl bg-primary text-primary-foreground items-center justify-center mb-4">
              <Building2 className="h-8 w-8" />
            </div>
            <h1 className="text-2xl font-bold">B2B Remit Portal</h1>
            <p className="text-muted-foreground">
              Secure cross-border payment platform
            </p>
          </div>

          <Card className="shadow-xl">
            <Tabs defaultValue="login">
              {/* <CardHeader>
                <TabsList className="grid grid-cols-2">
                  <TabsTrigger value="login">Sign In</TabsTrigger>
                  <TabsTrigger value="signup">Sign Up</TabsTrigger>
                </TabsList>
              </CardHeader> */}
              <div className="pt-4 tb-2 text-center">
                <h1 className="text-xl font-bold">Sign In</h1>
              </div>

              {/* ================= LOGIN ================= */}
              <TabsContent value="login">
                <Formik
                  initialValues={{ email: "", password: "" }}
                  validationSchema={loginSchema}
                  onSubmit={handleLogin}
                >
                  {({ isSubmitting }) => (
                    <Form>
                      <CardContent className="space-y-4">
                        <div>
                          <Label>Email Address</Label>
                          <Field as={Input} name="email" />
                          <ErrorMessage
                            name="email"
                            component="div"
                            className="text-red-500 text-sm"
                          />
                        </div>

                        <div>
                          <Label>Password</Label>
                          <div className="relative">
                            <Field
                              as={Input}
                              name="password"
                              type={showPassword ? "text" : "password"}
                            />
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              className="absolute right-0 top-0 h-full px-3"
                              onClick={() => setShowPassword(!showPassword)}
                            >
                              {showPassword ? <EyeOff /> : <Eye />}
                            </Button>
                          </div>
                          <ErrorMessage
                            name="password"
                            component="div"
                            className="text-red-500 text-sm"
                          />
                        </div>

                        {errorMessage && (
                          <div className="text-red-500 text-sm text-center">
                            {errorMessage}
                          </div>
                        )}

                        <div>
                          <Label>Portal Access</Label>
                          <Select
                            value={loginType}
                            onValueChange={(v: LoginType) => setLoginType(v)}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="SUPER_USER">
                                Super Admin Portal
                              </SelectItem>

                              <SelectItem value="ADMIN">
                                Exchange Admin Portal
                              </SelectItem>
                              <SelectItem value="EXCHANGE_USER">
                                Exchange User Portal
                              </SelectItem>
                              <SelectItem value="STAFF">
                                Branch Admin Portal
                              </SelectItem>
                              <SelectItem value="BUSINESS">
                                Business Admin Portal
                              </SelectItem>
                              <SelectItem value="BUSINESS_USER">
                                Business User Portal
                              </SelectItem>
                            </SelectContent>
                          </Select>

                          <p className="text-xs text-muted-foreground mt-2">
                            Select the portal you want to access
                          </p>
                        </div>
                        <div
                          className={`flex items-center justify-between text-sm`}
                        >
                          <Button
                            type="button"
                            variant="link"
                            className="p-0 h-auto text-primary"
                          >
                            Forgot Password?
                          </Button>
                        </div>
                      </CardContent>

                      <CardFooter className="flex-col gap-4">
                        <Button
                          type="submit"
                          className="w-full"
                          disabled={isSubmitting}
                        >
                          {isSubmitting ? "Logging in..." : "Sign In"}
                        </Button>

                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <Shield className="h-3 w-3" />
                          Secured with enterprise-grade encryption
                        </div>
                      </CardFooter>
                    </Form>
                  )}
                </Formik>
              </TabsContent>

              {/* ================= SIGNUP (DESIGN ONLY) ================= */}
              <TabsContent value="signup">
                <CardContent className="space-y-4">
                  <div>
                    <Label>Company Name</Label>
                    <Input placeholder="Your Company Ltd." />
                  </div>
                  <div>
                    <Label>Full Name</Label>
                    <Input placeholder="John Smith" />
                  </div>
                  <div>
                    <Label>Email</Label>
                    <Input placeholder="you@company.com" />
                  </div>
                  <div>
                    <Label>Password</Label>
                    <Input type="password" placeholder="••••••••" />
                  </div>
                  <div>
                    <Label>Confirm Password</Label>
                    <Input type="password" placeholder="••••••••" />
                  </div>
                </CardContent>

                <CardFooter className="flex-col gap-4">
                  <Button className="w-full">Create Account</Button>
                  <p className="text-xs text-muted-foreground text-center">
                    By signing up, you agree to Terms & Privacy Policy
                  </p>
                </CardFooter>
              </TabsContent>
            </Tabs>
          </Card>
        </div>
      </main>

      {/* FOOTER */}
      <footer className="border-t py-4 text-center text-sm text-muted-foreground">
        @ {new Date().getFullYear()} TIJARASOFT. All rights reserved.
      </footer>
    </div>
  );
};

export default Auth;
