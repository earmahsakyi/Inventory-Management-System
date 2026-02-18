import { motion } from "framer-motion";
import { Truck, Package, BarChart3, ShoppingCart, Users, Building2 } from "lucide-react";

const features = [
  { icon: Truck, title: "Supplier Management", description: "Manage vendor relationships, track orders, and optimize your supply chain effortlessly." },
  { icon: Package, title: "Product Tracking", description: "Real-time product catalog with barcode support, variants, and category organization." },
  { icon: BarChart3, title: "Smart Stock Control", description: "Automated low-stock alerts, reorder points, and intelligent inventory forecasting." },
  { icon: ShoppingCart, title: "Sales Analytics", description: "Comprehensive sales reports with trends, margins, and customer purchasing patterns." },
  { icon: Users, title: "Employee Management", description: "Role-based access control, performance tracking, and team productivity insights." },
  { icon: Building2, title: "Sales Reports", description: "Sales tracking with revenue targets, performance analytics, and growth insights." },
];

const FeaturesSection = () => (
  <section id="features" className="relative py-32 overflow-hidden">
    <div className="container mx-auto px-6">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="text-center mb-16 space-y-4"
      >
        <p className="text-sm font-medium text-primary tracking-wide uppercase">Features</p>
        <h2 className="text-3xl sm:text-4xl font-heading font-bold text-foreground">
          Everything you need to run your business
        </h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          A unified platform that brings together inventory, sales, and team management into one powerful dashboard.
        </p>
      </motion.div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {features.map((feature, i) => (
          <motion.div
            key={feature.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: i * 0.08 }}
            className="glass-card-hover p-6 space-y-4"
          >
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <feature.icon className="h-5 w-5 text-primary" />
            </div>
            <h3 className="text-lg font-heading font-semibold text-foreground">{feature.title}</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default FeaturesSection;
