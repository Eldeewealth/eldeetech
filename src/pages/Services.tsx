import { Cpu, Cloud, Network, Palette, Globe, Smartphone, TrendingUp, DollarSign, ShoppingBag, Package, Search, BarChart3, Database, Server, Settings, Code } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const Services = () => {
  const serviceCategories = [
    {
      title: "Information Technology & Consultancy",
      icon: Cpu,
      services: [
        { name: "IT Support & Maintenance", icon: Cpu, description: "24/7 technical support and system maintenance" },
        { name: "Cloud Solutions", icon: Cloud, description: "Scalable cloud infrastructure and migration services" },
        { name: "Network Infrastructure", icon: Network, description: "Design and implementation of secure networks" },
        { name: "IT Consulting", icon: Cpu, description: "Strategic technology planning and optimization" },
      ],
    },
    {
      title: "Digital & Creative Services",
      icon: Palette,
      services: [
        { name: "Web Design & Development", icon: Globe, description: "Responsive and modern website solutions" },
        { name: "Mobile App Development", icon: Smartphone, description: "Native and cross-platform mobile apps" },
        { name: "Digital Marketing", icon: TrendingUp, description: "SEO, social media, and content marketing" },
        { name: "Brand Identity", icon: Palette, description: "Logo design, brand guidelines, and visual identity" },
        { name: "Software Development", icon: Code, description: "Custom web and software applications tailored to your needs" },
      ],
    },
    {
      title: "Financial Technology & Trading",
      icon: DollarSign,
      services: [
        { name: "Forex Trading Training", icon: TrendingUp, description: "Comprehensive forex trading education" },
        { name: "Crypto Trading", icon: DollarSign, description: "Cryptocurrency trading strategies and tools" },
        { name: "Financial Literacy", icon: DollarSign, description: "Personal finance and investment education" },
        { name: "Trading Software", icon: TrendingUp, description: "Custom trading tools and platforms" },
      ],
    },
    {
      title: "Retail & E-Commerce",
      icon: ShoppingBag,
      services: [
        { name: "Computer Sales", icon: Package, description: "Latest computers and laptops for all needs" },
        { name: "Tech Accessories", icon: Package, description: "Quality gadgets and tech accessories" },
        { name: "E-Commerce Solutions", icon: ShoppingBag, description: "Online store setup and management" },
        { name: "Hardware Procurement", icon: Package, description: "Bulk hardware sourcing and supply" },
      ],
    },
    {
      title: "Data Science & AI",
      icon: TrendingUp,
      services: [
        { name: "Predictive Analytics", icon: TrendingUp, description: "Build models to forecast trends and outcomes" },
        { name: "NLP & Search", icon: Search, description: "Text processing, semantic search, and intelligent assistants" },
        { name: "Dashboards/BI", icon: BarChart3, description: "Interactive dashboards and business intelligence reporting" },
        { name: "Data Engineering", icon: Database, description: "Data pipelines, warehousing, and scalable data architectures" },
        { name: "MLOps Deployment", icon: Server, description: "Model deployment, monitoring, and lifecycle automation" },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-hero opacity-10" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center space-y-6">
            <h1 className="text-5xl md:text-6xl font-bold text-foreground">
              Our <span className="text-accent">Services</span>
            </h1>
            <p className="text-xl text-muted-foreground">
              Comprehensive technology solutions tailored to empower your business and drive innovation
            </p>
          </div>
        </div>
      </section>

      {/* Services Categories */}
      {serviceCategories.map((category, categoryIndex) => {
        const CategoryIcon = category.icon;
        return (
          <section
            key={categoryIndex}
            className={`py-20 ${categoryIndex % 2 === 0 ? "bg-background" : "bg-secondary/30"}`}
          >
            <div className="container mx-auto px-4">
              <div className="max-w-6xl mx-auto">
                {/* Category Header */}
                <div className="flex items-center space-x-4 mb-12">
                  <div className="w-16 h-16 rounded-xl bg-gradient-primary flex items-center justify-center shadow-lg">
                    <CategoryIcon className="w-8 h-8 text-primary-foreground" />
                  </div>
                  <h2 className="text-3xl md:text-4xl font-bold text-foreground">{category.title}</h2>
                </div>

                {/* Services Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {category.services.map((service, serviceIndex) => {
                    const ServiceIcon = service.icon;
                    return (
                      <Link
                        key={serviceIndex}
                        to={`/contact?subject=${encodeURIComponent(
                          `I would want your ${service.name} service`
                        )}`}
                        className="block focus:outline-none focus:ring-2 focus:ring-accent/60 rounded-xl"
                      >
                        <Card
                          className="border-border bg-card hover:shadow-tech transition-all duration-300 group cursor-pointer"
                        >
                          <CardHeader>
                            <div className="flex items-start justify-between">
                              <div className="flex items-center space-x-3">
                                <div className="w-12 h-12 rounded-lg bg-gradient-primary flex items-center justify-center group-hover:scale-110 transition-transform shadow-md">
                                  <ServiceIcon className="w-6 h-6 text-primary-foreground" />
                                </div>
                                <CardTitle className="text-xl text-foreground group-hover:text-accent transition-colors">
                                  {service.name}
                                </CardTitle>
                              </div>
                            </div>
                          </CardHeader>
                          <CardContent>
                            <p className="text-muted-foreground">{service.description}</p>
                          </CardContent>
                        </Card>
                      </Link>
                    );
                  })}
                </div>
              </div>
            </div>
          </section>
        );
      })}

      {/* CTA Section */}
      <section className="py-20 bg-gradient-primary relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white via-transparent to-transparent" />
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <h2 className="text-4xl md:text-5xl font-bold text-white">
              Need a Custom Solution?
            </h2>
            <p className="text-xl text-white/90">
              We're here to help. Let's discuss your specific needs and create a tailored solution for your business.
            </p>
            <div className="pt-4">
              <Button size="lg" asChild className="bg-white text-primary hover:bg-white/90 shadow-glow">
                <Link to="/contact">Get Started</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Services;
