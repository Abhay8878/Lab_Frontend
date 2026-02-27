// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { ArrowLeft } from "lucide-react";

// type Mode = "login" | "forgot" | "reset";

// const Login: React.FC = () => {
//   const [mode, setMode] = useState<Mode>("login");

//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [confirmPassword, setConfirmPassword] = useState("");

//   const [token, setToken] = useState<string | null>(null);
//   const [error, setError] = useState("");
//   const [message, setMessage] = useState("");

//   const [isLoggingIn, setIsLoggingIn] = useState(false);
//   const [isSendingForgot, setIsSendingForgot] = useState(false);
//   const [isResetting, setIsResetting] = useState(false);

//   const [showLoginPassword, setShowLoginPassword] = useState(false);
//   const [showResetPasswords, setShowResetPasswords] = useState(false);

//   const navigate = useNavigate();

//   const passwordsMismatch =
//     mode === "reset" &&
//     password.length > 0 &&
//     confirmPassword.length > 0 &&
//     password !== confirmPassword;

//   const switchMode = (newMode: Mode) => {
//     setMode(newMode);

//     setPassword("");
//     setConfirmPassword("");
//     setError("");
//     setMessage("");

//     setShowLoginPassword(false);
//     setShowResetPasswords(false);
//   };

//   // LOGIN
//   const handleLogin = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setError("");
//     setMessage("");
//     setIsLoggingIn(true);
//     const lower_Email = email.toLowerCase();

//     try {
//       const res = await fetch("http://localhost:3000/auth/login", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ email: lower_Email, password }),
//       });

//       const data = await res.json();

//       if (!res.ok) throw new Error(data.message || "Login failed");

//       if (data.data.practitionerType !== "Lab") {
//         throw new Error("Access denied. Lab users only.");
//       }

//       localStorage.setItem("accessToken", data.data.accessToken);
//       localStorage.setItem("userId", data.data.userId);
//       localStorage.setItem("practitionerType", data.data.practitionerType);

//       navigate("/");
//     } catch (err: unknown) {
//       const errorMessage =
//         err instanceof Error ? err.message : "Login failed. Please try again.";
//       setError(errorMessage);
//     } finally {
//       setIsLoggingIn(false);
//     }
//   };

//   // FORGOT
//   const handleForgot = async () => {
//     if (!email) {
//       setError("Please enter your email");
//       return;
//     }

//     setError("");
//     setMessage("");
//     setIsSendingForgot(true);

//     try {
//       const res = await fetch("http://localhost:3000/auth/forgot-password", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ email }),
//       });

//       const data = await res.json();

//       if (!res.ok) {
//         throw new Error(data.message || "Failed to send reset email");
//       }

//       if (data.token) {
//         setToken(data.token);
//         setMode("reset");
//       } else {
//         setMessage("If email exists, reset instructions were sent.");
//       }
//     } catch (err: unknown) {
//       const errorMessage =
//         err instanceof Error
//           ? err.message
//           : "Failed to send reset email. Please try again.";
//       setError(errorMessage);
//     } finally {
//       setIsSendingForgot(false);
//     }
//   };

//   const handleReset = async () => {
//     if (!token) return;

//     setError("");
//     setMessage("");

//     if (password !== confirmPassword) {
//       setError("Passwords do not match");
//       return;
//     }

//     if (password.length < 6) {
//       setError("Password must be at least 6 characters");
//       return;
//     }

//     setIsResetting(true);

//     try {
//       const res = await fetch("http://localhost:3000/auth/reset-password", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           token,
//           newPassword: password,
//         }),
//       });

//       const data = await res.json();

//       if (!res.ok) {
//         throw new Error(data.message || "Failed to reset password");
//       }

//       setMessage("Password reset successful. Please login.");
//       setMode("login");
//       setPassword("");
//       setConfirmPassword("");
//       setToken(null);
//     } catch (err: unknown) {
//       const errorMessage =
//         err instanceof Error
//           ? err.message
//           : "Failed to reset password. Please try again.";
//       setError(errorMessage);
//     } finally {
//       setIsResetting(false);
//     }
//   };

//   return (
//     <div className="flex h-screen w-full overflow-hidden">
//       <div className="w-[70%] relative">
//         <div
//           className="absolute inset-0 bg-cover bg-center bg-blue-700"
//           style={{
//             backgroundImage: `url('../../../src/assets/imgDental.jpg')`,
//           }}
//         >
//           <div className="absolute inset-0 bg-gradient-to-br "></div>
//         </div>
//       </div>

//       <div className="w-[30%] flex items-center justify-center px-8">
//         <div className="w-full max-w-md">
//           <h2 className="text-3xl font-bold mb-2">
//             {mode === "login" && "Lab Login"}
//             {mode === "forgot" && "Forgot Password"}
//             {mode === "reset" && "Reset Password"}
//           </h2>

//           <p className="text-sm text-gray-600 mb-6">
//             {mode === "login" && "Enter your credentials"}
//             {mode === "forgot" && "Enter your email"}
//             {mode === "reset" && "Enter your new password"}
//           </p>

//           {error && <p className="text-red-700 mb-3 text-sm">{error}</p>}
//           {message && <p className="text-green-700 mb-3 text-sm">{message}</p>}

//           {mode === "login" && (
//             <form onSubmit={handleLogin} className="space-y-4">
//               <input
//                 type="email"
//                 placeholder="Email"
//                 value={email}
//                 onChange={(e) => setEmail(e.target.value)}
//                 className="w-full px-4 py-3 border rounded-lg"
//                 required
//               />

//               <div className="relative">
//                 <input
//                   type={showLoginPassword ? "text" : "password"}
//                   placeholder="Password"
//                   value={password}
//                   onChange={(e) => setPassword(e.target.value)}
//                   className="w-full px-4 py-3 border rounded-lg pr-20"
//                   required
//                 />
//                 <button
//                   type="button"
//                   onClick={() => setShowLoginPassword((prev) => !prev)}
//                   className="absolute inset-y-0 right-3 my-auto text-sm font-medium text-gray-700 hover:underline"
//                 >
//                   {showLoginPassword ? "Hide" : "Show"}
//                 </button>
//               </div>

//               <button
//                 type="submit"
//                 disabled={isLoggingIn}
//                 className={`w-full py-3 rounded-lg text-white transition
//                   ${
//                     isLoggingIn
//                       ? "bg-gray-500 cursor-not-allowed"
//                       : "bg-black hover:bg-gray-900"
//                   }`}
//               >
//                 {isLoggingIn ? "Logging in..." : "Login"}
//               </button>

//               <div className="text-right">
//                 <button
//                   type="button"
//                   onClick={() => setMode("forgot")}
//                   className="text-sm text-black hover:underline"
//                 >
//                   Forgot Password?
//                 </button>
//               </div>
//             </form>
//           )}

//           {/* FORGOT */}
//           {mode === "forgot" && (
//             <div className="space-y-4">
//               <input
//                 type="email"
//                 placeholder="Email"
//                 value={email}
//                 onChange={(e) => setEmail(e.target.value)}
//                 className="w-full px-4 py-3 border rounded-lg"
//               />

//               <button
//                 onClick={handleForgot}
//                 disabled={isSendingForgot}
//                 className={`w-full py-3 rounded-lg text-white transition
//                   ${
//                     isSendingForgot
//                       ? "bg-gray-500 cursor-not-allowed"
//                       : "bg-black hover:bg-gray-900"
//                   }`}
//               >
//                 {isSendingForgot ? "Sending..." : "Send Reset"}
//               </button>

//               <button
//                 onClick={() => {
//                   setMode("login");
//                   setError("");
//                   setMessage("");
//                 }}
//                 className="text-sm text-black hover:underline"
//               >
//                 <div className="flex items-center gap-2">
//                   <ArrowLeft className="h-4 w-4" />
//                   <span>Back to login</span>
//                 </div>
//               </button>
//             </div>
//           )}

//           {mode === "reset" && (
//             <div className="space-y-4">
//               <div className="relative">
//                 <input
//                   type={showResetPasswords ? "text" : "password"}
//                   placeholder="New Password"
//                   value={password}
//                   onChange={(e) => setPassword(e.target.value)}
//                   className={`w-full px-4 py-3 border rounded-lg pr-20 focus:outline-none
//                     ${
//                       passwordsMismatch ? "border-red-600" : "border-gray-600"
//                     }`}
//                 />
//                 <button
//                   type="button"
//                   onClick={() => setShowResetPasswords((prev) => !prev)}
//                   className="absolute inset-y-0 right-3 my-auto text-sm font-medium text-gray-700 hover:underline"
//                 >
//                   {showResetPasswords ? "Hide" : "Show"}
//                 </button>
//               </div>

//               <div className="relative">
//                 <input
//                   type={showResetPasswords ? "text" : "password"}
//                   placeholder="Confirm New Password"
//                   value={confirmPassword}
//                   onChange={(e) => setConfirmPassword(e.target.value)}
//                   className={`w-full px-4 py-3 border rounded-lg pr-20 focus:outline-none
//                     ${
//                       passwordsMismatch ? "border-red-600" : "border-gray-600"
//                     }`}
//                 />
//               </div>

//               {passwordsMismatch && (
//                 <p className="text-sm text-red-600">Passwords do not match</p>
//               )}

//               <button
//                 onClick={handleReset}
//                 disabled={passwordsMismatch || isResetting}
//                 className={`w-full py-3 rounded-lg text-white transition
//                   ${
//                     passwordsMismatch || isResetting
//                       ? "bg-gray-500 cursor-not-allowed"
//                       : "bg-black hover:bg-gray-900"
//                   }`}
//               >
//                 {isResetting ? "Resetting..." : "Reset Password"}
//               </button>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Login;

import React, { useState } from "react";

import { useNavigate } from "react-router-dom";

import { ArrowLeft } from "lucide-react";

type Mode = "login" | "forgot" | "reset";

const Login: React.FC = () => {
  const [mode, setMode] = useState<Mode>("login");

  const [email, setEmail] = useState("");

  const [password, setPassword] = useState("");

  const [confirmPassword, setConfirmPassword] = useState("");

  const [token, setToken] = useState<string | null>(null);

  const [error, setError] = useState("");

  const [message, setMessage] = useState("");

  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const passwordsMismatch =
    mode === "reset" &&
    password.length > 0 &&
    confirmPassword.length > 0 &&
    password !== confirmPassword;

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    setError("");

    setLoading(true);

    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL || "http://localhost:3000"}/auth/login`,

        {
          method: "POST",

          headers: { "Content-Type": "application/json" },

          body: JSON.stringify({ email, password }),
        },
      );

      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Login failed");

      // Handle wrapped response

      const payload = data.data || data;

      localStorage.setItem("accessToken", payload.accessToken);
      localStorage.setItem("userId", payload.userId);
      localStorage.setItem("firstName", payload.firstName ?? "");

      navigate("/");
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Login failed");
      }
    } finally {
      setLoading(false);
    }
  };

  // ---------------- FORGOT ----------------

  const handleForgot = async () => {
    setError("");

    setMessage("");

    setLoading(true);

    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL || "http://localhost:3000"}/auth/forgot-password`,

        {
          method: "POST",

          headers: { "Content-Type": "application/json" },

          body: JSON.stringify({ email }),
        },
      );

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Failed to process request");

        return;
      }

      // DEV MODE: backend logs token, or return it

      const payload = data.data || data;

      if (payload.token) {
        setToken(payload.token);

        setMode("reset");

        setPassword("");

        setConfirmPassword("");
      } else {
        setMessage(
          payload.message || "If email exists, reset instructions were sent.",
        );
      }
    } catch (err: unknown) {
      setError("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // ---------------- RESET ----------------

  const handleReset = async () => {
    if (!token) return;

    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match");

      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters");

      return;
    }

    setLoading(true);

    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL || "http://localhost:3000"}/auth/reset-password`,

        {
          method: "POST",

          headers: { "Content-Type": "application/json" },

          body: JSON.stringify({
            token,

            newPassword: password,
          }),
        },
      );

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Reset failed");

        return;
      }

      const payload = data.data || data;

      setMessage(payload.message || "Password reset successful. Please login.");

      setMode("login");

      setPassword("");

      setConfirmPassword("");

      setToken(null);
    } catch (err: unknown) {
      setError("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen w-full overflow-hidden">
      {/* LEFT IMAGE */}

      <div className="w-[70%] relative">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url('/src/assets/imgDental.jpg')` }}
        >
          {/* <div className="absolute inset-0 bg-gradient-to-br from-blue-400/40 to-black/70"></div> */}
        </div>
      </div>

      {/* RIGHT FORM */}

      <div className="w-[30%] flex items-center justify-center px-8">
        <div className="w-full max-w-md">
          <h2 className="text-3xl font-bold mb-2">
            {mode === "login" && "Lab Login"}

            {mode === "forgot" && "Forgot Password"}

            {mode === "reset" && "Reset Password"}
          </h2>

          <p className="text-gray-600 mb-6">
            {mode === "login" && "Enter your credentials"}

            {mode === "forgot" && "Enter your email"}

            {mode === "reset"}
          </p>

          {error && <p className="text-red-700 mb-3">{error}</p>}

          {message && <p className="text-green-700 mb-3">{message}</p>}

          {/* LOGIN */}

          {mode === "login" && (
            <form onSubmit={handleLogin} className="space-y-4">
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 border rounded-lg"
                required
                disabled={loading}
              />

              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 border rounded-lg"
                required
                disabled={loading}
              />

              <button
                disabled={loading}
                className={`w-full py-3 text-white rounded-lg transition-colors

                ${loading ? "bg-gray-400 cursor-not-allowed" : "bg-brand-button hover:bg-brand-button/85"}`}
              >
                {loading ? "Logging in..." : "Login"}
              </button>

              <div className="text-right">
                <button
                  type="button"
                  disabled={loading}
                  onClick={() => setMode("forgot")}
                  className="text-sm text-black-800 hover:underline disabled:opacity-50"
                >
                  Forgot Password?
                </button>
              </div>
            </form>
          )}

          {/* FORGOT */}

          {mode === "forgot" && (
            <div className="space-y-4">
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 border rounded-lg"
                disabled={loading}
              />

              <button
                onClick={handleForgot}
                disabled={loading}
                className={`w-full py-3 text-white rounded-lg transition-colors

                ${loading ? "bg-gray-400 cursor-not-allowed" : "bg-brand-button hover:bg-brand-button/85"}`}
              >
                {loading ? "Sending..." : "Send Reset"}
              </button>

              <button
                disabled={loading}
                onClick={() => setMode("login")}
                className="text-sm text-black-800 hover:underline disabled:opacity-50"
              >
                <div className="flex flex-1 items-center gap-2">
                  <ArrowLeft className="h-2 w-2" />
                  Back to login
                </div>
              </button>
            </div>
          )}

          {mode === "reset" && (
            <div className="space-y-4">
              <input
                type="password"
                placeholder="New Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none

        ${passwordsMismatch ? "border-red-600" : "border-gray-600"}`}
              />

              <input
                type="password"
                placeholder="Confirm New Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                disabled={loading}
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none

        ${passwordsMismatch ? "border-red-600" : "border-gray-600"}`}
              />

              {passwordsMismatch && (
                <p className="text-sm text-red-600">Passwords do not match</p>
              )}

              <button
                onClick={handleReset}
                disabled={passwordsMismatch || loading}
                className={`w-full py-3 text-white rounded-lg transition-colors

                ${passwordsMismatch || loading ? "bg-gray-400 cursor-not-allowed" : "bg-brand-button hover:bg-brand-button/85"}`}
              >
                {loading ? "Resetting..." : "Reset Password"}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Login;
 