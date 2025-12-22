import { Link } from "react-router-dom";
import { Github, Twitter, Instagram } from "lucide-react";

export const Footer = () => {
  return (
    <footer className="border-t border-border bg-secondary/30 py-12">
      <div className="container px-4">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div className="md:col-span-2">
            <Link to="/" className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-racing-gradient rounded-lg flex items-center justify-center">
                <span className="font-display font-black text-xl text-primary-foreground">F1</span>
              </div>
              <span className="font-display font-bold text-xl tracking-wider">VELOCITY</span>
            </Link>
            <p className="font-body text-muted-foreground max-w-sm">
              Experience the ultimate automotive journey. Explore the world's fastest cars and legendary F1 drivers.
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-display font-bold text-sm uppercase tracking-wider mb-4">Explore</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/cars" className="font-body text-muted-foreground hover:text-foreground transition-colors">
                  Cars
                </Link>
              </li>
              <li>
                <Link to="/drivers" className="font-body text-muted-foreground hover:text-foreground transition-colors">
                  Drivers
                </Link>
              </li>
            </ul>
          </div>

          {/* Account */}
          <div>
            <h4 className="font-display font-bold text-sm uppercase tracking-wider mb-4">Account</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/profile" className="font-body text-muted-foreground hover:text-foreground transition-colors">
                  Profile
                </Link>
              </li>
              <li>
                <Link to="/favorites" className="font-body text-muted-foreground hover:text-foreground transition-colors">
                  Favorites
                </Link>
              </li>
              <li>
                <Link to="/preferences" className="font-body text-muted-foreground hover:text-foreground transition-colors">
                  Preferences
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="flex flex-col md:flex-row justify-between items-center pt-8 border-t border-border">
          <p className="font-mono text-xs text-muted-foreground mb-4 md:mb-0">
            © {new Date().getFullYear()} Velocity. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <a
              href="#"
              className="w-9 h-9 rounded-full bg-secondary border border-border flex items-center justify-center hover:border-primary/50 transition-colors"
            >
              <Twitter className="w-4 h-4 text-muted-foreground" />
            </a>
            <a
              href="#"
              className="w-9 h-9 rounded-full bg-secondary border border-border flex items-center justify-center hover:border-primary/50 transition-colors"
            >
              <Instagram className="w-4 h-4 text-muted-foreground" />
            </a>
            <a
              href="#"
              className="w-9 h-9 rounded-full bg-secondary border border-border flex items-center justify-center hover:border-primary/50 transition-colors"
            >
              <Github className="w-4 h-4 text-muted-foreground" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};
