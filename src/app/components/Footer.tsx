"use client";
import Image from "next/image";
import { FaInstagram, FaLinkedin, FaTiktok } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="relative w-full top-10 py-12 px-6  text-white flex flex-col items-center text-center z-50 overflow-hidden">
      {/* Logo */}
      <Image
        src="/logo-nexus.png"
        alt="Nexus Club Logo"
        width={520}
        height={80}
        className="drop-shadow-[0_0_15px_#8a2be2]"
      />

      {/* Slogan */}
      <h2 className="text-4xl md:text-6xl font-extrabold text-[#00ffff] drop-shadow-[0_0_20px_#00ffff] mt-6">
        We make sense from chaos
      </h2>

      {/* Bold Club Identity */}
      <p className="max-w-2xl text-gray-300 text-sm md:text-base mt-6 leading-relaxed px-4 font-light tracking-wide">
        Nexus Club is more than just a club - it’s a community. Created by
        students for students. We’re based in Algiers, but our ideas break
        borders. If it’s futuristic, wild, and meaningful - it’s Nexus.
      </p>

      {/* Location */}
      <p className="text-sm text-gray-500 mt-2 italic">
        Ifag Higher Institute, Benaknoun, Algiers, Algeria
      </p>

      {/* Social Icons */}
      <div className="flex space-x-8 text-[#bbbbbb] text-xl mt-6">
        <a
          href="https://tiktok.com/@nexus.club_"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-white hover:drop-shadow-[0_0_6px_#ffffff]"
        >
          <FaTiktok size={24} />
        </a>
        <a
          href="https://instagram.com/nexus.club_"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-white hover:drop-shadow-[0_0_6px_#ffffff]"
        >
          <FaInstagram size={24} />
        </a>
        <a
          href="https://www.linkedin.com/in/nexus-club-692baa334/"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-white hover:drop-shadow-[0_0_6px_#ffffff]"
        >
          <FaLinkedin size={24} />
        </a>
      </div>

      {/* Final Line */}
      <p className="text-sm text-gray-400 font-light tracking-wide mt-6">
        © 2025 Nexus Club - Built with 🔥, driven by ⚡, fueled by 💡, made with
        ❤️.
      </p>
    </footer>
  );
}
