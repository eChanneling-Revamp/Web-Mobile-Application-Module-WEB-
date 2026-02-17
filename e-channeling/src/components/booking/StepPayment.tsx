"use client";
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store";
import {
    createBooking,
    sendConfirmationEmail,
    clearSendConfirmationEmail,
} from "@/store/booking/bookingSlice";
import {
    clearPaymentDetails,
    clearPaymentError,
    clearPaymentSuccess,
    processPayment,
    setPaymentDetails,
} from "@/store/payment/paymentSlice";

interface StepPaymentProps {
    doctorFee: string;
    userId: string;
    onPrev: () => void;
    onNext: () => void;
}

export const StepPayment: React.FC<StepPaymentProps> = ({
    doctorFee,
    userId,
    onPrev,
    onNext,
}) => {
    const dispatch = useDispatch<AppDispatch>();

    // Get Redux state
    const {
        isCreatingBooking,
        bookingError,
        confirmationData,
        sendConfirmationEmailError,
        sendConfirmationEmailLoading,
        sendConfirmationEmailSuccess,
    } = useSelector((state: RootState) => state.booking);

    const {
        paymentDetails,
        isProcessingPayment,
        paymentError,
        isPaymentSuccess,
    } = useSelector((state: RootState) => state.payment);

    // Track touched fields for validation
    const [touched, setTouched] = useState({
        cardNumber: false,
        cardHolderName: false,
        expiryDate: false,
        cvv: false,
    });

    // Fixed platform fee
    const platformFee = 200.0;

    // Calculate total
    const totalAmount = parseFloat(doctorFee) + platformFee;

    // Handle input changes
    const handleChange = (
        field: keyof typeof paymentDetails,
        value: string,
    ) => {
        dispatch(setPaymentDetails({ [field]: value }));
    };

    // Validation functions
    const isValidCardNumber = (num: string) => {
        const digits = num.replace(/\s/g, "");
        return /^\d{16}$/.test(digits); // Backend requires exactly 16 digits
    };

    const isValidCardHolderName = (name: string) => {
        // 3-50 chars, letters and spaces only
        return (
            name.trim().length >= 3 &&
            name.length <= 50 &&
            /^[A-Za-z\s]+$/.test(name)
        );
    };

    const isValidDate = (date: string) => {
        return /^(0[1-9]|1[0-2])\/\d{2}$/.test(date.trim());
    };

    const isValidSecurityCode = (code: string) => {
        return /^\d{3,4}$/.test(code.trim());
    };

    // Validation errors
    const errors = {
        cardNumber: !isValidCardNumber(paymentDetails.cardNumber),
        cardHolderName: !isValidCardHolderName(paymentDetails.cardHolderName),
        expiryDate: !isValidDate(paymentDetails.expiryDate),
        cvv: !isValidSecurityCode(paymentDetails.cvv),
    };

    // Show errors only for touched fields
    const showErrors = {
        cardNumber: touched.cardNumber && errors.cardNumber,
        cardHolderName: touched.cardHolderName && errors.cardHolderName,
        expiryDate: touched.expiryDate && errors.expiryDate,
        cvv: touched.cvv && errors.cvv,
    };

    // Form is valid
    const isFormValid =
        !errors.cardNumber &&
        !errors.cardHolderName &&
        !errors.expiryDate &&
        !errors.cvv;

    // Handle blur
    const handleBlur = (field: keyof typeof touched) => {
        setTouched((prev) => ({ ...prev, [field]: true }));
    };

    // Handle card number formatting (add spaces every 4 digits)
    const handleCardNumberChange = (value: string) => {
        const digits = value.replace(/\D/g, "");
        const formatted = digits.replace(/(\d{4})/g, "$1 ").trim();
        handleChange("cardNumber", formatted);
    };

    // Handle expiry date formatting
    const handleExpiryDateChange = (value: string) => {
        let cleaned = value.replace(/\D/g, "");
        if (cleaned.length >= 2) {
            cleaned = cleaned.slice(0, 2) + "/" + cleaned.slice(2, 4);
        }
        handleChange("expiryDate", cleaned);
    };

    // Handle form submit - Create booking first, then process payment
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!isFormValid) return;

        try {
            // Step 1: Create booking
            // const bookingResult = await dispatch(
            //     createBooking({ userId })
            // ).unwrap();

            // Step 2: Process payment with the appointment number from booking

            if (!confirmationData) {
                throw new Error("No booking confirmation data available");
            }

            await dispatch(
                processPayment({
                    appointmentNumber: confirmationData.appointmentNumber,
                    amount: totalAmount,
                    cardNumber: paymentDetails.cardNumber.replace(/\s/g, ""), // Remove spaces
                    cardHolderName: paymentDetails.cardHolderName,
                    expiryDate: paymentDetails.expiryDate,
                    cvv: paymentDetails.cvv,
                }),
            ).unwrap();
        } catch (error: any) {
            // Error is handled in Redux state
            console.error("Payment processing error:", error);
        }
    };

    useEffect(() => {
        if (isPaymentSuccess) {
            dispatch(clearPaymentSuccess());
            dispatch(clearPaymentError());
            dispatch(clearPaymentDetails());
            onNext();
        }
    }, [isPaymentSuccess]);

    // Handle Pay Later - send confirmation email and navigate on success
    useEffect(() => {
        if (sendConfirmationEmailSuccess) {
            onNext();
        }
    }, [sendConfirmationEmailSuccess]);

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            dispatch(clearSendConfirmationEmail());
        };
    }, []);

    const handlePayLater = async () => {
        if (!confirmationData) {
            return;
        }
        // Dispatch the sendConfirmationEmail action
        dispatch(sendConfirmationEmail(confirmationData));
    };

    const inputClass =
        "w-full rounded-xl border-2 border-gray-300 px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200";
    const errorClass = "border-red-500 focus:ring-red-500 focus:border-red-500";

    return (
        <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Payment Details */}
                <div className="space-y-3">
                    <h2 className="text-2xl font-bold text-gray-900">
                        Payment Details
                    </h2>

                    {/* Show booking error */}
                    {bookingError && (
                        <div className="rounded-xl bg-red-50 border-2 border-red-200 p-4 text-red-800">
                            {bookingError}
                        </div>
                    )}

                    {/* Show payment error */}
                    {paymentError && (
                        <div className="rounded-xl bg-red-50 border-2 border-red-200 p-4 text-red-800">
                            {paymentError}
                        </div>
                    )}

                    {/* Show confirmation email error */}
                    {sendConfirmationEmailError && (
                        <div className="rounded-xl bg-red-50 border-2 border-red-200 p-4 text-red-800">
                            {sendConfirmationEmailError}
                        </div>
                    )}

                    {/* Card Number */}
                    <div>
                        <input
                            type="text"
                            placeholder="Credit Card Number *"
                            value={paymentDetails.cardNumber}
                            onChange={(e) =>
                                handleCardNumberChange(e.target.value)
                            }
                            onBlur={() => handleBlur("cardNumber")}
                            maxLength={19}
                            disabled={isCreatingBooking || isProcessingPayment}
                            className={`${inputClass} ${showErrors.cardNumber ? errorClass : ""}`}
                        />
                        {showErrors.cardNumber && (
                            <p className="text-sm text-red-600 mt-1">
                                Enter a valid 16-digit card number
                            </p>
                        )}
                    </div>

                    {/* Cardholder Name */}
                    <div>
                        <input
                            type="text"
                            placeholder="Card Holder Name *"
                            value={paymentDetails.cardHolderName}
                            onChange={(e) =>
                                handleChange("cardHolderName", e.target.value)
                            }
                            onBlur={() => handleBlur("cardHolderName")}
                            disabled={isCreatingBooking || isProcessingPayment}
                            className={`${inputClass} ${showErrors.cardHolderName ? errorClass : ""}`}
                        />
                        {showErrors.cardHolderName && (
                            <p className="text-sm text-red-600 mt-1">
                                Name must be 3-50 characters, letters and spaces
                                only
                            </p>
                        )}
                    </div>

                    {/* Expiry Date and CVV */}
                    <div className="grid grid-cols-2 gap-4">
                        {/* Expiry Date */}
                        <div>
                            <input
                                type="text"
                                placeholder="Expiry Date (MM/YY) *"
                                value={paymentDetails.expiryDate}
                                onChange={(e) =>
                                    handleExpiryDateChange(e.target.value)
                                }
                                onBlur={() => handleBlur("expiryDate")}
                                maxLength={5}
                                disabled={
                                    isCreatingBooking || isProcessingPayment
                                }
                                className={`${inputClass} ${showErrors.expiryDate ? errorClass : ""}`}
                            />
                            {showErrors.expiryDate && (
                                <p className="text-sm text-red-600 mt-1">
                                    Format: MM/YY
                                </p>
                            )}
                        </div>

                        {/* CVV */}
                        <div>
                            <input
                                type="text"
                                placeholder="CVV *"
                                value={paymentDetails.cvv}
                                onChange={(e) => {
                                    const digits = e.target.value.replace(
                                        /\D/g,
                                        "",
                                    );
                                    handleChange("cvv", digits);
                                }}
                                onBlur={() => handleBlur("cvv")}
                                maxLength={4}
                                disabled={
                                    isCreatingBooking || isProcessingPayment
                                }
                                className={`${inputClass} ${showErrors.cvv ? errorClass : ""}`}
                            />
                            {showErrors.cvv && (
                                <p className="text-sm text-red-600 mt-1">
                                    3-4 digits
                                </p>
                            )}
                        </div>
                    </div>
                </div>

                {/* Total Amount */}
                <div className="space-y-6">
                    {/* Amount Card */}
                    <div className="rounded-2xl bg-white border-2 border-gray-200 p-6 space-y-2">
                        <h2 className="text-lg font-bold text-gray-900">
                            Total Amount
                        </h2>

                        {/* Consultation Fee */}
                        <div className="flex items-center justify-between text-base">
                            <span className="text-gray-700">
                                Consultation Fee
                            </span>
                            <span className="font-medium text-gray-900">
                                Rs. {doctorFee}
                            </span>
                        </div>

                        {/* Platform Fee */}
                        <div className="flex items-center justify-between text-base">
                            <span className="text-gray-700">Platform Fee</span>
                            <span className="font-medium text-gray-900">
                                Rs. {platformFee.toFixed(2)}
                            </span>
                        </div>

                        {/* Divider */}
                        <div className="border-t-2 border-gray-200 my-4"></div>

                        {/* Total */}
                        <div className="flex items-center justify-between text-base">
                            <span className="font-bold text-gray-900">
                                Total Amount
                            </span>
                            <span className="font-bold text-gray-900">
                                Rs. {totalAmount.toFixed(2)}
                            </span>
                        </div>

                        {/* Terms Notice */}
                        <div className="mt-4 rounded-lg bg-blue-50 p-3 text-xs text-gray-700">
                            By proceeding with the payment, you agree to our
                            Terms of Service and Privacy Policy.
                        </div>
                    </div>
                </div>
            </div>

            {/* Navigation Buttons */}
            <div className="flex items-center justify-between pt-8">
                {/* <button
                    type="button"
                    onClick={onPrev}
                    disabled={isCreatingBooking || isProcessingPayment}
                    className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-full transition ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-blue-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    ← Previous
                </button> */}

                {/* Pay Later Button */}
                <button
                    type="button"
                    onClick={handlePayLater}
                    disabled={sendConfirmationEmailLoading || !confirmationData}
                    className="px-6 py-2.5 bg-blue-600 cursor-pointer hover:bg-blue-700 text-white font-semibold rounded-full transition ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-blue-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {sendConfirmationEmailLoading ? "Sending..." : "Pay Later"}
                </button>

                <button
                    type="submit"
                    disabled={
                        !isFormValid || isCreatingBooking || isProcessingPayment
                    }
                    className="px-6 py-2.5 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-full cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed transition ease-in-out duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-green-300"
                >
                    {isCreatingBooking
                        ? "Creating Booking..."
                        : isProcessingPayment
                          ? "Processing Payment..."
                          : "Pay Now →"}
                </button>
            </div>
        </form>
    );
};
