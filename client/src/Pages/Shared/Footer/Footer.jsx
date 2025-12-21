import CoverageMap from "./CoverageMap";

const Footer = () => {
  return (
    <>
      {/* TOP FOOTER */}
      <footer className="footer bg-base-200 text-base-content p-10 shadow-md">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-10 w-full">

          {/* SERVICES */}
          <nav>
            <h6 className="text-primary font-bold text-lg mb-2">
              Services
            </h6>
            <a className="link link-hover">Branding</a>
            <a className="link link-hover">Design</a>
            <a className="link link-hover">Marketing</a>
            <a className="link link-hover">Advertisement</a>
          </nav>

          {/* COMPANY */}
          <nav>
            <h6 className="text-primary font-bold text-lg mb-2">
              Company
            </h6>
            <a className="link link-hover">About us</a>
            <a className="link link-hover">Contact</a>
            <a className="link link-hover">Jobs</a>
            <a className="link link-hover">Press kit</a>
          </nav>

          {/* LEGAL */}
          <nav>
            <h6 className="text-primary font-bold text-lg mb-2">
              Legal
            </h6>
            <a className="link link-hover">Terms of use</a>
            <a className="link link-hover">Privacy policy</a>
            <a className="link link-hover">Cookie policy</a>
          </nav>

          {/* OUR OFFICE */}
          <nav>
            <h6 className="text-primary font-bold text-lg mb-2">
              Our Office
            </h6>
            <p className="text-sm">
              <strong>Banani</strong> <br />
              Head Office
            </p>
            <p className="text-sm mt-2">
              <strong>Chattogram</strong> <br />
              Branch Office
            </p>
          </nav>

          {/* COVERAGE AREA */}
          <div className="md:col-span-2">

            {/* ROW 1: TITLE */}
            <h6 className="text-primary font-bold text-lg flex items-center gap-2 mb-4">
              📍 Coverage Area
            </h6>

            {/* ROW 2: TEXT + MAP */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">

              {/* LEFT: TEXT */}
              <div className="text-sm text-gray-500">
                <p className="mb-3">
                  CityNet currently provides high-speed internet services in:
                </p>

                <ul className="list-disc list-inside space-y-2 text-base-content">
                  <li>
                    <span className="font-semibold text-primary">
                      Dhaka
                    </span>{" "}
                    (Primary coverage)
                  </li>
                  <li>
                    <span className="font-semibold text-primary">
                      Chattogram
                    </span>{" "}
                    (Branch coverage)
                  </li>
                </ul>

                <p className="mt-4 text-xs flex items-center gap-2">
                  <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                  Live service zones
                </p>
              </div>

              {/* RIGHT: MAP */}
              <div className="w-full h-[220px] rounded-2xl overflow-hidden border border-primary/30 shadow-lg">
                <CoverageMap />
              </div>

            </div>
          </div>

        </div>
      </footer>

      {/* BOTTOM FOOTER */}
      <footer className="footer bg-base-200 text-base-content border-base-300 border-t px-10 py-4 flex justify-between shadow-md">
        <aside className="grid-flow-col items-center">
          <div>
            <a className="text-4xl font-extrabold text-primary">
              CityNet
            </a>
            <span className="ml-2 text-lg font-semibold">
              ISP Ltd.
            </span>
            <br />
            <h3 className="font-bold text-sm mt-2 text-slate-600">
              Providing reliable service since 2022
            </h3>
          </div>
        </aside>

        {/* SOCIAL ICONS */}
        <nav className="md:place-self-center md:justify-self-end">
          <div className="grid grid-flow-col gap-4">
            {/* Twitter */}
            <a>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                className="fill-current"
              >
                <path d="M24 4.557c-.883.392-1.832.656-2.828.775..." />
              </svg>
            </a>

            {/* YouTube */}
            <a>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                className="fill-current"
              >
                <path d="M19.615 3.184c-3.604-.246..." />
              </svg>
            </a>

            {/* Facebook */}
            <a>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                className="fill-current"
              >
                <path d="M9 8h-3v4h3v12h5v-12..." />
              </svg>
            </a>
          </div>
        </nav>
      </footer>
    </>
  );
};

export default Footer;