// import React, { useEffect, useState } from "react";
// // import { useNavigate, useLocation } from "react-router-dom";
// import { toast } from "react-toastify";
// import axiosInstance from "@/config/AxiosInstance";
// // import { useCookies } from "react-cookie";

// import BASE_URL from "@/config/config";
// import axios from "axios";
// import { useCookies } from "react-cookie";
// import { useNavigate } from "react-router-dom";

// const InitiateTwoFA = () => {

//   const [cookies] = useCookies(["email", "tempToken", "requiresTwoFactor"]);
//   const email = cookies.email;
//   const tempToken = cookies.tempToken;
//   const requiresTwoFactor = cookies.requiresTwoFactor;

//   const [qrCodeUrl, setQrCodeUrl] = useState("");
//   const [manualEntryKey, setManualEntryKey] = useState("");
//   const [backupCodes, setBackupCodes] = useState<string[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");
//   const [otp, setOtp] = useState("");

//   const [, setCookie] = useCookies(["twoFactorEnabled", "accessToken", "requiresTwoFactor"]);

//   const navigate = useNavigate();

//   useEffect(() => {
//     const initiateSetup = async () => {
//       try {
//         const response = await axios.post(
//           `${BASE_URL}/api/v3/staff-auth/initiate-2fa-setup?email=${email}`
//         );
//         if (response.data.status) {
//           const { qrCodeUrl, manualEntryKey, backupCodes } = response.data.data;
//           setQrCodeUrl(qrCodeUrl);
//           setManualEntryKey(manualEntryKey);
//           setBackupCodes(backupCodes);
//         } else {
//           setError(response.data.message || "Failed to initiate 2FA setup");
//         }
//       } catch (err) {
//         console.error(err);
//         setError("Error initiating 2FA setup");
//       } finally {
//         setLoading(false);
//       }
//     };

//     initiateSetup();
//   }, []);

//   const handleVerify = async () => {
//     if (!otp) {
//       toast.error("Please enter the OTP");
//       return;
//     }

//     try {
//       const verifyResponse = await axios.post(
//         `${BASE_URL}/api/v3/staff-auth/verify-2fa-setup`,
//         {
//           tempToken,
//           twoFactorCode: otp,
//         }
//       );

//       if (verifyResponse.data.status) {
//         const { accessToken } = verifyResponse.data.data;

//         // Store 2FA enabled in cookie
//         setCookie("twoFactorEnabled", true, {
//           path: "/",
//           maxAge: 60 * 60 * 24, // 1 day
//           secure: true,
//           sameSite: "strict",
//         });

//         // Store accessToken in cookie
//         setCookie("accessToken", accessToken, {
//           path: "/",
//           maxAge: 60 * 60 * 24, // 1 day
//           secure: true,
//           sameSite: "strict",
//         });

//         toast.success("2FA setup completed successfully!");

//         // Redirect to branch page
//         navigate("/branch", { replace: true });
//       } else {
//         setError(verifyResponse.data.message || "Verification failed");
//         toast.error(verifyResponse.data.message || "Verification failed");
//       }
//     } catch (err: any) {
//       console.error(err);
//       setError(err.response?.data?.message || "Error during verification");
//       toast.error(err.response?.data?.message || "Verification failed");
//     }
//   };

//   if (loading) {
//     return (
//       <div className="min-h-screen flex items-center justify-center">
//         Loading...
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="min-h-screen flex items-center justify-center text-red-500">
//         {error}
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gray-100">
//       <div className="max-w-md w-full mx-auto p-6 border rounded shadow bg-white">
//         <h2 className="text-2xl font-bold mb-4 text-center">
//           Set Up Two-Factor Authentication
//         </h2>
//         <p className="mb-4 text-center">
//           Scan this QR code with your authenticator app (e.g., Google
//           Authenticator).
//         </p>
//         {qrCodeUrl && (
//           <div className="flex justify-center mb-4">
//             <img src={qrCodeUrl} alt="2FA QR Code" className="w-48 h-48" />
//           </div>
//         )}
//         <p className="mb-4 text-center">
//           Or enter this key manually in your app:{" "}
//           <strong>{manualEntryKey}</strong>
//         </p>
//         <div className="mb-4">
//           <h3 className="font-semibold mb-2">Backup Codes</h3>
//           <p className="text-sm text-gray-600 mb-2">
//             Store these in a safe place. You can use them if you lose access to
//             your authenticator app.
//           </p>
//           <ul className="list-disc pl-5">
//             {backupCodes.map((code, index) => (
//               <li key={index} className="text-sm">
//                 {code}
//               </li>
//             ))}
//           </ul>
//         </div>
//         <div className="mb-4">
//           <label className="block mb-1 font-semibold">
//             Enter the 6-digit code from your app
//           </label>
//           <input
//             type="text"
//             maxLength={6}
//             value={otp}
//             onChange={(e) => setOtp(e.target.value)}
//             className="w-full px-3 py-2 border rounded"
//             placeholder="123456"
//           />
//         </div>
//         <button
//           onClick={handleVerify}
//           className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition"
//         >
//           Verify and Enable 2FA
//         </button>
//       </div>
//     </div>
//   );
// };

// export default InitiateTwoFA;

// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import { toast } from "react-toastify";
// import { useCookies } from "react-cookie";
// import { useNavigate } from "react-router-dom";
// import BASE_URL from "@/config/config";

// const InitiateTwoFA = () => {
//   const navigate = useNavigate();

//   /* -----------------------------------------
//      COOKIES
//   ----------------------------------------- */
//   const [cookies, setCookie, removeCookie] = useCookies([
//     "email",
//     "tempToken",
//     "requiresTwoFactor",
//     "twoFactorEnabled",
//     "accessToken",
//   ]);

//   const email = cookies.email;
//   const tempToken = cookies.tempToken;
//   const requiresTwoFactor = cookies.requiresTwoFactor;
//   // false → first time setup
//   // true  → OTP login

//   /* -----------------------------------------
//      STATES
//   ----------------------------------------- */
//   const [qrCodeUrl, setQrCodeUrl] = useState("");
//   const [manualEntryKey, setManualEntryKey] = useState("");
//   const [backupCodes, setBackupCodes] = useState<string[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");

//   // OTP boxes
//   const [otp, setOtp] = useState<string[]>(["", "", "", "", "", ""]);

//   /* -----------------------------------------
//      INITIATE 2FA (QR ONLY FIRST TIME)
//   ----------------------------------------- */
//   useEffect(() => {
//     const initiate2FA = async () => {
//       // 🔥 Already enabled → skip QR generation
//       if (requiresTwoFactor) {
//         setLoading(false);
//         return;
//       }

//       try {
//         const response = await axios.post(
//           `${BASE_URL}/api/v3/staff-auth/initiate-2fa-setup?email=${email}`
//         );

//         if (response.data.status) {
//           const { qrCodeUrl, manualEntryKey, backupCodes } =
//             response.data.data;

//           setQrCodeUrl(qrCodeUrl);
//           setManualEntryKey(manualEntryKey);
//           setBackupCodes(backupCodes);
//         } else {
//           setError(response.data.message || "Failed to initiate 2FA");
//         }
//       } catch (err) {
//         console.error(err);
//         setError("Error initiating 2FA setup");
//       } finally {
//         setLoading(false);
//       }
//     };

//     initiate2FA();
//   }, [requiresTwoFactor, email]);

//   /* -----------------------------------------
//      OTP HANDLERS
//   ----------------------------------------- */
//   const handleOtpChange = (value: string, index: number) => {
//     if (!/^[0-9]?$/.test(value)) return;

//     const newOtp = [...otp];
//     newOtp[index] = value;
//     setOtp(newOtp);

//     if (value && index < 5) {
//       document.getElementById(`otp-${index + 1}`)?.focus();
//     }
//   };

//   const handleOtpKeyDown = (
//     e: React.KeyboardEvent<HTMLInputElement>,
//     index: number
//   ) => {
//     if (e.key === "Backspace" && !otp[index] && index > 0) {
//       document.getElementById(`otp-${index - 1}`)?.focus();
//     }
//   };

//   /* -----------------------------------------
//      VERIFY OTP (SETUP vs LOGIN)
//   ----------------------------------------- */
//   const handleVerify = async () => {
//     const otpCode = otp.join("");

//     if (otpCode.length !== 6) {
//       toast.error("Please enter complete OTP");
//       return;
//     }

//     // 🔥 Decide API dynamically
//     const verifyApi = requiresTwoFactor
//       ? "/api/v3/staff-auth/verify-2fa-login"
//       : "/api/v3/staff-auth/verify-2fa-setup";

//     try {
//       const response = await axios.post(
//         `${BASE_URL}${verifyApi}`,
//         {
//           tempToken,
//           twoFactorCode: otpCode,
//         }
//       );

//       if (response.data.status) {
//         const { accessToken } = response.data.data;

//         setCookie("twoFactorEnabled", true, {
//           path: "/",
//           maxAge: 60 * 60 * 24,
//           secure: true,
//           sameSite: "strict",
//         });

//         setCookie("accessToken", accessToken, {
//           path: "/",
//           maxAge: 60 * 60 * 24,
//           secure: true,
//           sameSite: "strict",
//         });

//         // 🔥 After first setup, all future logins use OTP
//         setCookie("requiresTwoFactor", true, {
//           path: "/",
//         });

//         toast.success("2FA verified successfully");
//         navigate("/branch", { replace: true });
//       } else {
//         toast.error(response.data.message || "OTP verification failed");
//       }
//     } catch (err: any) {
//       console.error(err);
//       toast.error(err.response?.data?.message || "Verification failed");
//     }
//   };

//   /* -----------------------------------------
//      UI STATES
//   ----------------------------------------- */
//   if (loading) {
//     return (
//       <div className="min-h-screen flex items-center justify-center">
//         Loading...
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="min-h-screen flex items-center justify-center text-red-500">
//         {error}
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gray-100">
//       <div className="max-w-md w-full p-6 bg-white border rounded shadow">
//         <h2 className="text-2xl font-bold text-center mb-4">
//           Two-Factor Authentication
//         </h2>

//         {/* QR CODE — FIRST TIME ONLY */}
//         {!requiresTwoFactor && qrCodeUrl && (
//           <>
//             <p className="text-center mb-4">
//               Scan this QR code using Google Authenticator or Authy
//             </p>

//             <div className="flex justify-center mb-4">
//               <img
//                 src={qrCodeUrl}
//                 alt="2FA QR"
//                 className="w-48 h-48"
//               />
//             </div>

//             <p className="text-center mb-4">
//               Manual Key: <strong>{manualEntryKey}</strong>
//             </p>

//             <div className="mb-6">
//               <h3 className="font-semibold mb-2">Backup Codes</h3>
//               <ul className="list-disc pl-5 text-sm">
//                 {backupCodes.map((code, index) => (
//                   <li key={index}>{code}</li>
//                 ))}
//               </ul>
//             </div>
//           </>
//         )}

//         {/* OTP INPUT */}
//         <div className="mb-6">
//           <label className="block mb-3 font-semibold text-center">
//             Enter 6-digit OTP
//           </label>

//           <div className="flex justify-center gap-3">
//             {otp.map((digit, index) => (
//               <input
//                 key={index}
//                 id={`otp-${index}`}
//                 type="text"
//                 maxLength={1}
//                 value={digit}
//                 onChange={(e) =>
//                   handleOtpChange(e.target.value, index)
//                 }
//                 onKeyDown={(e) =>
//                   handleOtpKeyDown(e, index)
//                 }
//                 className="w-12 h-12 text-center text-lg border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//               />
//             ))}
//           </div>
//         </div>

//         <button
//           onClick={handleVerify}
//           className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
//         >
//           Verify & Continue
//         </button>
//       </div>
//     </div>
//   );
// };

// export default InitiateTwoFA;

// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import { toast } from "react-toastify";
// import { useCookies } from "react-cookie";
// import { useNavigate } from "react-router-dom";
// import BASE_URL from "@/config/config";

// const InitiateTwoFA = () => {
//   const navigate = useNavigate();

//   /* -----------------------------------------
//      COOKIES
//   ----------------------------------------- */
//   const [cookies, setCookie] = useCookies([
//     "email",
//     "tempToken",
//     "requiresTwoFactor",
//     "twoFactorEnabled",
//     "accessToken",
//   ]);

//   const email = cookies.email;
//   const tempToken = cookies.tempToken;
//   const requiresTwoFactor = cookies.requiresTwoFactor === true;

//   console.log("email",email);
//   console.log("Tem Token:-" , tempToken);
//   console.log("Requires Two Factor", requiresTwoFactor)

//   const isFirstTimeSetup = !requiresTwoFactor;

//   /* -----------------------------------------
//      STATES
//   ----------------------------------------- */
//   const [qrCodeUrl, setQrCodeUrl] = useState("");
//   const [manualEntryKey, setManualEntryKey] = useState("");
//   const [backupCodes, setBackupCodes] = useState<string[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");

//   const [otp, setOtp] = useState<string[]>(["", "", "", "", "", ""]);

//   /* -----------------------------------------
//      INITIATE 2FA (QR ONLY FIRST TIME)
//   ----------------------------------------- */
//   useEffect(() => {
//     if (!tempToken) {
//       toast.error("Session expired. Please login again.");
//       navigate("/");
//       return;
//     }

//     const initiate2FA = async () => {
//       // 🔥 Skip QR generation if already enabled
//       if (!requiresTwoFactor) {
//         setLoading(false);
//         return;
//       }

//       try {
//         const response = await axios.post(
//           `${BASE_URL}/api/v3/staff-auth/initiate-2fa-setup`,
//           null,
//           {
//             params: { email },
//           }
//         );

//         if (response.data?.status) {
//           const { qrCodeUrl, manualEntryKey, backupCodes } =
//             response.data.data;

//           setQrCodeUrl(qrCodeUrl);
//           setManualEntryKey(manualEntryKey);
//           setBackupCodes(backupCodes);
//         } else {
//           setError(response.data?.message || "Failed to initiate 2FA");
//         }
//       } catch (err) {
//         console.error(err);
//         setError("Error initiating 2FA setup");
//       } finally {
//         setLoading(false);
//       }
//     };

//     initiate2FA();
//   }, [requiresTwoFactor, email, tempToken, navigate]);

//   /* -----------------------------------------
//      OTP HANDLERS
//   ----------------------------------------- */
//   const handleOtpChange = (value: string, index: number) => {
//     if (!/^[0-9]?$/.test(value)) return;

//     const updatedOtp = [...otp];
//     updatedOtp[index] = value;
//     setOtp(updatedOtp);

//     if (value && index < 5) {
//       document.getElementById(`otp-${index + 1}`)?.focus();
//     }
//   };

//   const handleOtpKeyDown = (
//     e: React.KeyboardEvent<HTMLInputElement>,
//     index: number
//   ) => {
//     if (e.key === "Backspace" && !otp[index] && index > 0) {
//       document.getElementById(`otp-${index - 1}`)?.focus();
//     }
//   };

//   /* -----------------------------------------
//      VERIFY OTP
//   ----------------------------------------- */
//   const handleVerify = async () => {
//     const otpCode = otp.join("");

//     if (otpCode.length !== 6) {
//       toast.error("Please enter complete OTP");
//       return;
//     }

//     const verifyApi = requiresTwoFactor
//       ? "/api/v3/staff-auth/verify-2fa-login"
//       : "/api/v3/staff-auth/verify-2fa-setup";

//     try {
//       const response = await axios.post(`${BASE_URL}${verifyApi}`, {
//         tempToken,
//         twoFactorCode: otpCode,
//       });

//       if (response.data?.status) {
//         const { accessToken } = response.data.data;

//         setCookie("accessToken", accessToken, {
//           path: "/",
//           maxAge: 60 * 60 * 24,
//           secure: true,
//           sameSite: "strict",
//         });

//         setCookie("twoFactorEnabled", true, {
//           path: "/",
//         });

//         setCookie("requiresTwoFactor", true, {
//           path: "/",
//         });

//         toast.success("2FA verified successfully");
//         navigate("/branch", { replace: true });
//       } else {
//         toast.error(response.data?.message || "OTP verification failed");
//       }
//     } catch (err: any) {
//       console.error(err);
//       toast.error(err.response?.data?.message || "Verification failed");
//     }
//   };

//   /* -----------------------------------------
//      UI STATES
//   ----------------------------------------- */
//   if (loading) {
//     return (
//       <div className="min-h-screen flex items-center justify-center">
//         Loading...
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="min-h-screen flex items-center justify-center text-red-500">
//         {error}
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gray-100">
//       <div className="max-w-md w-full p-6 bg-white border rounded shadow">
//         <h2 className="text-2xl font-bold text-center mb-4">
//           Two-Factor Authentication
//         </h2>

//         {/* ---------------- FIRST TIME: QR ---------------- */}
//         {isFirstTimeSetup && qrCodeUrl && (
//           <>
//             <p className="text-center mb-4">
//               Scan this QR code using Google Authenticator or Authy
//             </p>

//             <div className="flex justify-center mb-4">
//               <img src={qrCodeUrl} alt="2FA QR" className="w-48 h-48" />
//             </div>

//             <p className="text-center mb-4">
//               Manual Key: <strong>{manualEntryKey}</strong>
//             </p>

//             <div className="mb-6">
//               <h3 className="font-semibold mb-2">Backup Codes</h3>
//               <ul className="list-disc pl-5 text-sm">
//                 {backupCodes.map((code, index) => (
//                   <li key={index}>{code}</li>
//                 ))}
//               </ul>
//             </div>
//           </>
//         )}

//         {/* ---------------- OTP (FIRST + SECOND TIME) ---------------- */}
//         {(requiresTwoFactor || qrCodeUrl) && (
//           <div className="mb-6">
//             <label className="block mb-3 font-semibold text-center">
//               Enter 6-digit OTP
//             </label>

//             <div className="flex justify-center gap-3">
//               {otp.map((digit, index) => (
//                 <input
//                   key={index}
//                   id={`otp-${index}`}
//                   type="text"
//                   maxLength={1}
//                   value={digit}
//                   onChange={(e) =>
//                     handleOtpChange(e.target.value, index)
//                   }
//                   onKeyDown={(e) =>
//                     handleOtpKeyDown(e, index)
//                   }
//                   className="w-12 h-12 text-center text-lg border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//                 />
//               ))}
//             </div>
//           </div>
//         )}

//         <button
//           onClick={handleVerify}
//           className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
//         >
//           Verify & Continue
//         </button>
//       </div>
//     </div>
//   );
// };

// export default InitiateTwoFA;

// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import { toast } from "react-toastify";
// import { useCookies } from "react-cookie";
// import { useNavigate } from "react-router-dom";
// import BASE_URL from "@/config/config";

// const InitiateTwoFA = () => {
//   const navigate = useNavigate();

//   /* -----------------------------------------
//      COOKIES
//   ----------------------------------------- */
//   const [cookies, setCookie] = useCookies([
//     "email",
//     "tempToken",
//     "requiresTwoFactor",
//     "twoFactorEnabled",
//     "accessToken",
//   ]);

//   const email = cookies.email;
//   const tempToken = cookies.tempToken;
//   const requiresTwoFactor = cookies.requiresTwoFactor === true;

//   /* -----------------------------------------
//      DEBUG LOGS
//   ----------------------------------------- */
//   console.log("📧 Email:", email);
//   console.log("🔑 Temp Token:", tempToken);
//   console.log("🔐 Requires Two Factor:", requiresTwoFactor);
//   console.log("🍪 All Cookies:", cookies);

//   /* -----------------------------------------
//      STATES
//   ----------------------------------------- */
//   const [qrCodeUrl, setQrCodeUrl] = useState("");
//   const [manualEntryKey, setManualEntryKey] = useState("");
//   const [backupCodes, setBackupCodes] = useState<string[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");

//   const [otp, setOtp] = useState<string[]>(["", "", "", "", "", ""]);

//   /* -----------------------------------------
//      INITIATE 2FA (ONLY WHEN requiresTwoFactor = true)
//   ----------------------------------------- */
//   useEffect(() => {
//     if (!tempToken) {
//       toast.error("Session expired. Please login again.");
//       navigate("/");
//       return;
//     }

//     const initiate2FA = async () => {
//       // ✅ If false → ONLY OTP (NO QR)
//       if (!requiresTwoFactor) {
//         console.log("➡️ requiresTwoFactor = false → OTP only");
//         setLoading(false);
//         return;
//       }

//       console.log("➡️ requiresTwoFactor = true → Fetching QR");

//       try {
//         const response = await axios.post(
//           `${BASE_URL}/api/v3/staff-auth/initiate-2fa-setup`,
//           null,
//           { params: { email } }
//         );

//         console.log("📥 initiate-2fa-setup response:", response.data);

//         if (response.data?.status) {
//           const { qrCodeUrl, manualEntryKey, backupCodes } =
//             response.data.data;

//           setQrCodeUrl(qrCodeUrl);
//           setManualEntryKey(manualEntryKey);
//           setBackupCodes(backupCodes);
//         } else {
//           setError(response.data?.message || "Failed to initiate 2FA");
//         }
//       } catch (err) {
//         console.error("❌ initiate-2fa-setup error:", err);
//         setError("Error initiating 2FA setup");
//       } finally {
//         setLoading(false);
//       }
//     };

//     initiate2FA();
//   }, [requiresTwoFactor, email, tempToken, navigate]);

//   /* -----------------------------------------
//      OTP HANDLERS
//   ----------------------------------------- */
//   const handleOtpChange = (value: string, index: number) => {
//     if (!/^[0-9]?$/.test(value)) return;

//     const updatedOtp = [...otp];
//     updatedOtp[index] = value;
//     setOtp(updatedOtp);

//     if (value && index < 5) {
//       document.getElementById(`otp-${index + 1}`)?.focus();
//     }
//   };

//   const handleOtpKeyDown = (
//     e: React.KeyboardEvent<HTMLInputElement>,
//     index: number
//   ) => {
//     if (e.key === "Backspace" && !otp[index] && index > 0) {
//       document.getElementById(`otp-${index - 1}`)?.focus();
//     }
//   };

//   /* -----------------------------------------
//      VERIFY OTP
//   ----------------------------------------- */
//   const handleVerify = async () => {
//     const otpCode = otp.join("");

//     console.log("🔢 Entered OTP:", otpCode);

//     if (otpCode.length !== 6) {
//       toast.error("Please enter complete OTP");
//       return;
//     }

//     const verifyApi = requiresTwoFactor
//       ? "/api/v3/staff-auth/verify-2fa-login"
//       : "/api/v3/staff-auth/verify-2fa-setup";

//     console.log("➡️ Verify API:", verifyApi);

//     try {
//       const response = await axios.post(`${BASE_URL}${verifyApi}`, {
//         tempToken,
//         twoFactorCode: otpCode,
//       });

//       console.log("📥 Verify response:", response.data);

//       if (response.data?.status) {
//         const { accessToken } = response.data.data;

//         setCookie("accessToken", accessToken, {
//           path: "/",
//           maxAge: 60 * 60 * 24,
//           secure: true,
//           sameSite: "strict",
//         });

//         setCookie("twoFactorEnabled", true, { path: "/" });
//         setCookie("requiresTwoFactor", true, { path: "/" });

//         toast.success("2FA verified successfully");
//         navigate("/branch", { replace: true });
//       } else {
//         toast.error(response.data?.message || "OTP verification failed");
//       }
//     } catch (err: any) {
//       console.error("❌ Verify error:", err);
//       toast.error(err.response?.data?.message || "Verification failed");
//     }
//   };

//   /* -----------------------------------------
//      UI STATES
//   ----------------------------------------- */
//   if (loading) {
//     return (
//       <div className="min-h-screen flex items-center justify-center">
//         Loading...
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="min-h-screen flex items-center justify-center text-red-500">
//         {error}
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gray-100">
//       <div className="max-w-md w-full p-6 bg-white border rounded shadow">
//         <h2 className="text-2xl font-bold text-center mb-4">
//           Two-Factor Authentication
//         </h2>

//         {/* ✅ QR + OTP when requiresTwoFactor = true */}
//         {requiresTwoFactor && qrCodeUrl && (
//           <>
//             <p className="text-center mb-4">
//               Scan this QR code using Google Authenticator
//             </p>

//             <div className="flex justify-center mb-4">
//               <img src={qrCodeUrl} alt="2FA QR" className="w-48 h-48" />
//             </div>

//             <p className="text-center mb-4">
//               Manual Key: <strong>{manualEntryKey}</strong>
//             </p>

//             <div className="mb-6">
//               <h3 className="font-semibold mb-2">Backup Codes</h3>
//               <ul className="list-disc pl-5 text-sm">
//                 {backupCodes.map((code, index) => (
//                   <li key={index}>{code}</li>
//                 ))}
//               </ul>
//             </div>
//           </>
//         )}

//         {/* ✅ OTP ALWAYS */}
//         <div className="mb-6">
//           <label className="block mb-3 font-semibold text-center">
//             Enter 6-digit OTP
//           </label>

//           <div className="flex justify-center gap-3">
//             {otp.map((digit, index) => (
//               <input
//                 key={index}
//                 id={`otp-${index}`}
//                 type="text"
//                 maxLength={1}
//                 value={digit}
//                 onChange={(e) =>
//                   handleOtpChange(e.target.value, index)
//                 }
//                 onKeyDown={(e) =>
//                   handleOtpKeyDown(e, index)
//                 }
//                 className="w-12 h-12 text-center text-lg border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//               />
//             ))}
//           </div>
//         </div>

//         <button
//           onClick={handleVerify}
//           className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
//         >
//           Verify & Continue
//         </button>
//       </div>
//     </div>
//   );
// };

// export default InitiateTwoFA;

// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import { toast } from "react-toastify";
// import { useCookies } from "react-cookie";
// import { useNavigate } from "react-router-dom";
// import BASE_URL from "@/config/config";

// const InitiateTwoFA = () => {
//   const navigate = useNavigate();

//   /* ----------------- COOKIES ----------------- */
//   const [cookies, setCookie] = useCookies([
//     "email",
//     "tempToken",
//     "requiresTwoFactor",
//     "twoFactorEnabled",
//     "accessToken",
//   ]);

//   const email = cookies.email;
//   const tempToken = cookies.tempToken;
//   const requiresTwoFactor = cookies.requiresTwoFactor === true; // true → OTP login
//   const isFirstTimeSetup = !requiresTwoFactor; // false → first-time setup

//   console.log("🍪 All Cookies:", cookies);
//   console.log("📧 Email:", email);
//   console.log("🔑 Temp Token:", tempToken);
//   console.log("🔐 Requires Two Factor:", requiresTwoFactor);

//   /* ----------------- STATES ----------------- */
//   const [qrCodeUrl, setQrCodeUrl] = useState("");
//   const [manualEntryKey, setManualEntryKey] = useState("");
//   const [backupCodes, setBackupCodes] = useState<string[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");
//   const [otp, setOtp] = useState("");

//   /* ----------------- INITIATE 2FA ----------------- */
//   useEffect(() => {
//     if (!tempToken) {
//       toast.error("Session expired. Please login again.");
//       navigate("/");
//       return;
//     }

//     const initiateSetup = async () => {
//       if (isFirstTimeSetup) {
//         try {
//           const response = await axios.post(
//             `${BASE_URL}/api/v3/staff-auth/initiate-2fa-setup?email=${email}`
//           );

//           console.log("📥 initiate-2fa-setup response:", response.data);

//           if (response.data.status) {
//             const { qrCodeUrl, manualEntryKey, backupCodes } =
//               response.data.data;

//             setQrCodeUrl(qrCodeUrl);
//             setManualEntryKey(manualEntryKey);
//             setBackupCodes(backupCodes);
//           } else {
//             setError(response.data.message || "Failed to initiate 2FA");
//           }
//         } catch (err) {
//           console.error("❌ initiate-2fa-setup error:", err);
//           setError("Error initiating 2FA setup");
//         } finally {
//           setLoading(false);
//         }
//       } else {
//         // Already has 2FA enabled, only OTP section
//         setLoading(false);
//       }
//     };

//     initiateSetup();
//   }, [email, tempToken, isFirstTimeSetup, navigate]);

//   /* ----------------- VERIFY 2FA ----------------- */
//   const handleVerify = async () => {
//     if (!otp || otp.length !== 6) {
//       toast.error("Please enter complete OTP");
//       return;
//     }

//     // Use correct API depending on first-time or not
//     const verifyApi = isFirstTimeSetup
//       ? "/api/v3/staff-auth/verify-2fa-setup"
//       : "/api/v3/staff-auth/verify-2fa-login";

//     try {
//       const response = await axios.post(`${BASE_URL}${verifyApi}`, {
//         tempToken,
//         twoFactorCode: otp,
//       });

//       console.log("📥 verify response:", response.data);

//       if (response.data.status) {
//         const { accessToken } = response.data.data;

//         setCookie("accessToken", accessToken, {
//           path: "/",
//           maxAge: 60 * 60 * 24,
//           secure: true,
//           sameSite: "strict",
//         });

//         setCookie("twoFactorEnabled", true, { path: "/" });

//         // After first-time setup → require OTP for next login
//         setCookie("requiresTwoFactor", true, { path: "/" });

//         toast.success("2FA verified successfully");
//         navigate("/branch", { replace: true });
//       } else {
//         toast.error(response.data.message || "OTP verification failed");
//       }
//     } catch (err: any) {
//       console.error("❌ Verify error:", err);
//       toast.error(err.response?.data?.message || "Verification failed");
//     }
//   };

//   if (loading) {
//     return (
//       <div className="min-h-screen flex items-center justify-center">
//         Loading...
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="min-h-screen flex items-center justify-center text-red-500">
//         {error}
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gray-100">
//       <div className="max-w-md w-full p-6 bg-white border rounded shadow">
//         <h2 className="text-2xl font-bold text-center mb-4">
//           Two-Factor Authentication
//         </h2>

//         {/* QR + Manual Key + Backup codes (first time setup) */}
//         {isFirstTimeSetup && qrCodeUrl && (
//           <>
//             <p className="text-center mb-4">
//               Scan this QR code using Google Authenticator
//             </p>

//             <div className="flex justify-center mb-4">
//               <img src={qrCodeUrl} alt="2FA QR" className="w-48 h-48" />
//             </div>

//             <p className="text-center mb-4">
//               Manual Key: <strong>{manualEntryKey}</strong>
//             </p>

//             <div className="mb-6">
//               <h3 className="font-semibold mb-2">Backup Codes</h3>
//               <ul className="list-disc pl-5 text-sm">
//                 {backupCodes.map((code, index) => (
//                   <li key={index}>{code}</li>
//                 ))}
//               </ul>
//             </div>
//           </>
//         )}

//         {/* OTP section (always shown) */}
//         <div className="mb-6">
//           <label className="block mb-3 font-semibold text-center">
//             Enter 6-digit OTP
//           </label>
//           <input
//             type="text"
//             maxLength={6}
//             value={otp}
//             onChange={(e) => setOtp(e.target.value)}
//             className="w-full px-3 py-2 border rounded"
//             placeholder="123456"
//           />
//         </div>

//         <button
//           onClick={handleVerify}
//           className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition"
//         >
//           Verify & Continue
//         </button>
//       </div>
//     </div>
//   );
// };

// export default InitiateTwoFA;

import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";
import BASE_URL from "@/config/config";

const InitiateTwoFA = () => {
  const navigate = useNavigate();

  const [cookies, setCookie] = useCookies([
    "email",
    "tempToken",
    "requiresTwoFactor",
    "twoFactorEnabled",
    "accessToken",
    "businessId",
  ]);

  const email = cookies.email;
  const tempToken = cookies.tempToken;
  const requiresTwoFactor = cookies.requiresTwoFactor === true; // true → already has 2FA

  console.log("🍪 All Cookies:", cookies);
  console.log("📧 Email:", email);
  console.log("🔑 Temp Token:", tempToken);
  console.log("🔐 Requires Two Factor:", requiresTwoFactor);

  const [qrCodeUrl, setQrCodeUrl] = useState("");
  const [manualEntryKey, setManualEntryKey] = useState("");
  const [backupCodes, setBackupCodes] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [otp, setOtp] = useState("");

  useEffect(() => {
    if (!tempToken) {
      toast.error("Session expired. Please login again.");
      navigate("/");
      return;
    }

    const initiateSetup = async () => {
      try {
        // Show QR for first-time or even if requiresTwoFactor === true
        const response = await axios.post(
          `${BASE_URL}/api/v3/staff-auth/initiate-2fa-setup?email=${email}`
        );

        if (response.data.status) {
          const { qrCodeUrl, manualEntryKey, backupCodes } = response.data.data;
          setQrCodeUrl(qrCodeUrl);
          setManualEntryKey(manualEntryKey);
          setBackupCodes(backupCodes);
        } else {
          setError(response.data.message || "Failed to initiate 2FA");
        }
      } catch (err) {
        console.error("❌ initiate-2fa-setup error:", err);
        setError("Error initiating 2FA setup");
      } finally {
        setLoading(false);
      }
    };

    initiateSetup();
  }, [email, tempToken, navigate]);

  const handleVerify = async () => {
    if (!otp || otp.length !== 6) {
      toast.error("Please enter complete OTP");
      return;
    }

    const verifyApi = requiresTwoFactor
      ? "/api/v3/staff-auth/verify-2fa-setup"
      : "/api/v3/staff-auth/verify-2fa-login";

    // /api/v3/staff-auth/verify-2fa-setup

    try {
      const response = await axios.post(`${BASE_URL}${verifyApi}`, {
        tempToken,
        twoFactorCode: otp,
      });

      console.log("📥 verify response:", response.data);

      if (response.data.status) {
        const { accessToken } = response.data.data;

        const businessId = response?.data?.data?.businessAdmin?.businessId;

        setCookie("businessId", businessId, {
          path: "/",
          maxAge: 86400,
        });

        setCookie("accessToken", accessToken, {
          path: "/",
          maxAge: 60 * 60 * 24,
          secure: true,
          sameSite: "strict",
        });
        setCookie("twoFactorEnabled", true, { path: "/" });
        setCookie("requiresTwoFactor", true, { path: "/" });

        toast.success("2FA verified successfully");
        navigate("/branch", { replace: true });
      } else {
        toast.error(response.data.message || "OTP verification failed");
      }
    } catch (err: any) {
      console.error("❌ Verify error:", err);
      toast.error(err.response?.data?.message || "Verification failed");
    }
  };

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
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

        {/* Show QR + OTP if requiresTwoFactor === true */}
        {requiresTwoFactor && qrCodeUrl && (
          <>
            <p className="text-center mb-4">
              Scan this QR code using Google Authenticator
            </p>
            <div className="flex justify-center mb-4">
              <img src={qrCodeUrl} alt="2FA QR" className="w-48 h-48" />
            </div>
            <p className="text-center mb-4">
              Manual Key: <strong>{manualEntryKey}</strong>
            </p>
            <div className="mb-6">
              <h3 className="font-semibold mb-2">Backup Codes</h3>
              <ul className="list-disc pl-5 text-sm">
                {backupCodes.map((code, i) => (
                  <li key={i}>{code}</li>
                ))}
              </ul>
            </div>
          </>
        )}

        {/* Show only OTP if requiresTwoFactor === false */}
        <div className="mb-6">
          <label className="block mb-3 font-semibold text-center">
            Enter 6-digit OTP
          </label>
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
          Verify & Continue
        </button>
      </div>
    </div>
  );
};

export default InitiateTwoFA;
