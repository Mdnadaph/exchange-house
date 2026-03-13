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

/* ======== VALIDATION ========= */

const PasswordSchema = Yup.object({
  password: Yup.string().required("Password is required"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password")], "Passwords must match")
    .required("Confirm Password is required"),
});

/* ======== COMPONENT ======= */

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

   if(!token){
   console.log("INVALID TOKEN OR MISSING TOKEN");
  } else {
    console.log("active token ", token);
  }

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








// import React, { useState, useEffect } from "react";
// import { useNavigate, useLocation } from "react-router-dom";
// import axios from "axios";
// import { Formik, Form, Field, ErrorMessage, FormikHelpers } from "formik";
// import * as Yup from "yup";
// import { IoMdEye, IoIosEyeOff } from "react-icons/io";
// import { useCookies } from "react-cookie";
// import BASE_URL from "@/config/config";

// interface FormValues {
//   password: string;
//   confirmPassword: string;
// }

// interface Staff {
//   email?: string;
//   twoFactorEnabled?: boolean;
//   active?: boolean;
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

// const PasswordSchema = Yup.object({
//   password: Yup.string().required("Password is required"),
//   confirmPassword: Yup.string()
//     .oneOf([Yup.ref("password")], "Passwords must match")
//     .required("Confirm Password is required"),
// });

// const StaffSetupPassword: React.FC = () => {
//   const navigate = useNavigate();
//   const location = useLocation();
//   const [, setCookie] = useCookies(["tempToken", "email", "twoFactorEnabled", "requiresTwoFactor"]);

//   const searchParams = new URLSearchParams(location.search);
//   const token = searchParams.get("token");

//   const [showPassword, setShowPassword] = useState(false);
//   const [showConfirmPassword, setShowConfirmPassword] = useState(false);

//   const [checking, setChecking] = useState(true);
//   const [isValid, setIsValid] = useState(false);
//   const [message, setMessage] = useState<string | null>(null);

//   useEffect(() => {
//     if (!token) {
//       setMessage("Invalid or missing link. Please request a new one.");
//       setChecking(false);
//       return;
//     }

//     const validateToken = async () => {
//       try {
//         // We only send dummy password to check if token is usable
//         const res = await axios.post<ApiResponse>(
//           `${BASE_URL}/api/v3/staff-auth/set-password`,
//           {
//             token,
//             password: "dummy-check-987654",
//             confirmPassword: "dummy-check-987654",
//           }
//         );

//         if (res.data.status === true) {
//           // Token looks usable
//           setIsValid(true);
//         } else {
//           // Token rejected (expired, used, invalid...)
//           setMessage(
//             res.data.message ||
//             "This link has expired or is no longer valid. Please request a new link."
//           );
//         }
//       } catch (err: any) {
//         const msg =
//           err.response?.data?.message ||
//           err.response?.status === 401 ? "This link has expired or is invalid." :
//           "Something went wrong. Please request a new link.";

//         setMessage(msg);
//       } finally {
//         setChecking(false);
//       }
//     };

//     validateToken();
//   }, [token]);

//   const handleSubmit = async (
//     values: FormValues,
//     { setSubmitting, setStatus }: FormikHelpers<FormValues>
//   ) => {
//     try {
//       const response = await axios.post<ApiResponse>(
//         `${BASE_URL}/api/v3/staff-auth/set-password`,
//         {
//           token,
//           password: values.password,
//           confirmPassword: values.confirmPassword,
//         }
//       );

//       if (!response.data.status) {
//         setStatus(response.data.message || "Failed to set password");
//         return;
//       }

//       const { tempToken, requiresTwoFactor } = response.data.data;
//       const staff = response.data.data.staff;

//       if (tempToken) setCookie("tempToken", tempToken, { path: "/", sameSite: "lax" });
//       if (staff?.email) setCookie("email", staff.email, { path: "/", sameSite: "lax" });
//       if (staff?.twoFactorEnabled !== undefined) {
//         setCookie("twoFactorEnabled", staff.twoFactorEnabled, { path: "/", sameSite: "lax" });
//       }
//       if (requiresTwoFactor !== undefined) {
//         setCookie("requiresTwoFactor", requiresTwoFactor, { path: "/", sameSite: "lax" });
//       }

//       if (requiresTwoFactor) {
//         navigate("/generateqr");
//       } else {
//         navigate("/");
//       }
//     } catch (error: any) {
//       setStatus(
//         error.response?.data?.message ||
//         (error.response?.status === 401 ? "This link has expired." : "Server error")
//       );
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   // ─── Rendering states ───

//   if (checking) {
//     return (
//       <div className="min-h-screen flex items-center justify-center">
//         <div className="text-lg font-medium">Verifying link...</div>
//       </div>
//     );
//   }

//   if (message) {
//     return (
//       <div className="min-h-screen flex items-center justify-center bg-gray-50">
//         <div className="max-w-md w-full p-8 bg-white rounded-lg shadow-lg text-center border">
//           <h2 className="text-2xl font-bold text-red-600 mb-5">Link Expired or Invalid</h2>
//           {/* <p className="text-gray-700 text-lg mb-8 leading-relaxed">{message}</p> */}
//           <p>This link has expired. Please request a new link and try again.</p>
//           {/* <button
//             onClick={() => navigate("/forgot-password")}
//             className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition"
//           >
//             Request New Link
//           </button> */}
//         </div>
//       </div>
//     );
//   }

//   // Valid token → show form
//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gray-50">
//       <div className="max-w-md w-full p-8 bg-white rounded-lg shadow-lg border">
//         <h2 className="text-2xl font-bold mb-6 text-center">Set New Password</h2>

//         <Formik
//           initialValues={{ password: "", confirmPassword: "" }}
//           validationSchema={PasswordSchema}
//           onSubmit={handleSubmit}
//         >
//           {({ isSubmitting, status }) => (
//             <Form>
//               <div className="mb-5">
//                 <label className="block mb-2 font-medium">New Password</label>
//                 <div className="relative">
//                   <Field
//                     type={showPassword ? "text" : "password"}
//                     name="password"
//                     className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
//                   />
//                   <button
//                     type="button"
//                     onClick={() => setShowPassword(!showPassword)}
//                     className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600"
//                   >
//                     {showPassword ? <IoMdEye size={20} /> : <IoIosEyeOff size={20} />}
//                   </button>
//                 </div>
//                 <ErrorMessage name="password" component="div" className="text-red-500 text-sm mt-1" />
//               </div>

//               <div className="mb-6">
//                 <label className="block mb-2 font-medium">Confirm Password</label>
//                 <div className="relative">
//                   <Field
//                     type={showConfirmPassword ? "text" : "password"}
//                     name="confirmPassword"
//                     className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
//                   />
//                   <button
//                     type="button"
//                     onClick={() => setShowConfirmPassword(!showConfirmPassword)}
//                     className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600"
//                   >
//                     {showConfirmPassword ? <IoMdEye size={20} /> : <IoIosEyeOff size={20} />}
//                   </button>
//                 </div>
//                 <ErrorMessage name="confirmPassword" component="div" className="text-red-500 text-sm mt-1" />
//               </div>

//               {status && <div className="text-red-600 mb-4 text-center font-medium">{status}</div>}

//               <button
//                 type="submit"
//                 disabled={isSubmitting}
//                 className="w-full bg-blue-600 text-white py-3 rounded font-medium hover:bg-blue-700 disabled:opacity-50 transition"
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