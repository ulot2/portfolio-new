import React from 'react'
import "@/styles/Footer.css";
import { LuGithub } from "react-icons/lu";
import { MdOutlineEmail } from "react-icons/md";
import { LuLinkedin } from "react-icons/lu";
import { FaXTwitter } from "react-icons/fa6";
import Link from 'next/link';

export const Footer = () => {
  return (
    <section className='general-box footer'>
        <div className="general-container footer-container">
            <h3 className="footer-header">Toluwalope Adegoke</h3>
            <p className="footer-text">Frontend Developer | Building Modern Web Experiences</p>
            <div className="footer-social">
                <Link href="https://github.com/ulot2" target="_blank" rel="noopener noreferrer" className='footer-social-icon'>
                    <LuGithub />
                </Link>
                <Link href="mailto:tolu.nuell@gmail.com" target="_blank" rel="noopener noreferrer" className='footer-social-icon'>
                    <MdOutlineEmail />
                </Link>
                <Link href="https://www.linkedin.com/in/toluwalope-adegoke-b441b9380" target="_blank" rel="noopener noreferrer" className='footer-social-icon'>
                    <LuLinkedin />
                </Link>
                <Link href="https://x.com/Tolu_dev" target="_blank" rel="noopener noreferrer" className='footer-social-icon'>
                    <FaXTwitter />
                </Link>
            </div>
            <p className="footer-credit">&copy; {new Date().getFullYear()} Toluwalope Adegoke. All rights reserved.</p>
        </div>
    </section>
  )
}
