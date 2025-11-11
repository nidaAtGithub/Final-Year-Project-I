import DashboardLayout from "@/components/layouts/DashboardLayout";
import { BarChart3, Users, FileText, Shield, Database, Activity, Settings } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const BlockchainLedger = () => {
  const navItems = [
    { label: "Dashboard", icon: BarChart3, active: false },
    { label: "User Management", icon: Users, active: false, badge: 2 },
    { label: "FIR Management", icon: FileText, active: false },
    { label: "Police Assignment", icon: Shield, active: false },
    { label: "Blockchain Ledger", icon: Database, active: true },
    { label: "AI Monitoring", icon: Activity, active: false },
    { label: "Reports & Analytics", icon: BarChart3, active: false },
    { label: "System Logs", icon: Settings, active: false },
  ];

  const blocks = [
    {
      blockNumber: "#12543",
      hash: "0x7d3c8...9f2a1",
      timestamp: "2025-01-20 14:35:22",
      transactions: 3,
      firId: "FIR-2025-001456",
      action: "FIR Created",
      verified: true,
    },
    {
      blockNumber: "#12542",
      hash: "0x5a2b9...3c4d8",
      timestamp: "2025-01-20 14:28:15",
      transactions: 2,
      firId: "FIR-2025-001234",
      action: "Status Updated",
      verified: true,
    },
    {
      blockNumber: "#12541",
      hash: "0x9e4f6...7a1b2",
      timestamp: "2025-01-20 14:15:03",
      transactions: 1,
      firId: "FIR-2025-001455",
      action: "Evidence Added",
      verified: true,
    },
  ];

  return (
    <DashboardLayout role="admin" navItems={navItems} title="Admin Portal">
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold text-foreground">Blockchain Ledger</h2>
          <p className="text-muted-foreground mt-1">Immutable record of all FIR transactions</p>
        </div>

        {/* Blockchain Stats */}
        <div className="grid md:grid-cols-4 gap-6">
          <Card className="border-border/50 bg-gradient-to-br from-secondary/5 to-secondary/10">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Blocks</p>
                  <p className="text-3xl font-bold text-secondary">12,543</p>
                  <p className="text-xs text-muted-foreground mt-1">Since inception</p>
                </div>
                <Database className="w-10 h-10 text-secondary/40" />
              </div>
            </CardContent>
          </Card>
          <Card className="border-border/50">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Transactions</p>
                  <p className="text-3xl font-bold text-foreground">37,629</p>
                  <p className="text-xs text-muted-foreground mt-1">All records</p>
                </div>
                <FileText className="w-10 h-10 text-muted-foreground/40" />
              </div>
            </CardContent>
          </Card>
          <Card className="border-border/50">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Last Block</p>
                  <p className="text-3xl font-bold text-foreground">2 min</p>
                  <p className="text-xs text-muted-foreground mt-1">ago</p>
                </div>
                <Activity className="w-10 h-10 text-muted-foreground/40" />
              </div>
            </CardContent>
          </Card>
          <Card className="border-secondary/30">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Chain Integrity</p>
                  <p className="text-3xl font-bold text-secondary">100%</p>
                  <p className="text-xs text-secondary mt-1">✓ Verified</p>
                </div>
                <Shield className="w-10 h-10 text-secondary/40" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search & Verify */}
        <Card className="border-border/50">
          <CardHeader>
            <CardTitle>Search Blockchain</CardTitle>
            <CardDescription>Search by block number, hash, or FIR ID</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-3">
              <Input 
                placeholder="Enter block number, hash, or FIR ID..." 
                className="border-border/50"
              />
              <Button className="bg-primary hover:bg-primary-hover">
                Search
              </Button>
              <Button variant="outline" className="border-border/50">
                Verify Chain
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Recent Blocks */}
        <Card className="border-border/50">
          <CardHeader>
            <CardTitle>Recent Blocks</CardTitle>
            <CardDescription>Latest transactions added to the blockchain</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {blocks.map((block) => (
                <Card key={block.blockNumber} className="border-border/50 hover:shadow-md transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-lg flex items-center gap-2">
                          Block {block.blockNumber}
                          {block.verified && (
                            <Badge className="bg-secondary/10 text-secondary border-secondary/20">
                              ✓ Verified
                            </Badge>
                          )}
                        </CardTitle>
                        <CardDescription className="mt-1 font-mono text-xs">
                          Hash: {block.hash}
                        </CardDescription>
                      </div>
                      <span className="text-xs text-muted-foreground">{block.timestamp}</span>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mb-4">
                      <div>
                        <p className="text-muted-foreground">Transactions</p>
                        <p className="font-medium">{block.transactions}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">FIR ID</p>
                        <p className="font-medium">{block.firId}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Action</p>
                        <p className="font-medium">{block.action}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Status</p>
                        <Badge variant="outline" className="bg-secondary/10 text-secondary border-secondary/20">
                          Confirmed
                        </Badge>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" className="border-border/50">
                        View Block Details
                      </Button>
                      <Button size="sm" variant="outline" className="border-border/50">
                        View Transaction
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Blockchain Info */}
        <div className="grid md:grid-cols-2 gap-6">
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle>How It Works</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground">
              <p>• Every FIR action is recorded as a transaction</p>
              <p>• Transactions are grouped into blocks every few minutes</p>
              <p>• Each block is cryptographically linked to the previous one</p>
              <p>• Once added, records cannot be altered or deleted</p>
              <p>• Ensures complete transparency and audit trail</p>
            </CardContent>
          </Card>

          <Card className="border-secondary/30">
            <CardHeader className="bg-secondary/5">
              <CardTitle className="text-secondary">Security Features</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground pt-6">
              <p>✓ SHA-256 cryptographic hashing</p>
              <p>✓ Distributed ledger across multiple nodes</p>
              <p>✓ Automatic integrity verification every 5 minutes</p>
              <p>✓ Tamper-evident design prevents unauthorized changes</p>
              <p>✓ Complete audit trail for compliance</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default BlockchainLedger;
