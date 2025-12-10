import React from "react";

const AboutUs = () => {
    return (
        <section className="bg-base-100 text-slate-800 px-6 py-16 mt-12">
            <div className="max-w-5xl mx-auto space-y-10">

                {/* Title */}
                <div className="text-center">
                    <h2 className="text-4xl font-bold text-primary mb-2">Connecting People. Empowering Cities.</h2>
                    <p className="text-gray-600 text-lg">
                        Welcome to <span className="font-semibold text-secondary">CityNet</span>, your city’s dedicated internet partner.
                    </p>
                </div>

                {/* Our Mission */}
                <div>
                    <h3 className="text-2xl font-semibold text-primary mb-2">🚀 Our Mission</h3>
                    <p className="text-gray-700">
                        To <strong>empower individuals and families with seamless internet access</strong>, by simplifying how they manage subscriptions, payments, and support — all in one place.
                    </p>
                </div>

                {/* What Makes Us Different */}
                <div>
                    <h3 className="text-2xl font-semibold text-primary mb-2">🌍 What Makes Us Different?</h3>
                    <ul className="list-disc list-inside space-y-2 text-gray-700">
                        <li><strong>Local Understanding:</strong> Packages and support tailored for the people of your city.</li>
                        <li><strong>User-Centered Design:</strong> Clean, easy-to-navigate platform for everyone.</li>
                        <li><strong>Instant Support:</strong> Real-time ticket tracking and scheduling tools.</li>
                        <li><strong>Reliable Connectivity:</strong> Smooth and stable internet for every lifestyle.</li>
                    </ul>
                </div>

                {/* Who We Serve */}
                <div>
                    <h3 className="text-2xl font-semibold text-primary mb-2">👨‍💻 Who We Serve</h3>
                    <ul className="list-disc list-inside text-gray-700 space-y-1">
                        <li>Home users wanting stable and affordable internet</li>
                        <li>Students needing fast access for online learning</li>
                        <li>Remote professionals relying on uninterrupted service</li>
                        <li>Families who stream, game, and stay connected</li>
                    </ul>
                </div>

                {/* Admin Info */}
                <div>
                    <h3 className="text-2xl font-semibold text-primary mb-2">💼 Admins, Rejoice!</h3>
                    <p className="text-gray-700">
                        Our backend system helps ISP administrators:
                    </p>
                    <ul className="list-disc list-inside text-gray-700 space-y-1 mt-2">
                        <li>Manage subscriptions and automate billing</li>
                        <li>Assign technicians to service requests</li>
                        <li>Send out service updates and alerts</li>
                        <li>Analyze usage and performance trends</li>
                    </ul>
                </div>

                {/* Our Promise */}
                <div>
                    <h3 className="text-2xl font-semibold text-primary mb-2">💬 Our Promise</h3>
                    <p className="text-gray-700">
                        We’re more than just an internet provider — we’re your <strong>daily digital partner</strong>. Whether you're streaming, working, or studying, <span className="text-secondary font-medium">CityNet</span> is here to keep you connected.
                    </p>
                </div>

                {/* Contact Info */}
                <div className="bg-base-200 p-6 rounded-xl shadow">
                    <h3 className="text-xl font-semibold text-primary mb-3">📞 Let’s Connect</h3>
                    <p className="text-gray-700"><strong>Phone:</strong> +880 1234-567890</p>
                    <p className="text-gray-700"><strong>Email:</strong> support@CityNet.com</p>
                    <p className="text-gray-700"><strong>Website:</strong> <a className="link link-secondary" href="http://www.CityNet.com">www.CityNet.com</a></p>
                </div>

            </div>
        </section>
    );
};

export default AboutUs;
