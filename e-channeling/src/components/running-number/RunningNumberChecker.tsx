"use client";
import React, { useState, useRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store";
import {sendRunningNumberOtp, verifyRunningNumberOtp, fetchRunningNumbers, clearRunningNumberErrors} from "@/store/running-number/runningNumberSlice";
import { Loader2, X } from "lucide-react";

export const RunningNumberChecker: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { phoneNumber, isOtpSent, isOtpVerified, appointments, isLoadingAppointments, error } =
    useSelector((state: RootState) => state.runningNumber);

  // OTP State
  const [otp, setOtp] = useState("");
  const [otpTimer, setOtpTimer] = useState(180);
  const [isFocused, setIsFocused] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const OTP_LENGTH = 6;

  // OTP Timer
  useEffect(() => {
    if (isOtpSent && !isOtpVerified) {
      const interval = setInterval(() => {
        setOtpTimer((prev) => (prev > 0 ? prev - 1 : 0));
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [isOtpSent, isOtpVerified]);

  // OTP Input Handlers
  const handleOtpChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!otp) dispatch(clearRunningNumberErrors());
    let value = e.target.value.replace(/\D/g, "");
    if (value.length > OTP_LENGTH) value = value.slice(0, OTP_LENGTH);
    setOtp(value);
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    const digits = e.clipboardData.getData("text").replace(/\D/g, "");
    setOtp(digits.slice(0, OTP_LENGTH));
  };

  const focusInput = () => {
    inputRef.current?.focus();
    setIsFocused(true);
  };

  // Handle OTP Submit
  const handleOtpSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (otp.length !== 6) return;

    setIsVerifying(true);
    try {
      await dispatch(verifyRunningNumberOtp({ phone: phoneNumber, otp })).unwrap();
      await dispatch(fetchRunningNumbers({ phone: phoneNumber })).unwrap();
      setOtp("");
    } catch (error) {
      console.error("OTP verification failed:", error);
    } finally {
      setIsVerifying(false);
    }
  };

  // Handle Resend OTP
  const handleResendOtp = () => {
    if (otpTimer > 0) return;
    dispatch(clearRunningNumberErrors());
    setOtp("");
    setOtpTimer(180);
    dispatch(sendRunningNumberOtp({ phone: phoneNumber }));
  };

  // Close OTP Modal
  const closeOtpModal = () => {
    dispatch(clearRunningNumberErrors());
    setOtp("");
  };

  return (
    <>
      {/* OTP Modal */}
      {isOtpSent && !isOtpVerified && (
        <div className="fixed inset-0 backdrop-blur-[1px] flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full relative animate-slideUp">
            <button
              onClick={closeOtpModal}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
              aria-label="Close"
            >
              <X className="w-6 h-6" />
            </button>

            <form onSubmit={handleOtpSubmit} className="space-y-6">
              <div className="text-center">
                <h2 className="text-2xl font-bold text-gray-800 mb-2">Verify Mobile Number</h2>
                <p className="text-sm text-gray-600">
                  We have sent OTP to your mobile number
                </p>
                <p className="text-base font-medium text-gray-800 mt-1">{phoneNumber}</p>
              </div>

              {/* Hidden actual input */}
              <input
                ref={inputRef}
                value={otp}
                onChange={handleOtpChange}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                maxLength={OTP_LENGTH}
                className="opacity-0 absolute pointer-events-none"
                type="tel"
                inputMode="numeric"
                pattern="[0-9]*"
                autoComplete="one-time-code"
                onPaste={handlePaste}
              />

              {/* Visible OTP Boxes */}
              <div className="flex gap-3 justify-center" onClick={focusInput}>
                {Array.from({ length: OTP_LENGTH }).map((_, index) => {
                  const isFilled = Boolean(otp[index]);
                  const isActive =
                    isFocused &&
                    (otp.length === index || (otp.length === OTP_LENGTH && index === OTP_LENGTH - 1));

                  return (
                    <div
                      key={index}
                      className={`w-12 h-14 border-2 rounded-lg flex items-center justify-center text-xl font-medium cursor-text transition-colors duration-150 relative ${
                        isFilled
                          ? "bg-blue-50 border-blue-500 text-blue-800"
                          : "bg-white border-gray-300 text-gray-700"
                      } ${isActive ? "ring-2 ring-blue-300" : ""}`}
                    >
                      {otp[index] || ""}
                      {isActive && !isFilled && (
                        <span className="absolute animate-pulse text-gray-700">|</span>
                      )}
                    </div>
                  );
                })}
              </div>

              <div className="text-center space-y-4">
                {error ? (
                  <p className="text-red-500 text-sm font-medium">{error}</p>
                ) : (
                  <p className="text-sm text-gray-600">
                    OTP Expires in {Math.floor(otpTimer / 60)}:
                    {(otpTimer % 60).toString().padStart(2, "0")}
                  </p>
                )}

                <p className="text-sm">
                  Didn&apos;t receive an OTP?{" "}
                  <button
                    type="button"
                    onClick={handleResendOtp}
                    className="text-blue-600 hover:text-blue-700 hover:underline cursor-pointer disabled:text-gray-400 disabled:cursor-not-allowed transition-colors"
                    disabled={otpTimer > 0}
                  >
                    Resend OTP
                  </button>
                </p>
              </div>

              <button
                type="submit"
                disabled={isVerifying || otp.length < 6}
                className="w-full px-8 py-3 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                {isVerifying ? (
                  <span className="flex items-center justify-center gap-2">
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Verifying...
                  </span>
                ) : (
                  "Verify"
                )}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Results Section */}
      {isOtpVerified && (
        <div className="bg-white rounded-2xl shadow-lg p-8">
          {isLoadingAppointments ? (
            <div className="flex flex-col items-center justify-center py-12">
              <Loader2 className="w-12 h-12 animate-spin text-blue-600 mb-4" />
              <p className="text-gray-600">Loading your appointments...</p>
            </div>
          ) : appointments.length === 0 ? (
            <div className="text-center py-12">
              <svg
                className="w-20 h-20 mx-auto text-gray-400 mb-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">No Appointments Found</h3>
              <p className="text-gray-600">No appointments found for {phoneNumber}</p>
            </div>
          ) : (
            <div>
              <div className="mb-6">
                <h2 className="text-gray-600 font-bold">Appointments for {phoneNumber}</h2>
              </div>

              <div className="space-y-4">
                {appointments.map((appointment) => (
                  <div
                    key={appointment.appointmentId}
                  >

                    <div className="bg-gradient-to-r from-blue-50 to-green-50 rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-gray-600 font-bold mb-1">Current Running Number</p>
                          <p className="text-3xl font-bold text-blue-600">
                            {appointment.currentRunningNumber}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-gray-600 font-bold mb-1">Your Number</p>
                          <p className="text-3xl font-bold text-green-600">{appointment.yourNumber}</p>
                        </div>
                      </div>
                      <div className="mt-3 pt-3 border-t border-gray-200">
                        <p className="text-2xs text-gray-600">Patient: {appointment.patientName}</p>
                        <p className="text-2xs text-gray-600">Doctor: {appointment.doctorName}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
};
