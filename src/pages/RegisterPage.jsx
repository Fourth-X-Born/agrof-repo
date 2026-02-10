import React, { useState } from "react";
import { Link } from "react-router-dom";

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="h-screen bg-[#f6f8f6] flex flex-col overflow-hidden">
      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center px-4">
        <div className="flex w-full max-w-[720px] bg-white rounded-lg shadow-lg overflow-visible">
          {/* Left Panel - Image */}
          <div className="hidden md:flex w-[38%] relative rounded-l-lg overflow-hidden">
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{
                backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuDmmGx_UK2Sn0RjgbliD7Mhm8e5NPtL46cRSRmXqCkhXQq78dK83dXaB_6sZTNkfsf6T1tZP6CzhtfY5LR1fPjJqJCMcXt5mjRDgBlfs5nXQc2-yo345Bk671vUXSdYdjKDh03LVhZdjzrxYCe6YQih-p6GjyLtbEOUc6GpUUW7Y1aRNxGM17AavPmsTAUMRv_rciHAV73HT_H8M-a9zNSaaeSbg5JpLMDkFV2AR3qq4c5mGGi6OhdNLquWWpIUHhbIJXwJoDsoNpU")'
              }}
            ></div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div>
            <div className="relative z-10 flex flex-col justify-between p-4 h-full">
              <div className="flex items-center gap-1">
                <span className="text-white text-xs font-bold">Agro<span className="text-green-400">Sense</span> AI</span>
              </div>
              <div className="flex flex-col gap-2">
                <h2 className="text-white text-lg font-bold leading-tight">
                  Empowering Sri Lankan Agriculture
                </h2>
                <p className="text-gray-200 text-[10px] leading-relaxed">
                  Join the smart farming revolution. Get localized AI advice for better harvests.
                </p>
                <div className="flex items-center gap-1 mt-1">
                  <div className="w-4 h-1 rounded-full bg-white"></div>
                  <div className="w-1 h-1 rounded-full bg-white/50"></div>
                  <div className="w-1 h-1 rounded-full bg-white/50"></div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Panel - Form */}
          <div className="flex-1 p-5 rounded-r-lg bg-white">
            {/* Header */}
            <div className="text-center mb-3">
              <h1 className="text-base font-bold text-[#131613]">Create your account</h1>
              <p className="text-gray-500 text-[10px] mt-0.5">Start your journey to smarter farming today.</p>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-gray-200 mb-3">
              <Link to="/login" className="flex-1 text-center py-1.5 text-[10px] font-medium text-gray-500 hover:text-gray-700 border-b-2 border-transparent">
                Login
              </Link>
              <div className="flex-1 text-center py-1.5 text-[10px] font-medium text-primary border-b-2 border-primary">
                Register
              </div>
            </div>

            {/* Form */}
            <form className="flex flex-col gap-2.5">
              {/* Full Name */}
              <div className="flex flex-col gap-0.5">
                <label className="text-[9px] font-medium text-[#131613]">Full Name</label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-2 top-1/2 -translate-y-1/2 text-gray-400 text-sm">person</span>
                  <input
                    type="text"
                    placeholder="e.g. Sunil Perera"
                    className="w-full h-8 pl-8 pr-3 rounded border border-gray-300 text-[10px] focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                  />
                </div>
              </div>

              {/* Email */}
              <div className="flex flex-col gap-0.5">
                <label className="text-[9px] font-medium text-[#131613]">Email</label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-2 top-1/2 -translate-y-1/2 text-gray-400 text-sm">mail</span>
                  <input
                    type="email"
                    placeholder="e.g. person@gmail.com"
                    className="w-full h-8 pl-8 pr-3 rounded border border-gray-300 text-[10px] focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                  />
                </div>
              </div>

              {/* Password */}
              <div className="flex flex-col gap-0.5">
                <label className="text-[9px] font-medium text-[#131613]">Password</label>
                <div className="relative flex items-center">
                  <span className="material-symbols-outlined absolute left-2 text-gray-400 text-sm">lock</span>
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Create a secure password"
                    className="w-full h-8 pl-8 pr-8 rounded border border-gray-300 text-[10px] focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-2 flex items-center justify-center text-gray-400 hover:text-gray-600"
                  >
                    <span className="material-symbols-outlined text-sm">
                      {showPassword ? "visibility_off" : "visibility"}
                    </span>
                  </button>
                </div>
              </div>

              {/* Register Button */}
              <button
                type="submit"
                className="w-full h-8 mt-1 rounded bg-primary text-white text-[10px] font-medium flex items-center justify-center gap-1 hover:bg-primary/90 transition-colors"
              >
                Register Account
                <span className="material-symbols-outlined text-sm">arrow_forward</span>
              </button>
            </form>

            {/* Terms */}
            <p className="text-center text-[8px] text-gray-400 mt-3">
              By clicking Register, you agree to our{" "}
              <a href="#" className="text-primary font-medium hover:underline">Terms</a>
              {" "}and{" "}
              <a href="#" className="text-primary font-medium hover:underline">Privacy Policy</a>
            </p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="text-center py-2 text-[8px] text-gray-400">
        © 2026 <span className="font-semibold"><span className="text-gray-500">Agro</span><span className="text-primary">Sense</span> AI</span>. All rights reserved.
      </div>
    </div>
  );
}
