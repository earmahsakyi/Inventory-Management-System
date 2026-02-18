import { useRef, useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTypingEffect } from "@/hooks/useTypingEffect";
import ParticleBackground from "./ParticleBackground";

const phrases = [
  "Manage your inventory.",
  "Track every sale.",
  "Run your business smarter.",
];

const DashboardMockup = () => (
  <div className="relative w-full max-w-lg">
    <div className="glass-card p-4 space-y-3 transform perspective-[1200px] rotateY-[-6deg] rotateX-[4deg]"
      style={{ transform: "perspective(1200px) rotateY(-6deg) rotateX(4deg)" }}>
      {/* Mini top bar */}
      <div className="flex items-center gap-2 pb-2 border-b border-border/50">
        <div className="w-2.5 h-2.5 rounded-full bg-destructive/60" />
        <div className="w-2.5 h-2.5 rounded-full bg-warning/60" />
        <div className="w-2.5 h-2.5 rounded-full bg-success/60" />
        <div className="flex-1" />
        <div className="h-2 w-20 rounded bg-muted/30" />
      </div>
      {/* Mini KPI row */}
      <div className="grid grid-cols-3 gap-2">
        {[
          { label: "Revenue", value: "$48.2K", color: "text-primary" },
          { label: "Products", value: "1,284", color: "text-success" },
          { label: "Sales", value: "326", color: "text-warning" },
        ].map((kpi) => (
          <div key={kpi.label} className="glass-card p-2.5">
            <p className="text-[10px] text-muted-foreground">{kpi.label}</p>
            <p className={`font-mono text-sm font-semibold ${kpi.color}`}>{kpi.value}</p>
          </div>
        ))}
      </div>
      {/* Mini chart placeholder */}
      <div className="glass-card p-3 h-28 flex items-end gap-1">
        {[40, 65, 45, 80, 55, 90, 70, 85, 60, 75, 95, 50].map((h, i) => (
          <div
            key={i}
            className="flex-1 rounded-sm bg-primary/40"
            style={{ height: `${h}%` }}
          />
        ))}
      </div>
      {/* Mini table */}
      <div className="glass-card p-2.5 space-y-1.5">
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex items-center gap-2">
            <div className="w-5 h-5 rounded bg-muted/20" />
            <div className="flex-1 h-2 rounded bg-muted/20" />
            <div className="w-12 h-2 rounded bg-primary/20" />
          </div>
        ))}
      </div>
    </div>
    {/* Glow behind mockup */}
    <div className="absolute inset-0 -z-10 blur-3xl opacity-20 bg-primary rounded-full scale-75" />
  </div>
);

const HeroSection = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const typedText = useTypingEffect(phrases);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
      const y = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
      setMousePos({ x, y });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <section
      ref={containerRef}
      className="relative min-h-screen flex items-center overflow-hidden hero-gradient"
    >
      {/* Z-index layers: particles(1) → overlay(2) → content(10) */}
      <ParticleBackground />

      <div className="absolute inset-0 z-[2] glass pointer-events-none" />

      <div className="relative z-[10] container mx-auto px-6 grid lg:grid-cols-2 gap-12 items-center py-24">
        {/* Left content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="space-y-8"
          style={{
            transform: `translate(${mousePos.x * -4}px, ${mousePos.y * -4}px)`,
          }}
        >
          <div className="inline-flex items-center gap-2 glass-card px-3 py-1.5 text-xs text-muted-foreground">
            <span className="w-1.5 h-1.5 rounded-full bg-success animate-pulse" />
            Trusted by 500+ businesses
          </div>

          <div className="space-y-4">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-heading font-bold leading-[1.1] tracking-tight text-foreground">
              The smarter way to{" "}
              <span className="text-gradient block mt-1">
                {typedText}
                <span className="animate-pulse text-primary">|</span>
              </span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-lg leading-relaxed">
              A complete inventory and sales management platform built for modern businesses.
              Track stock, manage suppliers, and analyze sales — all in one place.
            </p>
          </div>

          <div className="flex flex-wrap gap-4">
            <Button variant="hero" size="lg" asChild>
              <Link to="/dashboard">
                Get Started <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
            <Button variant="hero-outline" size="lg" asChild>
              <Link to="/dashboard">
                <Play className="mr-1 h-4 w-4" /> View Dashboard Demo
              </Link>
            </Button>
          </div>

          <div className="flex items-center gap-6 pt-2">
            <div className="flex -space-x-2">
              {[0, 1, 2, 3].map((i) => (
                <div key={i} className="w-8 h-8 rounded-full border-2 border-background bg-muted" />
              ))}
            </div>
            <p className="text-sm text-muted-foreground">
              <span className="text-foreground font-medium">4.9/5</span> from 200+ reviews
            </p>
          </div>
        </motion.div>

        {/* Right mockup */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, delay: 0.2, ease: "easeOut" }}
          className="hidden lg:flex justify-center"
          style={{
            transform: `translate(${mousePos.x * 6}px, ${mousePos.y * 6}px)`,
          }}
        >
          <DashboardMockup />
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
