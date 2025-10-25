import { useState } from "react";
import { Mail, MapPin, Phone, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const Contact = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
    botcheck: "", // honeypot in state
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.email || !formData.message) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    // Abort after 15s
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000);

    try {
      setLoading(true);
      const res = await fetch("/api/send-mail", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
        signal: controller.signal,
      });

      const ct = res.headers.get("content-type") || "";
      let data: any = null;
      if (ct.includes("application/json")) {
        data = await res.json();
      } else {
        const text = await res.text();
        data = { success: false, message: `Invalid server response: ${text.slice(0, 200)}` };
      }

      if (res.ok && data?.success) {
        toast({
          title: "Message Sent!",
          description: "Thank you for contacting us. We'll get back to you soon.",
        });
        setFormData({ name: "", email: "", phone: "", subject: "", message: "", botcheck: "" });
      } else {
        const msg = data?.message || `${res.status} ${res.statusText}` || "Unable to send message at the moment.";
        toast({ title: "Failed to send", description: msg, variant: "destructive" });
      }
    } catch (err: any) {
      const aborted = err?.name === "AbortError";
      toast({
        title: aborted ? "Request timed out" : "Network error",
        description: aborted
          ? "The request took too long (15s). Please try again."
          : "Please check your connection and try again.",
        variant: "destructive",
      });
    } finally {
      clearTimeout(timeoutId);
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const contactInfo = [
    {
      icon: Mail,
      title: "Email",
      content: "info@eldeetech.com.ng",
      link: "mailto:info@eldeetech.com.ng",
    },
    {
      icon: Phone,
      title: "Phone",
      content: "+234 708 2777 516",
      link: "tel:+2347082777516",
    },
    {
      icon: MapPin,
      title: "Location",
      content: "Ebonyi, Nigeria",
      link: null,
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
              Get in <span className="text-accent">Touch</span>
            </h1>
            <p className="text-xl text-muted-foreground">
              Have a question or ready to start your project? We'd love to hear from you
            </p>
          </div>
        </div>
      </section>

      {/* Contact Info Cards */}
      <section className="py-12 bg-secondary/30">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {contactInfo.map((info, index) => {
              const Icon = info.icon;
              return (
                <Card key={index} className="border-border bg-card hover:shadow-tech transition-all duration-300 group">
                  <CardContent className="p-6 text-center space-y-4">
                    <div className="w-14 h-14 rounded-xl bg-gradient-primary flex items-center justify-center mx-auto group-hover:scale-110 transition-transform shadow-lg">
                      <Icon className="w-7 h-7 text-primary-foreground" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground mb-2">{info.title}</h3>
                      {info.link ? (
                        <a
                          href={info.link}
                          className="text-muted-foreground hover:text-accent transition-colors"
                        >
                          {info.content}
                        </a>
                      ) : (
                        <p className="text-muted-foreground">{info.content}</p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Contact Form */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <Card className="border-border bg-gradient-card shadow-tech">
              <CardHeader>
                <CardTitle className="text-3xl text-center text-foreground">Send Us a Message</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* honeypot field for bots */}
                  <input
                    type="text"
                    name="botcheck"
                    value={formData.botcheck}
                    onChange={handleChange}
                    className="hidden"
                    tabIndex={-1}
                    autoComplete="off"
                  />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label htmlFor="name" className="text-sm font-medium text-foreground">
                        Name <span className="text-destructive">*</span>
                      </label>
                      <Input
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Your name"
                        required
                        className="border-border bg-background"
                      />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="email" className="text-sm font-medium text-foreground">
                        Email <span className="text-destructive">*</span>
                      </label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="your@email.com"
                        required
                        className="border-border bg-background"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label htmlFor="phone" className="text-sm font-medium text-foreground">
                        Phone
                      </label>
                      <Input
                        id="phone"
                        name="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="+234 708 2777 516"
                        className="border-border bg-background"
                      />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="subject" className="text-sm font-medium text-foreground">
                        Subject
                      </label>
                      <Input
                        id="subject"
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        placeholder="How can we help?"
                        className="border-border bg-background"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="message" className="text-sm font-medium text-foreground">
                      Message <span className="text-destructive">*</span>
                    </label>
                    <Textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      placeholder="Tell us about your project or question..."
                      required
                      rows={6}
                      className="border-border bg-background resize-none"
                    />
                  </div>

                  <Button
                    type="submit"
                    size="lg"
                    className="w-full bg-gradient-primary hover:opacity-90"
                    disabled={loading}
                  >
                    {loading ? "Sending..." : "Send Message"} <Send className="ml-2 w-5 h-5" />
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Contact;
