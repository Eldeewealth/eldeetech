import { Link } from "react-router-dom";
import { Facebook, Instagram, Linkedin, Twitter, Mail, MapPin, Phone } from "lucide-react";
import logo from "../assets/eldeetech-logo.png";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-10 h-10 rounded-lg overflow-hidden">
                <img src={logo} alt="Eldeetech" className="w-full h-full object-cover" />
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-lg leading-tight">Eldeetech</span>
                <span className="text-xs opacity-80">Ltd</span>
              </div>
            </div>
            <p className="text-sm opacity-90 mb-4">
              Empowering Technology, Creativity and AI-Driven Innovation
            </p>
            <div className="flex space-x-3">
              <a
                href="https://facebook.com/Eldeetech"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-primary-foreground/10 hover:bg-accent flex items-center justify-center transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="w-4 h-4" />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-primary-foreground/10 hover:bg-accent flex items-center justify-center transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-primary-foreground/10 hover:bg-accent flex items-center justify-center transition-colors"
                aria-label="LinkedIn"
              >
                <Linkedin className="w-4 h-4" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-primary-foreground/10 hover:bg-accent flex items-center justify-center transition-colors"
                aria-label="Twitter"
              >
                <Twitter className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-sm opacity-90 hover:opacity-100 hover:text-accent transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-sm opacity-90 hover:opacity-100 hover:text-accent transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/services" className="text-sm opacity-90 hover:opacity-100 hover:text-accent transition-colors">
                  Services
                </Link>
              </li>
              <li>
                <Link to="/training" className="text-sm opacity-90 hover:opacity-100 hover:text-accent transition-colors">
                  Training
                </Link>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Services</h3>
            <ul className="space-y-2">
              <li className="text-sm opacity-90">IT Consultancy</li>
              <li className="text-sm opacity-90">Digital Marketing</li>
              <li className="text-sm opacity-90">Web Development</li>
              <li className="text-sm opacity-90">Fintech Solutions</li>
              <li className="text-sm opacity-90">E-Commerce</li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-start space-x-2 text-sm opacity-90">
                <Mail className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <span>info@eldeetech.com.ng</span>
              </li>
              <li className="flex items-start space-x-2 text-sm opacity-90">
                <Phone className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <span>+234 708 2777 516</span>
              </li>
              <li className="flex items-start space-x-2 text-sm opacity-90">
                <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <span>Ebonyi, Nigeria</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-primary-foreground/20 mt-8 pt-8 text-center">
          <p className="text-sm opacity-80">
            © {currentYear} Eldeetech Ltd. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
