import React, { useEffect, useRef, useState } from "react";
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
  businessId: number;
  businessName: string | null;
  currencyCode: string;
}

interface BusinessAdmin {
  id: number;
  uuid: string;
  firstName: string;
  lastName: string;
  email: string;
  businessId: number;
  businessName: string | null;
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
    "userId",
    "fullName",
    "email",
    "businessAdminId",
    "businessName",
    "currencyCode",
  ]);

  const [otp, setOtp] = useState<string[]>(["", "", "", "", "", ""]);
  const inputsRef = useRef<Array<HTMLInputElement | null>>([]);
  const [verifyError, setVerifyError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // ── Auto-focus first input on mount ──
  useEffect(() => {
    inputsRef.current[0]?.focus();
  }, []);

  /* =========================
      OTP INPUT HANDLING
  ========================== */

  const handleChange = (value: string, index: number) => {
    if (!/^[0-9]?$/.test(value)) return;

    const updatedOtp = [...otp];
    updatedOtp[index] = value;
    setOtp(updatedOtp);
    setVerifyError(null);

    if (value && index < 5) {
      inputsRef.current[index + 1]?.focus();
    }

    if (updatedOtp.join("").length === 6) {
      handleVerify(updatedOtp.join(""));
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").trim();
    if (!/^\d{6}$/.test(pasted)) return;

    const digits = pasted.split("");
    setOtp(digits);
    inputsRef.current[5]?.focus();
    handleVerify(pasted);
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
      setVerifyError("Please enter a 6-digit OTP");
      toast.error("Please enter a 6-digit OTP");
      return;
    }

    if (!cookies.tempToken) {
      toast.error("Session expired. Please login again.");
      navigate("/login", { replace: true });
      return;
    }

    setVerifyError(null);
    setIsLoading(true);

    try {
      const response = await axios.post<VerifyResponse>(
        `${BASE_URL}/api/v3/business-user-auth/verify-2fa-login`,
        {
          tempToken: cookies.tempToken,
          twoFactorCode: otpCode,
        },
      );

      if (!response.data.status) {
        const msg = response.data.message || "Verification failed";
        setVerifyError(msg);
        toast.error(msg);
        setOtp(["", "", "", "", "", ""]);
        inputsRef.current[0]?.focus();
        return;
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

      const payload = JSON.parse(atob(accessToken.split(".")[1])) as JwtPayload;
      const role = payload.roles?.[0];
      const maxAge = expiresIn || 10800;

      /* =========================
          STORE AUTH COOKIES
      ========================== */

      setCookie("token", accessToken, { path: "/", maxAge });
      setCookie("refreshToken", refreshToken, { path: "/", maxAge: 86400 });
      setCookie("role", role, { path: "/" });
      setCookie("userType", payload.userType, { path: "/" });

      /* =========================
          USER DATA
      ========================== */

      if (businessUser) {
        setCookie("userId", businessUser.id, { path: "/" });
        setCookie("fullName", businessUser.fullName, { path: "/" });
        setCookie("email", businessUser.email, { path: "/" });
        setCookie("businessName", businessUser.businessName, { path: "/" });
        setCookie("currencyCode", businessUser?.currencyCode, { path: "/" });
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
          ROLE BASED REDIRECT
      ========================== */

      if (["ROLE_USER", "ROLE_BUSINESS_USER"].includes(role || "")) {
        navigate("/portal", { replace: true });
      } else {
        navigate("/login", { replace: true });
      }
    } catch (error: any) {
      console.error("OTP Verification Error:", error);

      const msg =
        error.response?.data?.message ||
        error.message ||
        "OTP verification failed";

      setVerifyError(msg);
      toast.error(msg);
      setOtp(["", "", "", "", "", ""]);
      inputsRef.current[0]?.focus();
    } finally {
      setIsLoading(false);
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
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(e.target.value, index)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              onPaste={index === 0 ? handlePaste : undefined}
              className="w-12 h-12 text-center text-xl border rounded focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition"
            />
          ))}
        </div>

        {verifyError && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded text-center text-sm">
            {verifyError}
          </div>
        )}

        <button
          onClick={() => handleVerify()}
          disabled={isLoading || otp.join("").length !== 6}
          className="w-full bg-blue-600 text-white py-3 rounded-md font-semibold hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? "Verifying..." : "Verify & Access Portal"}
        </button>
      </div>
    </div>
  );
};

export default UserVerifyTwoFALogin;
