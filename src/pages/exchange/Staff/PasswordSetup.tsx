// import React from "react";
// import { useNavigate, useLocation } from "react-router-dom";
// import axios from "axios";
// import { Formik, Form, Field, ErrorMessage } from "formik";
// import * as Yup from "yup";
// import BASE_URL from "@/config/config";

// // Validation schema
// const PasswordSchema = Yup.object().shape({
//   password: Yup.string()
//     .min(6, "Password must be at least 6 characters")
//     .required("Password is required"),
//   confirmPassword: Yup.string()
//     .oneOf([Yup.ref("password"), null], "Passwords must match")
//     .required("Confirm Password is required"),
// });

// const SetPassword = () => {
//   const navigate = useNavigate();
//   const location = useLocation();

//   // Extract token from query string ?token=...
//   const searchParams = new URLSearchParams(location.search);
//   const token = searchParams.get("token");

//   const handleSubmit = async (values, { setSubmitting, setStatus }) => {
//     if (!token) {
//       setStatus("Invalid or missing token.");
//       return;
//     }

//     try {
//       const response = await axios.post(
//         `${BASE_URL}/api/v3/staff-auth/set-password`,
//         {
//           token, // token from URL
//           password: values.password,
//           confirmPassword: values.confirmPassword,
//         }
//       );

//       if (response.data.status) {
//         // Password updated successfully
//         navigate("/");
//       } else {
//         setStatus(response.data.message || "Something went wrong");
//       }
//     } catch (error) {
//       console.error(error);
//       setStatus(error.response?.data?.message || "Server Error");
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   return (
//     <div className="max-w-md mx-auto mt-10 p-6 border rounded shadow">
//       <h2 className="text-2xl font-bold mb-4 text-center">Set New Password</h2>
//       <Formik
//         initialValues={{ password: "", confirmPassword: "" }}
//         validationSchema={PasswordSchema}
//         onSubmit={handleSubmit}
//       >
//         {({ isSubmitting, status }) => (
//           <Form>
//             <div className="mb-4">
//               <label className="block mb-1 font-semibold">New Password</label>
//               <Field
//                 type="password"
//                 name="password"
//                 className="w-full px-3 py-2 border rounded"
//               />
//               <ErrorMessage
//                 name="password"
//                 component="div"
//                 className="text-red-500 text-sm mt-1"
//               />
//             </div>

//             <div className="mb-4">
//               <label className="block mb-1 font-semibold">Confirm Password</label>
//               <Field
//                 type="password"
//                 name="confirmPassword"
//                 className="w-full px-3 py-2 border rounded"
//               />
//               <ErrorMessage
//                 name="confirmPassword"
//                 component="div"
//                 className="text-red-500 text-sm mt-1"
//               />
//             </div>

//             {status && <div className="text-red-500 mb-3">{status}</div>}

//             <button
//               type="submit"
//               disabled={isSubmitting}
//               className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition"
//             >
//               {isSubmitting ? "Setting Password..." : "Set Password"}
//             </button>
//           </Form>
//         )}
//       </Formik>
//     </div>
//   );
// };

// export default SetPassword;

import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { IoMdEye, IoIosEyeOff } from "react-icons/io";
import BASE_URL from "@/config/config";

// Validation schema
const PasswordSchema = Yup.object().shape({
  password: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password"), null], "Passwords must match")
    .required("Confirm Password is required"),
});

const SetPassword = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Extract token from query string ?token=...
  const searchParams = new URLSearchParams(location.search);
  const token = searchParams.get("token");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleSubmit = async (values, { setSubmitting, setStatus }) => {
    if (!token) {
      setStatus("Invalid or missing token.");
      return;
    }

    try {
      const response = await axios.post(
        `${BASE_URL}/api/v3/staff-auth/set-password`,
        {
          token, // token from URL
          password: values.password,
          confirmPassword: values.confirmPassword,
        }
      );

      if (response.data.status) {
        navigate("/"); // Password updated successfully
      } else {
        setStatus(response.data.message || "Something went wrong");
      }
    } catch (error) {
      console.error(error);
      setStatus(error.response?.data?.message || "Server Error");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="max-w-md w-full mx-auto mt-10 p-6 border rounded shadow">
        <h2 className="text-2xl font-bold mb-4 text-center">
          Set New Password
        </h2>
        <Formik
          initialValues={{ password: "", confirmPassword: "" }}
          validationSchema={PasswordSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting, status }) => (
            <Form>
              {/* New Password */}
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
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                  >
                    {showPassword ? <IoMdEye /> : <IoIosEyeOff />}
                  </button>
                </div>
                <ErrorMessage
                  name="password"
                  component="div"
                  className="text-red-500 text-sm mt-1"
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
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                  >
                    {showConfirmPassword ? <IoMdEye /> : <IoIosEyeOff />}
                  </button>
                </div>
                <ErrorMessage
                  name="confirmPassword"
                  component="div"
                  className="text-red-500 text-sm mt-1"
                />
              </div>

              {status && <div className="text-red-500 mb-3">{status}</div>}

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition"
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

export default SetPassword;
