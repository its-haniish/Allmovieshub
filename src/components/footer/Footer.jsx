import React from "react";
import {
    FaFacebookF,
    FaInstagram,
    FaTwitter,
    FaLinkedin,
    FaTelegram,
} from "react-icons/fa";

import ContentWrapper from "../contentWrapper/ContentWrapper";

import "./style.scss";

const Footer = () => {
    return (
        <footer className="footer">
            <ContentWrapper>
                <ul className="menuItems">
                    <li className="menuItem">Terms Of Use</li>
                    <li className="menuItem">Privacy-Policy</li>
                    <li className="menuItem">About</li>
                    <li className="menuItem">Blog</li>
                    <li className="menuItem">FAQ</li>
                </ul>
                <div className="infoText">
                    AllMoviesHub – 300mb Movies, 480p Movies, 720p Movies, Hindi Dubbed Series, 1080p Movies, Tv series download, Hubflix, Hubflixhd, Thehubflix, Hdmovieshub, Hdmovieshub.in, Hdmovieshub 300mb, Allmovieshub.
                </div>
                <div className="socialIcons">
                    <span className="icon">
                        <FaFacebookF />
                    </span>
                    <span className="icon">
                        <FaInstagram />
                    </span>
                    <span className="icon">
                        <FaTwitter />
                    </span>
                    <span className="icon">
                        <FaLinkedin />
                    </span><span className="icon">
                        <  FaTelegram/>
                    </span>
                </div>
            </ContentWrapper>
        </footer>
    );
};

export default Footer;
