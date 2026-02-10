import React, { useState } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import ricePlantImg from "../assets/images/rice-plant-white-background-vector-eps-10_638232-733-removebg-preview.png";
import authService from "../services/authService";

export default function AuthPage() {
    const location = useLocation();
    const navigate = useNavigate();
    const isLogin = location.pathname === "/login";

    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    // Login form state
    const [loginForm, setLoginForm] = useState({ email: "", password: "" });

    // Register form state
    const [registerForm, setRegisterForm] = useState({
        name: "",
        email: "",
        password: "",
    });

    const switchToLogin = () => {
        setError("");
        navigate("/login");
    };
    const switchToRegister = () => {
        setError("");
        navigate("/register");
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        setError("");

        if (!loginForm.email || !loginForm.password) {
            setError("Please fill in all fields");
            return;
        }

        try {
            setLoading(true);
            const response = await authService.login(loginForm.email, loginForm.password);
            if (response.success) {
                navigate("/dashboard");
            } else {
                setError(response.message || "Login failed");
            }
        } catch (err) {
            console.error("Login error:", err);
            setError(err.message || "Invalid email or password");
        } finally {
            setLoading(false);
        }
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        setError("");

        if (!registerForm.name || !registerForm.email || !registerForm.password) {
            setError("Please fill in all fields");
            return;
        }

        try {
            setLoading(true);
            const response = await authService.register({
                name: registerForm.name,
                email: registerForm.email,
                password: registerForm.password,
            });

            if (response.success) {
                // Auto-login after successful registration
                await authService.login(registerForm.email, registerForm.password);
                navigate("/complete-profile");
            } else {
                setError(response.message || "Registration failed");
            }
        } catch (err) {
            console.error("Registration error:", err);
            setError(err.message || "Registration failed. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="h-screen bg-[#f6f8f6] flex items-center justify-center overflow-hidden relative p-6">
            {/* Animated Background Decorations */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                {/* Subtle gradient ambient */}
                <div className="absolute -top-20 -left-20 w-64 h-64 bg-primary/5 rounded-full blur-3xl"></div>
                <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-primary/5 rounded-full blur-3xl"></div>

                {/* Left Side Plants - Dense cluster */}
                <div className="absolute left-0 bottom-0 flex items-end">
                    <img src={ricePlantImg} alt="" className="h-[280px] opacity-35"
                        style={{ animation: 'sway 2.5s ease-in-out infinite', transformOrigin: 'bottom center' }} />
                    <img src={ricePlantImg} alt="" className="h-[220px] opacity-28 -ml-8"
                        style={{ animation: 'sway 3.2s ease-in-out infinite', transformOrigin: 'bottom center', animationDelay: '0.3s' }} />
                    <img src={ricePlantImg} alt="" className="h-[180px] opacity-22 -scale-x-100 -ml-6"
                        style={{ animation: 'sway 2.8s ease-in-out infinite', transformOrigin: 'bottom center', animationDelay: '0.7s' }} />
                    <img src={ricePlantImg} alt="" className="h-[250px] opacity-30 -ml-10"
                        style={{ animation: 'sway 3.5s ease-in-out infinite', transformOrigin: 'bottom center', animationDelay: '0.5s' }} />
                    <img src={ricePlantImg} alt="" className="h-[160px] opacity-20 -scale-x-100 -ml-5"
                        style={{ animation: 'sway 2.4s ease-in-out infinite', transformOrigin: 'bottom center', animationDelay: '0.9s' }} />
                    <img src={ricePlantImg} alt="" className="h-[200px] opacity-25 -ml-7"
                        style={{ animation: 'sway 3.8s ease-in-out infinite', transformOrigin: 'bottom center', animationDelay: '0.2s' }} />
                    <img src={ricePlantImg} alt="" className="h-[140px] opacity-18 -scale-x-100 -ml-4"
                        style={{ animation: 'sway 2.6s ease-in-out infinite', transformOrigin: 'bottom center', animationDelay: '1.1s' }} />
                    <img src={ricePlantImg} alt="" className="h-[120px] opacity-15 -ml-3"
                        style={{ animation: 'sway 3.1s ease-in-out infinite', transformOrigin: 'bottom center', animationDelay: '0.4s' }} />
                    <img src={ricePlantImg} alt="" className="h-[100px] opacity-12 -scale-x-100 -ml-2"
                        style={{ animation: 'sway 4.0s ease-in-out infinite', transformOrigin: 'bottom center', animationDelay: '0.8s' }} />
                </div>

                {/* Right Side Plants - Dense cluster */}
                <div className="absolute right-0 bottom-0 flex items-end flex-row-reverse">
                    <img src={ricePlantImg} alt="" className="h-[260px] opacity-32 -scale-x-100"
                        style={{ animation: 'sway 2.7s ease-in-out infinite', transformOrigin: 'bottom center' }} />
                    <img src={ricePlantImg} alt="" className="h-[200px] opacity-26 -mr-8"
                        style={{ animation: 'sway 3.3s ease-in-out infinite', transformOrigin: 'bottom center', animationDelay: '0.4s' }} />
                    <img src={ricePlantImg} alt="" className="h-[240px] opacity-30 -scale-x-100 -mr-9"
                        style={{ animation: 'sway 2.9s ease-in-out infinite', transformOrigin: 'bottom center', animationDelay: '0.6s' }} />
                    <img src={ricePlantImg} alt="" className="h-[170px] opacity-22 -mr-6"
                        style={{ animation: 'sway 3.6s ease-in-out infinite', transformOrigin: 'bottom center', animationDelay: '0.2s' }} />
                    <img src={ricePlantImg} alt="" className="h-[190px] opacity-24 -scale-x-100 -mr-7"
                        style={{ animation: 'sway 2.5s ease-in-out infinite', transformOrigin: 'bottom center', animationDelay: '0.8s' }} />
                    <img src={ricePlantImg} alt="" className="h-[150px] opacity-20 -mr-5"
                        style={{ animation: 'sway 4.2s ease-in-out infinite', transformOrigin: 'bottom center', animationDelay: '0.1s' }} />
                    <img src={ricePlantImg} alt="" className="h-[220px] opacity-28 -scale-x-100 -mr-8"
                        style={{ animation: 'sway 3.0s ease-in-out infinite', transformOrigin: 'bottom center', animationDelay: '1.0s' }} />
                    <img src={ricePlantImg} alt="" className="h-[130px] opacity-16 -mr-4"
                        style={{ animation: 'sway 3.4s ease-in-out infinite', transformOrigin: 'bottom center', animationDelay: '0.5s' }} />
                    <img src={ricePlantImg} alt="" className="h-[110px] opacity-14 -scale-x-100 -mr-3"
                        style={{ animation: 'sway 2.8s ease-in-out infinite', transformOrigin: 'bottom center', animationDelay: '0.9s' }} />
                </div>
            </div>

            {/* Main Card - Centered */}
            <div className="flex w-full max-w-[900px] bg-white rounded-2xl shadow-xl overflow-visible animate-scale-in transform scale-105">
                {/* Left Panel - Image */}
                <div className="hidden md:flex w-[40%] relative rounded-l-xl overflow-hidden">
                    <div
                        className="absolute inset-0 bg-cover bg-center"
                        style={{
                            backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuDmmGx_UK2Sn0RjgbliD7Mhm8e5NPtL46cRSRmXqCkhXQq78dK83dXaB_6sZTNkfsf6T1tZP6CzhtfY5LR1fPjJqJCMcXt5mjRDgBlfs5nXQc2-yo345Bk671vUXSdYdjKDh03LVhZdjzrxYCe6YQih-p6GjyLtbEOUc6GpUUW7Y1aRNxGM17AavPmsTAUMRv_rciHAV73HT_H8M-a9zNSaaeSbg5JpLMDkFV2AR3qq4c5mGGi6OhdNLquWWpIUHhbIJXwJoDsoNpU")'
                        }}
                    ></div>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div>
                    <div className="relative z-10 flex flex-col justify-between p-5 h-full">
                        <div className="flex items-center gap-2">
                            {/* Logo removed from here */}
                        </div>
                        <div className="flex flex-col gap-2">
                            <h2 className="text-white text-xl font-bold leading-tight transition-all duration-500">
                                {isLogin ? "Welcome Back, Farmer!" : "Empowering Sri Lankan Agriculture"}
                            </h2>
                            <p className="text-gray-200 text-xs leading-relaxed transition-all duration-500">
                                {isLogin
                                    ? "Access your personalized farming insights and continue growing smarter."
                                    : "Join the smart farming revolution. Get localized AI advice for better harvests."
                                }
                            </p>
                            <div className="flex items-center gap-1.5 mt-1">
                                <div className="w-5 h-1 rounded-full bg-white"></div>
                                <div className="w-1 h-1 rounded-full bg-white/50"></div>
                                <div className="w-1 h-1 rounded-full bg-white/50"></div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Panel - Form */}
                <div className="flex-1 p-8 rounded-r-xl bg-white">
                    {/* Header */}
                    <div className="text-center mb-6">
                        {/* Mobile/Form Logo */}
                        <div className="flex items-center justify-center gap-2 mb-6">
                            <span className="material-symbols-outlined text-primary text-xl">spa</span>
                            <span className="text-[#131613] text-sm font-bold">Agro<span className="text-primary">Sense</span> AI</span>
                        </div>

                        <h1 className="text-xl font-bold text-[#131613] transition-all duration-300">
                            {isLogin ? "Welcome back" : "Create your account"}
                        </h1>
                        <p className="text-gray-500 text-xs mt-1 transition-all duration-500">
                            {isLogin ? "Sign in to continue your farming journey." : "Start your journey to smarter farming today."}
                        </p>
                    </div>

                    {/* Error Message */}
                    {error && (
                        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-xs flex items-center gap-2">
                            <span className="material-symbols-outlined text-base">error</span>
                            {error}
                        </div>
                    )}

                    {/* Tabs */}
                    <div className="flex border-b border-gray-200 mb-3">
                        <button
                            onClick={switchToLogin}
                            className={`flex-1 text-center py-2 text-xs font-medium border-b-2 transition-all duration-500 ${isLogin
                                ? "text-primary border-primary"
                                : "text-gray-500 hover:text-gray-700 border-transparent"
                                }`}
                        >
                            Login
                        </button>
                        <button
                            onClick={switchToRegister}
                            className={`flex-1 text-center py-2 text-xs font-medium border-b-2 transition-all duration-500 ${!isLogin
                                ? "text-primary border-primary"
                                : "text-gray-500 hover:text-gray-700 border-transparent"
                                }`}
                        >
                            Register
                        </button>
                    </div>

                    {/* Form Container with Animation - Fixed height for consistency */}
                    <div className="relative overflow-hidden h-[300px]">
                        {/* Login Form */}
                        <div className={`h-full transition-all duration-500 ease-in-out ${isLogin
                            ? "opacity-100 translate-x-0"
                            : "opacity-0 -translate-x-full absolute inset-0 pointer-events-none"
                            }`}>
                            {isLogin && (
                                <form onSubmit={handleLogin} className="flex flex-col justify-center h-full gap-3">
                                    {/* Instruction Text */}
                                    <p className="text-gray-500 text-xs mb-2 text-center">
                                        Enter your credentials to access your account
                                    </p>
                                    {/* Email */}
                                    <div className="flex flex-col gap-1">
                                        <label className="text-[11px] font-medium text-[#131613]">Email</label>
                                        <div className="relative">
                                            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-base">mail</span>
                                            <input
                                                type="email"
                                                placeholder="e.g. person@gmail.com"
                                                value={loginForm.email}
                                                onChange={(e) => setLoginForm(prev => ({ ...prev, email: e.target.value }))}
                                                className="w-full h-9 pl-9 pr-3 rounded-lg border-2 border-gray-300 text-xs focus:outline-none focus:border-primary"
                                            />
                                        </div>
                                    </div>

                                    {/* Password */}
                                    <div className="flex flex-col gap-1">
                                        <label className="text-[11px] font-medium text-[#131613]">Password</label>
                                        <div className="relative flex items-center">
                                            <span className="material-symbols-outlined absolute left-3 text-gray-400 text-base">lock</span>
                                            <input
                                                type={showPassword ? "text" : "password"}
                                                placeholder="Enter your password"
                                                value={loginForm.password}
                                                onChange={(e) => setLoginForm(prev => ({ ...prev, password: e.target.value }))}
                                                className="w-full h-9 pl-9 pr-9 rounded-lg border-2 border-gray-300 text-xs focus:outline-none focus:border-primary"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowPassword(!showPassword)}
                                                className="absolute right-3 flex items-center justify-center text-gray-400 hover:text-gray-600"
                                            >
                                                <span className="material-symbols-outlined text-base">
                                                    {showPassword ? "visibility_off" : "visibility"}
                                                </span>
                                            </button>
                                        </div>
                                    </div>

                                    {/* Forgot Password */}
                                    <div className="flex justify-end -mt-2">
                                        <a href="#" className="text-[11px] text-primary font-medium hover:underline">
                                            Forgot password?
                                        </a>
                                    </div>

                                    {/* Login Button */}
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="w-full h-9 rounded-lg bg-primary text-white text-xs font-medium flex items-center justify-center gap-1.5 hover:bg-primary/90 transition-colors disabled:opacity-50"
                                    >
                                        {loading ? (
                                            <>
                                                <span className="material-symbols-outlined text-base animate-spin">progress_activity</span>
                                                Logging in...
                                            </>
                                        ) : (
                                            <>
                                                Login
                                                <span className="material-symbols-outlined text-base">arrow_forward</span>
                                            </>
                                        )}
                                    </button>
                                </form>
                            )}
                        </div>

                        {/* Register Form */}
                        <div className={`transition-all duration-500 ease-in-out ${!isLogin
                            ? "opacity-100 translate-x-0"
                            : "opacity-0 translate-x-full absolute inset-0 pointer-events-none"
                            }`}>
                            {!isLogin && (
                                <form onSubmit={handleRegister} className="flex flex-col gap-2.5">
                                    {/* Instruction Text */}
                                    <p className="text-gray-500 text-xs mb-2 text-center">
                                        Fill in your details to create your account
                                    </p>
                                    {/* Full Name */}
                                    <div className="flex flex-col gap-1">
                                        <label className="text-[11px] font-medium text-[#131613]">Full Name</label>
                                        <div className="relative">
                                            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-base">person</span>
                                            <input
                                                type="text"
                                                placeholder="e.g. Sunil Perera"
                                                value={registerForm.name}
                                                onChange={(e) => setRegisterForm(prev => ({ ...prev, name: e.target.value }))}
                                                className="w-full h-9 pl-9 pr-3 rounded-lg border-2 border-gray-300 text-xs focus:outline-none focus:border-primary"
                                            />
                                        </div>
                                    </div>

                                    {/* Email */}
                                    <div className="flex flex-col gap-1">
                                        <label className="text-[11px] font-medium text-[#131613]">Email</label>
                                        <div className="relative">
                                            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-base">mail</span>
                                            <input
                                                type="email"
                                                placeholder="e.g. person@gmail.com"
                                                value={registerForm.email}
                                                onChange={(e) => setRegisterForm(prev => ({ ...prev, email: e.target.value }))}
                                                className="w-full h-9 pl-9 pr-3 rounded-lg border-2 border-gray-300 text-xs focus:outline-none focus:border-primary"
                                            />
                                        </div>
                                    </div>

                                    {/* Password */}
                                    <div className="flex flex-col gap-1">
                                        <label className="text-[11px] font-medium text-[#131613]">Password</label>
                                        <div className="relative flex items-center">
                                            <span className="material-symbols-outlined absolute left-3 text-gray-400 text-base">lock</span>
                                            <input
                                                type={showPassword ? "text" : "password"}
                                                placeholder="Create a secure password"
                                                value={registerForm.password}
                                                onChange={(e) => setRegisterForm(prev => ({ ...prev, password: e.target.value }))}
                                                className="w-full h-9 pl-9 pr-9 rounded-lg border-2 border-gray-300 text-xs focus:outline-none focus:border-primary"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowPassword(!showPassword)}
                                                className="absolute right-3 flex items-center justify-center text-gray-400 hover:text-gray-600"
                                            >
                                                <span className="material-symbols-outlined text-base">
                                                    {showPassword ? "visibility_off" : "visibility"}
                                                </span>
                                            </button>
                                        </div>
                                    </div>

                                    {/* Register Button */}
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="w-full h-9 mt-1 rounded-lg bg-primary text-white text-xs font-medium flex items-center justify-center gap-1.5 hover:bg-primary/90 transition-colors disabled:opacity-50"
                                    >
                                        {loading ? (
                                            <>
                                                <span className="material-symbols-outlined text-base animate-spin">progress_activity</span>
                                                Creating account...
                                            </>
                                        ) : (
                                            <>
                                                Register Account
                                                <span className="material-symbols-outlined text-base">arrow_forward</span>
                                            </>
                                        )}
                                    </button>
                                </form>
                            )}
                        </div>
                    </div>

                    {/* Home Button */}
                    <Link
                        to="/"
                        className="w-full h-9 mt-3 rounded-lg border-2 border-gray-300 text-gray-600 text-xs font-medium flex items-center justify-center gap-1.5 hover:bg-gray-50 hover:border-gray-400 transition-all"
                    >
                        <span className="material-symbols-outlined text-base">home</span>
                        Back to Home
                    </Link>

                    {/* Bottom Link */}
                    <p className="text-center text-[11px] text-gray-400 mt-3">
                        {isLogin ? (
                            <>
                                Don't have an account?{" "}
                                <button onClick={switchToRegister} className="text-primary font-medium hover:underline">Sign up</button>
                            </>
                        ) : (
                            <>
                                By clicking Register, you agree to our{" "}
                                <Link to="/terms-of-service" className="text-primary font-medium hover:underline">Terms</Link>
                                {" "}and{" "}
                                <Link to="/privacy-policy" className="text-primary font-medium hover:underline">Privacy Policy</Link>
                            </>
                        )}
                    </p>
                </div>
            </div>

            {/* Footer - Absolute Bottom */}
            <div className="absolute bottom-2 left-0 right-0 text-center text-[11px] text-gray-400">
                © 2026 <span className="font-semibold"><span className="text-gray-500">Agro</span><span className="text-primary">Sense</span> AI</span>. All rights reserved.
            </div>
        </div>
    );
}
