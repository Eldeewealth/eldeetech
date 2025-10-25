import { GraduationCap, Users, BookOpen, Award, Code, Briefcase, TrendingUp, Target } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const Training = () => {
  const programs = [
    {
      icon: Code,
      title: "Web Development Bootcamp",
      duration: "16 Weeks",
      level: "Beginner to Advanced",
      description: "Master modern web development with HTML, CSS, JavaScript, React, and backend technologies.",
      topics: ["HTML/CSS Fundamentals", "JavaScript & React", "Backend Development", "Database Management"],
    },
    {
      icon: Briefcase,
      title: "Digital Marketing Mastery",
      duration: "8 Weeks",
      level: "All Levels",
      description: "Learn to create effective digital marketing campaigns that drive results and grow businesses.",
      topics: ["SEO & Content Marketing", "Social Media Strategy", "Email Marketing", "Analytics & ROI"],
    },
    {
      icon: TrendingUp,
      title: "Financial Trading Academy",
      duration: "10 Weeks",
      level: "Beginner to Intermediate",
      description: "Comprehensive training in forex and cryptocurrency trading with practical strategies.",
      topics: ["Market Analysis", "Trading Strategies", "Risk Management", "Platform Mastery"],
    },
    {
      icon: Target,
      title: "Leadership Development",
      duration: "6 Weeks",
      level: "Professional",
      description: "Develop essential leadership skills to inspire teams and drive organizational success.",
      topics: ["Leadership Principles", "Team Management", "Strategic Thinking", "Communication Skills"],
    },
  ];

  const features = [
    {
      icon: Users,
      title: "Expert Instructors",
      description: "Learn from industry professionals with real-world experience",
    },
    {
      icon: BookOpen,
      title: "Hands-On Projects",
      description: "Build real projects to strengthen your portfolio",
    },
    {
      icon: Award,
      title: "Certification",
      description: "Earn recognized certificates upon completion",
    },
    {
      icon: GraduationCap,
      title: "Flexible Learning",
      description: "Study at your own pace with online and in-person options",
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
              Training & <span className="text-accent">Mentorship</span>
            </h1>
            <p className="text-xl text-muted-foreground">
              Empower yourself with world-class ICT and leadership development programs
            </p>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-secondary/30">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card
                  key={index}
                  className="border-border bg-card hover:shadow-tech transition-all duration-300 group text-center"
                >
                  <CardContent className="p-6 space-y-4">
                    <div className="w-16 h-16 rounded-xl bg-gradient-primary flex items-center justify-center mx-auto group-hover:scale-110 transition-transform shadow-lg">
                      <Icon className="w-8 h-8 text-primary-foreground" />
                    </div>
                    <h3 className="text-xl font-semibold text-foreground">{feature.title}</h3>
                    <p className="text-muted-foreground">{feature.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Training Programs */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              Our Training Programs
            </h2>
            <p className="text-lg text-muted-foreground">
              Comprehensive courses designed to equip you with in-demand skills
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-7xl mx-auto">
            {programs.map((program, index) => {
              const Icon = program.icon;
              return (
                <Card key={index} className="border-border bg-gradient-card hover:shadow-tech transition-all duration-300">
                  <CardHeader>
                    <div className="flex items-start justify-between mb-4">
                      <div className="w-14 h-14 rounded-xl bg-gradient-primary flex items-center justify-center shadow-lg">
                        <Icon className="w-7 h-7 text-primary-foreground" />
                      </div>
                      <div className="text-right">
                        <span className="inline-block px-3 py-1 rounded-full bg-accent/10 text-accent text-sm font-medium">
                          {program.level}
                        </span>
                      </div>
                    </div>
                    <CardTitle className="text-2xl text-foreground mb-2">{program.title}</CardTitle>
                    <p className="text-sm text-muted-foreground font-medium">{program.duration}</p>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-muted-foreground">{program.description}</p>
                    <div>
                      <h4 className="font-semibold text-foreground mb-3">What You'll Learn:</h4>
                      <ul className="grid grid-cols-2 gap-2">
                        {program.topics.map((topic, topicIndex) => (
                          <li key={topicIndex} className="flex items-start space-x-2">
                            <span className="text-accent mt-1">•</span>
                            <span className="text-sm text-muted-foreground">{topic}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Mentorship */}
      <section className="py-20 bg-secondary/30">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <Card className="border-border bg-card shadow-tech">
              <CardContent className="p-8 md:p-12">
                <div className="text-center mb-8">
                  <div className="w-20 h-20 rounded-xl bg-gradient-primary flex items-center justify-center mx-auto mb-6 shadow-lg">
                    <Users className="w-10 h-10 text-primary-foreground" />
                  </div>
                  <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
                    One-on-One Mentorship
                  </h2>
                  <p className="text-lg text-muted-foreground">
                    Get personalized guidance from experienced professionals
                  </p>
                </div>
                <div className="space-y-6 text-center">
                  <p className="text-muted-foreground leading-relaxed">
                    Our mentorship program connects you with industry experts who provide personalized guidance, 
                    career advice, and technical support. Whether you're starting your career or looking to advance, 
                    our mentors are here to help you succeed.
                  </p>
                  <div className="grid md:grid-cols-3 gap-6 pt-6">
                    <div className="space-y-2">
                      <h4 className="font-semibold text-foreground">Career Guidance</h4>
                      <p className="text-sm text-muted-foreground">Navigate your career path with expert advice</p>
                    </div>
                    <div className="space-y-2">
                      <h4 className="font-semibold text-foreground">Skill Development</h4>
                      <p className="text-sm text-muted-foreground">Master in-demand technical skills</p>
                    </div>
                    <div className="space-y-2">
                      <h4 className="font-semibold text-foreground">Network Building</h4>
                      <p className="text-sm text-muted-foreground">Connect with industry professionals</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
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
              Ready to Start Your Learning Journey?
            </h2>
            <p className="text-xl text-white/90">
              Enroll in our training programs today and take the first step towards your success
            </p>
            <div className="pt-4">
              <Button size="lg" asChild className="bg-white text-primary hover:bg-white/90 shadow-glow">
                <Link to="/contact">Enroll Now</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Training;
