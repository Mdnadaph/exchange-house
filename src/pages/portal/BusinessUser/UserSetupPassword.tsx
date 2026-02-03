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

// /* ================= VALIDATION ================= */

// const PasswordSchema = Yup.object({
//   password: Yup.string().required("Password is required"),
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
//     "email",
//     "twoFactorEnabled",
//     "requiresTwoFactor",
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
//       setStatus("Invalid or missing token.");
//       setSubmitting(false);
//       return;
//     }

//     try {
//       const response = await axios.post<ApiResponse>(
//         // `${BASE_URL}/api/v3/staff-auth/set-password`,
//         `${BASE_URL}/api/v3/business-user-auth/set-password`,
//         // api/v3/business-user-auth/set-password
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
//         navigate("/business-user-generateqr");
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

// export default UserSetupPassword;




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

// interface BusinessAdmin {
//   id?: number;
//   email?: string;
//   firstName?: string;
//   lastName?: string;
// }

// interface ApiResponseData {
//   tempToken?: string;
//   requiresTwoFactor?: boolean;
//   businessAdmin?: BusinessAdmin;
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

// const BusinessPasswordSetup: React.FC = () => {
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

//       const { tempToken, requiresTwoFactor, businessAdmin } =
//         response.data.data;

//       /* ===== STORE COOKIES SAFELY ===== */

//       if (tempToken) {
//         setCookie("tempToken", tempToken, {
//           // path: "/",
//           // secure: true,
//           // sameSite: "strict",
//           path: "/", sameSite: "lax"
//         });
//       }

//       if (requiresTwoFactor !== undefined) {
//         setCookie("businessRequiresTwoFactor", requiresTwoFactor, {
//           // path: "/",
//           // secure: true,
//           // sameSite: "strict",
//           path: "/", sameSite: "lax"
//         });
//       }

//       if (businessAdmin?.id !== undefined) {
//         setCookie("businessId", businessAdmin.id, {
//           // path: "/",
//           // secure: true,
//           // sameSite: "strict",
//           path: "/", sameSite: "lax"
//         });
//       }

//       if (businessAdmin?.email) {
//         setCookie("businessEmail", businessAdmin.email, {
//           // path: "/",
//           // secure: true,
//           // sameSite: "strict",
//           path: "/", sameSite: "lax"
//         });
//       }

//       if (businessAdmin?.firstName) {
//         setCookie("businessFirstName", businessAdmin.firstName, {
//           // path: "/",
//           // secure: true,
//           // sameSite: "strict",

//           path: "/", sameSite: "lax"
//         });
//       }

//       if (businessAdmin?.lastName) {
//         setCookie("businessLastName", businessAdmin.lastName, {
//           // path: "/",
//           // secure: true,
//           // sameSite: "strict",
//           path: "/", sameSite: "lax"
//         });
//       }

//       console.log("🍪 Cookies saved successfully");

//       /* ===== NAVIGATION ===== */
//       if (requiresTwoFactor) {
//         navigate("/business-user-generateqr");
//       } else {
//         navigate("/");
//       }
//     } catch (error: unknown) {
//       console.error("❌ Set Password Error:", error);

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

// export default BusinessPasswordSetup;



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
          path: "/",
          sameSite: "lax"
        });
      }

      if (requiresTwoFactor !== undefined) {
        setCookie("businessRequiresTwoFactor", requiresTwoFactor, {
          path: "/",
          sameSite: "lax"
        });
      }

      if (businessUser?.id !== undefined) {
        setCookie("businessId", businessUser.id, {
          path: "/",
          sameSite: "lax"
        });
      }

      if (businessUser?.email) {
        setCookie("businessEmail", businessUser.email, {
          path: "/",
          sameSite: "lax"
        });
      }

      // Handle firstName and lastName from fullName if available
      if (businessUser?.fullName) {
        const nameParts = businessUser.fullName.split(" ");
        const firstName = nameParts[0] || "";
        const lastName = nameParts.slice(1).join(" ") || "";
        setCookie("businessFirstName", firstName, {
          path: "/",
          sameSite: "lax"
        });
        setCookie("businessLastName", lastName, {
          path: "/",
          sameSite: "lax"
        });
      } else {
        // If fullName is null or undefined, set empty strings or skip as needed
        setCookie("businessFirstName", "", {
          path: "/",
          sameSite: "lax"
        });
        setCookie("businessLastName", "", {
          path: "/",
          sameSite: "lax"
        });
      }

      console.log("🍪 Cookies saved successfully");

      /* ===== NAVIGATION ===== */
      if (requiresTwoFactor) {
        navigate("/business-user-generateqr");
      } else {
        navigate("/");
      }
    } catch (error: unknown) {
      console.error("❌ Set Password Error:", error);

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