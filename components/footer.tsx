import Link from "next/link";
import { Phone, MapPin, Clock } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-foreground text-background py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          <div className="lg:col-span-2">
            <Link href="/" className="inline-block mb-4">
              <h3 className="text-2xl font-bold text-background">
                Bhale Biryani
              </h3>
              <p className="text-background/60 text-sm">Seethammadhara</p>
            </Link>
            <p className="text-background/70 leading-relaxed max-w-md">
              Serving authentic Hyderabadi-style Dum Biryani in Visakhapatnam
              since years. Experience the taste that keeps our customers coming
              back.
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-background mb-4">Quick Links</h4>
            <ul className="space-y-3">
              <li>
                <Link
                  href="#home"
                  className="text-background/70 hover:text-background transition-colors"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  href="#menu"
                  className="text-background/70 hover:text-background transition-colors"
                >
                  Menu
                </Link>
              </li>
              <li>
                <Link
                  href="#reviews"
                  className="text-background/70 hover:text-background transition-colors"
                >
                  Reviews
                </Link>
              </li>
              <li>
                <Link
                  href="#location"
                  className="text-background/70 hover:text-background transition-colors"
                >
                  Location
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-background mb-4">Contact Info</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <Phone className="h-5 w-5 text-accent flex-shrink-0 mt-0.5" />
                <a
                  href="tel:+919100888983"
                  className="text-background/70 hover:text-background transition-colors"
                >
                  091008 88983
                </a>
              </li>
              <li className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-accent flex-shrink-0 mt-0.5" />
                <span className="text-background/70">
                  Near Alluri Seetharama Raju Statue, Seethammadhara
                </span>
              </li>
              <li className="flex items-start gap-3">
                <Clock className="h-5 w-5 text-accent flex-shrink-0 mt-0.5" />
                <span className="text-background/70">
                  Monday - Sunday : 11:00 AM - 10:30 PM
                </span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-background/20 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-background/60 text-sm">
            &copy; {new Date().getFullYear()} Bhale Biryani Seethammadhara. All
            rights reserved.
          </p>
          {/* <p className="text-background/60 text-sm">
             {"\u20B9"}100 - {"\u20B9"}200 per person
          </p> */}
        </div>
      </div>
    </footer>
  );
}
