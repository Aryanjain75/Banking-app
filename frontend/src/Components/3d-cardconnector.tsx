"use client";

import React from "react";
import { CardBody, CardContainer, CardItem } from "./3d-card";
import { Link } from "react-router-dom";
import TypingAnimation from "./LampEffect";

export default function ThreeDCard() {
  // Array of bank data objects
  const bankDataArray = [
    {
      name: "High-Yield Savings Account",
      description: "Your trusted partner for secure and innovative banking solutions.",
      features: [
        "Three Level Protection",
        "2% return on saving account",
      ],
      imageUrl: "https://th.bing.com/th/id/OIP.8xTozbcDKVgqkzpjJvysGAHaHa?rs=1&pid=ImgDetMain",
      websiteUrl: "http://localhost:5173/Registrations",
    },
    {
      name: "24/7 Customer Support",
      description: "Your trusted partner for secure and innovative banking solutions.",
      features: [
        "Any Type of account Related",
        "Verification On Mobile",
        "For any type of service (Activation and Deactivation)"
      ],
      imageUrl: "https://th.bing.com/th/id/OIP.t53zlzXX6h0eR8xvmj4vOwHaHa?rs=1&pid=ImgDetMain",
    },
    {
      name: "Low-Interest Personal Loans",
      description: "Offering competitive rates and flexible terms for personal loans.",
      features: [
        "Flexible Repayment Terms",
        "No Hidden Fees",
        "Quick Approval Process",
      ],
      imageUrl: "https://th.bing.com/th/id/OIP.q0SfCamZ554Keg-1mfUWwwHaE7?rs=1&pid=ImgDetMain",
      websiteUrl: "https://www.lowinterestbank.com",
    },
    {
      name: "Advanced Mobile Banking",
      description: "Experience seamless banking with our state-of-the-art mobile app.",
      features: [
        "Instant Transactions",
        "Advanced Security Features",
        "Easy Account Management",
      ],
      imageUrl: "https://th.bing.com/th/id/OIP.cNJvcVzSqwC5o7CIqMK1RgHaF0?rs=1&pid=ImgDetMain",
      websiteUrl: "https://www.advancedmobilebank.com",
    },
    {
      name: "Global Reach Bank",
      description: "Connecting you to financial services around the world.",
      features: [
        "International Transactions",
        "Multi-Currency Accounts",
        "Global Customer Support",
      ],
      imageUrl: "https://th.bing.com/th/id/OIP.rrBjgS2Lc06pySxoXXr_lAHaER?rs=1&pid=ImgDetMain",
      websiteUrl: "https://www.globalreachbank.com",
    },
    {
      name: "Innovative Financial Solutions",
      description: "Leading the way in financial technology and solutions.",
      features: [
        "AI-Powered Financial Insights",
        "Customized Investment Plans",
        "Cutting-Edge Technology",
      ],
      imageUrl: "https://th.bing.com/th/id/OIP.6P8xvslrq4Vobyz6UxjM5gHaEK?rs=1&pid=ImgDetMain",
      websiteUrl: "https://www.innovativefinancialsolutions.com",
    },
  ];

  return (
    <div className="flex flex-wrap gap-4">
        <TypingAnimation
      className="text-4xl font-bold text-black dark:text-white block h-fit w-full mt-3"
      text="Best Features ever seen"
    />
    <br/>
      <div className="gap-2 m-10 grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-4 w-full justify-center">
      {bankDataArray.map((bankData, index) => (
        <CardContainer key={index} className="inter-var">
          <CardBody className="bg-gray-50 relative group/card dark:hover:shadow-2xl dark:hover:shadow-emerald-500/[0.1] dark:bg-black dark:border-white/[0.2] border-black/[0.1] w-auto  h-auto rounded-xl p-6 border">
            {/* Bank Name */}
            <CardItem
              translateZ="50"
              className="text-2xl font-bold text-neutral-600 dark:text-white"
            >
              {bankData.name}
            </CardItem>

            {/* Bank Description */}
            <CardItem
              as="p"
              translateZ="60"
              className="text-neutral-500 text-base max-w-sm mt-2 dark:text-neutral-300"
            >
              {bankData.description}
            </CardItem>

            {/* Bank Image */}
            <CardItem translateZ="100" className="w-full mt-4">
              <img
                src={bankData.imageUrl}
                className="h-60 w-full object-cover rounded-xl group-hover/card:shadow-xl"
                alt={bankData.name}
              />
            </CardItem>

            {/* Bank Features */}
            <CardItem
              as="ul"
              translateZ="80"
              className="list-disc text-neutral-500 text-sm mt-4 pl-5 dark:text-neutral-300"
            >
              {bankData.features.map((feature, idx) => (
                <li key={idx}>{feature}</li>
              ))}
            </CardItem>

            {/* Action Buttons */}
            <div className="flex justify-between items-center mt-6">
              {bankData.websiteUrl && (
                <CardItem
                  translateZ={20}
                  as={Link}
                  to={bankData.websiteUrl}
                  target="_blank"
                  className="px-4 py-2 rounded-xl text-sm font-normal dark:text-white"
                >
                  Learn More →
                </CardItem>
              )}
              <CardItem
                translateZ={20}
                as="button"
                className="px-4 py-2 rounded-xl bg-black dark:bg-white dark:text-black text-white text-sm font-bold"
              >
                Open Account
              </CardItem>
            </div>
          </CardBody>
        </CardContainer>
      ))}
      </div>
    </div>
  );
}
