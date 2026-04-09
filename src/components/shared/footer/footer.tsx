import { Link } from "@tanstack/react-router";
import React from "react";

import { GitHub, Instagram, LinkedIn, Mail } from "@/components/icons/brands";

const FooterLink = ({
  to,
  children,
}: {
  to: string;
  children: React.ReactNode;
}) => (
  <li>
    <Link to={to} className="font-semibold text-base-content-black">
      {children}
    </Link>
  </li>
);

const SocialMediaLink = ({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) => (
  <li>
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="font-semibold text-base-content-black"
    >
      {children}
    </a>
  </li>
);

const Footer = () => {
  return (
    <footer className="px-4 py-10 lg:px-8">
      <div>
        <div className="mx-auto flex flex-col gap-12">
          <div className="flex flex-col items-center gap-8 md:justify-between md:flex-row">
            <ul className="flex items-center gap-8">
              <FooterLink to="/">Home</FooterLink>
              <FooterLink to="/about-us">About Us</FooterLink>
              <FooterLink to="/events">Events</FooterLink>
              <FooterLink to="/events#faq">FAQ</FooterLink>
            </ul>
            <ul className="flex items-center gap-8">
              <SocialMediaLink href="https://www.linkedin.com/company/nanogramhub/">
                <LinkedIn className="size-6" />
              </SocialMediaLink >
              <SocialMediaLink href="https://www.instagram.com/nanogram_drait">
                <Instagram className="size-6" />
              </SocialMediaLink>
              <SocialMediaLink href="mailto:nanogramhub@gmail.com">
                <Mail className="size-6" />
              </SocialMediaLink>
              <SocialMediaLink href="https://github.com/nanogramhub">
                <GitHub className="size-6 dark:fill-white" />
              </SocialMediaLink>
            </ul>
          </div>
          <div className="flex flex-col items-center md:justify-between md:flex-row md:gap-0 gap-8">
            <p className="w-auto text-sm text-left text-muted-foreground">
              Dept. of Electronics and Communication Engineering
              <br />
              Dr. Ambedkar Institute of Technology, Bengaluru
            </p>
            <p className="w-auto text-sm text-right text-muted-foreground">
              © Nanogram - The Tech Hub 2026, All Rights Reserved
              <br />
              Made with ❤️ by Pramoda S R - Viceroy, 2024, Nanogram
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
