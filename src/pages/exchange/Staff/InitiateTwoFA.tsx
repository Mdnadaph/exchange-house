import React, { useEffect, useState } from "react";
// import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import axiosInstance from "@/config/AxiosInstance";
// import { useCookies } from "react-cookie";

import BASE_URL from "@/config/config";
import axios from "axios";
import { useCookies } from "react-cookie";
import { useNavigate, useParams } from "react-router-dom";

const InitiateTwoFA = () => {
  const [qrCodeUrl, setQrCodeUrl] = useState("");
  const [manualEntryKey, setManualEntryKey] = useState("");
  const [backupCodes, setBackupCodes] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [otp, setOtp] = useState("");

  const [, setCookie] = useCookies(["twoFactorEnabled"]);

  const navigate = useNavigate();

  useEffect(() => {
    const initiateSetup = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/api/v3/staff-auth/initiate-2fa-setup`);
        if (response.data.status) {
          const { qrCodeUrl, manualEntryKey, backupCodes } = response.data.data;
          setQrCodeUrl(qrCodeUrl);
          setManualEntryKey(manualEntryKey);
          setBackupCodes(backupCodes);
        } else {
          setError(response.data.message || "Failed to initiate 2FA setup");
        }
      } catch (err) {
        console.error(err);
        setError("Error initiating 2FA setup");
      } finally {
        setLoading(false);
      }
    };

    initiateSetup();
  }, []);

  const handleVerify = async () => {
    if (!otp) {
      toast.error("Please enter the OTP");
      return;
    }

    try {
      // Call initiate to get tempToken
      const initiateResponse = await axios.post(`${BASE_URL}/api/v3/staff/2fa/initiate`);

      const tempToken = initiateResponse.data.tempToken;

      // For dev, if twoFactorCode is present, could use it, but here user enters otp

      // Assume verify API
      const verifyResponse = await axios.post(`${BASE_URL}/api/v3/staff/2fa/verify`, {
        tempToken,
        twoFactorCode: otp,
      });

      if (verifyResponse.data.status) {
        setCookie("twoFactorEnabled", true, {
          path: "/",
          maxAge: 60 * 60 * 24, // 1 day
          secure: true,
          sameSite: "strict",
        });
        toast.success("2FA setup completed successfully!");
        navigate("/exchange");
      } else {
        setError(verifyResponse.data.message || "Verification failed");
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Error during verification");
      toast.error("Verification failed");
    }
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (error) {
    return <div className="min-h-screen flex items-center justify-center text-red-500">{error}</div>;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="max-w-md w-full mx-auto p-6 border rounded shadow bg-white">
        <h2 className="text-2xl font-bold mb-4 text-center">Set Up Two-Factor Authentication</h2>
        <p className="mb-4 text-center">Scan this QR code with your authenticator app (e.g., Google Authenticator).</p>
        {qrCodeUrl && (
          <div className="flex justify-center mb-4">
            <img src={qrCodeUrl} alt="2FA QR Code" className="w-48 h-48" />
          </div>
        )}
        <p className="mb-4 text-center">
          Or enter this key manually in your app: <strong>{manualEntryKey}</strong>
        </p>
        <div className="mb-4">
          <h3 className="font-semibold mb-2">Backup Codes</h3>
          <p className="text-sm text-gray-600 mb-2">Store these in a safe place. You can use them if you lose access to your authenticator app.</p>
          <ul className="list-disc pl-5">
            {backupCodes.map((code, index) => (
              <li key={index} className="text-sm">{code}</li>
            ))}
          </ul>
        </div>
        <div className="mb-4">
          <label className="block mb-1 font-semibold">Enter the 6-digit code from your app</label>
          <input
            type="text"
            maxLength={6}
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            className="w-full px-3 py-2 border rounded"
            placeholder="123456"
          />
        </div>
        <button
          onClick={handleVerify}
          className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition"
        >
          Verify and Enable 2FA
        </button>
      </div>
    </div>
  );
};

export default InitiateTwoFA;