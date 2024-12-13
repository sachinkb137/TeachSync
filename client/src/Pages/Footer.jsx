import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGithub, faTwitter, faInstagram, faLinkedin } from '@fortawesome/free-brands-svg-icons';

const Footer = () => {
    return (
        <footer className="bg-dark text-light py-4">
            <div className="container">
                <div className="row">
                    <div className="col-md-4 border-end border-white">
                        <div className="d-flex align-items-center">
                            <p className="mb-0">Sachin K B</p>
                            <span>&nbsp;|&nbsp;</span>
                            <FontAwesomeIcon icon={faGithub} className="me-2 text-white" />
                            <FontAwesomeIcon icon={faTwitter} className="me-2 text-white" />
                            <FontAwesomeIcon icon={faInstagram} className="me-2 text-white" />
                            <FontAwesomeIcon icon={faLinkedin} className="me-2 text-white" />
                        </div>
                    </div>
                    <div className="col-md-4 border-end border-white">
                        <div className="d-flex align-items-center">
                            <p className="mb-0">Vikas B M</p>
                            <span>&nbsp;|&nbsp;</span>
                            <FontAwesomeIcon icon={faGithub} className="me-2 text-white" />
                            <FontAwesomeIcon icon={faTwitter} className="me-2 text-white" />
                            <FontAwesomeIcon icon={faInstagram} className="me-2 text-white" />
                            <FontAwesomeIcon icon={faLinkedin} className="me-2 text-white" />
                        </div>
                    </div>
                    <div className="col-md-4 text-end">
                        <div className="d-flex align-items-center justify-content-end">
                            <p className="mb-0">Tejas T M</p>
                            <span>&nbsp;|&nbsp;</span>
                            <FontAwesomeIcon icon={faGithub} className="me-2 text-white" />
                            <FontAwesomeIcon icon={faTwitter} className="me-2 text-white" />
                            <FontAwesomeIcon icon={faInstagram} className="me-2 text-white" />
                            <FontAwesomeIcon icon={faLinkedin} className="me-2 text-white" />
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
