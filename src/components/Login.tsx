// import React, { useState } from "react";
// import { useForm } from "react-hook-form";
// import { useNavigate } from "react-router-dom";
// import { toast } from "react-toastify";
// import { IoMdEye, IoIosEyeOff } from "react-icons/io";
// import sideImage from "../assets/images/station.jpg";
// import logo from "../assets/images/Envision.webp";
// import { useCookies } from "react-cookie";
// import axiosInstance from "@/config/AxiosInstance";
// import InitiateTwoFA from "@/pages/exchange/Staff/InitiateTwoFA";
// // import { useCookies } from "react-cookie";

// interface LoginFormData {
//   email: string;
//   password: string;
// }

// const Login: React.FC = () => {

//   const [cookies] = useCookies(["tempToken,"]);
//   const tempToken = cookies.tempToken;


//   const [showPassword, setShowPassword] = useState(false);
//   const {
//     register,
//     handleSubmit,
//     formState: { errors },
//   } = useForm<LoginFormData>();
//   const navigate = useNavigate();

//   // const [cookies, setCookie] = useCookies(["token"]);

//   const onSubmit = async (data: LoginFormData) => {
//     try {
//       const response = await axiosInstance.post(
//         "/api/v3/auth/admin-login",
//         data
//       );
//       if (response.data.token) {
//         setCookie("token", response.data.token, {
//           path: "/",
//           secure: true,
//           sameSite: "strict",
//           maxAge: response.data.tokenExpiryTime || 1800,
//         });

//         if (twoFactorEnabled === false) {
//           navigate("/generateqr"); // route of InitiateTwoFA component
//         } else {
//           navigate("/exchange");
//           toast.success(response.data.message || "Login successful!");
//         }

       

//       } else {
//         toast.error("Invalid credentials");
//       }
//     } catch (error: any) {
//       toast.error(
//         error.response?.data?.message || "Error during login. Please try again."
//       );
//       console.error("Login error:", error);
//     }
//   };

//   return (
//     <div className="flex h-screen bg-gray-100">
//       {/* Side Image Section */}
//       <div
//         className="hidden md:block w-1/2 bg-cover bg-center"
//         style={{ backgroundImage: `url(${sideImage})` }}
//       ></div>

//       {/* Form Section */}
//       <div className="w-full md:w-1/2 flex flex-col justify-center items-center p-8">
//         <img src={logo} alt="Envision Logo" className="w-32 mb-8" />
//         <h2 className="text-2xl font-bold mb-6">Login</h2>
//         <form onSubmit={handleSubmit(onSubmit)} className="w-full max-w-md">
//           {/* Email Field */}
//           <div className="mb-4">
//             <label
//               htmlFor="email"
//               className="block text-sm font-medium text-gray-700"
//             >
//               Email
//             </label>
//             <input
//               id="email"
//               type="email"
//               className="mt-1 p-2 w-full border rounded-md"
//               {...register("email", {
//                 required: "Email is required",
//                 pattern: { value: /^\S+@\S+$/i, message: "Invalid email" },
//               })}
//             />
//             {errors.email && (
//               <p className="text-red-500 text-sm mt-1">
//                 {errors.email.message}
//               </p>
//             )}
//           </div>

//           {/* Password Field */}
//           <div className="mb-6 relative">
//             <label
//               htmlFor="password"
//               className="block text-sm font-medium text-gray-700"
//             >
//               Password
//             </label>
//             <input
//               id="password"
//               type={showPassword ? "text" : "password"}
//               className="mt-1 p-2 w-full border rounded-md"
//               {...register("password", {
//                 required: "Password is required",
//                 minLength: {
//                   value: 6,
//                   message: "Password must be at least 6 characters",
//                 },
//               })}
//             />
//             <button
//               type="button"
//               className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 mt-6"
//               onClick={() => setShowPassword(!showPassword)}
//             >
//               {showPassword ? <IoIosEyeOff /> : <IoMdEye />}
//             </button>
//             {errors.password && (
//               <p className="text-red-500 text-sm mt-1">
//                 {errors.password.message}
//               </p>
//             )}
//           </div>

//           {/* Submit Button */}
//           <button
//             type="submit"
//             className="w-full bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600"
//           >
//             Login
//           </button>
//         </form>
//         <p className="mt-4 text-sm text-gray-600">
//           Don't have an account?{" "}
//           <a href="/register" className="text-blue-500 hover:underline">
//             Register
//           </a>
//         </p>
//       </div>
//     </div>
//   );
// };

// export default Login;


import React, { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { IoMdEye, IoIosEyeOff } from "react-icons/io";
import sideImage from "../assets/images/station.jpg";
import logo from "../assets/images/Envision.webp";
import { useCookies } from "react-cookie";
import BASE_URL from "@/config/config";
import axios from "axios";

interface LoginFormData {
  email: string;
  password: string;
}

const validationSchema = Yup.object({
  email: Yup.string()
    .email("Invalid email format")
    .required("Email is required"),
  password: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
});

const Login: React.FC = () => {
  const [cookies, setCookie] = useCookies([
    "tempToken",
    "token",
    "twoFactorEnabled",
    "email",
    "role",
    "fullName",
  ]);

  const { tempToken, twoFactorEnabled, token } = cookies;

  console.log("Stored Token:", token);
  console.log("Two Factor Enabled:", twoFactorEnabled);
  console.log("Temp Token:", tempToken);

  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const onSubmit = async (
    values: LoginFormData,
    { setSubmitting }: any
  ) => {
    try {
      let response;

      if (twoFactorEnabled === false) {
        response = await axios.post(
          `${BASE_URL}/api/v3/staff-auth/login`,
          values
        );
      } else {
        response = await axios.post(
          `${BASE_URL}/api/v3/auth/admin-login`,
          values
        );
      }

      console.log("FULL API RESPONSE:", response.data);

      if (response.data?.data?.token) {
        const {
          token,
          email,
          role,
          fullName,
          tokenExpiryTime,
        } = response.data.data;

        // ===== STORE COOKIES =====
        setCookie("token", token, {
          path: "/",
          secure: true,
          sameSite: "strict",
          maxAge: tokenExpiryTime || 1800,
        });

        setCookie("email", email, {
          path: "/",
          secure: true,
          sameSite: "strict",
        });

        setCookie("role", role, {
          path: "/",
          secure: true,
          sameSite: "strict",
        });

        setCookie("fullName", fullName, {
          path: "/",
          secure: true,
          sameSite: "strict",
        });

        // ===== PRINT CONSOLE =====
        console.log("Saved Token:", token);
        console.log("Saved Email:", email);
        console.log("Saved Role:", role);
        console.log("Saved Full Name:", fullName);

        // ===== EXISTING NAVIGATION LOGIC =====
        if (role === "ROLE_ADMIN") {
          navigate("/exchange");
          toast.success(response.data.message || "Login successful!");
        } else if (twoFactorEnabled === false) {
          navigate("/generateqr");
        } else {
          navigate("/exchange");
          toast.success(response.data.message || "Login successful!");
        }
      } else {
        toast.error("Invalid credentials");
      }
    } catch (error: any) {
      toast.error(
        error.response?.data?.message ||
          "Error during login. Please try again."
      );
      console.error("Login error:", error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Side Image */}
      <div
        className="hidden md:block w-1/2 bg-cover bg-center"
        style={{ backgroundImage: `url(${sideImage})` }}
      />

      {/* Form Section */}
      <div className="w-full md:w-1/2 flex flex-col justify-center items-center p-8">
        <img src={logo} alt="Envision Logo" className="w-32 mb-8" />
        <h2 className="text-2xl font-bold mb-6">Login</h2>

        <Formik
          initialValues={{ email: "", password: "" }}
          validationSchema={validationSchema}
          onSubmit={onSubmit}
        >
          {({ isSubmitting }) => (
            <Form className="w-full max-w-md">
              {/* Email */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Email
                </label>
                <Field
                  type="email"
                  name="email"
                  className="mt-1 p-2 w-full border rounded-md"
                />
                <ErrorMessage
                  name="email"
                  component="p"
                  className="text-red-500 text-sm"
                />
              </div>

              {/* Password */}
              <div className="mb-6 relative">
                <label className="block text-sm font-medium text-gray-700">
                  Password
                </label>
                <Field
                  type={showPassword ? "text" : "password"}
                  name="password"
                  className="mt-1 p-2 w-full border rounded-md"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 mt-6"
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
                className="w-full bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600"
              >
                {isSubmitting ? "Logging in..." : "Login"}
              </button>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default Login;
