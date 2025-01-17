import { Input } from "@/components/ui/input";
import { AppDispatch, RootState } from "@/store";
import { Label } from "@radix-ui/react-label";
import { useState } from "react";
import { IoEye, IoEyeOff } from "react-icons/io5";
import { useDispatch, useSelector } from "react-redux";
import { CheckCircle } from "lucide-react"; // Import CheckCircle from lucide-react
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { InputStyle, LableStyle } from "@/constants/themeContants";
// import { changePassword } from "@/features/auth/authSlice";
import { toast } from "@/components/ui/use-toast";
import { changePassword, logout } from "@/features/auth/authSlice";
import LoadingButton from "@mui/lab/LoadingButton";

const SetPassword = ({ open, onClose }: any) => {
  const dispatch = useDispatch<AppDispatch>();
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [passwordStrength, setPasswordStrength] = useState({
    score: 0,
    label: "",
  });
  const [passwordChecks, setPasswordChecks] = useState({
    hasUpperCase: false,
    hasNumber: false,
    hasSpecialChar: false,
    isValidLength: false,
  });

  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { loading } = useSelector((state: RootState) => state.auth);
  const handleSubmit = (e: any) => {
    e.preventDefault();
    if (!oldPassword || !newPassword || !confirmPassword) {
      setError("All fields are required.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setError("New password and confirm password do not match.");
      return;
    }
    dispatch(changePassword(payload)).then((response: any) => {
      console.log(response, response.data);
      if (response.payload.data.code === 200 || response.payload.data.success) {
        onClose();
        setOldPassword("");
        setNewPassword("");
        setConfirmPassword("");
        setPasswordStrength({ score: 0, label: "" });
        setPasswordChecks({
          hasUpperCase: false,
          hasNumber: false,
          hasSpecialChar: false,
          isValidLength: false,
        });
        toast({
          title:
            response?.payload?.data?.message || "Password Changed Successfully",
          className: "bg-green-600 text-white items-center",
        });
        setError("");
        dispatch(logout());
      }
    });
  };

  const payload: any = {
    oldpassword: oldPassword,
    newpassword: newPassword,
  };
  const handleClose = () => {
    setOldPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setPasswordStrength({ score: 0, label: "" });
    setPasswordChecks({
      hasUpperCase: false,
      hasNumber: false,
      hasSpecialChar: false,
      isValidLength: false,
    });
    onClose();
  };

  const checkPasswordStrength = (password: string) => {
    const checks = {
      hasUpperCase: /[A-Z]/.test(password),
      hasNumber: /\d/.test(password),
      hasSpecialChar: /[^a-zA-Z0-9]/.test(password),
      isValidLength: password.length >= 8 && password.length <= 16,
    };

    const score = Object.values(checks).filter((check) => check).length;

    setPasswordChecks(checks);

    let label = "";
    if (score <= 2) label = "Weak";
    else if (score === 3) label = "Medium";
    else label = "Strong";

    setPasswordStrength({ score, label });
  };

  const isFormValid =
    oldPassword &&
    newPassword &&
    confirmPassword &&
    newPassword === confirmPassword &&
    passwordStrength.score > 3;

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="w-full max-w-5xl h-fit p-8">
        {/* <Card className="rounded shadow bg-[#fff]"> */}

        {/* <CardHeader className="bg-[#e0f2f1] p-0 flex justify-center px-[10px] py-[5px]"> */}
        <Card>
          <CardHeader className="shadow-none">
            <h3 className="text-[17px] font-[600] text-slate-600">
              Set Your Password
            </h3>
          </CardHeader>
          <CardContent className="mt-[10px] flex space-x-12">
            <form onSubmit={handleSubmit} className="w-1/2 space-y-8">
              {error && <p className="text-red-500 mb-4">{error}</p>}

              <div className="floating-label-group relative">
                <Label className={LableStyle}>Old Password</Label>
                <Input
                  className={InputStyle}
                  required
                  type={showOldPassword ? "text" : "password"}
                  value={oldPassword}
                  onChange={(e) => setOldPassword(e.target.value)}
                />
                <button
                  type="button"
                  className="eye-button absolute right-2 top-1/2 transform -translate-y-1/2"
                  onClick={() => setShowOldPassword(!showOldPassword)}
                >
                  {showOldPassword ? <IoEyeOff /> : <IoEye />}
                </button>
              </div>

              <div className="floating-label-group relative">
                <Label className={LableStyle}>New Password</Label>
                <Input
                  required
                  className={InputStyle}
                  type={showNewPassword ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => {
                    setNewPassword(e.target.value);
                    checkPasswordStrength(e.target.value);
                  }}
                />
                <button
                  type="button"
                  className="eye-button absolute right-2 top-1/2 transform -translate-y-1/2"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                >
                  {showNewPassword ? <IoEyeOff /> : <IoEye />}
                </button>
              </div>

              <div className="floating-label-group relative">
                <Label className={LableStyle}>Confirm Password</Label>
                <div className="input-container relative">
                  <Input
                    className={InputStyle}
                    required
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                  <button
                    type="button"
                    className="eye-button absolute right-2 top-1/2 transform -translate-y-1/2"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? <IoEyeOff /> : <IoEye />}
                  </button>
                </div>
              </div>

              <LoadingButton
                type="submit"
                disabled={!isFormValid}
                className={`py-5 text-white rounded-lg w-full ${
                  isFormValid ? "bg-teal-500" : "bg-gray-300 cursor-not-allowed"
                }`}
                variant="contained"
                loading={loading === "loading"}
              >
                Set Password
              </LoadingButton>
            </form>

            <div className="w-1/2 pl-12 border-l border-gray-200">
              <h3 className="text-2xl font-semibold mb-6 text-gray-700">
                Password Requirements
              </h3>
              <ul className="space-y-5 text-gray-600 text-lg">
                <li
                  className={`flex items-center ${
                    passwordChecks.hasUpperCase
                      ? "text-green-600"
                      : "text-gray-500"
                  }`}
                >
                  {passwordChecks.hasUpperCase ? (
                    <CheckCircle className="h-8 w-8 text-green-600 mr-4" />
                  ) : (
                    <div className="h-8 w-8 text-gray-500 mr-4" />
                  )}
                  <span>At least one uppercase letter</span>
                </li>
                <li
                  className={`flex items-center ${
                    passwordChecks.hasNumber
                      ? "text-green-600"
                      : "text-gray-500"
                  }`}
                >
                  {passwordChecks.hasNumber ? (
                    <CheckCircle className="h-8 w-8 text-green-600 mr-4" />
                  ) : (
                    <div className="h-8 w-8 text-gray-500 mr-4" />
                  )}
                  <span>At least one number</span>
                </li>
                <li
                  className={`flex items-center ${
                    passwordChecks.hasSpecialChar
                      ? "text-green-600"
                      : "text-gray-500"
                  }`}
                >
                  {passwordChecks.hasSpecialChar ? (
                    <CheckCircle className="h-8 w-8 text-green-600 mr-4" />
                  ) : (
                    <div className="h-8 w-8 text-gray-500 mr-4" />
                  )}
                  <span>At least one special character</span>
                </li>
                <li
                  className={`flex items-center ${
                    passwordChecks.isValidLength
                      ? "text-green-600"
                      : "text-gray-500"
                  }`}
                >
                  {passwordChecks.isValidLength ? (
                    <CheckCircle className="h-8 w-8 text-green-600 mr-4" />
                  ) : (
                    <div className="h-8 w-8 text-gray-500 mr-4" />
                  )}
                  <span>8-16 characters in length</span>
                </li>
              </ul>
              <div className="mt-8">
                <p className="text-lg font-semibold text-gray-500">
                  Password Strength:
                </p>
                <div className="w-full bg-gray-200 rounded-full mt-2 h-3">
                  <div
                    className={`h-3 rounded-full ${
                      passwordStrength.label === "Strong"
                        ? "bg-green-600"
                        : passwordStrength.label === "Medium"
                        ? "bg-yellow-600"
                        : "bg-red-600"
                    }`}
                    style={{ width: `${passwordStrength.score * 25}%` }}
                  />
                </div>
                <p className="text-lg font-semibold text-gray-500 mt-2">
                  <span
                    className={`${
                      passwordStrength.label === "Strong"
                        ? "text-green-600"
                        : passwordStrength.label === "Medium"
                        ? "text-yellow-600"
                        : "text-red-600"
                    }`}
                  >
                    {passwordStrength.label}
                  </span>
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </DialogContent>
    </Dialog>
  );
};

export default SetPassword;
