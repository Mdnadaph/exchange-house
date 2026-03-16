import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ErrorMessage, Field, Form, Formik } from "formik";
import { Building2, Eye, EyeOff } from "lucide-react";
import { useLayoutEffect, useState } from "react";
import * as Yup from "yup";
import { toast } from "sonner";
import { useNavigate, useSearchParams } from "react-router-dom";
import BASE_URL from "@/config/config";
import axios from "axios";
import { IoIosWarning } from "react-icons/io";
const schema = Yup.object({
  newPassword: Yup.string().min(6).required("New Password required"),
});
export default function ResetPassword() {
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [searchParams] = useSearchParams();
  const [data, setData] = useState<any>({});
  const token = searchParams.get("token");
  const navigate = useNavigate();
  const validateRestPassword = async () => {
    const res = await axios.get(
      `${BASE_URL}/api/v3/unified/reset-password/validate?token=${token}`,
    );
    setData(res);
  };
  useLayoutEffect(() => {
    validateRestPassword();
  }, []);
  const handleResetPassword = async (values: any, { setSubmitting }: any) => {
    setErrorMessage(""); // Clear previous error
    const dtoFormData = {
      token,
      ...values,
    };
    let apiUrl = `${BASE_URL}/api/v3/unified/reset-password`;
    try {
      const res = await axios.post(apiUrl, dtoFormData, {
        headers: { "Content-Type": "application/json" },
      });
      toast.success(res?.data?.message || "Reset Password Successfully");
      navigate("/login");
      /* ===== 2FA FLOW ===== */
    } catch (err: any) {
      setErrorMessage(err?.response?.data?.message || "Invalid  password");
    } finally {
      setSubmitting(false);
    }
  };
  console.log("data", data);
  return data?.data?.valid ? (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/5 flex flex-col">
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <div className="inline-flex w-16 h-16 rounded-2xl bg-primary text-primary-foreground items-center justify-center mb-4">
              <Building2 className="h-8 w-8" />
            </div>
            <h1 className="text-2xl font-bold">Reset password</h1>
          </div>

          <Card
            className="shadow-xl
          pt-7"
          >
            <Formik
              initialValues={{ newPassword: "" }}
              validationSchema={schema}
              onSubmit={handleResetPassword}
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
                      {isSubmitting ? "Setting..." : "Rest Password"}
                    </Button>
                  </CardContent>
                </Form>
              )}
            </Formik>
          </Card>
        </div>
      </div>
    </div>
  ) : (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/5 flex flex-col">
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <div className="inline-flex w-16 h-16 rounded-2xl bg-primary text-primary-foreground items-center justify-center mb-4">
              <IoIosWarning className="w-10 h-10" />
            </div>
            <h1 className="text-2xl font-bold text-red-500">
              Invalid, expired, or already used token
            </h1>
          </div>
        </div>
      </div>
    </div>
  );
}
