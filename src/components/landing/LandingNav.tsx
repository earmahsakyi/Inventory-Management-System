import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Package } from "lucide-react";

const LandingNav = () => (
  <nav className="fixed top-0 left-0 right-0 z-50 glass">
    <div className="container mx-auto px-6 h-16 flex items-center justify-between">
      <Link to="/" className="flex items-center gap-2.5 text-foreground font-heading font-semibold text-lg">
        <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center">
          <Package className="h-4 w-4 text-primary" />
        </div>
        InvenFlow
      </Link>

      <div className="hidden md:flex items-center gap-8 text-sm text-muted-foreground">
        <a href="#features" className="hover:text-foreground transition-colors duration-200">Features</a>
        <a href="#preview" className="hover:text-foreground transition-colors duration-200">Preview</a>
        <a href="#cta" className="hover:text-foreground transition-colors duration-200">Pricing</a>
      </div>

      <div className="flex items-center gap-3">
        <Button variant="ghost" size="sm" className="text-muted-foreground">
          Log in
        </Button>
        <Button variant="default" size="sm" asChild>
          <Link to="/dashboard">Get Started</Link>
        </Button>
      </div>
    </div>
  </nav>
);

export default LandingNav;
