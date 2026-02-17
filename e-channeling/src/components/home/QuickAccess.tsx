import React from "react";
import Image from "next/image";
import Link from "next/link";
import { FaUserDoctor } from "react-icons/fa6";
import running_number from "./../../../public/running_number.png";
import { ClipboardClock } from "lucide-react";
import { HeartHandshake } from "lucide-react";
import { motion } from "framer-motion";

const QuickAccess = () => {
    const items = [
        
        {
            id: 1,
            title: "Running Number",
            icon: (
                <Image
                    src={running_number}
                    alt="Running Number"
                    width={48}
                    height={48}
                />
            ),
            href: "/running-number",
            isNew: false,
        },
        {
            id: 2,
            title: "Booking Doctor",
            icon: (
                <ClipboardClock className="w-11 h-11 text-gray-500 border-gray-600" />
            ),
            href: "/search",
            isNew: false,
        },
        {
            id: 3,
            title: "Help & Support",
            icon: (
                <HeartHandshake className="w-11 h-11 text-gray-500 border-gray-600" />
            ),
            href: "/help",
            isNew: false,
        },
    ];

    return (
        <section className="py-12 sm:pb-16 lg:pb-20 pt-25 px-4 sm:px-6 lg:px-8 bg-white mb-12 sm:mb-16">
            <div className="max-w-6xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.3 }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                    className="mb-8 sm:mb-12"
                >
                    <h2 className="text-2xl sm:text-3xl font-bold text-gray-800">
                        Quick Access
                    </h2>
                </motion.div>

                <div className="grid grid-cols-2 sm:grid-cols-3  gap-4 sm:gap-6">
                    {items.map((item, index) => (
                        <motion.div
                            key={item.id}
                            initial={{ opacity: 0, y: 40 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, amount: 0.3 }}
                            transition={{
                                duration: 0.5,
                                delay: index * 0.1,
                                ease: "easeOut",
                            }}
                        >
                            <Link
                                href={item.href}
                                className="relative bg-[#ebf0fa] hover:bg-white border border-blue-100 rounded-xl p-5 flex flex-col items-center justify-center text-center transition-all hover:shadow-2xl block"
                            >
                                {item.isNew && (
                                    <span className="absolute top-2 left-2 text-[10px] px-2 py-0.5 rounded-full bg-green-500 text-white font-semibold">
                                        NEW
                                    </span>
                                )}

                                <div className="mb-5 flex items-center justify-center w-18 h-18 rounded-lg bg-white border border-blue-100">
                                    {item.icon}
                                </div>

                                <span className="text-sm sm:text-base font-medium text-gray-700">
                                    {item.title}
                                </span>
                            </Link>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default QuickAccess;
