import React, { useRef, useState } from "react";
import axios from "axios";
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import BASE_URL from "@/config/config";

/* =========================
    INTERFACES
========================= */

interface BusinessUser {
  id: number;
  displayId: string;
  fullName: string;
  email: string;
  status: string;
  active: boolean;
}

interface BusinessAdmin {
  id: number;
  uuid: string;
  firstName: string;
  lastName: string;
  email: string;
  businessId: number;
}

interface VerifyResponseData {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
  requiresTwoFactor: boolean;
  businessAdmin: BusinessAdmin | null;
  businessUser: BusinessUser | null;
}

interface VerifyResponse {
  status: boolean;
  message: string;
  statusCode: number;
  data: VerifyResponseData;
}

interface JwtPayload {
  roles?: string[];
  userType?: string;
  businessAdminId?: number;
  userId?: number;
  exp: number;
}

/* =========================
    COMPONENT
========================= */

const UserVerifyTwoFALogin: React.FC = () => {
  const navigate = useNavigate();
  const [cookies, setCookie] = useCookies([
    "tempToken",
    "token",
    "refreshToken",
    "role",
    "userType",
  ]);

  const [otp, setOtp] = useState<string[]>(["", "", "", "", "", ""]);
  const inputsRef = useRef<Array<HTMLInputElement | null>>([]);

  /* =========================
      OTP INPUT HANDLING
  ========================== */

  const handleChange = (value: string, index: number) => {
    if (!/^[0-9]?$/.test(value)) return;

    const updatedOtp = [...otp];
    updatedOtp[index] = value;
    setOtp(updatedOtp);

    if (value && index < 5) {
      inputsRef.current[index + 1]?.focus();
    }

    if (updatedOtp.join("").length === 6) {
      handleVerify(updatedOtp.join(""));
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
    if (e.key === "Enter") {
      handleVerify();
    }
  };

  /* =========================
      VERIFY OTP
  ========================== */

  const handleVerify = async (providedOtp?: string) => {
    const otpCode = providedOtp || otp.join("");

    if (otpCode.length !== 6) {
      toast.error("Please enter a 6-digit OTP");
      return;
    }

    if (!cookies.tempToken) {
      toast.error("Session expired. Please login again.");
      navigate("/login", { replace: true });
      return;
    }

    try {
      const response = await axios.post<VerifyResponse>(
        `${BASE_URL}/api/v3/business-user-auth/verify-2fa-login`,
        {
          tempToken: cookies.tempToken,
          twoFactorCode: otpCode,
        }
      );

      if (!response.data.status) {
        throw new Error(response.data.message);
      }

      const {
        accessToken,
        refreshToken,
        expiresIn,
        businessUser,
        businessAdmin,
      } = response.data.data;

      /* =========================
          DECODE JWT
      ========================== */

      const payload = JSON.parse(
        atob(accessToken.split(".")[1])
      ) as JwtPayload;

      const role = payload.roles?.[0];
      const maxAge = expiresIn || 10800;

      /* =========================
          STORE AUTH COOKIES
      ========================== */

      setCookie("token", accessToken, { path: "/", maxAge });
      setCookie("refreshToken", refreshToken, {
        path: "/",
        maxAge: 86400,
      });
      setCookie("role", role, { path: "/" });
      setCookie("userType", payload.userType, { path: "/" });

      /* =========================
          USER DATA
      ========================== */

      if (businessUser) {
        setCookie("userId", businessUser.id, { path: "/" });
        setCookie("fullName", businessUser.fullName, { path: "/" });
        setCookie("email", businessUser.email, { path: "/" });
      }

      if (businessAdmin) {
        setCookie("businessAdminId", businessAdmin.id, { path: "/" });
        setCookie("email", businessAdmin.email, { path: "/" });
      }

      /* =========================
          CLEAN TEMP TOKEN
      ========================== */

      setCookie("tempToken", "", { path: "/", maxAge: 0 });

      toast.success("Login successful");

      /* =========================
          ROLE BASED REDIRECT ✅
      ========================== */

      if (["ROLE_USER", "ROLE_BUSINESS_USER"].includes(role || "")) {
        navigate("/portal", { replace: true });
      } 
      
      // else if (role === "ROLE_BUSINESS_ADMIN") {
      //   navigate("/exchange", { replace: true });
      // } else if (role === "ROLE_ADMIN") {
      //   navigate("/admin", { replace: true });
      // }
      
      else {
        navigate("/login", { replace: true });
      }
    } catch (error: any) {
      console.error("OTP Verification Error:", error);
      toast.error(
        error?.response?.data?.message || "OTP verification failed"
      );
      setOtp(["", "", "", "", "", ""]);
      inputsRef.current[0]?.focus();
    }
  };

  /* =========================
      UI
  ========================== */

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-6 rounded shadow w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-4">
          Business User Verification
        </h2>

        <p className="text-sm text-center text-gray-500 mb-6">
          Enter the 6-digit code from your authenticator app.
        </p>

        <div className="flex justify-between gap-2 mb-4">
          {otp.map((digit, index) => (
            <input
              key={index}
              ref={(el) => (inputsRef.current[index] = el)}
              type="text"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(e.target.value, index)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              className="w-12 h-12 text-center text-xl border rounded focus:outline-none focus:border-blue-500"
            />
          ))}
        </div>

        <button
          onClick={() => handleVerify()}
          className="w-full bg-blue-600 text-white py-3 rounded-md font-semibold hover:bg-blue-700 transition"
        >
          Verify & Access Portal
        </button>
      </div>
    </div>
  );
};

export default UserVerifyTwoFALogin;
