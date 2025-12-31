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
  const [loginType, setLoginType] = useState<"ADMIN" | "STAFF" | "BUSINESS">(
    "ADMIN"
  );
  const navigate = useNavigate();

  const [, setCookie] = useCookies([
    "token",
    "email",
    "role",
    "fullName",
    "twoFactorEnabled",
    "adminId",
  ]);

  const onSubmit = async (values: LoginFormData, { setSubmitting }: any) => {
    let apiUrl = "";

    if (loginType === "STAFF") {
      apiUrl = `${BASE_URL}/api/v3/staff-auth/login`;
    } else if (loginType === "BUSINESS") {
      apiUrl = `${BASE_URL}/api/v3/business-auth/login`;
    } else {
      apiUrl = `${BASE_URL}/api/v3/auth/admin-login`;
    }

    console.group("🔐 LOGIN DEBUG START");
    console.log("👤 Login Type:", loginType);
    console.log("📧 Email:", values.email);
    console.log("🔑 Password:", values.password);
    console.log("🌐 API URL:", apiUrl);
    console.log("📤 REQUEST PAYLOAD:", values);

    try {
      const response = await axios.post(apiUrl, values, {
        headers: { "Content-Type": "application/json" },
      });

      console.log("📥 FULL API RESPONSE:", response);
      const { data } = response;

      if (!data?.status) {
        console.warn("❌ LOGIN FAILED:", data.message);
        toast.error(data.message || "Invalid credentials");
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
        adminId,
      } = data.data;

      // ============================
      // SAVE COOKIES
      // ============================
      setCookie("token", token, {
        // path: "/",
        // secure: true,
        // sameSite: "strict",
        // maxAge: tokenExpiryTime || 1800,
        path: "/",
        sameSite: "lax",
        maxAge: tokenExpiryTime || 1800,
      });
      setCookie("email", email, { path: "/" });
      setCookie("role", role, { path: "/" });
      setCookie("fullName", fullName, { path: "/" });
      setCookie("twoFactorEnabled", twoFactorEnabled, { path: "/" });
      setCookie("adminId", adminId, { path: "/" });

      toast.success(data.message || "Login successful");

      // ============================
      // STAFF / BUSINESS 2FA FLOW
      // ============================
      if (loginType === "STAFF") {
        console.log(`🔐 STAFF LOGIN → requiresTwoFactor:`, requiresTwoFactor);

        if (requiresTwoFactor === false) {
          console.log("➡️ First-time 2FA setup → Redirecting to /generateqr");
          navigate("/generateqr");
          return;
        }

        if (requiresTwoFactor === true) {
          console.log("➡️ Existing 2FA user → Redirecting to OTP verification");
          navigate("/verify-2fa-login");
          return;
        }
      }

      if (loginType === "BUSINESS") {
        console.log(
          `🔐 BUSINESS LOGIN → requiresTwoFactor:`,
          requiresTwoFactor
        );

        if (requiresTwoFactor === false) {
          console.log(
            "➡️ First-time 2FA setup → Redirecting to /business/2fa/qr"
          );
          navigate("/business/2fa/qr");
          return;
        }

        if (requiresTwoFactor === true) {
          console.log(
            "➡️ Existing 2FA user → Redirecting to business OTP verification"
          );
          navigate("/business/2fa/login");
          return;
        }
      }

      // ============================
      // FINAL REDIRECT
      // ============================
      if (role === "ROLE_ADMIN") {
        navigate("/exchange");
      } else if (loginType === "BUSINESS") {
        navigate("/portal"); // Business admin default page
      } else {
        navigate("/branch");
      }
    } catch (error: any) {
      console.group("❌ LOGIN ERROR");
      console.error(error);
      toast.error(
        error?.response?.data?.message || "Login failed. Please try again."
      );
      console.groupEnd();
    } finally {
      console.groupEnd();
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
              loginType === "ADMIN"
                ? "bg-blue-500 text-white"
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
                ? "bg-blue-500 text-white"
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
                ? "bg-blue-500 text-white"
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
                  : loginType === "STAFF"
                  ? "Login as Staff"
                  : loginType === "BUSINESS"
                  ? "Login as Business Admin"
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
