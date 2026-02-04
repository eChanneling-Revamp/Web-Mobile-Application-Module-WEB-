"use client";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store";
import {sendRunningNumberOtp, setPhoneNumber, resetRunningNumberState} from "@/store/running-number/runningNumberSlice";
import { Loader2 } from "lucide-react";
import { RunningNumberChecker } from "@/components/running-number/RunningNumberChecker";

const RunningNumberPage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { phoneNumber, isOtpVerified, error } = useSelector(
    (state: RootState) => state.runningNumber
  );

  const [localPhone, setLocalPhone] = useState(phoneNumber || "");
  const [isLoadingSend, setIsLoadingSend] = useState(false);
  const [validationError, setValidationError] = useState("");

  // Phone Validation
  const validatePhone = (phone: string): boolean => {
    const phoneRegex = /^07[0-9]{8}$/;
    return phoneRegex.test(phone);
  };

  // Handle Phone Change
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "");
    if (value.length <= 10) {
      setLocalPhone(value);
      setValidationError("");
    }
  };

  // Handle Phone Submit
  const handlePhoneSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validatePhone(localPhone)) {
      setValidationError("Please enter a valid mobile number (07XXXXXXXX)");
      return;
    }

    setIsLoadingSend(true);
    dispatch(setPhoneNumber(localPhone));

    try {
      await dispatch(sendRunningNumberOtp({ phone: localPhone })).unwrap();
    } catch (error) {
      console.error("Failed to send OTP:", error);
    } finally {
      setIsLoadingSend(false);
    }
  };

  // Handle Check Another
  const handleCheckAnother = () => {
    dispatch(resetRunningNumberState());
    setLocalPhone("");
    setValidationError("");
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Phone Number Card */}
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Check Running Number</h2>
          <p className="text-gray-600 mb-6">
            Enter your phone number to check appointment running numbers
          </p>

          <form onSubmit={handlePhoneSubmit} className="space-y-4">
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                Mobile number
              </label>
              <div className="flex gap-3">
                <input
                  id="phone"
                  type="tel"
                  placeholder="0712345678"
                  value={localPhone}
                  onChange={handlePhoneChange}
                  disabled={isOtpVerified}
                  className="flex-1 rounded-xl border-2 border-gray-300 px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 disabled:bg-gray-100 disabled:cursor-not-allowed"
                  maxLength={10}
                />
                {!isOtpVerified ? (
                  <button
                    type="submit"
                    disabled={isLoadingSend || !localPhone}
                    className="px-8 py-3 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-xl cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                  >
                    {isLoadingSend ? (
                      <span className="flex items-center gap-2">
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Sending...
                      </span>
                    ) : (
                      "Search"
                    )}
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleCheckAnother}
                    className="px-8 py-3 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-xl transition-all duration-200"
                  >
                    Check Another
                  </button>
                )}
              </div>
              {(validationError || error) && (
                <p className="text-red-500 text-sm mt-2">{validationError || error}</p>
              )}
            </div>
          </form>
        </div>

        {/* OTP and Results Component */}
        <RunningNumberChecker />
      </div>
    </div>
  );
};

export default RunningNumberPage;