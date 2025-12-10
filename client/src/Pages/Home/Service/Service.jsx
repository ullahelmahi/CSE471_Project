import React from "react";

const services = [
    {
        id: 1,
        title: "High-Speed Broadband Internet",
        icon: "🌐",
        description: "Experience uninterrupted internet with speeds ranging from 10 Mbps to 100 Mbps. Ideal for streaming, gaming, and working from home.",
        features: [
            "Unlimited data usage",
            "24/7 customer support",
            "Flexible monthly plans"
        ],
        tag: "Popular"
    },
    {
        id: 2,
        title: "Dedicated Corporate Internet",
        icon: "🏢",
        description: "Tailored connectivity solutions for businesses with symmetrical speed, reliability, and SLAs.",
        features: [
            "Guaranteed uptime",
            "Priority technical support",
            "Custom bandwidth options"
        ],
        tag: "Business"
    },
    {
        id: 3,
        title: "IP Telephony Services",
        icon: "📞",
        description: "Affordable and clear IP-based voice calling service perfect for homes and call centers.",
        features: [
            "Crystal clear voice quality",
            "Integration with existing hardware",
            "Scalable business solutions"
        ],
        tag: "Communication"
    },
    {
        id: 4,
        title: "Digital TV Services",
        icon: "📺",
        description: "Stream your favorite channels with our digital TV packages bundled with internet services.",
        features: [
            "HD and SD channels",
            "Parental controls",
            "Interactive guide support"
        ],
        tag: "Entertainment"
    },
    {
        id: 5,
        title: "Cloud Storage Solutions",
        icon: "☁️",
        description: "Store, backup, and share your files securely with our local cloud storage service.",
        features: [
            "Secure encryption",
            "Unlimited access",
            "Great for freelancers & SMEs"
        ],
        tag: "Storage"
    },
    {
        id: 6,
        title: "Smart Home Services",
        icon: "🏠",
        description: "Turn your home smart with connected lighting, climate control, and security solutions.",
        features: [
            "Voice command support",
            "Remote control access",
            "Home automation tools"
        ],
        tag: "Smart Living"
    }
];

const ServicesPage = () => {
    return (
        <section className="bg-base-100 px-6 py-16 text-slate-800 mt-12">
            <div className="max-w-6xl mx-auto space-y-12">

                {/* Header */}
                <div className="text-center">
                    <h1 className="text-4xl font-bold text-primary mb-2">📡 Our Services</h1>
                    <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                        We offer reliable and advanced internet services tailored for homes, businesses, and beyond — built for the people of Bangladesh.
                    </p>
                </div>

                {/* Service Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {services.map(service => (
                        <div key={service.id} className="bg-base-200 p-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-300">
                            <div className="flex items-start gap-4">
                                <div className="text-3xl">{service.icon}</div>
                                <div>
                                    <h2 className="text-xl font-semibold text-secondary mb-1">{service.title}</h2>
                                    <p className="text-gray-700 mb-3">{service.description}</p>
                                    <ul className=" list-inside text-gray-600 text-sm space-y-1">
                                        {service.features.map((feature, i) => (
                                            <li key={i}>✅ {feature}</li>
                                        ))}
                                    </ul>
                                    <div className="badge badge-outline badge-accent mt-4">{service.tag}</div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* CTA */}
                <div className="text-center pt-10">
                    <h2 className="text-2xl font-semibold text-primary mb-2">Need a Custom Package or Service?</h2>
                    <p className="text-gray-600 mb-4">We're happy to create a plan that suits your needs. Just get in touch with our support team.</p>
                    <a href="/support" className="btn btn-primary">Contact Support</a>
                </div>
            </div>
        </section>
    );
};

export default ServicesPage;
