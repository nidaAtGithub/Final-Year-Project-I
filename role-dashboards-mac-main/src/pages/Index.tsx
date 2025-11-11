import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, FileText, Search, Bell, Users, BarChart3, Lock, CheckCircle } from "lucide-react";
import { Link } from "react-router-dom";

const Index = () => {
  const [activeRole, setActiveRole] = useState<"citizen" | "police" | "admin" | null>(null);

  const features = [
    {
      icon: FileText,
      title: "File FIR Online",
      description: "Submit First Information Reports digitally from anywhere, anytime"
    },
    {
      icon: Search,
      title: "Track Status",
      description: "Real-time tracking of your FIR status and investigation progress"
    },
    {
      icon: Shield,
      title: "Blockchain Security",
      description: "All records secured with blockchain technology for transparency"
    },
    {
      icon: Lock,
      title: "AI Verification",
      description: "Automated verification and classification of reports"
    }
  ];

  const stats = [
    { label: "FIRs Filed", value: "12,543", icon: FileText },
    { label: "Active Cases", value: "3,421", icon: BarChart3 },
    { label: "Officers", value: "856", icon: Users },
    { label: "Resolved", value: "9,122", icon: CheckCircle }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-gradient-header border-b border-border/40 sticky top-0 z-50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center">
                <Shield className="w-7 h-7 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-navy-foreground">Automated FIR System</h1>
                <p className="text-sm text-navy-foreground/80">Digital Crime Reporting Portal</p>
              </div>
            </div>
            <nav className="hidden md:flex items-center gap-6">
              <a href="#home" className="text-navy-foreground/90 hover:text-navy-foreground transition-colors">Home</a>
              <a href="#about" className="text-navy-foreground/90 hover:text-navy-foreground transition-colors">About</a>
              <a href="#process" className="text-navy-foreground/90 hover:text-navy-foreground transition-colors">How It Works</a>
              <a href="#faq" className="text-navy-foreground/90 hover:text-navy-foreground transition-colors">FAQ</a>
              <a href="#contact" className="text-navy-foreground/90 hover:text-navy-foreground transition-colors">Contact</a>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section id="home" className="bg-gradient-header py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-4xl md:text-5xl font-bold text-navy-foreground mb-6">
              Report Crimes Securely & Track Progress in Real-Time
            </h2>
            <p className="text-lg text-navy-foreground/90 mb-8">
              A modern, AI-powered platform for filing and managing First Information Reports with blockchain verification
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Button size="lg" className="bg-primary hover:bg-primary-hover text-primary-foreground">
                File FIR Now
              </Button>
              <Button size="lg" className="bg-secondary hover:bg-secondary/90 text-secondary-foreground">
                Track FIR Status
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <Card key={index} className="text-center border-border/50">
                <CardContent className="pt-6">
                  <stat.icon className="w-8 h-8 mx-auto mb-3 text-primary" />
                  <div className="text-3xl font-bold text-foreground mb-1">{stat.value}</div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="about" className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-foreground mb-4">Why Choose Our System?</h3>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Leveraging cutting-edge technology for transparent, efficient, and secure crime reporting
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <Card key={index} className="border-border/50 hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                    <feature.icon className="w-6 h-6 text-primary" />
                  </div>
                  <CardTitle className="text-lg">{feature.title}</CardTitle>
                  <CardDescription>{feature.description}</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Role Selection Section */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-foreground mb-4">Access Your Dashboard</h3>
            <p className="text-muted-foreground">Select your role to continue</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {/*<Link to="/citizen/dashboard">*/}
            <Link to="/citizen/Signin">
              <Card className="border-border/50 hover:shadow-xl hover:border-primary/50 transition-all cursor-pointer group">
                <CardHeader className="text-center">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-primary/20 transition-colors">
                    <Users className="w-8 h-8 text-primary" />
                  </div>
                  <CardTitle className="text-xl">Citizen</CardTitle>
                  <CardDescription className="mt-2">
                    File FIRs, track status, and manage your reports
                  </CardDescription>
                </CardHeader>
              </Card>
            </Link>
            {/*<Link to="/police/dashboard">*/}
            <Link to="/police/Signin">
              <Card className="border-border/50 hover:shadow-xl hover:border-primary/50 transition-all cursor-pointer group">
                <CardHeader className="text-center">
                  <div className="w-16 h-16 bg-secondary/10 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-secondary/20 transition-colors">
                    <Shield className="w-8 h-8 text-secondary" />
                  </div>
                  <CardTitle className="text-xl">Police Officer</CardTitle>
                  <CardDescription className="mt-2">
                    Review FIRs, manage investigations, and close cases
                  </CardDescription>
                </CardHeader>
              </Card>
            </Link>
            {/*<Link to="/admin/dashboard">*/}
            <Link to="/admin/Signin">
              <Card className="border-border/50 hover:shadow-xl hover:border-primary/50 transition-all cursor-pointer group">
                <CardHeader className="text-center">
                  <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-accent/20 transition-colors">
                    <Lock className="w-8 h-8 text-accent" />
                  </div>
                  <CardTitle className="text-xl">Admin</CardTitle>
                  <CardDescription className="mt-2">
                    Manage users, assignments, and system analytics
                  </CardDescription>
                </CardHeader>
              </Card>
            </Link>
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section id="process" className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-foreground mb-4">How It Works</h3>
            <p className="text-muted-foreground">Simple 4-step process to file and track your FIR</p>
          </div>
          <div className="max-w-4xl mx-auto">
            <div className="grid md:grid-cols-4 gap-8">
              {[
                { step: "1", title: "Register/Login", desc: "Create account or sign in" },
                { step: "2", title: "File FIR", desc: "Fill online form with details" },
                { step: "3", title: "AI Verification", desc: "Automatic classification" },
                { step: "4", title: "Track Progress", desc: "Monitor case status" }
              ].map((item, i) => (
                <div key={i} className="text-center">
                  <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold text-primary-foreground">
                    {item.step}
                  </div>
                  <h4 className="font-semibold text-foreground mb-2">{item.title}</h4>
                  <p className="text-sm text-muted-foreground">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-16 bg-muted/30">
        <div className="container mx-auto px-4 max-w-3xl">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-foreground mb-4">Frequently Asked Questions</h3>
          </div>
          <div className="space-y-4">
            {[
              { q: "What is an FIR?", a: "First Information Report is a written document prepared by police on receiving information about a cognizable offense." },
              { q: "Is online FIR legally valid?", a: "Yes, digital FIRs filed through this system are legally valid and secured with blockchain verification." },
              { q: "How long does verification take?", a: "AI verification is instant. Police review typically takes 24-48 hours." },
              { q: "Can I track my FIR status?", a: "Yes, you can track your FIR in real-time using your FIR ID and registered credentials." }
            ].map((faq, i) => (
              <Card key={i} className="border-border/50">
                <CardHeader>
                  <CardTitle className="text-lg">{faq.q}</CardTitle>
                  <CardDescription className="mt-2">{faq.a}</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-16">
        <div className="container mx-auto px-4 max-w-2xl text-center">
          <h3 className="text-3xl font-bold text-foreground mb-4">Need Help?</h3>
          <p className="text-muted-foreground mb-8">Our support team is available 24/7 to assist you</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Card className="border-border/50">
              <CardContent className="pt-6">
                <Bell className="w-8 h-8 mx-auto mb-3 text-primary" />
                <div className="font-semibold mb-1">Emergency Helpline</div>
                <div className="text-2xl font-bold text-primary">100</div>
              </CardContent>
            </Card>
            <Card className="border-border/50">
              <CardContent className="pt-6">
                <Shield className="w-8 h-8 mx-auto mb-3 text-secondary" />
                <div className="font-semibold mb-1">Support Email</div>
                <div className="text-sm text-muted-foreground">support@fir.gov.in</div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-navy py-8 mt-16">
        <div className="container mx-auto px-4 text-center">
          <p className="text-navy-foreground/80">
            © 2025 Automated FIR System. All rights reserved.
          </p>
          <p className="text-navy-foreground/60 text-sm mt-2">
            Powered by Blockchain & AI Technology
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
