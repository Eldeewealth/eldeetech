import { Target, Eye, Heart, Users, Award, Lightbulb } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const About = () => {
  const values = [
    {
      icon: Award,
      title: "Excellence",
      description: "We strive for excellence in every project, delivering world-class solutions that exceed expectations.",
    },
    {
      icon: Lightbulb,
      title: "Innovation",
      description: "We embrace cutting-edge technology and creative thinking to solve complex challenges.",
    },
    {
      icon: Heart,
      title: "Integrity",
      description: "We operate with transparency, honesty, and ethical practices in all our dealings.",
    },
    {
      icon: Users,
      title: "Collaboration",
      description: "We believe in the power of teamwork and partnership to achieve extraordinary results.",
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
              About <span className="text-accent">Eldeetech Ltd</span>
            </h1>
            <p className="text-xl text-muted-foreground">
              A leading provider of world-class information technology, digital, and creative solutions in Nigeria
            </p>
          </div>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-20 bg-secondary/30">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto space-y-8">
            <div className="text-center mb-12">
              <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">Our Story</h2>
            </div>
            <Card className="border-border bg-card shadow-tech">
              <CardContent className="p-8 md:p-12">
                <div className="prose prose-lg max-w-none">
                  <p className="text-muted-foreground leading-relaxed mb-6">
                    Eldeetech Ltd is a Limited Liability Company registered in Nigeria, dedicated to providing 
                    world-class information technology, digital, and creative solutions. We help individuals and 
                    organizations harness the power of technology through consultancy, design, innovation, and training.
                  </p>
                  <p className="text-muted-foreground leading-relaxed mb-6">
                    Our journey began with a simple vision: to bridge the gap between technology and business, 
                    making advanced digital solutions accessible to organizations of all sizes across Nigeria. 
                    Today, we stand as a trusted partner for businesses seeking to leverage technology for growth 
                    and innovation.
                  </p>
                  <p className="text-muted-foreground leading-relaxed">
                    With a team of experienced professionals and a commitment to excellence, we continue to 
                    empower our clients with solutions that drive real business results. From IT infrastructure 
                    to creative design, from financial technology to e-commerce, we provide comprehensive services 
                    that address the diverse needs of modern businesses.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
            <Card className="border-border bg-gradient-card shadow-tech group hover:shadow-glow transition-shadow">
              <CardContent className="p-8 space-y-4">
                <div className="w-16 h-16 rounded-xl bg-gradient-primary flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg">
                  <Target className="w-8 h-8 text-primary-foreground" />
                </div>
                <h3 className="text-3xl font-bold text-foreground">Our Mission</h3>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  To empower businesses and individuals with technology-driven solutions that inspire growth, 
                  creativity, and innovation. We are committed to delivering excellence through consultancy, 
                  design, and training that transforms challenges into opportunities.
                </p>
              </CardContent>
            </Card>

            <Card className="border-border bg-gradient-card shadow-tech group hover:shadow-glow transition-shadow">
              <CardContent className="p-8 space-y-4">
                <div className="w-16 h-16 rounded-xl bg-gradient-primary flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg">
                  <Eye className="w-8 h-8 text-primary-foreground" />
                </div>
                <h3 className="text-3xl font-bold text-foreground">Our Vision</h3>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  To be the leading technology solutions provider in Nigeria and beyond, recognized for our 
                  innovation, reliability, and commitment to empowering organizations and individuals to achieve 
                  their full potential through technology.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="py-20 bg-secondary/30">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              Our Core Values
            </h2>
            <p className="text-lg text-muted-foreground">
              The principles that guide everything we do
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
            {values.map((value, index) => {
              const Icon = value.icon;
              return (
                <Card
                  key={index}
                  className="border-border bg-card hover:shadow-tech transition-all duration-300 group"
                >
                  <CardContent className="p-6 text-center space-y-4">
                    <div className="w-16 h-16 rounded-xl bg-gradient-primary flex items-center justify-center mx-auto group-hover:scale-110 transition-transform shadow-lg">
                      <Icon className="w-8 h-8 text-primary-foreground" />
                    </div>
                    <h3 className="text-xl font-semibold text-foreground">{value.title}</h3>
                    <p className="text-muted-foreground">{value.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Leadership Approach */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <Card className="border-border bg-gradient-card shadow-tech">
              <CardContent className="p-8 md:p-12">
                <div className="text-center mb-8">
                  <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
                    Our Leadership Approach
                  </h2>
                </div>
                <div className="space-y-6">
                  <p className="text-lg text-muted-foreground leading-relaxed">
                    At Eldeetech Ltd, we believe in servant leadership - putting our clients' needs first and 
                    empowering our team to deliver exceptional results. Our leadership approach is built on:
                  </p>
                  <ul className="space-y-4 text-muted-foreground">
                    <li className="flex items-start space-x-3">
                      <span className="text-accent font-bold">•</span>
                      <span><strong className="text-foreground">Client-Centric Focus:</strong> Every decision we make is guided by what's best for our clients</span>
                    </li>
                    <li className="flex items-start space-x-3">
                      <span className="text-accent font-bold">•</span>
                      <span><strong className="text-foreground">Continuous Learning:</strong> We invest in our team's growth and stay ahead of industry trends</span>
                    </li>
                    <li className="flex items-start space-x-3">
                      <span className="text-accent font-bold">•</span>
                      <span><strong className="text-foreground">Collaborative Culture:</strong> We foster an environment where ideas flourish and innovation thrives</span>
                    </li>
                    <li className="flex items-start space-x-3">
                      <span className="text-accent font-bold">•</span>
                      <span><strong className="text-foreground">Accountability:</strong> We take ownership of our commitments and deliver on our promises</span>
                    </li>
                    <li className="flex items-start space-x-3">
                      <span className="text-accent font-bold">•</span>
                      <span><strong className="text-foreground">Ethical Practice:</strong> We maintain the highest standards of integrity in all our operations</span>
                    </li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default About;
