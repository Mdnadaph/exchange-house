import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ErrorMessage, Field, Formik, Form } from "formik";
import { Building2, Eye, EyeOff } from "lucide-react";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
// import { Form } from "react-router-dom";
import { Label } from "recharts";
import * as Yup from "yup";
import { useNavigate, useSearchParams } from "react-router-dom";
import BASE_URL from "@/config/config";
import axios from "axios";
import { toast } from "sonner";
const loginSchema = Yup.object({
  newPassword: Yup.string().min(6).required("New Password required"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("newPassword")], "Passwords must match")
    .required("Confirm password required"),
});
export default function ChangePassword() {
  const [searchParams] = useSearchParams();
  const uuid = searchParams.get("uuid");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();
  const handleLogin = async (values: any, { setSubmitting }: any) => {
    setErrorMessage(""); // Clear previous error
    let apiUrl = `${BASE_URL}/api/v3/super/exchange-admins/${uuid}/change-initial-password`;
    try {
      const res = await axios.put(apiUrl, values, {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      });
      if (!res.data?.status) {
        setErrorMessage(res.data.message || "password do not match!");
        return;
      }
      if (res?.data?.statusCode === 200) {
        toast.success(res?.data?.message || "Change Password Successfully");
      }
      navigate("/login");
      /* ===== 2FA FLOW ===== */
    } catch (err: any) {
      setErrorMessage(err?.response?.data?.message || "Invalid  password");
    } finally {
      setSubmitting(false);
    }
  };
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/5 flex flex-col">
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <div className="inline-flex w-16 h-16 rounded-2xl bg-primary text-primary-foreground items-center justify-center mb-4">
              <Building2 className="h-8 w-8" />
            </div>
            <h1 className="text-2xl font-bold">Change password</h1>
          </div>
          <Card
            className="shadow-xl
          pt-7"
          >
            <Formik
              initialValues={{ newPassword: "", confirmPassword: "" }}
              validationSchema={loginSchema}
              onSubmit={handleLogin}
            >
              {({ isSubmitting }) => (
                <Form>
                  <CardContent className="space-y-4">
                    <div>
                      <p className="text-gray-800 pb-3 font-medium text-base">
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
                          onClick={() => setShowNewPassword(!showNewPassword)}
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
                    <div>
                      <p className="text-gray-800 pb-3 font-medium text-base">
                        Confirm password
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

                    {errorMessage && (
                      <div className="text-red-500 text-sm text-center">
                        {errorMessage}
                      </div>
                    )}
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
