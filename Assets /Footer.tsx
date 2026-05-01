import React from 'react';
import { motion } from 'motion/react';
import whiteLogo from './vestore-v1-white.svg';

const Footer = () => (
  <footer className="bg-vestora-charcoal text-vestora-sage py-12 md:py-16 border-t border-white/10">
    <div className="max-w-7xl mx-auto px-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 md:gap-12 mb-12 md:mb-16">
        <div className="col-span-1 sm:col-span-2 md:col-span-4 lg:col-span-2">
          <div className="flex items-center gap-3 mb-6">
            <img src={whiteLogo} alt="Vestora" className="h-8 w-auto" />
          </div>
          <p className="text-sm max-w-xs mb-6">
            The UAE's first EOS investment comparison platform. Helping companies navigate end-of-service benefits with clarity.
          </p>
        </div>

        <div>
          <h4 className="text-vestora-white font-semibold mb-4">Platform</h4>
          <ul className="space-y-3 text-sm flex flex-col items-start">
            {[['EOS Calculator', '#calculator'], ['Fund Comparison', '#platform'], ['Fund Managers', '#platform']].map(([label, href]) => (
              <li key={label}>
                <motion.a whileHover={{ x: 5, color: '#ffffff' }} href={href} className="hover:text-white transition-colors inline-block">{label}</motion.a>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="text-vestora-white font-semibold mb-4">Company</h4>
          <ul className="space-y-3 text-sm flex flex-col items-start">
            {['About Us', 'Contact'].map((link) => (
              <li key={link}>
                <motion.a whileHover={{ x: 5, color: '#ffffff' }} href="#" className="hover:text-white transition-colors inline-block">{link}</motion.a>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="text-vestora-white font-semibold mb-4">Legal</h4>
          <ul className="space-y-3 text-sm flex flex-col items-start">
            {['Privacy Policy', 'Terms of Service', 'Security'].map((link) => (
              <li key={link}>
                <motion.a whileHover={{ x: 5, color: '#ffffff' }} href="#" className="hover:text-white transition-colors inline-block">{link}</motion.a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4 text-xs">
        <p>&copy; {new Date().getFullYear()} Vestora. All rights reserved.</p>
        <div className="flex gap-6">
          <motion.a whileHover={{ x: 5, color: '#ffffff' }} href="#" className="hover:text-white transition-colors inline-block">Twitter</motion.a>
          <motion.a whileHover={{ x: 5, color: '#ffffff' }} href="#" className="hover:text-white transition-colors inline-block">LinkedIn</motion.a>
        </div>
      </div>
    </div>
  </footer>
);

export default Footer;
