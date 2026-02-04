import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { Formik, Form, Field, ErrorMessage, FormikHelpers } from "formik";
import * as Yup from "yup";
import { IoMdEye, IoIosEyeOff } from "react-icons/io";
import { useCookies } from "react-cookie";
import BASE_URL from "@/config/config";

/* ================= TYPES ================= */

interface FormValues {
  password: string;
  confirmPassword: string;
}

interface Staff {
  email?: string;
  twoFactorEnabled?: boolean;
}

interface ApiResponseData {
  tempToken?: string;
  requiresTwoFactor?: boolean;
  staff?: Staff;
}

interface ApiResponse {
  status: boolean;
  message: string;
  data: ApiResponseData;
}

/* ================= VALIDATION ================= */

const PasswordSchema = Yup.object({
  password: Yup.string().required("Password is required"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password")], "Passwords must match")
    .required("Confirm Password is required"),
});

/* ================= COMPONENT ================= */

const StaffSetupPassword: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [, setCookie] = useCookies([
    "tempToken",
    "email",
    "twoFactorEnabled",
    "requiresTwoFactor",
  ]);

  const searchParams = new URLSearchParams(location.search);
  const token = searchParams.get("token");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleSubmit = async (
    values: FormValues,
    { setSubmitting, setStatus }: FormikHelpers<FormValues>
  ) => {
    if (!token) {
      setStatus("Invalid or missing token.");
      setSubmitting(false);
      return;
    }

    try {
      const response = await axios.post<ApiResponse>(
        `${BASE_URL}/api/v3/staff-auth/set-password`,
        {
          token,
          password: values.password,
          confirmPassword: values.confirmPassword,
        }
      );

      console.log("FULL API RESPONSE:", response.data);

      if (!response.data.status) {
        setStatus(response.data.message);
        return;
      }

      /* ===== EXTRACT DATA ===== */
      const tempToken = response.data.data.tempToken;
      const email = response.data.data.staff?.email;
      const twoFactorEnabled = response.data.data.staff?.twoFactorEnabled;
      const requiresTwoFactor = response.data.data.requiresTwoFactor;

      /* ===== STORE COOKIES LIKE LOGIN ===== */
      if (tempToken) {
        setCookie("tempToken", tempToken, {
          // path: "/",
          // secure: true,
          // sameSite: "strict",
          path: "/",
          sameSite: "lax",
        });
      }

      if (email) {
        setCookie("email", email, {
          // path: "/",
          // secure: true,
          // sameSite: "strict",

          path: "/",
          sameSite: "lax",
        });
      }

      if (twoFactorEnabled !== undefined) {
        setCookie("twoFactorEnabled", twoFactorEnabled, {
          // path: "/",
          // secure: true,
          // sameSite: "strict",
          path: "/",
          sameSite: "lax",
        });
      }

      if (requiresTwoFactor !== undefined) {
        setCookie("requiresTwoFactor", requiresTwoFactor, {
          // path: "/",
          // secure: true,
          // sameSite: "strict",
          path: "/",
          sameSite: "lax",
        });
      }

      if (requiresTwoFactor) {
        navigate("/generateqr");
      } else {
        navigate("/"); // redirect to login if 2FA is not required
      }

      // navigate("/generateqr");
    } catch (error: any) {
      setStatus(error.response?.data?.message || "Server Error");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="max-w-md w-full p-6 border rounded shadow">
        <h2 className="text-2xl font-bold mb-4 text-center">
          Set New Password
        </h2>

        {/* NO GENERIC: Works with Vite + SWC */}
        <Formik
          initialValues={{ password: "", confirmPassword: "" }}
          validationSchema={PasswordSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting, status }) => (
            <Form>
              {/* Password */}
              <div className="mb-4">
                <label className="block mb-1 font-semibold">New Password</label>
                <div className="relative">
                  <Field
                    type={showPassword ? "text" : "password"}
                    name="password"
                    className="w-full px-3 py-2 border rounded"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2"
                  >
                    {showPassword ? <IoMdEye /> : <IoIosEyeOff />}
                  </button>
                </div>
                <ErrorMessage
                  name="password"
                  component="div"
                  className="text-red-500 text-sm"
                />
              </div>

              {/* Confirm Password */}
              <div className="mb-4">
                <label className="block mb-1 font-semibold">
                  Confirm Password
                </label>
                <div className="relative">
                  <Field
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirmPassword"
                    className="w-full px-3 py-2 border rounded"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2"
                  >
                    {showConfirmPassword ? <IoMdEye /> : <IoIosEyeOff />}
                  </button>
                </div>
                <ErrorMessage
                  name="confirmPassword"
                  component="div"
                  className="text-red-500 text-sm"
                />
              </div>

              {status && <div className="text-red-500 mb-3">{status}</div>}

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-blue-500 text-white py-2 rounded"
              >
                {isSubmitting ? "Setting Password..." : "Set Password"}
              </button>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default StaffSetupPassword;
