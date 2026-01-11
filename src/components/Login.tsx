import React, { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import { IoMdEye, IoIosEyeOff } from "react-icons/io";
import { useCookies } from "react-cookie";
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

type LoginType = "ADMIN" | "STAFF" | "BUSINESS" | "SUPER_USER";

interface JwtPayload {
  roles?: string[]; // Optional, as tempToken may not have it
  exp: number;
  iat: number;
  // Add other fields if needed
}

const Login: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [loginType, setLoginType] = useState<LoginType>("SUPER_USER");

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

  const from = location.state?.from?.pathname;

  const onSubmit = async (values: LoginFormData, { setSubmitting }: any) => {
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
      default:
        apiUrl = `${BASE_URL}/api/v3/auth/admin-login`;
    }

    try {
      const response = await axios.post(apiUrl, values, {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      });

      const apiData = response.data;
      console.log("API Response Data:", apiData); // Print full API response data

      if (!apiData?.status) {
        toast.error(apiData.message || "Invalid email or password");
        return;
      }

      // Destructure response data
      const {
        requiresTwoFactor,
        tempToken,
        twoFactorMethod,
        accessToken: responseAccessToken,
        refreshToken,
        expiresIn,
        token,
        fullName,
      } = apiData.data;

      // Handle STAFF / BUSINESS 2FA flow
      if (requiresTwoFactor !== undefined) {
        if (tempToken) {
          // Manually decode tempToken to get exp for maxAge
          const payload = JSON.parse(
            atob(tempToken.split(".")[1])
          ) as JwtPayload;
          const currentTime = Math.floor(Date.now() / 1000);
          const maxAge = payload.exp - currentTime;

          setCookie("tempToken", tempToken, {
            path: "/",
            // sameSite: "lax",
            maxAge: maxAge > 0 ? maxAge : 10800, 
          });

          setCookie("twoFactorMethod", twoFactorMethod, {
            path: "/",
            // sameSite: "lax",
            maxAge: maxAge > 0 ? maxAge : 10800,
          });
          // setCookie("fullName", fullName, {
          //   path: "/",
          //   // sameSite: "lax",
          //   maxAge: maxAge > 0 ? maxAge : 10800,
          // });
        }

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
      }

      // Non-2FA case (for SUPER_USER, ADMIN, or when no requiresTwoFactor)
      const accessToken = responseAccessToken || token;
      if (!accessToken) {
        throw new Error("No access token found in response");
      }

      // Manually decode JWT to get role and compute maxAge if needed
      const payload = JSON.parse(atob(accessToken.split(".")[1])) as JwtPayload;
      const role = payload.roles?.[0]; // e.g., "ROLE_SUPER_USER"
      const currentTime = Math.floor(Date.now() / 1000);
      const maxAge = expiresIn || payload.exp - currentTime;

      console.log("ROLE FROM API:", role);

      // Save cookies
      setCookie("token", accessToken, {
        path: "/",
        // sameSite: "lax",
        maxAge: maxAge > 0 ? maxAge : 10800, 
      });

      setCookie("fullName", fullName, {
        path: "/",
        // sameSite: "lax",
        maxAge: maxAge > 0 ? maxAge : 10800, 
      });

      if (refreshToken) {
        setCookie("refreshToken", refreshToken, {
          path: "/",
          // sameSite: "lax",
        });
      }

      setCookie("role", role, { path: "/" });

      toast.success("Login successful");

      // Redirect logic
      if (from) {
        navigate(from, { replace: true });
      } else {
        switch (role) {
          case "ROLE_SUPER_USER":
            navigate("/admin", { replace: true });
            break;
          case "ROLE_EXCHANGE_ADMIN":
            navigate("/exchange", { replace: true });
            break;
          default:
            if (loginType === "BUSINESS") {
              navigate("/portal", { replace: true });
            } else {
              navigate("/branch", { replace: true });
            }
        }
      }
    } catch (error: any) {
      console.log("API Error Response:", error?.response?.data); // Print full API error data
      toast.error(
        error?.response?.data?.message || "Invalid email or password"
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50 p-4">
      <div className="grid md:grid-cols-2 max-w-5xl w-full bg-white rounded-3xl overflow-hidden shadow-xl">
        <div className="hidden md:block relative">
          <img
            src={sideImage}
            alt="Side"
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/20" />
        </div>

        <div className="flex flex-col justify-center p-8 lg:p-12">
          <div className="text-center mb-6">
            <img src={logo} alt="Logo" className="h-12 mx-auto mb-3" />
            <h1 className="text-2xl font-bold">Login your Account</h1>
          </div>

          {/* LOGIN TYPE BUTTONS */}
          <div className="flex flex-col items-center gap-3 mb-6">
            {/* Top Row: Super Admin Only */}
            <div>
              {["SUPER_USER"].map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setLoginType(type as LoginType)}
                  className={`px-6 py-2 rounded font-medium ${
                    loginType === type
                      ? "bg-gradient-to-r from-[#0B4FA8] via-[#1E63C6] to-[#F2C94C] text-white"
                      : "bg-gray-300 text-black"
                  }`}
                >
                  Super Admin
                </button>
              ))}
            </div>

            {/* Bottom Row: Remaining Roles */}
            <div className="flex gap-3 flex-wrap justify-center">
              {["ADMIN", "STAFF", "BUSINESS"].map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setLoginType(type as LoginType)}
                  className={`px-4 py-2 rounded font-medium ${
                    loginType === type
                      ? "bg-gradient-to-r from-[#0B4FA8] via-[#1E63C6] to-[#F2C94C] text-white"
                      : "bg-gray-300 text-black"
                  }`}
                >
                  {type === "BUSINESS" ? "Business Admin" : type}
                </button>
              ))}
            </div>
          </div>

          <Formik
            initialValues={{ email: "", password: "" }}
            validationSchema={validationSchema}
            onSubmit={onSubmit}
          >
            {({ isSubmitting }) => (
              <Form className="w-full max-w-md mx-auto">
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
                    component="div"
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
                    className="absolute right-3 top-9 text-xl text-gray-600"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <IoIosEyeOff /> : <IoMdEye />}
                  </button>
                  <ErrorMessage
                    name="password"
                    component="div"
                    className="text-red-500 text-sm"
                  />
                </div>

                <div className="text-right mb-3">
                  <a href="#" className="text-sm text-red-800 hover:underline">
                    Forgot Password?
                  </a>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full p-2 rounded text-white bg-gradient-to-r from-[#0B4FA8] via-[#1E63C6] to-[#F2C94C] hover:from-[#083A7A] hover:via-[#174FA3] hover:to-[#D4A017] transition-all duration-300 ease-in-out disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? "Logging in..." : "Login"}
                </button>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </div>
  );
};

export default Login;
