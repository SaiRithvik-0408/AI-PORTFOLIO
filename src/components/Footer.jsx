import React from 'react';

const Footer = () => {
    return (
        <footer className="mt-12 py-6 border-t border-white/10 bg-red-500/5 backdrop-blur-sm rounded-lg">
            <div className="text-center space-y-2">
                <p className="text-red-400 font-semibold flex items-center justify-center gap-2">
                    <span className="text-lg">™</span>
                    <span>Designed & Developed by</span>
                    <a
                        href="https://github.com/SaiRithvik-0408"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-red-300 transition-colors underline decoration-red-400/50 hover:decoration-red-300"
                    >
                        @SaiRithvik-0408
                    </a>
                </p>
                <p className="text-gray-400 text-sm">
                    © {new Date().getFullYear()} All rights reserved
                </p>
            </div>
        </footer>
    );
};

export default Footer;
