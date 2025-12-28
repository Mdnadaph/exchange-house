// import React, { useState } from "react";
// import { Formik, Form, Field, ErrorMessage } from "formik";
// import * as Yup from "yup";
// import { useNavigate } from "react-router-dom";
// import { toast } from "react-toastify";
// import { IoMdEye, IoIosEyeOff } from "react-icons/io";
// import { useCookies } from "react-cookie";
// import axios from "axios";

// import sideImage from "../assets/images/station.jpg";
// import logo from "../assets/images/Envision.webp";
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
//   const [isStaffLogin, setIsStaffLogin] = useState(false);
//   const navigate = useNavigate();

//   const [, setCookie] = useCookies([
//     "token",
//     "email",
//     "role",
//     "fullName",
//     "twoFactorEnabled",
//   ]);

//   const onSubmit = async (
//     values: LoginFormData,
//     { setSubmitting }: any
//   ) => {
//     try {
//       let response;

//       // ============================
//       // SELECT API BASED ON LOGIN TYPE
//       // ============================
//       if (isStaffLogin) {
//         response = await axios.post(
//           `${BASE_URL}/api/v3/staff-auth/login`,
//           values
//         );
//       } else {
//         response = await axios.post(
//           `${BASE_URL}/api/v3/auth/admin-login`,
//           values
//         );
//       }

//       console.log("LOGIN RESPONSE:", response.data);

//       if (!response.data?.status) {
//         toast.error("Invalid credentials");
//         return;
//       }

//       const {
//         token,
//         email,
//         role,
//         fullName,
//         tokenExpiryTime,
//         twoFactorEnabled,
//         requiresTwoFactor,
//       } = response.data.data;

//       // ============================
//       // SAVE COOKIES
//       // ============================
//       setCookie("token", token, {
//         path: "/",
//         secure: true,
//         sameSite: "strict",
//         maxAge: tokenExpiryTime || 1800,
//       });

//       setCookie("email", email, { path: "/" });
//       setCookie("role", role, { path: "/" });
//       setCookie("fullName", fullName, { path: "/" });
//       setCookie("twoFactorEnabled", twoFactorEnabled, { path: "/" });

//       toast.success(response.data.message || "Login successful");

//       // ============================
//       // STAFF 2FA FLOW
//       // ============================
//       if (
//         isStaffLogin &&
//         (requiresTwoFactor === true || twoFactorEnabled === true)
//       ) {
//         navigate("/generateqr");
//         return;
//       }

//       // ============================
//       // ADMIN / STAFF REDIRECT
//       // ============================
//       if (role === "ROLE_ADMIN") {
//         navigate("/exchange");
//       } else {
//         navigate("/branch");
//       }
//     } catch (error: any) {
//       console.error("Login Error:", error);
//       toast.error(
//         error?.response?.data?.message || "Login failed. Please try again."
//       );
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   return (
//     <div className="flex h-screen bg-gray-100">
//       {/* LEFT IMAGE */}
//       <div
//         className="hidden md:block w-1/2 bg-cover bg-center"
//         style={{ backgroundImage: `url(${sideImage})` }}
//       />

//       {/* LOGIN FORM */}
//       <div className="w-full md:w-1/2 flex flex-col justify-center items-center p-8">
//         <img src={logo} alt="Logo" className="w-32 mb-6" />

//         <h2 className="text-2xl font-bold mb-4">Login</h2>

//         {/* LOGIN TYPE SWITCH */}
//         <div className="flex gap-4 mb-6">
//           <button
//             type="button"
//             className={`px-4 py-2 rounded ${
//               !isStaffLogin
//                 ? "bg-blue-500 text-white"
//                 : "bg-gray-300 text-black"
//             }`}
//             onClick={() => setIsStaffLogin(false)}
//           >
//             Admin Login
//           </button>

//           <button
//             type="button"
//             className={`px-4 py-2 rounded ${
//               isStaffLogin
//                 ? "bg-blue-500 text-white"
//                 : "bg-gray-300 text-black"
//             }`}
//             onClick={() => setIsStaffLogin(true)}
//           >
//             Staff Login
//           </button>
//         </div>

//         <Formik
//           initialValues={{ email: "", password: "" }}
//           validationSchema={validationSchema}
//           onSubmit={onSubmit}
//         >
//           {({ isSubmitting }) => (
//             <Form className="w-full max-w-md">
//               {/* EMAIL */}
//               <div className="mb-4">
//                 <label className="block text-sm">Email</label>
//                 <Field
//                   name="email"
//                   type="email"
//                   className="w-full p-2 border rounded"
//                 />
//                 <ErrorMessage
//                   name="email"
//                   component="p"
//                   className="text-red-500 text-sm"
//                 />
//               </div>

//               {/* PASSWORD */}
//               <div className="mb-6 relative">
//                 <label className="block text-sm">Password</label>
//                 <Field
//                   name="password"
//                   type={showPassword ? "text" : "password"}
//                   className="w-full p-2 border rounded"
//                 />

//                 <button
//                   type="button"
//                   className="absolute right-3 top-9"
//                   onClick={() => setShowPassword(!showPassword)}
//                 >
//                   {showPassword ? <IoIosEyeOff /> : <IoMdEye />}
//                 </button>

//                 <ErrorMessage
//                   name="password"
//                   component="p"
//                   className="text-red-500 text-sm"
//                 />
//               </div>

//               <button
//                 type="submit"
//                 disabled={isSubmitting}
//                 className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
//               >
//                 {isSubmitting
//                   ? "Logging in..."
//                   : isStaffLogin
//                   ? "Login as Staff"
//                   : "Login as Admin"}
//               </button>
//             </Form>
//           )}
//         </Formik>
//       </div>
//     </div>
//   );
// };

// export default Login;

import React, { useState, useRef } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { IoMdEye, IoIosEyeOff } from "react-icons/io";
import { useCookies } from "react-cookie";
import axios from "axios";

import sideImage from "../assets/images/station.jpg";
import logo from "../assets/images/Envision.webp";
import BASE_URL from "@/config/config";

/* ============================
   TYPES
============================ */
interface LoginFormData {
  email: string;
  password: string;
}

/* ============================
   VALIDATION
============================ */
const validationSchema = Yup.object({
  email: Yup.string().required("Email required"),
  password: Yup.string().min(6).required("Password required"),
});

/* ============================
   COMPONENT
============================ */
const Login: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [isStaffLogin, setIsStaffLogin] = useState(false);

  // 🔥 FIX: REF FOR LOGIN TYPE (NO STALE STATE)
  const loginTypeRef = useRef<"ADMIN" | "STAFF">("ADMIN");

  const navigate = useNavigate();

  const [, setCookie] = useCookies([
    "token",
    "email",
    "role",
    "fullName",
    "twoFactorEnabled",
    "requiresTwoFactor",
    "tempToken",
  ]);


  /* ============================
   SUBMIT HANDLER
============================ */
  const onSubmit = async (values: LoginFormData, { setSubmitting }: any) => {
    try {
      const loginType = loginTypeRef.current;

      const apiUrl =
        loginType === "STAFF"
          ? `${BASE_URL}/api/v3/staff-auth/login`
          : `${BASE_URL}/api/v3/auth/admin-login`;

      const response = await axios.post(apiUrl, values);

      if (!response.data?.status) {
        toast.error(response.data.message);
        return;
      }

      /* ================= STAFF ================= */
      if (loginType === "STAFF") {
        const { tempToken, requiresTwoFactor, twoFactorEnabled, email } =
          response.data.data;

        if (!tempToken) {
          toast.error("Invalid login response");
          return;
        }

        setCookie("tempToken", tempToken, { path: "/" });
        setCookie("email", email, { path: "/" });
        setCookie("requiresTwoFactor", requiresTwoFactor, { path: "/" });
        setCookie("twoFactorEnabled", twoFactorEnabled, { path: "/" });

        navigate("/staff/2fa");
        return;
      }

      /* ================= ADMIN ================= */
      const { token, email, role, fullName, tokenExpiryTime } =
        response.data.data;

      setCookie("token", token, {
        path: "/",
        maxAge: tokenExpiryTime || 1800,
      });

      setCookie("email", email, { path: "/" });
      setCookie("role", role, { path: "/" });
      setCookie("fullName", fullName, { path: "/" });

      navigate("/exchange");
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Login failed");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* LEFT IMAGE */}
      <div
        className="hidden md:block w-1/2 bg-cover bg-center"
        style={{ backgroundImage: `url(${sideImage})` }}
      />

      {/* LOGIN FORM */}
      <div className="w-full md:w-1/2 flex flex-col justify-center items-center p-8">
        <img src={logo} alt="Logo" className="w-32 mb-6" />

        <h2 className="text-2xl font-bold mb-4">Login</h2>

        {/* LOGIN TYPE SWITCH */}
        <div className="flex gap-4 mb-6">
          <button
            type="button"
            className={`px-4 py-2 rounded ${
              loginTypeRef.current === "ADMIN"
                ? "bg-blue-500 text-white"
                : "bg-gray-300 text-black"
            }`}
            onClick={() => {
              setIsStaffLogin(false);
              loginTypeRef.current = "ADMIN";
            }}
          >
            Admin Login
          </button>

          <button
            type="button"
            className={`px-4 py-2 rounded ${
              loginTypeRef.current === "STAFF"
                ? "bg-blue-500 text-white"
                : "bg-gray-300 text-black"
            }`}
            onClick={() => {
              setIsStaffLogin(true);
              loginTypeRef.current = "STAFF";
            }}
          >
            Staff Login
          </button>
        </div>

        <Formik
          initialValues={{ email: "", password: "" }}
          validationSchema={validationSchema}
          onSubmit={onSubmit}
        >
          {({ isSubmitting }) => (
            <Form className="w-full max-w-md">
              {/* EMAIL */}
              <div className="mb-4">
                <label className="block text-sm">Email</label>
                <Field
                  name="email"
                  type="text"
                  className="w-full p-2 border rounded"
                />
                <ErrorMessage
                  name="email"
                  component="p"
                  className="text-red-500 text-sm"
                />
              </div>

              {/* PASSWORD */}
              <div className="mb-6 relative">
                <label className="block text-sm">Password</label>
                <Field
                  name="password"
                  type={showPassword ? "text" : "password"}
                  className="w-full p-2 border rounded"
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

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
              >
                {isSubmitting
                  ? "Logging in..."
                  : isStaffLogin
                  ? "Login as Staff"
                  : "Login as Admin"}
              </button>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default Login;
