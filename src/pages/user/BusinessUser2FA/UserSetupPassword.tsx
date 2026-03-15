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

// interface BusinessUser {
//   id?: number;
//   email?: string;
//   fullName?: string | null;
//   // Other fields can be added if needed, but keeping minimal for cookie usage
// }

// interface ApiResponseData {
//   tempToken?: string;
//   requiresTwoFactor?: boolean;
//   businessUser?: BusinessUser;
//   // Other fields like twoFactorMethod, etc., can be added if needed
// }

// interface ApiResponse {
//   status: boolean;
//   message: string;
//   data: ApiResponseData;
// }

// /* ================= VALIDATION ================= */

// const PasswordSchema = Yup.object({
//   password: Yup.string()
//     .required("Password is required"),
//   confirmPassword: Yup.string()
//     .oneOf([Yup.ref("password")], "Passwords must match")
//     .required("Confirm Password is required"),
// });

// /* ================= COMPONENT ================= */

// const UserSetupPassword: React.FC = () => {
//   const navigate = useNavigate();
//   const location = useLocation();

//   const [, setCookie] = useCookies([
//     "tempToken",
//     "businessRequiresTwoFactor",
//     "businessId",
//     "businessEmail",
//     "businessFirstName",
//     "businessLastName",
//   ]);

//   const searchParams = new URLSearchParams(location.search);
//   const token = searchParams.get("token");

//   const [showPassword, setShowPassword] = useState(false);
//   const [showConfirmPassword, setShowConfirmPassword] = useState(false);

//   const handleSubmit = async (
//     values: FormValues,
//     { setSubmitting, setStatus }: FormikHelpers<FormValues>
//   ) => {
//     if (!token) {
//       setStatus("Invalid or expired password setup link.");
//       setSubmitting(false);
//       return;
//     }

//     try {
//       const response = await axios.post<ApiResponse>(
//         `${BASE_URL}/api/v3/business-user-auth/set-password`,
//         {
//           token,
//           password: values.password,
//           confirmPassword: values.confirmPassword,
//         }
//       );

//       if (!response.data.status) {
//         setStatus(response.data.message);
//         return;
//       }

//       const { tempToken, requiresTwoFactor, businessUser } =
//         response.data.data;

//       /* ===== STORE COOKIES SAFELY ===== */

//       if (tempToken) {
//         setCookie("tempToken", tempToken, {
//           path: "/",
//           sameSite: "lax"
//         });
//       }

//       if (requiresTwoFactor !== undefined) {
//         setCookie("businessRequiresTwoFactor", requiresTwoFactor, {
//           path: "/",
//           sameSite: "lax"
//         });
//       }

//       if (businessUser?.id !== undefined) {
//         setCookie("businessId", businessUser.id, {
//           path: "/",
//           sameSite: "lax"
//         });
//       }

//       if (businessUser?.email) {
//         setCookie("businessEmail", businessUser.email, {
//           path: "/",
//           sameSite: "lax"
//         });
//       }

//       // Handle firstName and lastName from fullName if available
//       if (businessUser?.fullName) {
//         const nameParts = businessUser.fullName.split(" ");
//         const firstName = nameParts[0] || "";
//         const lastName = nameParts.slice(1).join(" ") || "";
//         setCookie("businessFirstName", firstName, {
//           path: "/",
//           sameSite: "lax"
//         });
//         setCookie("businessLastName", lastName, {
//           path: "/",
//           sameSite: "lax"
//         });
//       } else {
//         // If fullName is null or undefined, set empty strings or skip as needed
//         setCookie("businessFirstName", "", {
//           path: "/",
//           sameSite: "lax"
//         });
//         setCookie("businessLastName", "", {
//           path: "/",
//           sameSite: "lax"
//         });
//       }

//       console.log("Cookies saved successfully");

//       /* ===== NAVIGATION ===== */
//       if (requiresTwoFactor) {
//         navigate("/business-user-generateqr");
//       } else {
//         navigate("/");
//       }
//     } catch (error: unknown) {
//       console.error("Set Password Error:", error);

//       if (axios.isAxiosError(error)) {
//         if (error.response?.data?.message) {
//           setStatus(error.response.data.message);
//         } else if (error.response) {
//           setStatus(`Request failed (${error.response.status})`);
//         } else {
//           setStatus("Network error. Please try again.");
//         }
//       } else {
//         setStatus("Unexpected error occurred.");
//       }
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

//         <Formik
//           initialValues={{ password: "", confirmPassword: "" }}
//           validationSchema={PasswordSchema}
//           onSubmit={handleSubmit}
//         >
//           {({ isSubmitting, status, setStatus }) => (
//             <Form onChange={() => status && setStatus(undefined)}>
//               {/* Password */}
//               <div className="mb-4">
//                 <label className="block mb-1 font-semibold">
//                   New Password
//                 </label>
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
//                     onClick={() =>
//                       setShowConfirmPassword(!showConfirmPassword)
//                     }
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

//               {status && (
//                 <div className="text-red-500 mb-3">{status}</div>
//               )}

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

// export default UserSetupPassword;




import React, { useState, useEffect } from "react";
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

interface BusinessUser {
  id?: number;
  email?: string;
  fullName?: string | null;
  // Other fields can be added if needed, but keeping minimal for cookie usage
}

interface ApiResponseData {
  tempToken?: string;
  requiresTwoFactor?: boolean;
  businessUser?: BusinessUser;
  // Other fields like twoFactorMethod, etc., can be added if needed
}

interface ApiResponse {
  status: boolean;
  message: string;
  data: ApiResponseData;
}

interface ValidateResponse {
  valid: boolean;
  message: string;
}

/* ================= VALIDATION ================= */

const PasswordSchema = Yup.object({
  password: Yup.string()
    .required("Password is required"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password")], "Passwords must match")
    .required("Confirm Password is required"),
});

/* ================= COMPONENT ================= */

const UserSetupPassword: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [, setCookie] = useCookies([
    "tempToken",
    "businessRequiresTwoFactor",
    "businessId",
    "businessEmail",
    "businessFirstName",
    "businessLastName",
  ]);

  const searchParams = new URLSearchParams(location.search);
  const token = searchParams.get("token");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // ── NEW STATES FOR LINK VALIDATION ───────────────────────────────
  const [isChecking, setIsChecking] = useState(true);
  const [isValid, setIsValid] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // ── VALIDATE SETUP LINK ─────────────────────────────────────────
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
          `${BASE_URL}/api/v3/business-user-auth/validate-setup-link`,
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
    { setSubmitting, setStatus }: FormikHelpers<FormValues>
  ) => {
    if (!token) {
      setStatus("Invalid or expired password setup link.");
      setSubmitting(false);
      return;
    }

    try {
      const response = await axios.post<ApiResponse>(
        `${BASE_URL}/api/v3/business-user-auth/set-password`,
        {
          token,
          password: values.password,
          confirmPassword: values.confirmPassword,
        }
      );

      if (!response.data.status) {
        setStatus(response.data.message);
        return;
      }

      const { tempToken, requiresTwoFactor, businessUser } =
        response.data.data;

      /* ===== STORE COOKIES SAFELY ===== */

      if (tempToken) {
        setCookie("tempToken", tempToken, {
          // path: "/",
          // sameSite: "lax"
        });
      }

      if (requiresTwoFactor !== undefined) {
        setCookie("businessRequiresTwoFactor", requiresTwoFactor, {
          // path: "/",
          // sameSite: "lax"
        });
      }

      if (businessUser?.id !== undefined) {
        setCookie("businessId", businessUser.id, {
          // path: "/",
          // sameSite: "lax"
        });
      }

      if (businessUser?.email) {
        setCookie("businessEmail", businessUser.email, {
          // path: "/",
          // sameSite: "lax"
        });
      }

      // Handle firstName and lastName from fullName if available
      if (businessUser?.fullName) {
        const nameParts = businessUser.fullName.split(" ");
        const firstName = nameParts[0] || "";
        const lastName = nameParts.slice(1).join(" ") || "";
        setCookie("businessFirstName", firstName, {
          // path: "/",
          // sameSite: "lax"
        });
        setCookie("businessLastName", lastName, {
          // path: "/",
          // sameSite: "lax"
        });
      } else {
        // If fullName is null or undefined, set empty strings or skip as needed
        setCookie("businessFirstName", "", {
          // path: "/",
          // sameSite: "lax"
        });
        setCookie("businessLastName", "", {
          // path: "/",
          // sameSite: "lax"
        });
      }

      console.log("Cookies saved successfully");

      /* ===== NAVIGATION ===== */
      if (requiresTwoFactor) {
        navigate("/business-user-generateqr");
      } else {
        navigate("/");
      }
    } catch (error: unknown) {
      console.error("Set Password Error:", error);

      if (axios.isAxiosError(error)) {
        if (error.response?.data?.message) {
          setStatus(error.response.data.message);
        } else if (error.response) {
          setStatus(`Request failed (${error.response.status})`);
        } else {
          setStatus("Network error. Please try again.");
        }
      } else {
        setStatus("Unexpected error occurred.");
      }
    } finally {
      setSubmitting(false);
    }
  };

  // ── RENDERING LOGIC ─────────────────────────────────────────────

  if (isChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg font-medium">Checking link validity...</div>
      </div>
    );
  }

  if (!isValid) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white border rounded shadow-lg p-8 text-center">
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

  // ── VALID LINK → SHOW FORM (your original form below) ───────────

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="max-w-md w-full p-6 border rounded shadow">
        <h2 className="text-2xl font-bold mb-4 text-center">
          Set New Password
        </h2>

        <Formik
          initialValues={{ password: "", confirmPassword: "" }}
          validationSchema={PasswordSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting, status, setStatus }) => (
            <Form onChange={() => status && setStatus(undefined)}>
              {/* Password */}
              <div className="mb-4">
                <label className="block mb-1 font-semibold">
                  New Password
                </label>
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
                    onClick={() =>
                      setShowConfirmPassword(!showConfirmPassword)
                    }
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

              {status && (
                <div className="text-red-500 mb-3">{status}</div>
              )}

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

export default UserSetupPassword;