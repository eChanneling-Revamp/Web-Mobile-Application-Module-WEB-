"use client";
import React, { useState } from "react";
import {
    Search,
    Calendar,
    CreditCard,
    CheckCircle,
    Phone,
    Mail,
    MessageCircle,
    ChevronDown,
    ChevronUp,
    Clock,
    MapPin,
    Users,
    FileText,
    HelpCircle,
    BookOpen,
    Video,
} from "lucide-react";
import Link from "next/link";
import FAQ from "@/components/help/FAQ";
import Image from "next/image";

export default function HelpPage() {
    const [openFAQ, setOpenFAQ] = useState<number | null>(null);

    const toggleFAQ = (id: number) => {
        setOpenFAQ(openFAQ === id ? null : id);
    };

    const bookingSteps = [
        {
            id: 1,
            icon: <Search className="w-6 h-6" />,
            title: "Search for Doctors",
            description:
                "Use our 'Find Doctors' feature to find doctors by specialty, location, or hospital. You can also browse featured doctors on the homepage.",
            tips: [
                "Use specific search terms for better results",
                "Filter by specialty to narrow down options",
                "Check doctor ratings and reviews",
            ],
        },
        {
            id: 2,
            icon: <Calendar className="w-6 h-6" />,
            title: "Select Date & Time",
            description:
                "Choose your preferred appointment date and time slot. Available slots are highlighted in green, while fully booked dates are shown in red.",
            tips: [
                "Morning slots fill up quickly - book early",
                "Check for video consultation options",
                "Consider alternative dates if preferred slot is full",
            ],
        },
        {
            id: 3,
            icon: <Users className="w-6 h-6" />,
            title: "Enter Patient Details",
            description:
                "Provide accurate patient information including full name, contact details, age, and reason for visit. This helps the doctor prepare for your consultation.",
            tips: [
                "Double-check contact information for confirmations",
                "Be specific about symptoms or concerns",
                "Add any relevant medical history",
            ],
        },
        {
            id: 4,
            icon: <CreditCard className="w-6 h-6" />,
            title: "Make Payment",
            description:
                "Complete your booking by making a secure payment. We accept all major credit/debit cards. You can also apply promo codes for discounts.",
            tips: [
                "Save payment details for faster bookings",
                "Check for available promo codes",
                "Review total amount before confirming",
            ],
        },
        {
            id: 5,
            icon: <CheckCircle className="w-6 h-6" />,
            title: "Get Confirmation",
            description:
                "Receive instant confirmation via email and SMS. Your appointment details, including ID, date, time, and location will be sent to you.",
            tips: [
                "Save your appointment ID for reference",
                "Download the receipt for your records",
                "Add appointment to your calendar",
            ],
        },
    ];

    return (
        <div className="min-h-screen px-5 sm:px-15 pt-8">
            <section
                className="px-4 sm:px-6 lg:px-20 py-10 sm:py-12 bg-gradient-to-r from-blue-500 to-green-500 mx-4 sm:mx-0 rounded-2xl relative overflow-hidden"
                style={{
                    backgroundImage:
                        "linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4)), url('/hero-img.jpg')",
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                }}
            >
                <div className="max-w-4xl mx-auto text-center relative z-10">
                    <HelpCircle className="w-15 h-15 text-white mx-auto mb-4" />
                    <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-[42px]  font-bold text-white mb-4">
                        How Can We Help You?
                    </h1>
                    <p className="text-white/90 text-lg mb-8">
                        Find answers to your questions and learn how to book
                        appointments easily
                    </p>
                </div>
            </section>

            <section className="py-12 px-4 sm:px-6 lg:px-20 bg-white">
                <div className="max-w-7xl mx-auto">
                    <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-8 text-center">
                        Quick Help Topics
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        <Link
                            href="#booking-guide"
                            className="group bg-gray-50 hover:bg-blue-50 rounded-xl p-6 transition-all hover:shadow-lg border border-gray-200 hover:border-blue-300"
                        >
                            <BookOpen className="w-10 h-10 text-blue-600 mb-3 group-hover:scale-110 transition-transform" />
                            <h3 className="font-semibold text-gray-800 mb-2">
                                Booking Guide
                            </h3>
                            <p className="text-sm text-gray-600">
                                Step-by-step instructions for booking
                                appointments
                            </p>
                        </Link>

                        <Link
                            href="#faq"
                            className="group bg-gray-50 hover:bg-green-50 rounded-xl p-6 transition-all hover:shadow-lg border border-gray-200 hover:border-green-300"
                        >
                            <MessageCircle className="w-10 h-10 text-green-600 mb-3 group-hover:scale-110 transition-transform" />
                            <h3 className="font-semibold text-gray-800 mb-2">
                                FAQs
                            </h3>
                            <p className="text-sm text-gray-600">
                                Common questions and answers
                            </p>
                        </Link>

                        <Link
                            href="#contact"
                            className="group bg-gray-50 hover:bg-blue-50 rounded-xl p-6 transition-all hover:shadow-lg border border-gray-200 hover:border-blue-300"
                        >
                            <Phone className="w-10 h-10 text-blue-600 mb-3 group-hover:scale-110 transition-transform" />
                            <h3 className="font-semibold text-gray-800 mb-2">
                                Contact Support
                            </h3>
                            <p className="text-sm text-gray-600">
                                Get in touch with our support team
                            </p>
                        </Link>

                        <Link
                            href="/search"
                            className="group bg-gray-50 hover:bg-green-50 rounded-xl p-6 transition-all hover:shadow-lg border border-gray-200 hover:border-green-300"
                        >
                            <Video className="w-10 h-10 text-green-600 mb-3 group-hover:scale-110 transition-transform" />
                            <h3 className="font-semibold text-gray-800 mb-2">
                                Find Doctors
                            </h3>
                            <p className="text-sm text-gray-600">
                                Search and book appointments now
                            </p>
                        </Link>
                    </div>
                </div>
            </section>

            <section
                id="booking-guide"
                className="py-16 px-4 sm:px-6 lg:px-20 bg-gray-50"
            >
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-4">
                            How to Book an Appointment
                        </h2>
                        <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                            Follow these simple steps to book your appointment
                            with top doctors
                        </p>
                    </div>

                    <div className="space-y-8">
                        {bookingSteps.map((step, index) => (
                            <div
                                key={step.id}
                                className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow p-6 sm:p-8 border border-gray-100"
                            >
                                <div className="flex flex-col sm:flex-row gap-6 ">
                                    <div className="flex flex-row sm:flex-col justify-between py-0 sm:py-1 items-center ">
                                        <div className="flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-r from-blue-100 to-green-100 mb-0 md:mb-0">
                                            {step.icon}
                                        </div>
                                        <div className="text-center md:text-left sm:mb-12 mb-3">
                                            <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-gray-100 text-blue-700 text-[16px] font-bold">
                                                {index + 1}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="flex-1">
                                        <h3 className="text-xl font-semibold text-gray-800 mb-3">
                                            {step.title}
                                        </h3>
                                        <p className="text-gray-600 mb-4 leading-relaxed ">
                                            {step.description}
                                        </p>

                                        <div className="bg-blue-50 rounded-lg p-4 border-l-4 border-blue-500">
                                            <p className="text-sm font-semibold text-blue-800 mb-2">
                                                💡 Pro Tips:
                                            </p>
                                            <ul className="space-y-1.5">
                                                {step.tips.map((tip, idx) => (
                                                    <li
                                                        key={idx}
                                                        className="text-sm text-blue-700 flex items-start"
                                                    >
                                                        <span className="mr-2">
                                                            •
                                                        </span>
                                                        <span>{tip}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="text-center mt-12">
                        <Link
                            href="/search"
                            className="group inline-flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white px-6 sm:px-8 md:px-8 py-3 sm:py-3.5 md:py-3 rounded-full text-base sm:text-lg font-semibold shadow-lg hover:shadow-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-white/80 transition-all cursor-pointer"
                        >
                            Start Booking Now
                            <svg
                                className="w-5 h-5 sm:w-6 sm:h-6 transition-transform duration-200 ease-out transform group-hover:translate-x-1"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2.2"
                                viewBox="0 0 24 24"
                                aria-hidden="true"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M9 5l7 7-7 7"
                                />
                            </svg>
                        </Link>
                    </div>
                </div>
            </section>

            <section id="faq" className="py-16 px-4 sm:px-6 lg:px-20 bg-white">
                <div className="max-w-4xl mx-auto">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-4">
                            Frequently Asked Questions
                        </h2>
                        <p className="text-gray-600 text-lg">
                            Find quick answers to common questions
                        </p>
                    </div>

                    <div className="space-y-4">
                        {FAQ.map((qa) => (
                            <div
                                key={qa.id}
                                className="bg-gray-100 rounded-xl border border-gray-200 overflow-hidden hover:border-blue-300 transition-colors"
                            >
                                <button
                                    onClick={() => toggleFAQ(qa.id)}
                                    className="w-full px-6 py-5 flex items-center justify-between text-left hover:bg-gray-200 transition-colors"
                                >
                                    <span className="font-semibold text-gray-800 pr-4">
                                        {qa.question}
                                    </span>
                                    {openFAQ === qa.id ? (
                                        <ChevronUp className="w-5 h-5 text-blue-600 flex-shrink-0" />
                                    ) : (
                                        <ChevronDown className="w-5 h-5 text-gray-400 flex-shrink-0" />
                                    )}
                                </button>
                                {openFAQ === qa.id && (
                                    <div className="px-6 pb-5 pt-2 text-gray-600 leading-relaxed border-t border-gray-200 bg-white">
                                        {qa.answer}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <section className="py-16 px-4 sm:px-6 lg:px-20 bg-gradient-to-r from-blue-50 to-green-50">
                <div className="max-w-6xl mx-auto">
                    <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-8 text-center">
                        Additional Resources
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow border border-gray-100">
                            <Clock className="w-8 h-8 text-blue-600 mb-4" />
                            <h3 className="font-semibold text-gray-800 mb-2">
                                Operating Hours
                            </h3>
                            <p className="text-sm text-gray-600 mb-3">
                                Our support team is available to assist you
                            </p>
                            <p className="text-sm text-gray-700 ">
                                <strong>Mon-Fri:</strong> 8:00 AM - 8:00 PM
                            </p>
                            <p className="text-sm text-gray-700 mt-1">
                                <strong>Sat-Sun:</strong> 9:00 AM - 5:00 PM
                            </p>
                        </div>

                        <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow border border-gray-100">
                            <MapPin className="w-8 h-8 text-green-600 mb-4" />
                            <h3 className="font-semibold text-gray-800 mb-2">
                                Service Areas
                            </h3>
                            <p className="text-sm text-gray-600 mb-3">
                                We serve patients across Sri Lanka
                            </p>
                            <p className="text-sm text-gray-700">
                                Available in Colombo, Kandy, Galle, Gampaha,
                                Jaffna, and more cities
                            </p>
                        </div>

                        <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow border border-gray-100">
                            <FileText className="w-8 h-8 text-blue-600 mb-4" />
                            <h3 className="font-semibold text-gray-800 mb-2">
                                Documentation
                            </h3>
                            <p className="text-sm text-gray-600 mb-3">
                                Learn more about our services
                            </p>
                            <div className="space-y-2">
                                <Link
                                    href="/terms"
                                    className="block text-sm text-blue-600 hover:text-blue-700"
                                >
                                    Terms & Conditions →
                                </Link>
                                <Link
                                    href="/privacy"
                                    className="block text-sm text-blue-600 hover:text-blue-700"
                                >
                                    Privacy Policy →
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section
                id="contact"
                className="py-16 px-4 sm:px-6 lg:px-20 bg-white"
            >
                <div className="max-w-4xl mx-auto ">
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-5 mb-10  text-center sm:text-left">
                        <div>
                            <h2 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-4">
                                Still Need Help?
                            </h2>
                            <p className="text-gray-600 text-lg">
                                Our support team is here to assist you
                            </p>
                        </div>
                        <div className="">
                            <Image
                                src="/helping.png"
                                alt="help"
                                width={100}
                                height={200}
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-8 text-center hover:shadow-lg transition-shadow border border-blue-200">
                            <div className="inline-flex items-center justify-center w-13 h-13 rounded-full bg-blue-600 mb-4">
                                <Phone className="w-6 h-6 text-white" />
                            </div>
                            <h3 className="font-semibold text-gray-800 mb-2 text-lg">
                                Call Us
                            </h3>
                            <p className="text-gray-600 text-sm mb-4">
                                Speak with our support team
                            </p>
                            <a
                                href="tel:+94112100100"
                                className="text-blue-600 font-semibold hover:text-blue-700 text-lg"
                            >
                                +94 11 0 000 000
                            </a>
                        </div>

                        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-8 text-center hover:shadow-lg transition-shadow border border-green-200">
                            <div className="inline-flex items-center justify-center w-13 h-13 rounded-full bg-green-600 mb-4">
                                <Mail className="w-6 h-6 text-white" />
                            </div>
                            <h3 className="font-semibold text-gray-800 mb-2 text-lg">
                                Email Us
                            </h3>
                            <p className="text-gray-600 text-sm mb-4">
                                Send us your questions
                            </p>
                            <a
                                href="mailto:support@echannelling.com"
                                className="text-green-600 font-semibold hover:text-green-700 break-all"
                            >
                                support@echannelling.com
                            </a>
                        </div>
                    </div>

                    <div className="mt-12 bg-red-50 border-l-4 border-red-500 rounded-lg p-6">
                        <div className="flex items-start">
                            <div className="flex-shrink-0">
                                <svg
                                    className="w-6 h-6 text-red-600"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                                    />
                                </svg>
                            </div>
                            <div className="ml-4">
                                <h3 className="text-lg font-semibold text-red-800 mb-1">
                                    Medical Emergency?
                                </h3>
                                <p className="text-red-700 text-sm leading-6">
                                    If you&apos;re experiencing a medical
                                    emergency, please call <strong>1990</strong>{" "}
                                    (Ambulance Service) or visit the nearest
                                    hospital emergency room immediately.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
