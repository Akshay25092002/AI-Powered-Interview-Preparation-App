import React from "react";
import { Facebook, Twitter, Instagram, Linkedin } from "lucide-react"; // Import Lucide icons
import { Link } from "react-router-dom";
import Container from "./Container";
import { NavRoutes } from "@/lib/helpers";

const SocialLink = ({ href, icon, hoverColor }) => {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={`hover:${hoverColor}`}
    >
      {icon}
    </a>
  );
};

const FooterLink = ({ to, children }) => {
  return (
    <li>
      <Link
        to={to}
        className="hover:underline text-gray-300 hover:text-gray-100"
      >
        {children}
      </Link>
    </li>
  );
};

export const Footer = () => {
  return (
    <div className="w-full bg-black text-gray-300 hover:text-gray-100 py-8">
      <Container>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* First Column: Links */}
          <div>
            <h3 className="font-bold text-lg mb-4">Quick Links</h3>
            <ul className="space-y-2">
              {NavRoutes.map((route) => (
                <FooterLink key={route.href} to={route.href}>
                  {route.label}
                </FooterLink>
              ))}
            </ul>
          </div>

          {/* Second Column: About Us */}
          <div>
            <h3 className="font-bold text-lg mb-4">About Us</h3>
            <p>
              Unlock your full potential with AI-powered tools! Our platform
              equips you with smart resources to sharpen your interview skills
              and boost your chances of success.
            </p>
          </div>

          {/* Third Column: Services */}
          <div>
            <h3 className="font-bold text-lg mb-4">Services</h3>
            <ul>
              <FooterLink to="/services/interview-prep">
                Interview Preparation
              </FooterLink>
              <FooterLink to="/services/career-coaching">
                Career Coaching
              </FooterLink>
              <FooterLink to="/services/resume-building">
                Resume Building
              </FooterLink>
            </ul>
          </div>

          {/* Fourth Column: Address and Social Media */}
          <div>
            <h3 className="font-bold text-lg mb-4">Contact Us</h3>
            <p className="mb-4">AI GANDHINAGAR</p>
            <div className="flex gap-4">
              <SocialLink
                href="https://facebook.com"
                icon={<Facebook size={24} />}
                hoverColor="text-blue-500"
              />
              <SocialLink
                href="https://twitter.com"
                icon={<Twitter size={24} />}
                hoverColor="text-blue-400"
              />
              <SocialLink
                href="https://instagram.com"
                icon={<Instagram size={24} />}
                hoverColor="text-pink-500"
              />
              <SocialLink
                href="https://linkedin.com"
                icon={<Linkedin size={24} />}
                hoverColor="text-blue-700"
              />
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
};
