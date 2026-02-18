import { Package } from "lucide-react";

const Footer = () => (
  <footer className="border-t border-border/50 py-12">
    <div className="container mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
      <div className="flex items-center gap-2 text-muted-foreground">
        <Package className="h-4 w-4 text-primary" />
        <span className="text-sm font-heading font-medium">InvenFlow</span>
      </div>
      <p className="text-xs text-muted-foreground">
        © {new Date().getFullYear()} InvenFlow. All rights reserved.
      </p>
    </div>
  </footer>
);

export default Footer;
