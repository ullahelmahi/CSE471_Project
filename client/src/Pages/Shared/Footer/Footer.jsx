import CoverageMap from "./CoverageMap";

const Footer = () => {
  return (
    <>
      {/* TOP FOOTER */}
      <footer className="bg-base-200 text-base-content px-10 py-12">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-5 gap-10">

          {/* SERVICES */}
          <div>
            <h6 className="text-primary font-bold text-lg mb-4">Services</h6>
            <ul className="space-y-2 text-sm">
              <li>Branding</li>
              <li>Design</li>
              <li>Marketing</li>
              <li>Advertisement</li>
            </ul>
          </div>

          {/* COMPANY */}
          <div>
            <h6 className="text-primary font-bold text-lg mb-4">Company</h6>
            <ul className="space-y-2 text-sm">
              <li>About us</li>
              <li>Contact</li>
              <li>Jobs</li>
              <li>Press kit</li>
            </ul>
          </div>

          {/* LEGAL */}
          <div>
            <h6 className="text-primary font-bold text-lg mb-4">Legal</h6>
            <ul className="space-y-2 text-sm">
              <li>Terms of use</li>
              <li>Privacy policy</li>
              <li>Cookie policy</li>
            </ul>
          </div>

          {/* OUR OFFICE */}
          <div>
            <h6 className="text-primary font-bold text-lg mb-4">Our Office</h6>
            <ul className="space-y-3 text-sm">
              <li>
                <strong>Banani</strong>
                <br />
                <span className="text-gray-500">Head Office</span>
              </li>
              <li>
                <strong>Chattogram</strong>
                <br />
                <span className="text-gray-500">Branch Office</span>
              </li>
            </ul>
          </div>

          {/* COVERAGE AREA */}
          <div>
            <h6 className="text-primary font-bold text-lg mb-4">
              📍 Coverage Area
            </h6>

            <p className="text-sm text-gray-500 mb-3">
              CityNet provides high-speed internet in:
            </p>

            <ul className="text-sm space-y-1 mb-4">
              <li>• <strong>Dhaka</strong> (Primary)</li>
              <li>• <strong>Chattogram</strong> (Branch)</li>
            </ul>

            <div className="rounded-xl overflow-hidden border border-gray-600 w-[180px]">
              <CoverageMap />
            </div>

            <p className="text-xs text-green-500 mt-2">
              ● Live service zones
            </p>
          </div>

        </div>
      </footer>

      {/* BOTTOM FOOTER */}
      <footer className="bg-base-300 border-t border-base-200 px-10 py-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">

          {/* BRAND */}
          <div className="text-center md:text-left">
            <h2 className="text-3xl font-extrabold text-primary">
              CityNet <span className="text-lg font-semibold">ISP Ltd.</span>
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              Providing reliable service since 2022
            </p>
          </div>

          {/* SOCIAL ICONS */}
          <div className="flex gap-6 text-gray-500">

            {/* Twitter */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="22"
              height="22"
              viewBox="0 0 24 24"
              className="fill-current cursor-pointer hover:text-primary"
            >
              <path d="M24 4.557a9.93 9.93 0 01-2.828.775 4.93 4.93 0 002.165-2.724 9.864 9.864 0 01-3.127 1.195 4.916 4.916 0 00-8.38 4.482A13.94 13.94 0 011.671 3.149a4.916 4.916 0 001.523 6.574 4.9 4.9 0 01-2.229-.616v.061a4.916 4.916 0 003.946 4.827 4.902 4.902 0 01-2.224.084 4.918 4.918 0 004.588 3.417A9.867 9.867 0 010 19.54a13.94 13.94 0 007.548 2.212c9.057 0 14.01-7.496 14.01-13.986 0-.21-.006-.423-.016-.634A10.012 10.012 0 0024 4.557z"/>
            </svg>

            {/* YouTube */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="22"
              height="22"
              viewBox="0 0 24 24"
              className="fill-current cursor-pointer hover:text-primary"
            >
              <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0C.488 3.45 0 5.804 0 12s.488 8.55 4.385 8.816c3.6.246 11.626.246 15.23 0C23.512 20.55 24 18.196 24 12s-.488-8.55-4.385-8.816zM9 16V8l8 4-8 4z"/>
            </svg>

            {/* Facebook */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="22"
              height="22"
              viewBox="0 0 24 24"
              className="fill-current cursor-pointer hover:text-primary"
            >
              <path d="M22.675 0h-21.35C.597 0 0 .597 0 1.326v21.348C0 23.403.597 24 1.326 24h11.495v-9.294H9.691V11.01h3.13V8.413c0-3.1 1.894-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 0-1.796.715-1.796 1.763v2.314h3.587l-.467 3.696h-3.12V24h6.116C23.403 24 24 23.403 24 22.674V1.326C24 .597 23.403 0 22.675 0z"/>
            </svg>

          </div>

        </div>
      </footer>
    </>
  );
};

export default Footer;