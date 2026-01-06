// import React, { useRef, useState } from "react";
// import axios from "axios";
// import { useCookies } from "react-cookie";
// import { useNavigate } from "react-router-dom";
// import { toast } from "react-toastify";
// import BASE_URL from "@/config/config";

// const BusinessTwoFALogin: React.FC = () => {
//   const navigate = useNavigate();
//   const [cookies, setCookie] = useCookies(["tempToken" , "accessToken"]);

//   const [otp, setOtp] = useState<string[]>(["", "", "", "", "", ""]);
//   const inputsRef = useRef<Array<HTMLInputElement | null>>([]);

//   /* =========================
//      HANDLE OTP INPUT
//   ========================== */
//   const handleChange = (value: string, index: number) => {
//     if (!/^[0-9]?$/.test(value)) return;

//     const newOtp = [...otp];
//     newOtp[index] = value;
//     setOtp(newOtp);

//     if (value && index < 5) {
//       inputsRef.current[index + 1]?.focus();
//     }
//   };

//   const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
//     if (e.key === "Backspace" && !otp[index] && index > 0) {
//       inputsRef.current[index - 1]?.focus();
//     }
//   };

//   /* =========================
//      VERIFY OTP
//   ========================== */
//   const handleVerify = async () => {
//     const otpCode = otp.join("");

//     if (otpCode.length !== 6) {
//       toast.error("Please enter 6-digit OTP");
//       return;
//     }

//     if (!cookies.tempToken) {
//       toast.error("Session expired. Please login again.");
//       navigate("/portal");
//       return;
//     }

//     console.log("🔐 VERIFY 2FA LOGIN PAYLOAD:", {
//       tempToken: cookies.tempToken,
//       twoFactorCode: otpCode,
//     });

//     try {
//       const response = await axios.post(
//         `${BASE_URL}/api/v3/business-auth/verify-2fa-login`,
//         // /api/v3/business-auth/verify-2fa-login
//         {
//           tempToken: cookies.tempToken,
//           twoFactorCode: otpCode,
//         }
//       );

//       console.log("📥 VERIFY RESPONSE:", response.data);

//       if (!response.data.status) {
//         toast.error(response.data.message || "OTP verification failed");
//         return;
//       }

//       const { accessToken, tokenExpiryTime } = response.data.data;

//       setCookie("accessToken", accessToken, {
//         // path: "/",
//         // secure: true,
//         // sameSite: "strict",
//         // maxAge: tokenExpiryTime || 86400,
//         path: "/", sameSite: "lax"
//       });

//       toast.success("Login successful");
//       navigate("/portal", { replace: true });
//     } catch (error: any) {
//       console.error("❌ VERIFY ERROR:", error);
//       toast.error(
//         error.response?.data?.message || "OTP verification failed"
//       );
//     }
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gray-100">
//       <div className="bg-white p-6 rounded shadow w-full max-w-md">
//         <h2 className="text-2xl font-bold text-center mb-6">
//           Verify OTP
//         </h2>

//         {/* OTP INPUTS */}
//         <div className="flex justify-between gap-2 mb-6">
//           {otp.map((digit, index) => (
//             <input
//               key={index}
//               ref={(el) => (inputsRef.current[index] = el)}
//               type="text"
//               maxLength={1}
//               value={digit}
//               onChange={(e) => handleChange(e.target.value, index)}
//               onKeyDown={(e) => handleKeyDown(e, index)}
//               className="w-12 h-12 text-center text-xl border rounded focus:outline-none focus:border-blue-500"
//             />
//           ))}
//         </div>

//         {/* VERIFY BUTTON */}
//         <button
//           onClick={handleVerify}
//           className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition"
//         >
//           Verify & Login
//         </button>
//       </div>
//     </div>
//   );
// };

// export default BusinessTwoFALogin;

// import React, { useRef, useState, useEffect } from "react";
// import axios from "axios";
// import { useCookies } from "react-cookie";
// import { useNavigate } from "react-router-dom";
// import { toast } from "react-toastify";
// import BASE_URL from "@/config/config";

// // Define type for businessAdmin
// interface BusinessAdmin {
//   id: number;
//   uuid: string;
//   firstName: string;
//   lastName: string;
//   email: string;
//   phoneNumber: string;
//   designation: string;
//   businessId: number;
// }

// interface VerifyResponseData {
//   accessToken: string;
//   expiresIn: number;
//   businessAdmin: BusinessAdmin;
// }

// const BusinessTwoFALogin: React.FC = () => {
//   const navigate = useNavigate();
//   console.log("Component rendered");

//   // Cookies
//   const [cookies, setCookie] = useCookies([
//     "tempToken",
//     "accessToken",
//     "id",
//     "uuid",
//     "firstName",
//     "lastName",
//     "email",
//     "phoneNumber",
//     "designation",
//     "businessId",
//   ]);

//   // OTP state
//   const [otp, setOtp] = useState<string[]>(["", "", "", "", "", ""]);
//   const inputsRef = useRef<Array<HTMLInputElement | null>>([]);

//   // OTP handlers
//   const handleChange = (value: string, index: number) => {
//     if (!/^[0-9]?$/.test(value)) return;

//     const newOtp = [...otp];
//     newOtp[index] = value;
//     setOtp(newOtp);

//     if (value && index < 5) {
//       inputsRef.current[index + 1]?.focus();
//     }
//   };

//   const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
//     if (e.key === "Backspace" && !otp[index] && index > 0) {
//       inputsRef.current[index - 1]?.focus();
//     }
//   };

//   // Verify OTP
//   const handleVerify = async () => {
//     console.log("=== handleVerify STARTED ===");
//     const otpCode = otp.join("");

//     if (otpCode.length !== 6) {
//       console.log("OTP length invalid:", otpCode.length);
//       toast.error("Please enter 6-digit OTP");
//       return;
//     }

//     if (!cookies.tempToken) {
//       console.log("No tempToken found");
//       toast.error("Session expired. Please login again.");
//       //navigate("/portal");
//       return;
//     }
//     console.log("Making API call with:", {
//       tempToken: cookies.tempToken?.substring(0, 20) + "...",
//       twoFactorCode: otpCode,
//     });
//     try {
//       const response = await axios.post<{
//         status: boolean;
//         data: VerifyResponseData;
//         message: string;
//       }>(`${BASE_URL}/api/v3/business-auth/verify-2fa-login`, {
//         tempToken: cookies.tempToken,
//         twoFactorCode: otpCode,
//       });
//       console.log("API Response received:", response.data);
//       if (!response.data.status) {
//         console.log("API returned false status:", response.data.message);
//         toast.error(response.data.message || "OTP verification failed");
//         return;
//       }

//       const { accessToken, expiresIn, businessAdmin } = response.data.data;
//       console.log("=== API SUCCESS ===");
//       // -----------------------------
//       // STORE COOKIES
//       // -----------------------------
//       setCookie("accessToken", accessToken, {
//         path: "/",
//         sameSite: "lax",
//         maxAge: expiresIn,
//       });
//       setCookie("businessId", businessAdmin.businessId, {
//         path: "/",
//         sameSite: "lax",
//       });
//       setCookie("id", businessAdmin.id, { path: "/", sameSite: "lax" });
//       setCookie("uuid", businessAdmin.uuid, { path: "/", sameSite: "lax" });
//       setCookie("firstName", businessAdmin.firstName, {
//         path: "/",
//         sameSite: "lax",
//       });
//       setCookie("lastName", businessAdmin.lastName, {
//         path: "/",
//         sameSite: "lax",
//       });
//       setCookie("email", businessAdmin.email, { path: "/", sameSite: "lax" });
//       setCookie("phoneNumber", businessAdmin.phoneNumber, {
//         path: "/",
//         sameSite: "lax",
//       });
//       setCookie("designation", businessAdmin.designation, {
//         path: "/",
//         sameSite: "lax",
//       });

//       // Clear tempToken
//       setCookie("tempToken", "", { path: "/", maxAge: 0 });

//       // -----------------------------
//       // PRINT API RESPONSE IMMEDIATELY
//       // -----------------------------
//       console.log("FROM API RESPONSE:");
//       console.log("accessToken:", accessToken);
//       console.log("id:", businessAdmin.id);
//       console.log("uuid:", businessAdmin.uuid);
//       console.log("firstName:", businessAdmin.firstName);
//       console.log("lastName:", businessAdmin.lastName);
//       console.log("email:", businessAdmin.email);
//       console.log("phoneNumber:", businessAdmin.phoneNumber);
//       console.log("designation:", businessAdmin.designation);
//       console.log("businessId:", businessAdmin.businessId);
//       setTimeout(() => {
//         console.log("⏳ About to navigate to /portal");
//         toast.success("Login successful");
//         navigate("/portal", { replace: true });
//       }, 500); // Increased
//     } catch (error: any) {
//       console.error("❌ VERIFY ERROR:", error);
//       toast.error(error.response?.data?.message || "OTP verification failed");
//     }
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gray-100">
//       <div className="bg-white p-6 rounded shadow w-full max-w-md">
//         <h2 className="text-2xl font-bold text-center mb-6">Verify OTP</h2>

//         {/* OTP INPUTS */}
//         <div className="flex justify-between gap-2 mb-6">
//           {otp.map((digit, index) => (
//             <input
//               key={index}
//               ref={(el) => (inputsRef.current[index] = el)}
//               type="text"
//               maxLength={1}
//               value={digit}
//               onChange={(e) => handleChange(e.target.value, index)}
//               onKeyDown={(e) => handleKeyDown(e, index)}
//               className="w-12 h-12 text-center text-xl border rounded focus:outline-none focus:border-blue-500"
//             />
//           ))}
//         </div>

//         {/* VERIFY BUTTON */}
//         <button
//           onClick={handleVerify}
//           className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition"
//         >
//           Verify & Login
//         </button>
//       </div>
//     </div>
//   );
// };

// export default BusinessTwoFALogin;

// import React, { useRef, useState } from "react";
// import axios from "axios";
// import { useCookies } from "react-cookie";
// import { useNavigate } from "react-router-dom";
// import { toast } from "react-toastify";
// import BASE_URL from "@/config/config";

// // Define type for businessAdmin
// interface BusinessAdmin {
//   id: number;
//   uuid: string;
//   firstName: string;
//   lastName: string;
//   email: string;
//   phoneNumber: string;
//   designation: string;
//   businessId: number;
// }

// interface VerifyResponseData {
//   accessToken: string;
//   expiresIn: number;
//   businessAdmin: BusinessAdmin;
// }

// const BusinessTwoFALogin: React.FC = () => {
//   const navigate = useNavigate();
//   console.log("Component rendered");

//   // Cookies - Unified "token" naming
//   const [cookies, setCookie] = useCookies([
//     "tempToken",
//     "token", // Changed from accessToken to token
//     "id",
//     "uuid",
//     "firstName",
//     "lastName",
//     "email",
//     "phoneNumber",
//     "designation",
//     "businessId",
//     "role"
//   ]);

//   // OTP state
//   const [otp, setOtp] = useState<string[]>(["", "", "", "", "", ""]);
//   const inputsRef = useRef<Array<HTMLInputElement | null>>([]);

//   // OTP handlers
//   const handleChange = (value: string, index: number) => {
//     if (!/^[0-9]?$/.test(value)) return;

//     const newOtp = [...otp];
//     newOtp[index] = value;
//     setOtp(newOtp);

//     if (value && index < 5) {
//       inputsRef.current[index + 1]?.focus();
//     }
//   };

//   const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
//     if (e.key === "Backspace" && !otp[index] && index > 0) {
//       inputsRef.current[index - 1]?.focus();
//     }
//   };

//   // Verify OTP
//   const handleVerify = async () => {
//     console.log("=== handleVerify STARTED ===");
//     const otpCode = otp.join("");

//     if (otpCode.length !== 6) {
//       console.log("OTP length invalid:", otpCode.length);
//       toast.error("Please enter 6-digit OTP");
//       return;
//     }

//     if (!cookies.tempToken) {
//       console.log("No tempToken found");
//       toast.error("Session expired. Please login again.");
//       navigate("/login");
//       return;
//     }

//     try {
//       const response = await axios.post<{
//         status: boolean;
//         data: VerifyResponseData;
//         message: string;
//       }>(`${BASE_URL}/api/v3/business-auth/verify-2fa-login`, {
//         tempToken: cookies.tempToken,
//         twoFactorCode: otpCode,
//       });

//       console.log("API Response received:", response.data);

//       if (!response.data.status) {
//         console.log("API returned false status:", response.data.message);
//         toast.error(response.data.message || "OTP verification failed");
//         return;
//       }

//       const { accessToken, expiresIn, businessAdmin } = response.data.data;
//       console.log("=== API SUCCESS ===");

//       // ---------------------------------------------------------
//       // STORE COOKIES (Changed accessToken -> token for the Guard)
//       // ---------------------------------------------------------
//       setCookie("token", accessToken, {
//         path: "/",
//         sameSite: "lax",
//         maxAge: expiresIn || 10800,
//       });

//       setCookie("businessId", businessAdmin.businessId, {
//         path: "/",
//         sameSite: "lax",
//       });
//       setCookie("id", businessAdmin.id, { path: "/", sameSite: "lax" });
//       setCookie("uuid", businessAdmin.uuid, { path: "/", sameSite: "lax" });
//       setCookie("firstName", businessAdmin.firstName, {
//         path: "/",
//         sameSite: "lax",
//       });
//       setCookie("lastName", businessAdmin.lastName, {
//         path: "/",
//         sameSite: "lax",
//       });
//       setCookie("email", businessAdmin.email, { path: "/", sameSite: "lax" });
//       setCookie("phoneNumber", businessAdmin.phoneNumber, {
//         path: "/",
//         sameSite: "lax",
//       });
//       setCookie("designation", businessAdmin.designation, {
//         path: "/",
//         sameSite: "lax",
//       });
//       setCookie("role", "BUSINESS", { path: "/", sameSite: "lax" });

//       // Clear tempToken
//       setCookie("tempToken", "", { path: "/", maxAge: 0 });

//       // LOGGING
//       console.log("FROM API RESPONSE (Verified):");
//       console.log("token (stored as token):", accessToken);

//       setTimeout(() => {
//         console.log("⏳ Navigating to /portal");
//         toast.success("Login successful");
//         navigate("/portal", { replace: true });
//       }, 500);

//     } catch (error: any) {
//       console.error("❌ VERIFY ERROR:", error);
//       toast.error(error.response?.data?.message || "OTP verification failed");
//     }
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gray-100">
//       <div className="bg-white p-6 rounded shadow w-full max-w-md">
//         <h2 className="text-2xl font-bold text-center mb-6">Verify OTP</h2>

//         <div className="flex justify-between gap-2 mb-6">
//           {otp.map((digit, index) => (
//             <input
//               key={index}
//               ref={(el) => (inputsRef.current[index] = el)}
//               type="text"
//               maxLength={1}
//               value={digit}
//               onChange={(e) => handleChange(e.target.value, index)}
//               onKeyDown={(e) => handleKeyDown(e, index)}
//               className="w-12 h-12 text-center text-xl border rounded focus:outline-none focus:border-blue-500"
//             />
//           ))}
//         </div>

//         <button
//           onClick={handleVerify}
//           className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition"
//         >
//           Verify & Login
//         </button>
//       </div>
//     </div>
//   );
// };

// export default BusinessTwoFALogin;

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

const BusinessTwoFALogin: React.FC = () => {
  const navigate = useNavigate();
  const [cookies, setCookie] = useCookies([
    "tempToken",
    "token",
    "id",
    "uuid",
    "firstName",
    "lastName",
    "email",
    "phoneNumber",
    "designation",
    "businessId",
    "role",
  ]);

  const [otp, setOtp] = useState<string[]>(["", "", "", "", "", ""]);
  const inputsRef = useRef<Array<HTMLInputElement | null>>([]);

  const handleChange = (value: string, index: number) => {
    if (!/^[0-9]?$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    if (value && index < 5) inputsRef.current[index + 1]?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };

  const handleVerify = async () => {
    const otpCode = otp.join("");
    if (otpCode.length !== 6) {
      toast.error("Please enter 6-digit OTP");
      return;
    }

    if (!cookies.tempToken) {
      toast.error("Session expired. Please login again.");
      navigate("/");
      return;
    }
    console.log(cookies.tempToken);

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
        toast.error(response.data.message || "OTP verification failed");
        return;
      }

      const { accessToken, expiresIn, businessAdmin } = response.data.data;

      // 1. STORE TOKEN
      setCookie("token", accessToken, {
        path: "/",
        sameSite: "lax",
        maxAge: expiresIn || 10800,
      });

      // 2. STORE ROLE (Essential for ProtectedRoute)
      setCookie("role", "BUSINESS", { path: "/", sameSite: "lax" });

      // 3. STORE DATA
      setCookie("businessId", businessAdmin.businessId, {
        path: "/",
        sameSite: "lax",
      });
      setCookie("id", businessAdmin.id, { path: "/", sameSite: "lax" });
      setCookie("firstName", businessAdmin.firstName, {
        path: "/",
        sameSite: "lax",
      });
      setCookie("email", businessAdmin.email, { path: "/", sameSite: "lax" });

      // 4. CLEANUP
      setCookie("tempToken", "", { path: "/", maxAge: 0 });

      toast.success("Login successful");
      navigate("/portal", { replace: true });
    } catch (error: any) {
      toast.error(error.response?.data?.message || "OTP verification failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-sm">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
          Business Verification
        </h2>
        <p className="text-sm text-center text-gray-500 mb-6">
          Enter the 6-digit code from your authenticator app.
        </p>

        <div className="flex justify-between gap-2 mb-8">
          {otp.map((digit, index) => (
            <input
              key={index}
              ref={(el) => (inputsRef.current[index] = el)}
              type="text"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(e.target.value, index)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              className="w-10 h-12 text-center text-2xl font-semibold border-2 rounded-md focus:border-blue-500 focus:outline-none transition-colors"
            />
          ))}
        </div>

        <button
          onClick={handleVerify}
          className="w-full bg-blue-600 text-white py-3 rounded-md font-semibold hover:bg-blue-700 transition-colors shadow-sm"
        >
          Verify & Access Portal
        </button>
      </div>
    </div>
  );
};

export default BusinessTwoFALogin;
