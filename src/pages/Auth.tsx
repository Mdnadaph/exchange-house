// import React, { useState, useEffect } from "react";
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

// type LoginType =
//   | "SUPER_USER"
//   | "ADMIN"
//   | "EXCHANGE_USER"
//   | "STAFF"
//   | "BUSINESS"
//   | "BUSINESS_USER";

// interface JwtPayload {
//   roles?: string[];
//   exp: number;
// }

// /* ================= ROLE CONSTANTS ================= */

// const BRANCH_ROLES = [
//   "ROLE_STAFF",
//   "ROLE_KYB_OFFICER",
//   "ROLE_SENIOR_KYB_OFFICER",
//   "ROLE_BRANCH_MANAGER",
// ];

// const BUSINESS_ROLES = ["ROLE_USER", "ROLE_BUSINESS_USER"];

// /* ================= COMPONENT ================= */

// const Auth: React.FC = () => {
//   const navigate = useNavigate();
//   const location = useLocation();
//   const [cookies] = useCookies(["token", "role", "tempToken", "twoFactorMethod"]);

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
//   const [errorMessage, setErrorMessage] = useState<string>("");

//   const from = location.state?.from?.pathname;

//   // ─── AUTO REDIRECT IF ALREADY LOGGED IN ────────────────────────────────
//   useEffect(() => {
//     if (cookies.token && cookies.role) {
//       const role = cookies.role as string;

//       // Prevent showing login page to already authenticated users
//       if (role === "ROLE_SUPER_USER") {
//         navigate("/admin", { replace: true });
//       } else if (
//         role === "ROLE_EXCHANGE_ADMIN" ||
//         role === "ROLE_EXCHANGE_USER"
//       ) {
//         navigate("/exchange", { replace: true });
//       } else if (BRANCH_ROLES.includes(role)) {
//         navigate("/branch", { replace: true });
//       } else if (role === "ROLE_BUSINESS_ADMIN") {
//         navigate("/portal", { replace: true });
//       } else if (BUSINESS_ROLES.includes(role)) {
//         navigate("/user", { replace: true });
//       } else {
//         // Rare fallback — clear suspicious cookies and stay on login
//         console.warn("Unexpected role while already logged in:", role);
//         // Optional: clear cookies here if you want to force re-login
//         // setCookie("token", "", { path: "/", maxAge: -1 });
//         // setCookie("role", "", { path: "/", maxAge: -1 });
//       }
//     }
//   }, [cookies.token, cookies.role, navigate]);

//   /* ================= LOGIN HANDLER ================= */

//   const handleLogin = async (values: any, { setSubmitting }: any) => {
//     setErrorMessage(""); // Clear previous error
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
//       case "EXCHANGE_USER":
//         apiUrl = `${BASE_URL}/api/v3/auth/user-login`;
//         break;
//       case "BUSINESS_USER":
//         apiUrl = `${BASE_URL}/api/v3/business-user-auth/login`;
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
//         setErrorMessage(res.data.message || "email or password do not match!");
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

//         if (loginType === "BUSINESS_USER") {
//           navigate(
//             requiresTwoFactor
//               ? "/business-user-2fa-login"
//               : "/business-user-generateqr",
//           );
//           return;
//         }
//       }

//       /* ===== NORMAL LOGIN ===== */
//       const payload = JSON.parse(atob(accessToken.split(".")[1])) as JwtPayload;
//       const role = payload.roles?.[0];
//       const maxAge = payload.exp - Math.floor(Date.now() / 1000);

//       setCookie("token", accessToken, { path: "/", maxAge });
//       setCookie("role", role, { path: "/", maxAge });
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
//           case "ROLE_EXCHANGE_USER":
//             navigate("/exchange");
//             break;
//           case "ROLE_BUSINESS_ADMIN":
//             navigate("/portal");
//             break;
//           case "ROLE_BUSINESS_USER":
//             navigate("/user"); // or "/portal" — choose consistent one
//             break;
//           default:
//             if (BRANCH_ROLES.includes(role || "")) {
//               navigate("/branch");
//             } else {
//               console.warn("Unknown role:", role);
//               toast.error("Unknown role. Please contact support.");
//               navigate("/login");
//             }
//             break;
//         }
//       }
//     } catch (err: any) {
//       const statusCode = err?.response?.data?.statusCode;
//       const uuid = err?.response?.data?.data?.uuid;

//       if (statusCode === 428) {
//         if (loginType === "EXCHANGE_USER") {
//           navigate(`/ExchangeUser-ChangePassword?uuid=${uuid}`);
//         } else {
//           navigate(`/change-password?uuid=${uuid}`);
//         }
//         return;
//       }

//       setErrorMessage(
//         err?.response?.data?.message || "Invalid email or password",
//       );
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
//               <div className="pt-4 pb-2 text-center">
//                 <h1 className="text-xl font-bold">Sign In</h1>
//               </div>

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
//                           <ErrorMessage
//                             name="password"
//                             component="div"
//                             className="text-red-500 text-sm"
//                           />
//                         </div>

//                         {errorMessage && (
//                           <div className="text-red-500 text-sm text-center">
//                             {errorMessage}
//                           </div>
//                         )}

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
//                               <SelectItem value="EXCHANGE_USER">
//                                 Exchange User Portal
//                               </SelectItem>
//                               <SelectItem value="STAFF">
//                                 Branch Admin Portal
//                               </SelectItem>
//                               <SelectItem value="BUSINESS">
//                                 Business Admin Portal
//                               </SelectItem>
//                               <SelectItem value="BUSINESS_USER">
//                                 Business User Portal
//                               </SelectItem>
//                             </SelectContent>
//                           </Select>

//                           <p className="text-xs text-muted-foreground mt-2">
//                             Select the portal you want to access
//                           </p>
//                         </div>

//                         <div className="flex items-center justify-between text-sm">
//                           <Button
//                             type="button"
//                             variant="link"
//                             className="p-0 h-auto text-primary"
//                           >
//                             Forgot Password?
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

//               {/* SIGNUP (placeholder) */}
//               <TabsContent value="signup">
//                 {/* ... your signup form ... */}
//               </TabsContent>
//             </Tabs>
//           </Card>
//         </div>
//       </main>

//       {/* FOOTER */}
//       <footer className="border-t py-4 text-center text-sm text-muted-foreground">
//         © {new Date().getFullYear()} TIJARASOFT. All rights reserved.
//       </footer>
//     </div>
//   );
// };

// export default Auth;

import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { useCookies } from "react-cookie";
import { toast } from "react-toastify";

import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { Eye, EyeOff, Building2, Shield, ArrowLeft } from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import BASE_URL from "@/config/config";

/* ================= VALIDATION ================= */

const loginSchema = Yup.object({
  email: Yup.string().email("Invalid email").required("Email required"),
  password: Yup.string().min(6).required("Password required"),
});

/* ================= CONSTANTS ================= */

const BRANCH_ROLES = [
  "ROLE_STAFF",
  "ROLE_KYB_OFFICER",
  "ROLE_SENIOR_KYB_OFFICER",
  "ROLE_BRANCH_MANAGER",
];

/* ================= COMPONENT ================= */

const Auth: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [cookies, setCookie, removeCookie] = useCookies([
    "token",
    "refreshToken",
    "role",
    "tempToken",
    "twoFactorMethod",
    "fullName",
    "passwordChangeToken", // ← added
    "tempUserType", // ← added (optional but useful)
  ]);

  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const from = location.state?.from?.pathname;

  // Redirect if already logged in
  useEffect(() => {
    if (cookies.token && cookies.role) {
      const role = cookies.role as string;
      if (role === "ROLE_SUPER_USER") {
        navigate("/admin", { replace: true });
      } else if (["ROLE_EXCHANGE_ADMIN", "ROLE_EXCHANGE_USER"].includes(role)) {
        navigate("/exchange", { replace: true });
      } else if (BRANCH_ROLES.includes(role)) {
        navigate("/branch", { replace: true });
      } else if (role === "ROLE_BUSINESS_ADMIN") {
        navigate("/portal", { replace: true });
      } else if (["ROLE_BUSINESS_USER", "ROLE_USER"].includes(role)) {
        navigate("/user", { replace: true });
      }
    }
  }, [cookies.token, cookies.role, navigate]);

  const handleLogin = async (
    values: { email: string; password: string },
    { setSubmitting }: any,
  ) => {
    setErrorMessage("");

    try {
      const res = await axios.post(
        `${BASE_URL}/api/v3/unified/login`,
        {
          email: values.email,
          password: values.password,
        },
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        },
      );

      if (!res.data?.status) {
        setErrorMessage(res.data.message || "Login failed");
        return;
      }

      const data = res.data.data;

      // ─── 2FA required ─────────────────────────────────
      if (data.requiresTwoFactor && data.tempToken) {
        const payload = JSON.parse(atob(data.tempToken.split(".")[1]));
        const maxAge = payload.exp - Math.floor(Date.now() / 1000);

        setCookie("tempToken", data.tempToken, { path: "/", maxAge });
        setCookie("twoFactorMethod", data.twoFactorMethod, {
          path: "/",
          maxAge,
        });

        switch (data.userType) {
          case "SUPER_USER":
            navigate("/verify-2fa-super");
            break;
          case "EXCHANGE_ADMIN":
          case "EXCHANGE_USER":
            navigate("/exchange/2fa-login");
            break;
          case "BUSINESS_ADMIN":
            navigate("/business/2fa/login");
            break;
          case "BUSINESS_USER":
            navigate("/business-user-2fa-login");
            break;
          default:
            navigate("/verify-2fa-login");
        }
        return;
      }

      // ─── Normal successful login ────────
      if (data.accessToken) {
        const jwtPayload = JSON.parse(atob(data.accessToken.split(".")[1]));
        const role = jwtPayload.roles?.[0] || "";
        const maxAge = jwtPayload.exp - Math.floor(Date.now() / 1000);

        setCookie("token", data.accessToken, { path: "/", maxAge });
        setCookie("role", role, { path: "/", maxAge });

        if (data.refreshToken) {
          setCookie("refreshToken", data.refreshToken, { path: "/" });
        }
        if (data.fullName) {
          setCookie("fullName", data.fullName, { path: "/", maxAge });
        }

        toast.success("Login successful");

        if (from) {
          navigate(from, { replace: true });
          return;
        }

        // Role-based redirect
        if (role === "ROLE_SUPER_USER") {
          navigate("/admin");
        } else if (
          ["ROLE_EXCHANGE_ADMIN", "ROLE_EXCHANGE_USER"].includes(role)
        ) {
          navigate("/exchange");
        } else if (BRANCH_ROLES.includes(role)) {
          navigate("/branch");
        } else if (role === "ROLE_BUSINESS_ADMIN") {
          navigate("/portal");
        } else if (["ROLE_BUSINESS_USER", "ROLE_USER"].includes(role)) {
          navigate("/user");
        } else {
          toast.error("Unrecognized role — please contact support");
          navigate("/login");
        }
      }
    } catch (err: any) {
      const statusCode = err?.response?.status;
      const uuid = err?.response?.data?.data?.uuid;

      if (statusCode === 428) {
        navigate(`/change-password?uuid=${uuid}`);
        return;
      }

      // (Optional) Keep old uuid-based flow if it still exists somewhere
      // const uuid = responseData.uuid;
      // if (statusCode === 428 && uuid) {
      //   navigate(`/change-password?uuid=${uuid}`, { replace: true });
      //   return;
      // }

      // Default error message
      setErrorMessage(
        err?.response?.data?.message || "Invalid email or password",
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/5 flex flex-col">
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
            <div className="pt-6 pb-2 text-center">
              <h1 className="text-xl font-bold">Sign In</h1>
            </div>

            <Formik
              initialValues={{ email: "", password: "" }}
              validationSchema={loginSchema}
              onSubmit={handleLogin}
            >
              {({ isSubmitting }) => (
                <Form>
                  <CardContent className="space-y-5">
                    <div>
                      <Label>
                        Email Address <span className="text-red-600">*</span>
                      </Label>
                      <Field
                        as={Input}
                        name="email"
                        type="email"
                        autoComplete="email"
                      />
                      <ErrorMessage
                        name="email"
                        component="div"
                        className="text-red-500 text-sm mt-1"
                      />
                    </div>

                    <div>
                      <Label>
                        Password <span className="text-red-600">*</span>
                      </Label>
                      <div className="relative">
                        <Field
                          as={Input}
                          name="password"
                          type={showPassword ? "text" : "password"}
                          autoComplete="current-password"
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
                        className="text-red-500 text-sm mt-0"
                      />
                    </div>

                    {errorMessage && (
                      <div className="text-red-500 text-sm text-center pt-2">
                        {errorMessage}
                      </div>
                    )}
                  </CardContent>

                  <div className="text-center mt-0">
                    <Button
                      variant="link"
                      className="text-sm"
                      onClick={() => navigate("/forgot-password")}
                    >
                      Forgot Password ?
                    </Button>
                  </div>

                  <CardFooter className="flex-col gap-4 pt-2">
                    <Button
                      type="submit"
                      className="w-full"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? "Logging in..." : "Sign In"}
                    </Button>

                    <div className="flex items-center gap-2 text-xs text-muted-foreground justify-center">
                      <Shield className="h-3 w-3" />
                      Secured with enterprise-grade encryption
                    </div>
                  </CardFooter>
                </Form>
              )}
            </Formik>
          </Card>
        </div>
      </main>

      <footer className="border-t py-4 text-center text-sm text-muted-foreground mt-auto">
        © {new Date().getFullYear()} TIJARASOFT. All rights reserved.
      </footer>
    </div>
  );
};

export default Auth;
