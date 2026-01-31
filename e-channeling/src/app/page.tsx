"use client";
import HeroSection from "../components/home/HeroSection";
import FeaturedServices from "../components/home/FeaturedServices";
import MembershipSection from "../components/home/MembershipSection";
import Welcome from "@/components/home/Welcome";
import QuickAccess from "../components/home/QuickAccess";

export default function Home() {
    return (
        <main className="min-h-screen px-5 sm:px-15 pt-8">
            {/* Landing Page */}
            <HeroSection />
            <Welcome />
            <FeaturedServices />
            <MembershipSection />
            <QuickAccess />
        </main>
    );
}
