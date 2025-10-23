import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, Cpu, Palette, TrendingUp, ShoppingCart, GraduationCap, CheckCircle2, Star } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import heroImage from "@/assets/hero-tech.jpg";

const Home = () => {
  const services = [
    {
      icon: Cpu,
      title: "IT & Consultancy",
      description: "Cloud solutions, networking, and infrastructure consulting for modern businesses.",
    },
    {
      icon: Palette,
      title: "Digital & Creative",
      description: "Web design, app development, branding, and digital marketing excellence.",
    },
    {
      icon: TrendingUp,
      title: "Fintech & Trading",
      description: "Training and tools for forex, crypto, and financial literacy programs.",
    },
    {
      icon: ShoppingCart,
      title: "Retail & E-Commerce",
      description: "Premium computers, gadgets, and accessories for your technology needs.",
    },
    {
      icon: GraduationCap,
      title: "Training & Mentorship",
      description: "ICT and leadership development programs to empower the next generation.",
    },
  ];

  const testimonials = [
    {
      name: "Adebayo Johnson",
      company: "TechStartup Nigeria",
      text: "Eldeetech transformed our digital presence with their innovative solutions. Highly professional team!",
      rating: 5,
    },
    {
      name: "Chioma Okafor",
      company: "E-Commerce Solutions Ltd",
      text: "Their IT consultancy services helped us scale our infrastructure seamlessly. Excellent work!",
      rating: 5,
    },
    {
      name: "Michael Eze",
      company: "Finance Hub",
      text: "The fintech training program was comprehensive and practical. Great investment for our team.",
      rating: 5,
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
        <div className="absolute inset-0 bg-gradient-hero opacity-95" />
        <div className="absolute inset-0">
          <img
            src={heroImage}
            alt="Technology and Innovation"
            className="w-full h-full object-cover opacity-20"
          />
        </div>
        
        <div className="relative z-10 container mx-auto px-4 py-20 text-center">
          <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
            <h1 className="text-5xl md:text-7xl font-bold text-white leading-tight transition-all duration-300 hover:scale-105 hover:drop-shadow-[0_0_20px_rgba(255,255,255,0.3)] cursor-default">
              Empowering Technology,
              <br />
              <span className="text-accent">Creativity & Innovation</span>
            </h1>
            <p className="text-xl md:text-2xl text-white/90 max-w-2xl mx-auto">
              World-class IT, digital, and creative solutions that inspire growth and drive success
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6">
              <Button size="lg" asChild className="bg-accent hover:bg-accent/90 text-accent-foreground shadow-glow">
                <Link to="/services">
                  Explore Services <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild className="bg-white/10 text-white border-white/30 hover:bg-white/20 backdrop-blur-sm">
                <Link to="/contact">Work With Us</Link>
              </Button>
            </div>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />
      </section>

      {/* Services Overview */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              Our Services
            </h2>
            <p className="text-lg text-muted-foreground">
              Comprehensive solutions tailored to empower your business with cutting-edge technology
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => {
              const Icon = service.icon;
              return (
                <Card
                  key={index}
                  className="group hover:shadow-tech transition-all duration-300 border-border bg-gradient-card cursor-pointer"
                >
                  <CardContent className="p-6 space-y-4">
                    <div className="w-14 h-14 rounded-xl bg-gradient-primary flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg">
                      <Icon className="w-7 h-7 text-primary-foreground" />
                    </div>
                    <h3 className="text-xl font-semibold text-foreground group-hover:text-accent transition-colors">
                      {service.title}
                    </h3>
                    <p className="text-muted-foreground">{service.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          <div className="text-center mt-12">
            <Button asChild size="lg" variant="outline" className="border-primary text-primary hover:bg-primary hover:text-primary-foreground">
              <Link to="/services">
                View All Services <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-20 bg-secondary/30">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h2 className="text-4xl md:text-5xl font-bold text-foreground">
                Why Choose Eldeetech?
              </h2>
              <p className="text-lg text-muted-foreground">
                We combine technical expertise with creative innovation to deliver solutions that drive real business results.
              </p>
              <ul className="space-y-4">
                {[
                  "World-class IT and creative solutions",
                  "Experienced team of professionals",
                  "Tailored services for your needs",
                  "Proven track record of success",
                  "Continuous support and training",
                ].map((item, index) => (
                  <li key={index} className="flex items-start space-x-3">
                    <CheckCircle2 className="w-6 h-6 text-accent flex-shrink-0 mt-0.5" />
                    <span className="text-foreground">{item}</span>
                  </li>
                ))}
              </ul>
              <Button asChild size="lg" className="bg-gradient-primary hover:opacity-90">
                <Link to="/about">Learn More About Us</Link>
              </Button>
            </div>
            <div className="relative">
              <div className="aspect-square rounded-2xl bg-gradient-primary opacity-20 absolute -inset-4 blur-3xl" />
              <div className="relative bg-card border border-border rounded-2xl p-8 shadow-tech">
                <div className="space-y-6">
                  <div className="flex items-center space-x-4">
                    <div className="w-16 h-16 rounded-full bg-accent/10 flex items-center justify-center">
                      <span className="text-3xl font-bold text-accent">10+</span>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Years of</p>
                      <p className="font-semibold text-foreground">Experience</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="w-16 h-16 rounded-full bg-accent/10 flex items-center justify-center">
                      <span className="text-3xl font-bold text-accent">500+</span>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Projects</p>
                      <p className="font-semibold text-foreground">Completed</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="w-16 h-16 rounded-full bg-accent/10 flex items-center justify-center">
                      <span className="text-3xl font-bold text-accent">100%</span>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Client</p>
                      <p className="font-semibold text-foreground">Satisfaction</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              What Our Clients Say
            </h2>
            <p className="text-lg text-muted-foreground">
              Don't just take our word for it - hear from our satisfied clients
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="bg-card border-border hover:shadow-tech transition-shadow">
                <CardContent className="p-6 space-y-4">
                  <div className="flex space-x-1">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 fill-accent text-accent" />
                    ))}
                  </div>
                  <p className="text-muted-foreground italic">"{testimonial.text}"</p>
                  <div className="pt-4 border-t border-border">
                    <p className="font-semibold text-foreground">{testimonial.name}</p>
                    <p className="text-sm text-muted-foreground">{testimonial.company}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-primary relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white via-transparent to-transparent" />
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <h2 className="text-4xl md:text-5xl font-bold text-white">
              Ready to Transform Your Business?
            </h2>
            <p className="text-xl text-white/90">
              Let's discuss how we can help you achieve your technology and business goals
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Button size="lg" asChild className="bg-white text-primary hover:bg-white/90 shadow-glow">
                <Link to="/contact">
                  Get Started <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild className="bg-white/10 text-white border-white/30 hover:bg-white/20 backdrop-blur-sm">
                <Link to="/services">View Services</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Home;
