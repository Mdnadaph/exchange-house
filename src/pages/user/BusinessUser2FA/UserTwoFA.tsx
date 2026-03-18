import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";
import BASE_URL from "@/config/config";
import { QRCodeCanvas } from "qrcode.react";

const UserTwoFA = () => {
  const navigate = useNavigate();

  const [cookies, setCookie] = useCookies([
    "accessToken",
    "businessTwoFactorEnabled",
    "businessEmail",
    "tempToken",
  ]);

  const businessEmail = cookies.businessEmail;
  const tempToken = cookies.tempToken;

  console.log("tempToken", tempToken);
  console.log("Email", businessEmail);

  const [qrCodeUrl, setQrCodeUrl] = useState("");
  const [manualEntryKey, setManualEntryKey] = useState("");
  const [backupCodes, setBackupCodes] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [verifyError, setVerifyError] = useState<string>("");   // ← added

  // OTP state (6 boxes)
  const [otp, setOtp] = useState<string[]>(Array(6).fill(""));
  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);

  /* ============================ INITIATE 2FA SETUP ============================ */
  useEffect(() => {
    if (!tempToken || !businessEmail) {
      toast.error("Session expired. Please login again.");
      navigate("/");
      return;
    }

    const initiateSetup = async () => {
      try {
        const response = await axios.post(
          `${BASE_URL}/api/v3/business-user-auth/initiate-2fa-setup?businessEmail=${businessEmail}`,
        );

        if (response.data.status) {
          const { qrCodeUrl, manualEntryKey, backupCodes } = response.data.data;
          setQrCodeUrl(qrCodeUrl);
          setManualEntryKey(manualEntryKey);
          setBackupCodes(backupCodes);
        } else {
          setError(response.data.message || "Failed to initiate 2FA");
        }
      } catch (err: any) {
        console.error("initiate-2fa-setup error:", err);
        setError(err.response?.data?.message || "Error initiating 2FA setup");
      } finally {
        setLoading(false);
      }
    };

    initiateSetup();
  }, [businessEmail, tempToken, navigate]);

  /* ============================ OTP INPUT HANDLERS ============================ */
  const handleOtpChange = (index: number, value: string) => {
    if (!/^[0-9]?$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Clear error when user types
    setVerifyError("");

    if (value && index < 5) {
      otpRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  };

  /* ============================ VERIFY OTP ============================ */
  const handleVerify = async () => {
    const otpValue = otp.join("");

    if (otpValue.length !== 6) {
      setVerifyError("Please enter complete 6-digit OTP");
      toast.error("Please enter complete 6-digit OTP");
      return;
    }

    setVerifyError(""); // clear previous error

    try {
      const response = await axios.post(
        `${BASE_URL}/api/v3/business-user-auth/verify-2fa-setup`,
        {
          tempToken,
          twoFactorCode: otpValue,
        },
      );

      if (response.data.status) {
        const { accessToken } = response.data.data;

        setCookie("accessToken", accessToken, {
          path: "/",
        });

        setCookie("businessTwoFactorEnabled", true, { path: "/" });

        toast.success("2FA setup completed successfully");
        navigate("/portal", { replace: true });
      } else {
        const msg = response.data.message || "OTP verification failed";
        setVerifyError(msg);
        toast.error(msg);
      }
    } catch (err: any) {
      console.error("verify error:", err);
      const msg = err.response?.data?.message || "Verification failed";
      setVerifyError(msg);
      toast.error(msg);
    }
  };

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center">
        Please Wait Sometine Generating The QR Code...
      </div>
    );

  if (error)
    return (
      <div className="min-h-screen flex items-center justify-center text-red-500">
        {error}
      </div>
    );

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="max-w-md w-full p-6 bg-white border rounded shadow">
        <h2 className="text-2xl font-bold text-center mb-4">
          Two-Factor Authentication
        </h2>

        {/* QR CODE */}
        {qrCodeUrl && (
          <>
            <p className="text-center mb-4">
              Scan this QR code using Google Authenticator
            </p>

            <div className="flex justify-center mb-4">
              <QRCodeCanvas
                value={qrCodeUrl}
                size={200}
                includeMargin
              />
            </div>

            <p className="text-center mb-4">
              Manual Key: <strong>{manualEntryKey}</strong>
            </p>

            <p className="text-center text-red-500 mb-2 font-semibold">
              Notice: Using Google Authenticator App To get OTP by Scanning QR
              Code or Type Mannual key.
            </p>
          </>
        )}

        {/* OTP BOXES */}
        <div className="mb-6">
          <label className="block mb-3 font-semibold text-center">
            Enter 6-digit OTP
          </label>

          <div className="flex justify-center gap-3">
            {otp.map((digit, index) => (
              <input
                key={index}
                ref={(el) => (otpRefs.current[index] = el)}
                type="text"
                maxLength={1}
                value={digit}
                onChange={(e) => handleOtpChange(index, e.target.value)}
                onKeyDown={(e) => handleOtpKeyDown(index, e)}
                className="w-12 h-12 text-center text-xl border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            ))}
          </div>
        </div>

        {/* ERROR MESSAGE — same style & position as previous components */}
        {verifyError && (
          <div className="mb-4 text-center text-red-600 font-medium bg-red-50 p-3 rounded border border-red-200">
            {verifyError}
          </div>
        )}

        <button
          onClick={() => handleVerify()}
          className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition"
        >
          Verify & Continue
        </button>
      </div>
    </div>
  );
};

export default UserTwoFA;