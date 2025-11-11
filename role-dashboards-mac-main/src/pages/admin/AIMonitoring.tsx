import DashboardLayout from "@/components/layouts/DashboardLayout";
import { BarChart3, Users, FileText, Shield, Database, Activity, Settings } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

const AIMonitoring = () => {
  const navItems = [
    { label: "Dashboard", icon: BarChart3, active: false },
    { label: "User Management", icon: Users, active: false, badge: 2 },
    { label: "FIR Management", icon: FileText, active: false },
    { label: "Police Assignment", icon: Shield, active: false },
    { label: "Blockchain Ledger", icon: Database, active: false },
    { label: "AI Monitoring", icon: Activity, active: true },
    { label: "Reports & Analytics", icon: BarChart3, active: false },
    { label: "System Logs", icon: Settings, active: false },
  ];

  const aiActivities = [
    {
      firId: "FIR-2025-001456",
      classification: "Theft - High Priority",
      confidence: 96,
      keywords: ["stolen vehicle", "armed", "night time"],
      timestamp: "2025-01-20 14:35:22",
      status: "success",
    },
    {
      firId: "FIR-2025-001455",
      classification: "Fraud - Medium Priority",
      confidence: 89,
      keywords: ["online scam", "banking", "identity theft"],
      timestamp: "2025-01-20 14:28:15",
      status: "success",
    },
    {
      firId: "FIR-2025-001454",
      classification: "Cybercrime - High Priority",
      confidence: 92,
      keywords: ["hacking", "data breach", "ransomware"],
      timestamp: "2025-01-20 14:15:03",
      status: "success",
    },
  ];

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 90) return "text-secondary";
    if (confidence >= 75) return "text-warning";
    return "text-accent";
  };

  return (
    <DashboardLayout role="admin" navItems={navItems} title="Admin Portal">
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold text-foreground">AI System Monitoring</h2>
          <p className="text-muted-foreground mt-1">Real-time AI classification and analysis</p>
        </div>

        {/* AI Stats */}
        <div className="grid md:grid-cols-4 gap-6">
          <Card className="border-border/50 bg-gradient-to-br from-accent/5 to-accent/10">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Classifications Today</p>
                  <p className="text-3xl font-bold text-accent">156</p>
                  <p className="text-xs text-muted-foreground mt-1">+23 from yesterday</p>
                </div>
                <Activity className="w-10 h-10 text-accent/40" />
              </div>
            </CardContent>
          </Card>
          <Card className="border-border/50 bg-gradient-to-br from-secondary/5 to-secondary/10">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Accuracy Rate</p>
                  <p className="text-3xl font-bold text-secondary">96.5%</p>
                  <p className="text-xs text-muted-foreground mt-1">Last 30 days</p>
                </div>
                <Shield className="w-10 h-10 text-secondary/40" />
              </div>
            </CardContent>
          </Card>
          <Card className="border-border/50">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Avg Processing Time</p>
                  <p className="text-3xl font-bold text-foreground">2.3s</p>
                  <p className="text-xs text-muted-foreground mt-1">Per FIR</p>
                </div>
                <Activity className="w-10 h-10 text-muted-foreground/40" />
              </div>
            </CardContent>
          </Card>
          <Card className="border-secondary/30">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">System Status</p>
                  <p className="text-3xl font-bold text-secondary">Active</p>
                  <p className="text-xs text-secondary mt-1">✓ Operational</p>
                </div>
                <Database className="w-10 h-10 text-secondary/40" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* AI Model Performance */}
        <Card className="border-border/50">
          <CardHeader>
            <CardTitle>AI Model Performance</CardTitle>
            <CardDescription>Real-time accuracy metrics</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-medium">Crime Classification Accuracy</span>
                  <span className="text-sm font-bold text-secondary">96.5%</span>
                </div>
                <Progress value={96.5} className="h-2" />
              </div>
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-medium">Priority Assignment Accuracy</span>
                  <span className="text-sm font-bold text-secondary">94.2%</span>
                </div>
                <Progress value={94.2} className="h-2" />
              </div>
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-medium">Keyword Extraction Accuracy</span>
                  <span className="text-sm font-bold text-secondary">98.1%</span>
                </div>
                <Progress value={98.1} className="h-2" />
              </div>
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-medium">Sentiment Analysis Accuracy</span>
                  <span className="text-sm font-bold text-warning">89.7%</span>
                </div>
                <Progress value={89.7} className="h-2" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Recent AI Classifications */}
        <Card className="border-border/50">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Recent AI Classifications</CardTitle>
                <CardDescription>Latest FIRs processed by AI</CardDescription>
              </div>
              <Button variant="outline" size="sm" className="border-border/50">
                View All
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {aiActivities.map((activity) => (
                <Card key={activity.firId} className="border-border/50 hover:shadow-md transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-lg">{activity.firId}</CardTitle>
                        <CardDescription className="mt-1">
                          {activity.classification}
                        </CardDescription>
                      </div>
                      <div className="text-right">
                        <Badge className="bg-secondary/10 text-secondary border-secondary/20 mb-2">
                          ✓ Processed
                        </Badge>
                        <p className="text-xs text-muted-foreground">{activity.timestamp}</p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Confidence Score</span>
                        <span className={`text-sm font-bold ${getConfidenceColor(activity.confidence)}`}>
                          {activity.confidence}%
                        </span>
                      </div>
                      <Progress value={activity.confidence} className="h-2" />
                      <div>
                        <p className="text-sm text-muted-foreground mb-2">Extracted Keywords:</p>
                        <div className="flex flex-wrap gap-2">
                          {activity.keywords.map((keyword, idx) => (
                            <Badge key={idx} variant="outline" className="bg-muted">
                              {keyword}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* AI Capabilities */}
        <div className="grid md:grid-cols-2 gap-6">
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle>AI Capabilities</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground">
              <p>✓ Automatic crime category classification</p>
              <p>✓ Priority level determination</p>
              <p>✓ Keyword and entity extraction</p>
              <p>✓ Sentiment and urgency analysis</p>
              <p>✓ Similar case detection</p>
              <p>✓ Suspect pattern recognition</p>
              <p>✓ Multi-language support (Urdu, English)</p>
            </CardContent>
          </Card>

          <Card className="border-accent/30">
            <CardHeader className="bg-accent/5">
              <CardTitle className="text-accent">System Health</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm pt-6">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Model Version:</span>
                <span className="font-semibold">v2.5.3</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Last Training:</span>
                <span className="font-semibold">2025-01-15</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Training Data Size:</span>
                <span className="font-semibold">50,000+ FIRs</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Uptime:</span>
                <span className="font-semibold text-secondary">99.8%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Response Time:</span>
                <span className="font-semibold text-secondary">&lt; 3s</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AIMonitoring;
