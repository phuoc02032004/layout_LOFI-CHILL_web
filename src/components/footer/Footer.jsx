import React from 'react';
import './Footer.css';
import { FaFacebook } from "react-icons/fa";
import { FaInstagram } from "react-icons/fa";
import { IoLogoTwitter } from "react-icons/io5";
import { FaGooglePlus } from "react-icons/fa";
import { FaYoutube } from "react-icons/fa";

function Footer() {
  return (
    <footer>
    <div class="footerContainer">
        <div class="socialIcons">
            <a href=""><FaFacebook /></a>
            <a href=""><FaInstagram /></a>
            <a href=""><IoLogoTwitter /></a>
            <a href=""><FaGooglePlus /></a>
            <a href=""><FaYoutube /></a>
        </div>
        <div class="footerNav">
            <ul><li><a href="">Home</a></li>
                <li><a href="">News</a></li>
                <li><a href="">About</a></li>
                <li><a href="">Contact Us</a></li>
                <li><a href="">our Team</a></li>
            </ul>
        </div>
        
    </div>
    <div class="footerBottom">
        <p>Copyright &copy;2023; Designed by <span class="designer">Noman</span></p>
    </div>
</footer>

  );
}

export default Footer;