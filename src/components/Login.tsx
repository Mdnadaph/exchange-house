import React, { useState } from "react";
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
  const [isStaffLogin, setIsStaffLogin] = useState(false);
  const navigate = useNavigate();

  const [, setCookie] = useCookies([
    "token",
    "email",
    "role",
    "fullName",
    "twoFactorEnabled",
  ]);

  const onSubmit = async (values: LoginFormData, { setSubmitting }: any) => {
    try {
      let response;

      // ============================
      // SELECT API BASED ON LOGIN TYPE
      // ============================
      if (isStaffLogin) {
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

      console.log("LOGIN RESPONSE:", response.data);

      if (!response.data?.status) {
        toast.error("Invalid credentials");
        return;
      }

      const {
        token,
        email,
        role,
        fullName,
        tokenExpiryTime,
        twoFactorEnabled,
        requiresTwoFactor,
      } = response.data.data;

      // ============================
      // SAVE COOKIES
      // ============================
      setCookie("token", token, {
        path: "/",
        secure: true,
        sameSite: "strict",
        maxAge: tokenExpiryTime || 1800,
      });

      setCookie("email", email, { path: "/" });
      setCookie("role", role, { path: "/" });
      setCookie("fullName", fullName, { path: "/" });
      setCookie("twoFactorEnabled", twoFactorEnabled, { path: "/" });

      toast.success(response.data.message || "Login successful");

      // ============================
      // STAFF 2FA FLOW
      // ============================
      // if (
      //   isStaffLogin &&
      //   (requiresTwoFactor === false)
      // ) {
      //   navigate("/generateqr");
      //   return;
      // }

      if (isStaffLogin) {
        if (requiresTwoFactor === false) {
          // First-time setup
          navigate("/generateqr");
          return;
        }

        if (requiresTwoFactor === true) {
          // Existing 2FA user → OTP verification
          navigate("/generateqr"); // same page, different behavior
          return;
        }
      }

      // ============================
      // ADMIN / STAFF REDIRECT
      // ============================
      if (role === "ROLE_ADMIN") {
        navigate("/exchange");
      } else {
        navigate("/branch");
      }
    } catch (error: any) {
      console.error("Login Error:", error);
      toast.error(
        error?.response?.data?.message || "Login failed. Please try again."
      );
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
              !isStaffLogin
                ? "bg-blue-500 text-white"
                : "bg-gray-300 text-black"
            }`}
            onClick={() => setIsStaffLogin(false)}
          >
            Admin Login
          </button>

          <button
            type="button"
            className={`px-4 py-2 rounded ${
              isStaffLogin ? "bg-blue-500 text-white" : "bg-gray-300 text-black"
            }`}
            onClick={() => setIsStaffLogin(true)}
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
                  type="email"
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
