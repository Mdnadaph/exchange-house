// import React, { useState } from "react";
// import { Formik, Form, Field, ErrorMessage } from "formik";
// import * as Yup from "yup";
// import { useNavigate } from "react-router-dom";
// import { toast } from "react-toastify";
// import { IoMdEye, IoIosEyeOff } from "react-icons/io";
// import { useCookies } from "react-cookie";
// import axios from "axios";

// import sideImage from "../assets/images/BizPay.jpeg";
// // import logo from "../assets/images/Envision.webp";
// import logo from "../assets/images/favicon.ico";
// import BASE_URL from "@/config/config";

// interface LoginFormData {
//   email: string;
//   password: string;
// }

// const validationSchema = Yup.object({
//   email: Yup.string().email("Invalid email").required("Email required"),
//   password: Yup.string().min(6).required("Password required"),
// });

// const Login: React.FC = () => {
//   const [showPassword, setShowPassword] = useState(false);
//   const [loginType, setLoginType] = useState<"ADMIN" | "STAFF" | "BUSINESS">(
//     "ADMIN"
//   );
//   const navigate = useNavigate();

//   const [, setCookie] = useCookies([
//     "token",
//     "tempToken",
//     "email",
//     "role",
//     "fullName",
//     "twoFactorEnabled",
//     "adminId",
//   ]);

//   const onSubmit = async (values: LoginFormData, { setSubmitting }: any) => {
//     let apiUrl = "";

//     if (loginType === "STAFF") {
//       apiUrl = `${BASE_URL}/api/v3/staff-auth/login`;
//     } else if (loginType === "BUSINESS") {
//       apiUrl = `${BASE_URL}/api/v3/business-auth/login`;
//     } else {
//       apiUrl = `${BASE_URL}/api/v3/auth/admin-login`;
//     }

//     //console.group("🔐 LOGIN DEBUG START");
//     //console.log("👤 Login Type:", loginType);
//     //console.log("📧 Email:", values.email);
//     //console.log("🔑 Password:", values.password);
//     //console.log("🌐 API URL:", apiUrl);
//     //console.log("📤 REQUEST PAYLOAD:", values);

//     try {
//       const response = await axios.post(apiUrl, values, {
//         headers: { "Content-Type": "application/json" },
//       });

//       //console.log("📥 FULL API RESPONSE:", response);
//       const { data } = response;

//       if (!data?.status) {
//         //console.warn("❌ LOGIN FAILED:", data.message);
//         toast.error(data.message || "Invalid credentials");
//         return;
//       }

//       const {
//         token,
//         tempToken,
//         email,
//         role,
//         fullName,
//         tokenExpiryTime,
//         twoFactorEnabled,
//         requiresTwoFactor,
//         adminId,
//       } = data.data;

//       // ============================
//       // SAVE COOKIES
//       // ============================
//       setCookie("token", token, {
//         // path: "/",
//         // secure: true,
//         // sameSite: "strict",
//         // maxAge: tokenExpiryTime || 1800,
//         path: "/",
//         sameSite: "lax",
//         maxAge: tokenExpiryTime || 1800,
//       });
//       setCookie("email", email, { path: "/" });
//       setCookie("role", role, { path: "/" });
//       setCookie("fullName", fullName, { path: "/" });
//       setCookie("twoFactorEnabled", twoFactorEnabled, { path: "/" });
//       setCookie("adminId", adminId, { path: "/" });
//       setCookie("tempToken", tempToken, { path: "/" });

//       toast.success(data.message || "Login successful");

//       // ============================
//       // STAFF / BUSINESS 2FA FLOW
//       // ============================
//       if (loginType === "STAFF") {
//         //console.log(`🔐 STAFF LOGIN → requiresTwoFactor:`, requiresTwoFactor);

//         if (requiresTwoFactor === false) {
//           //console.log("➡️ First-time 2FA setup → Redirecting to /generateqr");
//           navigate("/generateqr");
//           return;
//         }

//         if (requiresTwoFactor === true) {
//           //console.log("➡️ Existing 2FA user → Redirecting to OTP verification");
//           navigate("/verify-2fa-login");
//           return;
//         }
//       }

//       if (loginType === "BUSINESS") {
//         //console.log(
//         //  `🔐 BUSINESS LOGIN → requiresTwoFactor:`,
//         //  requiresTwoFactor
//         //);

//         if (requiresTwoFactor === false) {
//           //console.log(
//           //  "➡️ First-time 2FA setup → Redirecting to /business/2fa/qr"
//           //);
//           navigate("/business/2fa/qr");
//           return;
//         }

//         if (requiresTwoFactor === true) {
//           //console.log(
//           //  "➡️ Existing 2FA user → Redirecting to business OTP verification"
//           //);
//           navigate("/business/2fa/login");
//           return;
//         }
//       }

//       // ============================
//       // FINAL REDIRECT
//       // ============================
//       if (role === "ROLE_ADMIN") {
//         navigate("/exchange");
//       } else if (loginType === "BUSINESS") {
//         navigate("/portal"); // Business admin default page
//       } else {
//         navigate("/branch");
//       }
//     } catch (error: any) {
//       //console.group("❌ LOGIN ERROR");
//       //console.error(error);
//       toast.error(
//         error?.response?.data?.message || "Login failed. Please try again."
//       );
//       console.groupEnd();
//     } finally {
//       console.groupEnd();
//       setSubmitting(false);
//     }
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50 p-4">
//       <div className="grid md:grid-cols-2 gap-0 max-w-5xl w-full bg-white rounded-3xl overflow-hidden shadow-xl ">
//         {/* LEFT IMAGE */}
//         <div className="hidden md:block relative h-full">
//           <img
//             src={sideImage}
//             alt="Airplane window"
//             className="absolute inset-0 w-full h-full object-cover"
//           />
//           <div className="absolute inset-0 bg-black/20" />
//         </div>

//         {/* LOGIN FORM */}
//         <div className="flex flex-col justify-center p-8 lg:p-12">
//           <div className="text-center mb-8">
//             <img src={logo} alt="Star Eco" className="h-12 mx-auto mb-4" />
//             <h1 className="text-2xl font-bold text-gray-800">
//               Login your Account
//             </h1>
//           </div>

//           {/* LOGIN TYPE SWITCH */}
//           <div className="flex gap-4 mb-6">
//             <button
//               type="button"
//               className={`px-4 py-2 rounded ${
//                 loginType === "ADMIN"
//                   ? "bg-gradient-to-r from-[#0B4FA8] via-[#1E63C6] to-[#F2C94C] text-white"
//                   : "bg-gray-300 text-black"
//               }`}
//               onClick={() => setLoginType("ADMIN")}
//             >
//               Admin Login
//             </button>
//             <button
//               type="button"
//               className={`px-4 py-2 rounded ${
//                 loginType === "STAFF"
//                   ? "bg-gradient-to-r from-[#0B4FA8] via-[#1E63C6] to-[#F2C94C] text-white"
//                   : "bg-gray-300 text-black"
//               }`}
//               onClick={() => setLoginType("STAFF")}
//             >
//               Staff Login
//             </button>
//             <button
//               type="button"
//               className={`px-4 py-2 rounded ${
//                 loginType === "BUSINESS"
//                   ? "bg-gradient-to-r from-[#0B4FA8] via-[#1E63C6] to-[#F2C94C] text-white"
//                   : "bg-gray-300 text-black"
//               }`}
//               onClick={() => setLoginType("BUSINESS")}
//             >
//               Business Admin
//             </button>
//           </div>

//           <Formik
//             initialValues={{ email: "", password: "" }}
//             validationSchema={validationSchema}
//             onSubmit={onSubmit}
//           >
//             {({ isSubmitting }) => (
//               <Form className="w-full max-w-md">
//                 {/* EMAIL */}
//                 <div className="mb-4">
//                   <label className="block text-sm font-medium text-gray-600 mb-1">
//                     Email
//                   </label>
//                   <Field
//                     name="email"
//                     type="email"
//                     className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-400"
//                   />
//                   <ErrorMessage
//                     name="email"
//                     component="p"
//                     className="text-red-500 text-sm"
//                   />
//                 </div>

//                 {/* PASSWORD */}
//                 <div className="mb-4 relative">
//                   <label className="block text-sm font-medium text-gray-600 mb-1">
//                     Password
//                   </label>
//                   <Field
//                     name="password"
//                     type={showPassword ? "text" : "password"}
//                     className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-400"
//                   />
//                   <button
//                     type="button"
//                     className="absolute right-3 top-9"
//                     onClick={() => setShowPassword(!showPassword)}
//                   >
//                     {showPassword ? <IoIosEyeOff /> : <IoMdEye />}
//                   </button>
//                   <ErrorMessage
//                     name="password"
//                     component="p"
//                     className="text-red-500 text-sm"
//                   />
//                 </div>

//                 {/* FORGOT PASSWORD */}
//                 <div className="text-center mb-3">
//                   <a href="#" className="text-sm text-red-800 hover:underline">
//                     Forgot Password?
//                   </a>
//                 </div>

//                 <button
//                   type="submit"
//                   disabled={isSubmitting}
//                   className="
//                               w-full p-2 rounded text-white
//                               bg-gradient-to-r from-[#0B4FA8] via-[#1E63C6] to-[#F2C94C]
//                               hover:from-[#083A7A] hover:via-[#174FA3] hover:to-[#D4A017]
//                               transition-all duration-300 ease-in-out
//                               disabled:opacity-60 disabled:cursor-not-allowed
//                             "
//                 >
//                   {isSubmitting
//                     ? "Logging in..."
//                     : loginType === "STAFF"
//                     ? "Login as Staff"
//                     : loginType === "BUSINESS"
//                     ? "Login as Business Admin"
//                     : "Login as Admin"}
//                 </button>

//                 {/* CONTACT ADMIN */}
//                 <p className="text-center text-sm text-gray-600 mt-5">
//                   Don't have an account?{" "}
//                   <a href="#" className="text-sky-600 hover:underline">
//                     Contact Admin
//                   </a>
//                 </p>
//               </Form>
//             )}
//           </Formik>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Login;








import React, { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useNavigate, useLocation } from "react-router-dom"; // Added useLocation
import { toast } from "react-toastify";
import { IoMdEye, IoIosEyeOff } from "react-icons/io";
import { Cookies, useCookies } from "react-cookie";
import axios from "axios";

import sideImage from "../assets/images/BizPay.jpeg";
import logo from "../assets/images/favicon.ico";
import BASE_URL from "@/config/config";

interface LoginFormData {
  email: string;
  password: string;
}

const validationSchema = Yup.object({
  email: Yup.string().email("Invalid email").required("Email required"),
  password: Yup.string().min(6).required("Password required"),
});

const Login: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [loginType, setLoginType] = useState<"ADMIN" | "STAFF" | "BUSINESS">("ADMIN");
  
  const navigate = useNavigate();
  const location = useLocation(); // Hook to access state passed from ProtectedRoute

  const [, setCookie] = useCookies([
    "token",
    "tempToken",
    "email",
    "role",
    "fullName",
    "twoFactorEnabled",
    "adminId",
  ]);




  // Capture where the user was trying to go (defaulting to null)
  const from = location.state?.from?.pathname;

  const onSubmit = async (values: LoginFormData, { setSubmitting }: any) => {
    let apiUrl = "";

    if (loginType === "STAFF") {
      apiUrl = `${BASE_URL}/api/v3/staff-auth/login`;
    } else if (loginType === "BUSINESS") {
      apiUrl = `${BASE_URL}/api/v3/business-auth/login`;
    } else {
      apiUrl = `${BASE_URL}/api/v3/auth/admin-login`;
    }

    try {
      const response = await axios.post(apiUrl, values, {
        headers: { "Content-Type": "application/json" },
      });

      const { data } = response;

      if (!data?.status) {
        toast.error(data.message || "Invalid credentials");
        return;
      }

      const {
        token,
        tempToken,
        email,
        role,
        fullName,
        tokenExpiryTime,
        twoFactorEnabled,
        requiresTwoFactor,
        adminId,
      } = data.data;

      // ============================
      // SAVE COOKIES
      // ============================
      setCookie("token", token, {
        path: "/",
        sameSite: "lax",
        maxAge: tokenExpiryTime || 1800,
      });
      setCookie("email", email, { path: "/" });
      setCookie("role", role, { path: "/" });
      setCookie("fullName", fullName, { path: "/" });
      setCookie("twoFactorEnabled", twoFactorEnabled, { path: "/" });
      setCookie("adminId", adminId, { path: "/" });
      setCookie("tempToken", tempToken, { path: "/" });


      console.log(token);
      console.log(email);
      console.log(fullName);
      console.log(adminId);
      console.log(role);

      toast.success(data.message || "Login successful");

      // ============================
      // STAFF / BUSINESS 2FA FLOW
      // ============================
      if (loginType === "STAFF") {
        if (requiresTwoFactor === false) {
          navigate("/generateqr");
          return;
        }
        if (requiresTwoFactor === true) {
          navigate("/verify-2fa-login");
          return;
        }
      }

      if (loginType === "BUSINESS") {
        if (requiresTwoFactor === false) {
          navigate("/business/2fa/qr");
          return;
        }
        if (requiresTwoFactor === true) {
          navigate("/business/2fa/login");
          return;
        }
      }

      // ==========================================
      // FINAL REDIRECT (Logic Optimized for UX)
      // ==========================================
      
      // If the user was trying to access a specific page before logging in, take them back there.
      if (from) {
        navigate(from, { replace: true });
      } else {
        // Fallback to role-based defaults if they came directly to the login page
        if (role === "ROLE_ADMIN") {
          navigate("/exchange");
        } else if (loginType === "BUSINESS") {
          navigate("/portal");
        } else {
          navigate("/branch");
        }
      }

    } catch (error: any) {
      toast.error(
        error?.response?.data?.message || "Login failed. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50 p-4">
      <div className="grid md:grid-cols-2 gap-0 max-w-5xl w-full bg-white rounded-3xl overflow-hidden shadow-xl ">
        <div className="hidden md:block relative h-full">
          <img
            src={sideImage}
            alt="Airplane window"
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/20" />
        </div>

        <div className="flex flex-col justify-center p-8 lg:p-12">
          <div className="text-center mb-8">
            <img src={logo} alt="Star Eco" className="h-12 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-800">
              Login your Account
            </h1>
          </div>

          <div className="flex gap-4 mb-6">
            <button
              type="button"
              className={`px-4 py-2 rounded ${
                loginType === "ADMIN"
                  ? "bg-gradient-to-r from-[#0B4FA8] via-[#1E63C6] to-[#F2C94C] text-white"
                  : "bg-gray-300 text-black"
              }`}
              onClick={() => setLoginType("ADMIN")}
            >
              Admin Login
            </button>
            <button
              type="button"
              className={`px-4 py-2 rounded ${
                loginType === "STAFF"
                  ? "bg-gradient-to-r from-[#0B4FA8] via-[#1E63C6] to-[#F2C94C] text-white"
                  : "bg-gray-300 text-black"
              }`}
              onClick={() => setLoginType("STAFF")}
            >
              Staff Login
            </button>
            <button
              type="button"
              className={`px-4 py-2 rounded ${
                loginType === "BUSINESS"
                  ? "bg-gradient-to-r from-[#0B4FA8] via-[#1E63C6] to-[#F2C94C] text-white"
                  : "bg-gray-300 text-black"
              }`}
              onClick={() => setLoginType("BUSINESS")}
            >
              Business Admin
            </button>
          </div>

          <Formik
            initialValues={{ email: "", password: "" }}
            validationSchema={validationSchema}
            onSubmit={onSubmit}
          >
            {({ isSubmitting }) => (
              <Form className="w-full max-w-md">
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-600 mb-1">
                    Email
                  </label>
                  <Field
                    name="email"
                    type="email"
                    className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-400"
                  />
                  <ErrorMessage
                    name="email"
                    component="p"
                    className="text-red-500 text-sm"
                  />
                </div>

                <div className="mb-4 relative">
                  <label className="block text-sm font-medium text-gray-600 mb-1">
                    Password
                  </label>
                  <Field
                    name="password"
                    type={showPassword ? "text" : "password"}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-400"
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-9"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <IoIosEyeOff /> : <IoMdEye />}
                  </button>
                  <ErrorMessage
                    name="password"
                    component="p"
                    className="text-red-500 text-sm"
                  />
                </div>

                <div className="text-center mb-3">
                  <a href="#" className="text-sm text-red-800 hover:underline">
                    Forgot Password?
                  </a>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full p-2 rounded text-white bg-gradient-to-r from-[#0B4FA8] via-[#1E63C6] to-[#F2C94C] hover:from-[#083A7A] hover:via-[#174FA3] hover:to-[#D4A017] transition-all duration-300 ease-in-out disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {isSubmitting
                    ? "Logging in..."
                    : loginType === "STAFF"
                    ? "Login as Staff"
                    : loginType === "BUSINESS"
                    ? "Login as Business Admin"
                    : "Login as Admin"}
                </button>

                <p className="text-center text-sm text-gray-600 mt-5">
                  Don't have an account?{" "}
                  <a href="#" className="text-sky-600 hover:underline">
                    Contact Admin
                  </a>
                </p>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </div>
  );
};

export default Login;





// import React, { useState } from "react";
// import { Formik, Form, Field, ErrorMessage } from "formik";
// import * as Yup from "yup";
// import { useNavigate, useLocation } from "react-router-dom";
// import { toast } from "react-toastify";
// import { IoMdEye, IoIosEyeOff } from "react-icons/io";
// import { useCookies } from "react-cookie";
// import axios from "axios";

// import sideImage from "../assets/images/BizPay.jpeg";
// import logo from "../assets/images/favicon.ico";
// import BASE_URL from "@/config/config";

// interface LoginFormData {
//   email: string;
//   password: string;
// }

// const validationSchema = Yup.object({
//   email: Yup.string().email("Invalid email").required("Email required"),
//   password: Yup.string().min(6).required("Password required"),
// });

// const Login: React.FC = () => {
//   const [showPassword, setShowPassword] = useState(false);
//   const [loginType, setLoginType] = useState<"ADMIN" | "STAFF" | "BUSINESS" | "SUPER_ADMIN">("ADMIN");
  
//   const navigate = useNavigate();
//   const location = useLocation();

//   const [, setCookie] = useCookies([
//     "token",
//     "tempToken",
//     "email",
//     "role",
//     "fullName",
//     "twoFactorEnabled",
//     "adminId",
//   ]);

//   const from = location.state?.from?.pathname;

//   const onSubmit = async (values: LoginFormData, { setSubmitting }: any) => {
//     let apiUrl = "";

//     if (loginType === "STAFF") {
//       apiUrl = `${BASE_URL}/api/v3/staff-auth/login`;
//     } else if (loginType === "BUSINESS") {
//       apiUrl = `${BASE_URL}/api/v3/business-auth/login`;
//     } else if (loginType === "SUPER_ADMIN") {
//       apiUrl = `${BASE_URL}/api/v3/auth/login`; // You should have a separate endpoint api/v3/auth/login
//     } else {
//       apiUrl = `${BASE_URL}/api/v3/auth/admin-login`;
//     }

//     try {
//       const response = await axios.post(apiUrl, values, {
//         headers: { "Content-Type": "application/json" },
//       });

//       const { data } = response;

//       if (!data?.status) {
//         toast.error(data.message || "Invalid credentials");
//         return;
//       }

//       const {
//         token,
//         tempToken,
//         email,
//         role,
//         fullName,
//         tokenExpiryTime,
//         twoFactorEnabled,
//         requiresTwoFactor,
//         adminId,
//       } = data.data;

//       // ============================
//       // SAVE COOKIES
//       // ============================
//       setCookie("token", token, { path: "/", sameSite: "lax", maxAge: tokenExpiryTime || 1800 });
//       setCookie("email", email, { path: "/" });
//       setCookie("role", role, { path: "/" });
//       setCookie("fullName", fullName, { path: "/" });
//       setCookie("twoFactorEnabled", twoFactorEnabled, { path: "/" });
//       setCookie("adminId", adminId, { path: "/" });
//       setCookie("tempToken", tempToken, { path: "/" });

//       toast.success(data.message || "Login successful");

//       // ============================
//       // STAFF / BUSINESS 2FA FLOW
//       // ============================
//       if (loginType === "STAFF") {
//         if (requiresTwoFactor === false) {
//           navigate("/generateqr");
//           return;
//         }
//         if (requiresTwoFactor === true) {
//           navigate("/verify-2fa-login");
//           return;
//         }
//       }

//       if (loginType === "BUSINESS") {
//         if (requiresTwoFactor === false) {
//           navigate("/business/2fa/qr");
//           return;
//         }
//         if (requiresTwoFactor === true) {
//           navigate("/business/2fa/login");
//           return;
//         }
//       }

//       // ============================
//       // FINAL REDIRECT BASED ON ROLE
//       // ============================
//       if (from) {
//         navigate(from, { replace: true });
//       } else {
//         if (role === "ROLE_SUPER_USER") {
//           navigate("/admin");
//         } else if (role === "ROLE_EXCHANGE_ADMIN") {
//           navigate("/exchange");
//         } else if (loginType === "BUSINESS") {
//           navigate("/portal");
//         } else {
//           navigate("/branch");
//         }
//       }

//     } catch (error: any) {
//       toast.error(
//         error?.response?.data?.message || "Login failed. Please try again."
//       );
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50 p-4">
//       <div className="grid md:grid-cols-2 gap-0 max-w-5xl w-full bg-white rounded-3xl overflow-hidden shadow-xl ">
//         <div className="hidden md:block relative h-full">
//           <img
//             src={sideImage}
//             alt="Side Image"
//             className="absolute inset-0 w-full h-full object-cover"
//           />
//           <div className="absolute inset-0 bg-black/20" />
//         </div>

//         <div className="flex flex-col justify-center p-8 lg:p-12">
//           <div className="text-center mb-8">
//             <img src={logo} alt="Logo" className="h-12 mx-auto mb-4" />
//             <h1 className="text-2xl font-bold text-gray-800">
//               Login your Account
//             </h1>
//           </div>

//           {/* Login Type Buttons */}
//           <div className="flex gap-4 mb-6 flex-wrap">
//             {["ADMIN", "STAFF", "BUSINESS", "SUPER_ADMIN"].map((type) => (
//               <button
//                 key={type}
//                 type="button"
//                 className={`px-4 py-2 rounded ${
//                   loginType === type
//                     ? "bg-gradient-to-r from-[#0B4FA8] via-[#1E63C6] to-[#F2C94C] text-white"
//                     : "bg-gray-300 text-black"
//                 }`}
//                 onClick={() => setLoginType(type as any)}
//               >
//                 {type === "SUPER_ADMIN"
//                   ? "Super Admin"
//                   : type === "BUSINESS"
//                   ? "Business Admin"
//                   : `${type.charAt(0)}${type.slice(1).toLowerCase()} Login`}
//               </button>
//             ))}
//           </div>

//           <Formik
//             initialValues={{ email: "", password: "" }}
//             validationSchema={validationSchema}
//             onSubmit={onSubmit}
//           >
//             {({ isSubmitting }) => (
//               <Form className="w-full max-w-md">
//                 <div className="mb-4">
//                   <label className="block text-sm font-medium text-gray-600 mb-1">
//                     Email
//                   </label>
//                   <Field
//                     name="email"
//                     type="email"
//                     className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-400"
//                   />
//                   <ErrorMessage
//                     name="email"
//                     component="p"
//                     className="text-red-500 text-sm"
//                   />
//                 </div>

//                 <div className="mb-4 relative">
//                   <label className="block text-sm font-medium text-gray-600 mb-1">
//                     Password
//                   </label>
//                   <Field
//                     name="password"
//                     type={showPassword ? "text" : "password"}
//                     className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-400"
//                   />
//                   <button
//                     type="button"
//                     className="absolute right-3 top-9"
//                     onClick={() => setShowPassword(!showPassword)}
//                   >
//                     {showPassword ? <IoIosEyeOff /> : <IoMdEye />}
//                   </button>
//                   <ErrorMessage
//                     name="password"
//                     component="p"
//                     className="text-red-500 text-sm"
//                   />
//                 </div>

//                 <div className="text-center mb-3">
//                   <a href="#" className="text-sm text-red-800 hover:underline">
//                     Forgot Password?
//                   </a>
//                 </div>

//                 <button
//                   type="submit"
//                   disabled={isSubmitting}
//                   className="w-full p-2 rounded text-white bg-gradient-to-r from-[#0B4FA8] via-[#1E63C6] to-[#F2C94C] hover:from-[#083A7A] hover:via-[#174FA3] hover:to-[#D4A017] transition-all duration-300 ease-in-out disabled:opacity-60 disabled:cursor-not-allowed"
//                 >
//                   {isSubmitting
//                     ? "Logging in..."
//                     : loginType === "STAFF"
//                     ? "Login as Staff"
//                     : loginType === "BUSINESS"
//                     ? "Login as Business Admin"
//                     : loginType === "SUPER_ADMIN"
//                     ? "Login as Super Admin"
//                     : "Login as Admin"}
//                 </button>

//                 <p className="text-center text-sm text-gray-600 mt-5">
//                   Don't have an account?{" "}
//                   <a href="#" className="text-sky-600 hover:underline">
//                     Contact Admin
//                   </a>
//                 </p>
//               </Form>
//             )}
//           </Formik>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Login;
