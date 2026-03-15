import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import BASE_URL from "@/config/config";
import axios from "axios";
import { ErrorMessage, Field, Formik, Form } from "formik";
import { Building2 } from "lucide-react";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import * as Yup from "yup";
const schema = Yup.object({
  email: Yup.string().required("Please enter email").email("Enter valid email"),
});

export default function ForgotPassword() {
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();
  const handlForgotPassword = async (values: any, { setSubmitting }: any) => {
    setErrorMessage(""); // Clear previous error
    let apiUrl = `${BASE_URL}/api/v3/unified/forgot-password`;
    try {
      const res = await axios.post(apiUrl, values, {
        headers: { "Content-Type": "application/json" },
      });
      toast.success(res?.data?.message || "Forgot Password Successfully");
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
            <h1 className="text-2xl font-bold">Forgot Password</h1>
          </div>
          <Card
            className="shadow-xl
          pt-7"
          >
            <Formik
              initialValues={{ email: "" }}
              validationSchema={schema}
              onSubmit={handlForgotPassword}
            >
              {({ isSubmitting }) => (
                <Form>
                  <CardContent className="space-y-4">
                    <div>
                      <Label>
                        Email Address <span className="text-red-600">*</span>
                      </Label>
                      <Field
                        as={Input}
                        name="email"
                        type="email"
                        autoComplete="email"
                      />
                      <ErrorMessage
                        name="email"
                        component="div"
                        className="text-red-500 text-sm mt-1"
                      />
                    </div>

                    <Button
                      type="submit"
                      className="w-full"
                      disabled={isSubmitting}
                    >
                      {isSubmitting
                        ? "Loading...."
                        : "Send Reset Password Link"}
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
