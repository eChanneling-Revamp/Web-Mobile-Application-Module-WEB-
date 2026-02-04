"use client";
import React from 'react';
import { CheckIcon } from '@heroicons/react/24/outline';

export default function MembershipPage() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Membership</h1>
        <p className="text-gray-700 mt-1 text-base md:text-lg ">Choose your membership plan</p>
      </div>

      {/* Membership Plans - Cards centered but not huge */}
      <div className="flex justify-center mt-15">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl w-full">
          {/* Free Member Card */}
          <div className="bg-white border border-gray-200 rounded-xl shadow-md p-6 flex flex-col items-center min-w-[230px]">
            <div className="mb-5 text-center">
              <h3 className="text-lg font-semibold text-gray-900">Free Member</h3>
              <div className="mt-2">
                <span className="text-2xl font-bold text-gray-900">0 LKR</span>
              </div>
              <div className="mt-1">
                <span className="text-gray-500 text-base">Life time</span>
              </div>
            </div>

            {/* Features */}
            <div className="flex-grow w-full mb-4">
              <ul className="space-y-2">
                <li className="flex items-start">
                  <CheckIcon className="w-5 h-5 text-green-500 mr-2 flex-shrink-0 mt-1" />
                  <span className="text-gray-700 text-sm">Member loyalty point scheme</span>
                </li>
                <li className="flex items-start">
                  <CheckIcon className="w-5 h-5 text-green-500 mr-2 flex-shrink-0 mt-1" />
                  <span className="text-gray-700 text-sm">Able to view Doctor Channel History</span>
                </li>
              </ul>
            </div>

            <div className="mt-auto pt-5 border-t border-gray-200 w-full">
              <button
                disabled
                className="w-full bg-gray-100 text-gray-500 py-2.5 px-4 rounded-lg font-medium cursor-not-allowed text-base"
              >
                Current Plan
              </button>
            </div>
          </div>

          {/* Premium Member Card */}
          <div className="bg-white border-2 border-blue-500 rounded-xl shadow-lg p-6 flex flex-col items-center min-w-[230px] relative">
            {/* Popular Badge */}
            <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
              <span className="bg-blue-600 text-white px-4 py-1 rounded-full text-xs font-bold shadow">
                Recommended
              </span>
            </div>

            <div className="mb-5 text-center">
              <h3 className="text-lg font-semibold text-gray-900">Premium Member</h3>
              <div className="mt-2">
                <span className="text-2xl font-bold text-gray-900">2000 LKR</span>
              </div>
              <div className="mt-1">
                <span className="text-gray-500 text-base">1 Year</span>
              </div>
            </div>

            {/* Features */}
            <div className="flex-grow w-full mb-4">
              <ul className="space-y-2">
                <li className="flex items-start">
                  <CheckIcon className="w-5 h-5 text-blue-600 mr-2 flex-shrink-0 mt-1" />
                  <span className="text-gray-700 text-sm">30% on ECH Service fee</span>
                </li>
                <li className="flex items-start">
                  <CheckIcon className="w-5 h-5 text-blue-600 mr-2 flex-shrink-0 mt-1" />
                  <span className="text-gray-700 text-sm">15% on ECH Service fee</span>
                </li>
              </ul>
            </div>

            <div className="mt-auto pt-5 border-t border-gray-200 w-full">
              <button className="w-full bg-blue-600 text-white py-2.5 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors text-base">
                Upgrade
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Additional Information */}
      <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-xl max-w-2xl mx-auto">
        <p className="text-center text-gray-800 text-sm">
          To view more info regarding eChanneling membership and benefits visit{' '}
          <a href="/membership-details" className="text-blue-700 hover:text-blue-900 font-bold underline">
            Membership Details
          </a>
        </p>
      </div>
    </div>
  );
}