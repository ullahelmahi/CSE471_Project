import React from "react";

const FtpPage = () => {
    return (
        <section className="bg-base-100 px-6 py-16 text-slate-800 mt-12">
            <div className="max-w-5xl mx-auto space-y-10">

                {/* Page Title */}
                <div className="text-center">
                    <h1 className="text-4xl font-bold text-primary">📂 FTP Services</h1>
                    <p className="text-gray-600 mt-2">
                        Access fast, local content with our high-speed FTP servers.
                    </p>
                </div>

                {/* Introductory Section */}
                <div className="bg-base-200 p-6 rounded-xl shadow space-y-4">
                    <h2 className="text-2xl font-semibold text-secondary">What is FTP?</h2>
                    <p>
                        FTP (File Transfer Protocol) allows users to <span className="font-bold">download and upload files</span> through a secure and stable connection. At <strong>CityNet</strong>, we provide high-speed FTP access to let you enjoy **local movies, software, games, and more** directly from our servers — without using your data cap.
                    </p>
                </div>

                {/* Key Features */}
                <div>
                    <h2 className="text-2xl font-semibold text-secondary mb-4">🚀 Key Features</h2>
                    <ul className="list-disc list-inside space-y-2 text-gray-700">
                        <li>🖥️ Fast and local download speeds</li>
                        <li>🎬 Huge library of movies, shows, games, and apps</li>
                        <li>📁 24/7 access from anywhere on our network</li>
                        <li>🔐 Secure and authenticated FTP login (for private access)</li>
                        <li>🧾 Usage is excluded from your internet data quota</li>
                    </ul>
                </div>

                {/* How to Connect */}
                <div className="bg-base-200 p-6 rounded-xl shadow space-y-4">
                    <h2 className="text-2xl font-semibold text-secondary">🔌 How to Connect to Our FTP Server</h2>
                    <ol className="list-decimal list-inside space-y-2 text-gray-700">
                        <li>Open any FTP client (e.g., FileZilla, Cyberduck).</li>
                        <li>Enter the server address: <code className="text-primary">ftp.CityNet.com</code></li>
                        <li>Use your ISP account username and password to log in.</li>
                        <li>Browse and download your desired content instantly!</li>
                    </ol>
                    <p className="text-sm text-gray-500 mt-2">Need help? See our <a href="/help-center" className="link link-secondary">Help Center</a> for step-by-step FTP client setup guides.</p>
                </div>

                {/* FAQ Section */}
                <div>
                    <h2 className="text-2xl font-semibold text-secondary mb-4">❓ Frequently Asked Questions</h2>
                    <div className="collapse collapse-plus bg-base-200 mb-2">
                        <input type="checkbox" />
                        <div className="collapse-title text-lg font-medium">
                            Is the FTP service free?
                        </div>
                        <div className="collapse-content">
                            <p>Yes! All FTP downloads are included with your plan and do not count against your data usage.</p>
                        </div>
                    </div>

                    <div className="collapse collapse-plus bg-base-200 mb-2">
                        <input type="checkbox" />
                        <div className="collapse-title text-lg font-medium">
                            Can I upload files to the server?
                        </div>
                        <div className="collapse-content">
                            <p>Currently, upload access is only available to authorized users. Please contact support for more info.</p>
                        </div>
                    </div>

                    <div className="collapse collapse-plus bg-base-200">
                        <input type="checkbox" />
                        <div className="collapse-title text-lg font-medium">
                            What’s the speed of the FTP connection?
                        </div>
                        <div className="collapse-content">
                            <p>All FTP downloads use high-speed LAN routing, so you can expect blazing-fast performance with minimal latency.</p>
                        </div>
                    </div>
                </div>

                {/* Contact CTA */}
                <div className="text-center mt-10">
                    <p className="text-gray-600">Need FTP login help or content requests?</p>
                    <a href="/support" className="btn btn-primary mt-2">Contact Our Support Team</a>
                </div>

            </div>
        </section>
    );
};

export default FtpPage;
