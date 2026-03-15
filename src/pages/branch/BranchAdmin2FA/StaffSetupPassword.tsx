// import React, { useState } from "react";
// import { useNavigate, useLocation } from "react-router-dom";
// import axios from "axios";
// import { Formik, Form, Field, ErrorMessage, FormikHelpers } from "formik";
// import * as Yup from "yup";
// import { IoMdEye, IoIosEyeOff } from "react-icons/io";
// import { useCookies } from "react-cookie";
// import BASE_URL from "@/config/config";

// /* ================= TYPES ================= */

// interface FormValues {
//   password: string;
//   confirmPassword: string;
// }

// interface Staff {
//   email?: string;
//   twoFactorEnabled?: boolean;
// }

// interface ApiResponseData {
//   tempToken?: string;
//   requiresTwoFactor?: boolean;
//   staff?: Staff;
// }

// interface ApiResponse {
//   status: boolean;
//   message: string;
//   data: ApiResponseData;
// }

// /* ======== VALIDATION ========= */

// const PasswordSchema = Yup.object({
//   password: Yup.string().required("Password is required"),
//   confirmPassword: Yup.string()
//     .oneOf([Yup.ref("password")], "Passwords must match")
//     .required("Confirm Password is required"),
// });

// /* ======== COMPONENT ======= */

// const StaffSetupPassword: React.FC = () => {
//   const navigate = useNavigate();
//   const location = useLocation();

//   const [, setCookie] = useCookies([
//     "tempToken",
//     "email",
//     "twoFactorEnabled",
//     "requiresTwoFactor",
//   ]);

//   const searchParams = new URLSearchParams(location.search);
//   const token = searchParams.get("token");

//    if(!token){
//    console.log("INVALID TOKEN OR MISSING TOKEN");
//   } else {
//     console.log("active token ", token);
//   }

//   const [showPassword, setShowPassword] = useState(false);
//   const [showConfirmPassword, setShowConfirmPassword] = useState(false);

//   const handleSubmit = async (
//     values: FormValues,
//     { setSubmitting, setStatus }: FormikHelpers<FormValues>
//   ) => {
//     if (!token) {
//       setStatus("Invalid or missing token.");
//       setSubmitting(false);
//       return;
//     }

//     try {
//       const response = await axios.post<ApiResponse>(
//         `${BASE_URL}/api/v3/staff-auth/set-password`,
//         {
//           token,
//           password: values.password,
//           confirmPassword: values.confirmPassword,
//         }
//       );

//       console.log("FULL API RESPONSE:", response.data);

//       if (!response.data.status) {
//         setStatus(response.data.message);
//         return;
//       }

//       /* ===== EXTRACT DATA ===== */
//       const tempToken = response.data.data.tempToken;
//       const email = response.data.data.staff?.email;
//       const twoFactorEnabled = response.data.data.staff?.twoFactorEnabled;
//       const requiresTwoFactor = response.data.data.requiresTwoFactor;

//       /* ===== STORE COOKIES LIKE LOGIN ===== */
//       if (tempToken) {
//         setCookie("tempToken", tempToken, {
//           // path: "/",
//           // secure: true,
//           // sameSite: "strict",
//           path: "/",
//           sameSite: "lax",
//         });
//       }

//       if (email) {
//         setCookie("email", email, {
//           // path: "/",
//           // secure: true,
//           // sameSite: "strict",

//           path: "/",
//           sameSite: "lax",
//         });
//       }

//       if (twoFactorEnabled !== undefined) {
//         setCookie("twoFactorEnabled", twoFactorEnabled, {
//           // path: "/",
//           // secure: true,
//           // sameSite: "strict",
//           path: "/",
//           sameSite: "lax",
//         });
//       }

//       if (requiresTwoFactor !== undefined) {
//         setCookie("requiresTwoFactor", requiresTwoFactor, {
//           // path: "/",
//           // secure: true,
//           // sameSite: "strict",
//           path: "/",
//           sameSite: "lax",
//         });
//       }

//       if (requiresTwoFactor) {
//         navigate("/generateqr");
//       } else {
//         navigate("/"); // redirect to login if 2FA is not required
//       }

//       // navigate("/generateqr");
//     } catch (error: any) {
//       setStatus(error.response?.data?.message || "Server Error");
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center">
//       <div className="max-w-md w-full p-6 border rounded shadow">
//         <h2 className="text-2xl font-bold mb-4 text-center">
//           Set New Password
//         </h2>

//         {/* NO GENERIC: Works with Vite + SWC */}
//         <Formik
//           initialValues={{ password: "", confirmPassword: "" }}
//           validationSchema={PasswordSchema}
//           onSubmit={handleSubmit}
//         >
//           {({ isSubmitting, status }) => (
//             <Form>
//               {/* Password */}
//               <div className="mb-4">
//                 <label className="block mb-1 font-semibold">New Password</label>
//                 <div className="relative">
//                   <Field
//                     type={showPassword ? "text" : "password"}
//                     name="password"
//                     className="w-full px-3 py-2 border rounded"
//                   />
//                   <button
//                     type="button"
//                     onClick={() => setShowPassword(!showPassword)}
//                     className="absolute right-3 top-1/2 -translate-y-1/2"
//                   >
//                     {showPassword ? <IoMdEye /> : <IoIosEyeOff />}
//                   </button>
//                 </div>
//                 <ErrorMessage
//                   name="password"
//                   component="div"
//                   className="text-red-500 text-sm"
//                 />
//               </div>

//               {/* Confirm Password */}
//               <div className="mb-4">
//                 <label className="block mb-1 font-semibold">
//                   Confirm Password
//                 </label>
//                 <div className="relative">
//                   <Field
//                     type={showConfirmPassword ? "text" : "password"}
//                     name="confirmPassword"
//                     className="w-full px-3 py-2 border rounded"
//                   />
//                   <button
//                     type="button"
//                     onClick={() => setShowConfirmPassword(!showConfirmPassword)}
//                     className="absolute right-3 top-1/2 -translate-y-1/2"
//                   >
//                     {showConfirmPassword ? <IoMdEye /> : <IoIosEyeOff />}
//                   </button>
//                 </div>
//                 <ErrorMessage
//                   name="confirmPassword"
//                   component="div"
//                   className="text-red-500 text-sm"
//                 />
//               </div>

//               {status && <div className="text-red-500 mb-3">{status}</div>}

//               <button
//                 type="submit"
//                 disabled={isSubmitting}
//                 className="w-full bg-blue-500 text-white py-2 rounded"
//               >
//                 {isSubmitting ? "Setting Password..." : "Set Password"}
//               </button>
//             </Form>
//           )}
//         </Formik>
//       </div>
//     </div>
//   );
// };

// export default StaffSetupPassword;







import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { IoMdEye, IoIosEyeOff } from "react-icons/io";
import { useCookies } from "react-cookie";
import BASE_URL from "@/config/config";

interface FormValues {
  password: string;
  confirmPassword: string;
}

interface ValidateResponse {
  valid: boolean;
  message: string;
}

interface SetPasswordResponse {
  status: boolean;
  message: string;
  data: {
    tempToken?: string;
    requiresTwoFactor?: boolean;
    staff?: {
      email?: string;
      twoFactorEnabled?: boolean;
    };
  };
}

const PasswordSchema = Yup.object({
  password: Yup.string()
    .min(8, "Password must be at least 8 characters")
    .required("Password is required"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password")], "Passwords must match")
    .required("Confirm password is required"),
});

const StaffSetupPassword = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [, setCookie] = useCookies([
    "tempToken",
    "email",
    "twoFactorEnabled",
    "requiresTwoFactor",
  ]);

  const token = new URLSearchParams(location.search).get("token");

  const [isChecking, setIsChecking] = useState(true);
  const [isValid, setIsValid] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    if (!token) {
      setErrorMessage("No setup token found in the URL.");
      setIsChecking(false);
      return;
    }

    let isCurrent = true;

    (async () => {
      try {
        const res = await axios.get<ValidateResponse>(
          `${BASE_URL}/api/v3/staff-auth/validate-setup-link`,
          {
            params: { token },
          }
        );

        if (isCurrent) {
          setIsValid(res.data.valid);
          setErrorMessage(
            res.data.valid ? "" : res.data.message || "Invalid setup link"
          );
        }

        // Optional: keep for debugging
        console.log("Validate API response:", res.data);
      } catch (err: any) {
        if (isCurrent) {
          setIsValid(false);
          setErrorMessage(
            err.response?.data?.message ||
              "Cannot validate setup link. It may be expired or invalid."
          );
        }
      } finally {
        if (isCurrent) {
          setIsChecking(false);
        }
      }
    })();

    return () => {
      isCurrent = false;
    };
  }, [token]);

  const handleSubmit = async (
    values: FormValues,
    { setSubmitting, setStatus }: any
  ) => {
    if (!token) {
      setStatus("Setup token is missing");
      setSubmitting(false);
      return;
    }

    try {
      const { data } = await axios.post<SetPasswordResponse>(
        `${BASE_URL}/api/v3/staff-auth/set-password`,
        {
          token,
          password: values.password,
          confirmPassword: values.confirmPassword,
        }
      );

      if (!data.status) {
        setStatus(data.message || "Failed to set password");
        return;
      }

      const { tempToken, staff, requiresTwoFactor } = data.data;

      if (tempToken) {
        setCookie("tempToken", tempToken, { 
          // path: "/", 
          // sameSite: "lax" 
        });
      }
      if (staff?.email) {
        setCookie("email", staff.email, { 
          // path: "/", 
          // sameSite: "lax"
         });
      }
      if (staff?.twoFactorEnabled !== undefined) {
        setCookie("twoFactorEnabled", staff.twoFactorEnabled, {
          // path: "/",
          // sameSite: "lax",
        });
      }
      if (requiresTwoFactor !== undefined) {
        setCookie("requiresTwoFactor", requiresTwoFactor, {
          // path: "/",
          // sameSite: "lax",
        });
      }

      // Redirect based on 2FA requirement
      navigate(requiresTwoFactor ? "/generateqr" : "/dashboard"); // ← changed to /dashboard (more common)
    } catch (err: any) {
      setStatus(
        err.response?.data?.message ||
          "Something went wrong. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  // ────────────────────────────────────────────────
  // Render
  // ────────────────────────────────────────────────

  if (isChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-lg font-medium text-gray-700">
          Checking link validity...
        </div>
      </div>
    );
  }

  if (!isValid) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <div className="max-w-md w-full bg-white border border-red-200 rounded-xl shadow-lg p-8 text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">
            Invalid or Expired Link
          </h2>
          <p className="text-gray-700 mb-6">{errorMessage}</p>
          <p className="text-sm text-gray-500">
            Please request a new password setup link from your administrator.
          </p>
        </div>
      </div>
    );
  }

  // ── Valid link → show password form ───────────────────────────
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="max-w-md w-full bg-white border rounded-xl shadow-lg p-8">
        <h1 className="text-2xl font-bold text-center text-gray-800 mb-8">
          Set Your Password
        </h1>

        <Formik
          initialValues={{ password: "", confirmPassword: "" }}
          validationSchema={PasswordSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting, status }) => (
            <Form className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  New Password
                </label>
                <div className="relative">
                  <Field
                    type={showPassword ? "text" : "password"}
                    name="password"
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showPassword ? (
                      <IoMdEye size={22} />
                    ) : (
                      <IoIosEyeOff size={22} />
                    )}
                  </button>
                </div>
                <ErrorMessage
                  name="password"
                  component="div"
                  className="mt-1.5 text-sm text-red-600"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Confirm Password
                </label>
                <div className="relative">
                  <Field
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirmPassword"
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showConfirmPassword ? (
                      <IoMdEye size={22} />
                    ) : (
                      <IoIosEyeOff size={22} />
                    )}
                  </button>
                </div>
                <ErrorMessage
                  name="confirmPassword"
                  component="div"
                  className="mt-1.5 text-sm text-red-600"
                />
              </div>

              {status && (
                <div className="text-red-600 text-center font-medium py-2">
                  {status}
                </div>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full bg-blue-600 text-white py-3 rounded-lg font-medium transition
                  ${
                    isSubmitting
                      ? "opacity-70 cursor-wait"
                      : "hover:bg-blue-700 active:bg-blue-800"
                  }`}
              >
                {isSubmitting ? "Setting password..." : "Set Password"}
              </button>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default StaffSetupPassword;