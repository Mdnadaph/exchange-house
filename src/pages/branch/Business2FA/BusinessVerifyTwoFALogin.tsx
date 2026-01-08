import React, { useRef, useState } from "react";
import axios from "axios";
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import BASE_URL from "@/config/config";

interface BusinessAdmin {
  id: number;
  uuid: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  designation: string;
  businessId: number;
}

interface VerifyResponseData {
  accessToken: string;
  expiresIn: number;
  businessAdmin: BusinessAdmin;
}

interface JwtPayload {
  roles?: string[];
  exp: number;
}

const BusinessTwoFALogin: React.FC = () => {
  const navigate = useNavigate();

  const [cookies, setCookie] = useCookies([
    "tempToken",
    "token",
    "role",
    "businessId",
    "id",
    "uuid",
    "firstName",
    "lastName",
    "email",
  ]);

  const [otp, setOtp] = useState<string[]>(["", "", "", "", "", ""]);
  const [otpError, setOtpError] = useState("");
  const inputsRef = useRef<Array<HTMLInputElement | null>>([]);

  /* =========================
      OTP INPUT HANDLING
  ========================== */
  const handleChange = (value: string, index: number) => {
    if (!/^[0-9]?$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    setOtpError("");

    if (value && index < 5) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };

  /* =========================
      VERIFY OTP
  ========================== */
  const handleVerify = async () => {
    const otpCode = otp.join("");

    if (otpCode.length !== 6) {
      setOtpError("Please enter a 6-digit OTP");
      toast.error("Please enter a 6-digit OTP");
      return;
    }

    if (!cookies.tempToken) {
      toast.error("Session expired. Please login again.");
      navigate("/login");
      return;
    }

    try {
      const response = await axios.post<{
        status: boolean;
        data: VerifyResponseData;
        message: string;
      }>(`${BASE_URL}/api/v3/business-auth/verify-2fa-login`, {
        tempToken: cookies.tempToken,
        twoFactorCode: otpCode,
      });

      if (!response.data.status) {
        setOtpError(response.data.message || "Invalid OTP");
        toast.error(response.data.message || "Invalid OTP");
        setOtp(["", "", "", "", "", ""]);
        inputsRef.current[0]?.focus();
        return;
      }

      const { accessToken, expiresIn, businessAdmin } = response.data.data;

      /* =========================
          DECODE JWT (CRITICAL FIX)
      ========================== */
      const payload = JSON.parse(
        atob(accessToken.split(".")[1])
      ) as JwtPayload;

      const role = payload.roles?.[0]; // e.g. ROLE_BUSINESS_ADMIN
      const currentTime = Math.floor(Date.now() / 1000);
      const maxAge = expiresIn || payload.exp - currentTime;

      /* =========================
          STORE AUTH DATA
      ========================== */
      setCookie("token", accessToken, {
        path: "/",
        sameSite: "lax",
        maxAge: maxAge > 0 ? maxAge : 10800,
      });

      setCookie("role", role, { path: "/", sameSite: "lax" });

      setCookie("businessId", businessAdmin.businessId, {
        path: "/",
        sameSite: "lax",
      });
      setCookie("id", businessAdmin.id, { path: "/", sameSite: "lax" });
      setCookie("uuid", businessAdmin.uuid, { path: "/", sameSite: "lax" });
      setCookie("firstName", businessAdmin.firstName, {
        path: "/",
        sameSite: "lax",
      });
      setCookie("lastName", businessAdmin.lastName, {
        path: "/",
        sameSite: "lax",
      });
      setCookie("email", businessAdmin.email, {
        path: "/",
        sameSite: "lax",
      });

      /* =========================
          CLEANUP
      ========================== */
      setCookie("tempToken", "", { path: "/", maxAge: 0 });

      toast.success("Login successful");

      // ✅ FINAL REDIRECT
      navigate("/portal", { replace: true });

    } catch (error: any) {
      setOtpError(error.response?.data?.message || "OTP verification failed");
      toast.error(error.response?.data?.message || "OTP verification failed");
      setOtp(["", "", "", "", "", ""]);
      inputsRef.current[0]?.focus();
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-6 rounded shadow w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-4">
          Business Verification
        </h2>

        <p className="text-sm text-center text-gray-500 mb-6">
          Enter the 6-digit code from your authenticator app.
        </p>

        <div className="flex justify-between gap-2 mb-2">
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

        {otpError && (
          <p className="text-red-500 text-sm text-center mt-2">{otpError}</p>
        )}

        <button
          onClick={handleVerify}
          className="w-full bg-blue-600 text-white py-3 rounded-md font-semibold hover:bg-blue-700 transition mt-4"
        >
          Verify & Access Portal
        </button>
      </div>
    </div>
  );
};

export default BusinessTwoFALogin;
