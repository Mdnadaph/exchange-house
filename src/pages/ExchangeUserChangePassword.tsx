import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ErrorMessage, Field, Formik, Form } from "formik";
import { Building2, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import * as Yup from "yup";
import { useNavigate, useSearchParams } from "react-router-dom";
import BASE_URL from "@/config/config";
import axios from "axios";
import { toast } from "sonner";

const passwordSchema = Yup.object({
  newPassword: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .required("New password required"),

  confirmPassword: Yup.string()
    .oneOf([Yup.ref("newPassword")], "Passwords must match")
    .required("Confirm password required"),
});

export default function ExchangeUserChangePassword() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const uuid = searchParams.get("uuid");

  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  /* 🔹 Check UUID */
  useEffect(() => {
    if (!uuid) {
      navigate("/login", { replace: true });
    }
  }, [uuid, navigate]);

  /* 🔹 Submit Handler */
  const handleSubmit = async (values: any, { setSubmitting }: any) => {
    setErrorMessage("");

    try {
      const apiUrl = `${BASE_URL}/api/v1/exchange-users/${uuid}/change-initial-password`;

      const res = await axios.put(apiUrl, values, {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      });

      if (!res.data?.status) {
        setErrorMessage(res.data.message || "Password change failed");
        return;
      }

      toast.success(res.data.message || "Password changed successfully");

      navigate("/login");
    } catch (err: any) {
      setErrorMessage(
        err?.response?.data?.message || "Something went wrong"
      );
    } finally {
      setSubmitting(false);
    }
  };

  /* 🔹 Prevent page render without uuid */
  if (!uuid) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/5 flex flex-col">
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-md">

          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex w-16 h-16 rounded-2xl bg-primary text-primary-foreground items-center justify-center mb-4">
              <Building2 className="h-8 w-8" />
            </div>

            <h1 className="text-2xl font-bold">
              Exchange User Change Password
            </h1>
          </div>

          {/* Card */}
          <Card className="shadow-xl pt-7">
            <Formik
              initialValues={{
                newPassword: "",
                confirmPassword: "",
              }}
              validationSchema={passwordSchema}
              onSubmit={handleSubmit}
            >
              {({ isSubmitting }) => (
                <Form>
                  <CardContent className="space-y-4">

                    {/* New Password */}
                    <div>
                      <p className="text-gray-800 pb-2 font-medium">
                        New Password
                      </p>

                      <div className="relative">
                        <Field
                          as={Input}
                          name="newPassword"
                          type={showNewPassword ? "text" : "password"}
                        />

                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-0 top-0 h-full px-3"
                          onClick={() =>
                            setShowNewPassword(!showNewPassword)
                          }
                        >
                          {showNewPassword ? <EyeOff /> : <Eye />}
                        </Button>
                      </div>

                      <ErrorMessage
                        name="newPassword"
                        component="div"
                        className="text-red-500 text-sm"
                      />
                    </div>

                    {/* Confirm Password */}
                    <div>
                      <p className="text-gray-800 pb-2 font-medium">
                        Confirm Password
                      </p>

                      <div className="relative">
                        <Field
                          as={Input}
                          name="confirmPassword"
                          type={showConfirmPassword ? "text" : "password"}
                        />

                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-0 top-0 h-full px-3"
                          onClick={() =>
                            setShowConfirmPassword(!showConfirmPassword)
                          }
                        >
                          {showConfirmPassword ? <EyeOff /> : <Eye />}
                        </Button>
                      </div>

                      <ErrorMessage
                        name="confirmPassword"
                        component="div"
                        className="text-red-500 text-sm"
                      />
                    </div>

                    {/* Error */}
                    {errorMessage && (
                      <div className="text-red-500 text-sm text-center">
                        {errorMessage}
                      </div>
                    )}

                    {/* Submit */}
                    <Button
                      type="submit"
                      className="w-full"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? "Setting..." : "Set Password"}
                    </Button>

                  </CardContent>
                </Form>
              )}
            </Formik>
          </Card>

        </div>
      </div>
    </div>
  );
}