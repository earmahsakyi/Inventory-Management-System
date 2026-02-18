import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const CTASection = () => (
  <section id="cta" className="py-32 relative overflow-hidden">
    {/* Spotlight glow */}
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
      <div className="w-[600px] h-[300px] bg-primary/8 rounded-full blur-[120px]" />
    </div>

    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="relative z-10 container mx-auto px-6 text-center space-y-8"
    >
      <h2 className="text-3xl sm:text-5xl font-heading font-bold text-foreground max-w-2xl mx-auto leading-tight">
        Ready to transform your business operations?
      </h2>
      <p className="text-lg text-muted-foreground max-w-lg mx-auto">
        Join thousands of businesses already using InvenFlow to streamline their inventory and sales.
      </p>
      <div className="flex justify-center gap-4">
        <Button variant="hero" size="lg" className="animate-pulse-glow" asChild>
          <Link to="/dashboard">
            Start Free Trial <ArrowRight className="ml-1 h-4 w-4" />
          </Link>
        </Button>
      </div>
      <p className="text-xs text-muted-foreground">No credit card required · 14-day free trial</p>
    </motion.div>
  </section>
);

export default CTASection;
