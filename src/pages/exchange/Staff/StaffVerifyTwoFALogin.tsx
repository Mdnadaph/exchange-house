// import React, { useRef, useState } from "react";
// import axios from "axios";
// import { useCookies } from "react-cookie";
// import { useNavigate } from "react-router-dom";
// import { toast } from "react-toastify";
// import BASE_URL from "@/config/config";

// const VerifyTwoFALogin: React.FC = () => {
//   const navigate = useNavigate();

//   const [cookies, setCookie] = useCookies([
//     "tempToken",
//     "Token",
//     "id",
//     "uuid",
//     "fullName",
//     "email",
//     "role",
//     "contactNumber",
//     "branchId",
//     "roleName",
//   ]);

//   const [otp, setOtp] = useState<string[]>(["", "", "", "", "", ""]);
//   const [otpError, setOtpError] = useState<string>("");

//   const inputsRef = useRef<Array<HTMLInputElement | null>>([]);

//   /* =========================
//       HANDLE OTP INPUT
//   ========================== */
//   const handleChange = (value: string, index: number) => {
//     if (!/^[0-9]?$/.test(value)) return;

//     const newOtp = [...otp];
//     newOtp[index] = value;
//     setOtp(newOtp);
//     setOtpError("");

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
//       VERIFY OTP
//   ========================== */
//   const handleVerify = async () => {
//     const otpCode = otp.join("");
//     setOtpError("");

//     if (otpCode.length !== 6) {
//       setOtpError("Please enter a 6-digit OTP");
//       toast.error("Please enter a 6-digit OTP");
//       return;
//     }

//     if (!cookies.tempToken) {
//       toast.error("Session expired. Please login again.");
//       navigate("/login");
//       return;
//     }

//     try {
//       const response = await axios.post(
//         `${BASE_URL}/api/v3/staff-auth/verify-2fa-login`,
//         {
//           tempToken: cookies.tempToken,
//           twoFactorCode: otpCode,
//         },
//       );

//       if (!response.data.status) {
//         setOtpError("Invalid or wrong OTP");
//         toast.error(response.data.message || "Invalid or wrong OTP");

//         setOtp(["", "", "", "", "", ""]);
//         inputsRef.current[0]?.focus();
//         return;
//       }

//       const { accessToken, expiresIn, staff } = response.data.data;

//       // 2. PRINT DATA TO CONSOLE
//       console.log("--- Login Success Data ---");
//       console.log("Access Token:", accessToken);
//       console.log("Staff Details:", staff);
//       // Individual fields as requested:
//       console.log("ID:", staff.id);
//       console.log("UUID:", staff.uuid);
//       console.log("Full Name:", staff.fullName);
//       console.log("Email:", staff.email);
//       console.log("Branch ID:", staff.branchId);
//       console.log("Role Name:", staff.roleName);
//       console.log("Contact Number:", staff.contactNumber);
//       console.log("--------------------------");

//       /* ===== STORE TOKEN ===== */
//       setCookie("Token", accessToken, {
//         path: "/",
//         // sameSite: "lax",
//         maxAge: expiresIn || 10800,
//       });

//       /* ===== STORE STAFF DATA ===== */
//       setCookie("id", staff.id, {
//         path: "/",
//         //  sameSite: "lax"
//       });
//       setCookie("uuid", staff.uuid, {
//         path: "/",
//         //  sameSite: "lax"
//       });
//       setCookie("fullName", staff.fullName, {
//         path: "/",
//         //  sameSite: "lax"
//       });
//       setCookie("email", staff.email, {
//         path: "/",
//         //  sameSite: "lax"
//       });

//       setCookie("branchId", staff.branchId, {
//         path: "/",
//         // sameSite: "lax"
//       });
//       setCookie("roleName", staff.roleName, {
//         path: "/",
//         // sameSite: "lax"
//       });

//       setCookie("role", "STAFF", {
//         path: "/",
//         //  sameSite: "lax"
//       });
//       setCookie("contactNumber", staff.contactNumber, {
//         path: "/",
//         // sameSite: "lax",
//       });

//       /* ===== CLEAR TEMP TOKEN ===== */
//       setCookie("tempToken", "", { path: "/", maxAge: 0 });

//       toast.success("Login successful");
//       navigate("/branch", { replace: true });
//     } catch (error: any) {
//       console.error("❌ VERIFY ERROR:", error);

//       setOtpError("Invalid or wrong OTP");
//       toast.error(error.response?.data?.message || "Invalid or wrong OTP");

//       setOtp(["", "", "", "", "", ""]);
//       inputsRef.current[0]?.focus();
//     }
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gray-100">
//       <div className="bg-white p-6 rounded shadow w-full max-w-md">
//         <h2 className="text-2xl font-bold text-center mb-6">
//           Staff Verification
//         </h2>
//         <p className="text-sm text-center text-gray-500 mb-6">
//           Enter the 6-digit code from your authenticator app.
//         </p>

//         {/* OTP INPUTS */}
//         <div className="flex justify-between gap-2 mb-2">
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

//         {/* ERROR MESSAGE */}
//         {otpError && (
//           <p className="text-red-500 text-sm text-center mt-4">{otpError}</p>
//         )}

//         {/* VERIFY BUTTON */}
//         <button
//           onClick={handleVerify}
//           className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition mt-3"
//         >
//           Verify & Login
//         </button>
//       </div>
//     </div>
//   );
// };

// export default VerifyTwoFALogin;


import React, { useRef, useState } from "react";
import axios from "axios";
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import BASE_URL from "@/config/config";

const VerifyTwoFALogin: React.FC = () => {
  const navigate = useNavigate();

  const [cookies, setCookie] = useCookies([
    "tempToken",
    "token",
    "id",
    "uuid",
    "fullName",
    "email",
    "role",
    "contactNumber",
    "branchId",
    "roleName",
  ]);

  const [otp, setOtp] = useState<string[]>(["", "", "", "", "", ""]);
  const [otpError, setOtpError] = useState<string>("");

  const inputsRef = useRef<Array<HTMLInputElement | null>>([]);

  /* =========================
      HANDLE OTP INPUT
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
    setOtpError("");

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
      const response = await axios.post(
        `${BASE_URL}/api/v3/staff-auth/verify-2fa-login`,
        {
          tempToken: cookies.tempToken,
          twoFactorCode: otpCode,
        },
      );

      if (!response.data.status) {
        setOtpError("Invalid or wrong OTP");
        toast.error(response.data.message || "Invalid or wrong OTP");

        setOtp(["", "", "", "", "", ""]);
        inputsRef.current[0]?.focus();
        return;
      }

      const { accessToken, expiresIn, staff } = response.data.data;

      // 2. PRINT DATA TO CONSOLE
      console.log("--- Login Success Data ---");
      console.log("Access Token:", accessToken);
      console.log("Staff Details:", staff);
      // Individual fields as requested:
      console.log("ID:", staff.id);
      console.log("UUID:", staff.uuid);
      console.log("Full Name:", staff.fullName);
      console.log("Email:", staff.email);
      console.log("Branch ID:", staff.branchId);
      console.log("Role Name:", staff.roleName);
      console.log("Contact Number:", staff.contactNumber);
      console.log("--------------------------");

      /* ===== STORE TOKEN ===== */
      setCookie("token", accessToken, {
        path: "/",
        // sameSite: "lax",
        maxAge: expiresIn || 10800,
      });

      /* ===== STORE STAFF DATA ===== */
      setCookie("id", staff.id, { path: "/" });
      setCookie("uuid", staff.uuid, { path: "/" });
      setCookie("fullName", staff.fullName, { path: "/" });
      setCookie("email", staff.email, { path: "/" });
      setCookie("branchId", staff.branchId, { path: "/" });
      setCookie("roleName", staff.roleName, { path: "/" });
      setCookie("role", staff.roleName, { path: "/" });
      setCookie("contactNumber", staff.contactNumber, { path: "/" });

      /* ===== CLEAR TEMP TOKEN ===== */
      setCookie("tempToken", "", { path: "/", maxAge: 0 });

      toast.success("Login successful");
      navigate("/branch", { replace: true });
    } catch (error: any) {
      console.error("❌ VERIFY ERROR:", error);

      setOtpError("Invalid or wrong OTP");
      toast.error(error.response?.data?.message || "Invalid or wrong OTP");

      setOtp(["", "", "", "", "", ""]);
      inputsRef.current[0]?.focus();
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-6 rounded shadow w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-6">
          Staff Verification
        </h2>
        <p className="text-sm text-center text-gray-500 mb-6">
          Enter the 6-digit code from your authenticator app.
        </p>

        {/* OTP INPUTS */}
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

        {/* ERROR MESSAGE */}
        {otpError && (
          <p className="text-red-500 text-sm text-center mt-4">{otpError}</p>
        )}

        {/* VERIFY BUTTON */}
        <button
          onClick={handleVerify}
          className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition mt-3"
        >
          Verify & Login
        </button>
      </div>
    </div>
  );
};

export default VerifyTwoFALogin;