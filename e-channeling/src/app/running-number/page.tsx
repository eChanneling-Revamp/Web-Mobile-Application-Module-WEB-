"use client";

import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store";
import {
  fetchRunningNumbers,
  setPhoneNumber,
  resetRunningNumberState,
} from "@/store/running-number/runningNumberSlice";
import { Loader2 } from "lucide-react";

function cleanPhoneInput(input: string) {
  return input.trim().replace(/\s+/g, "");
}

function isValidSriLankaMobile(input: string) {
  const v = cleanPhoneInput(input);
  return /^07\d{8}$/.test(v) || /^\+947\d{8}$/.test(v) || /^947\d{8}$/.test(v);
}

const RunningNumberPage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { phoneNumber, appointments, isLoadingAppointments, error } =
    useSelector((state: RootState) => state.runningNumber);

  const [localPhone, setLocalPhone] = useState(phoneNumber || "");
  const [validationError, setValidationError] = useState("");

  const hasResults = appointments.length > 0;

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;

    // allow digits, +, spaces
    if (!/^[0-9+\s]*$/.test(raw)) return;

    // prevent extremely long input
    if (raw.length > 16) return;

    setLocalPhone(raw);
    setValidationError("");
  };

  const handlePhoneSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isValidSriLankaMobile(localPhone)) {
      setValidationError(
        "Enter a valid Sri Lankan mobile number (0712345678 / +94712345678 / 94712345678)"
      );
      return;
    }

    const cleaned = cleanPhoneInput(localPhone);

    dispatch(setPhoneNumber(cleaned));
    dispatch(fetchRunningNumbers({ phone: cleaned }));
  };

  const handleCheckAnother = () => {
    dispatch(resetRunningNumberState());
    setLocalPhone("");
    setValidationError("");
  };

 
  const showNoResultsMessage =
    !!phoneNumber &&
    !isLoadingAppointments &&
    !validationError &&
    !error &&
    !hasResults;

  return (
    <div className="min-h-screen bg-[#f4f6f9] py-12 px-4">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Search Card */}
        <div className="bg-white rounded-2xl shadow-[0_8px_25px_rgba(0,0,0,0.08)] p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Check Running Number
          </h2>
          <p className="text-gray-600 mb-6">
            Enter your phone number to check appointment running numbers
          </p>

          <form onSubmit={handlePhoneSubmit}>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Mobile number
            </label>

            <div className="flex gap-3">
              <input
                type="tel"
                placeholder="0712345678"
                value={localPhone}
                onChange={handlePhoneChange}
                className="flex-1 rounded-xl border border-gray-300 bg-[#eef4ff] px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                inputMode="tel"
              />

              {!hasResults ? (
                <button
                  type="submit"
                  disabled={isLoadingAppointments || !localPhone.trim()}
                  className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl disabled:opacity-50"
                >
                  {isLoadingAppointments ? (
                    <span className="flex items-center gap-2">
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Checking...
                    </span>
                  ) : (
                    "Search"
                  )}
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleCheckAnother}
                  className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl"
                >
                  Check Another
                </button>
              )}
            </div>

            {(validationError || error) && (
              <p className="text-red-500 text-sm mt-2">
                {validationError || error}
              </p>
            )}
          </form>
        </div>

        {/* Results Section */}
        {hasResults && (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-700">
              Appointments for {phoneNumber}
            </h3>

            {appointments.map((appt: any, index: number) => (
              <div
                key={index}
                className="
                  rounded-2xl
                  p-6
                  shadow-[0_6px_18px_rgba(0,0,0,0.06)]
                  bg-gradient-to-r
                  from-[#eaf3ff]
                  via-[#edf7f2]
                  to-[#e8f8ef]
                "
              >
                {/* Numbers Row */}
                <div className="flex justify-between items-start pb-4 border-b border-gray-200">
                  {/* Current Running */}
                  <div>
                    <p className="text-sm font-semibold text-gray-600">
                      Current Running Number
                    </p>
                    <p className="text-5xl font-bold text-blue-600 mt-1">
                      {appt.currentRunningNumber ?? "—"}
                    </p>
                  </div>

                  {/* Your Number */}
                  <div className="text-right">
                    <p className="text-sm font-semibold text-gray-600">
                      Your Number
                    </p>
                    <p className="text-5xl font-bold text-green-600 mt-1">
                      {appt.yourNumber ?? "—"}
                    </p>
                  </div>
                </div>

                {/* Details */}
                <div className="mt-4 text-gray-700 space-y-1">
                  <p>
                    <span className="text-gray-600">Patient:</span>{" "}
                    <span className="font-medium">{appt.patientName}</span>
                  </p>
                  <p>
                    <span className="text-gray-600">Doctor:</span>{" "}
                    <span className="font-medium">{appt.doctorName}</span>
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* No Results Message */}
        {showNoResultsMessage && (
          <div className="bg-white rounded-2xl shadow-[0_8px_25px_rgba(0,0,0,0.06)] p-6">
            <h3 className="text-lg font-semibold text-gray-700 mb-1">
              Appointments for {phoneNumber}
            </h3>
            <p className="text-gray-600">
              No ongoing Appointments found for this number.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default RunningNumberPage;
