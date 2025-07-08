import Link from "next/link";

function Footer() {
  return (
    <footer className=" text-white py-6 mt-8 bg-primary">
      <div className="max-w-7xl mx-auto px-4">
        {/* Top Section with Navigation Links */}
        <div className="flex flex-wrap justify-between">
          <div className="flex flex-col space-y-4">
            <h3 className="text-lg font-semibold">Quick Links</h3>
            <ul className="flex justify-center content-center gap-2">
              <li>
                <Link href="/" passHref>
                  Home
                </Link>
              </li>
              <li>
                <Link href="/about" passHref>
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" passHref>
                  Contact
                </Link>
              </li>
              <li>
                <Link href="/shop" passHref>
                  Shop
                </Link>
              </li>
            </ul>
          </div>

          {/* Social Media Links */}
          <div className="flex flex-col space-y-4">
            <h3 className="text-lg font-semibold">Follow Us</h3>
            <div className="flex space-x-4">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white"
              >
                Facebook
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white"
              >
                Instagram
              </a>
              <a
                href="https://www.instagram.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white"
              >
                Twitter
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Section with Copyright and Legal Links */}
        <div className="mt-6 border-t border-gray-700 pt-6 text-center text-sm">
          <p>
            &copy; {new Date().getFullYear()} Jewellery. All rights reserved.
          </p>
          <div className="mt-2">
            <Link href="/privacy-policy" passHref>
              Privacy Policy
            </Link>
            |
            <Link href="/terms-of-service" passHref>
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
