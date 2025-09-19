import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calculator, Building2, ArrowRight, Scale } from "lucide-react";
import QuickFieldEstimator from "@/components/QuickFieldEstimator";
import DetailedProjectDesk from "@/components/DetailedProjectDesk";
import SteelWeightCalculator from "@/components/SteelWeightCalculator";

const Index = () => {
  const [activeModule, setActiveModule] = useState<"home" | "quick" | "detailed" | "steel">("home");

  if (activeModule === "quick") {
    return <QuickFieldEstimator onBack={() => setActiveModule("home")} />;
  }

  if (activeModule === "detailed") {
    return <DetailedProjectDesk onBack={() => setActiveModule("home")} />;
  }

  if (activeModule === "steel") {
    return <SteelWeightCalculator onBack={() => setActiveModule("home")} />;
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-gradient-primary text-primary-foreground shadow-elevated">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-2">Construction Estimation Suite</h1>
            <p className="text-primary-light text-lg">Professional tools for accurate project estimations</p>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {/* Quick Field Estimator Card */}
          <Card className="bg-gradient-card shadow-card hover:shadow-elevated transition-all duration-300 border-0">
            <div className="p-8">
              <div className="flex items-center mb-6">
                <div className="p-3 bg-accent text-accent-foreground rounded-lg mr-4">
                  <Calculator className="h-8 w-8" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-card-foreground">Quick Field Estimator</h2>
                  <p className="text-muted-foreground">On-site rapid calculations</p>
                </div>
              </div>
              
              <div className="space-y-4 mb-8">
                <div className="flex items-center text-sm text-muted-foreground">
                  <ArrowRight className="h-4 w-4 mr-2 text-accent" />
                  Instant concrete volume calculations
                </div>
                <div className="flex items-center text-sm text-muted-foreground">
                  <ArrowRight className="h-4 w-4 mr-2 text-accent" />
                  Real-time steel weight estimates
                </div>
                <div className="flex items-center text-sm text-muted-foreground">
                  <ArrowRight className="h-4 w-4 mr-2 text-accent" />
                  Immediate cost projections
                </div>
                <div className="flex items-center text-sm text-muted-foreground">
                  <ArrowRight className="h-4 w-4 mr-2 text-accent" />
                  Perfect for field use
                </div>
              </div>

              <Button 
                onClick={() => setActiveModule("quick")}
                className="w-full bg-accent hover:bg-accent/90 text-accent-foreground shadow-calculation"
                size="lg"
              >
                Start Quick Estimation
              </Button>
            </div>
          </Card>

          {/* Detailed Project Desk Card */}
          <Card className="bg-gradient-card shadow-card hover:shadow-elevated transition-all duration-300 border-0">
            <div className="p-8">
              <div className="flex items-center mb-6">
                <div className="p-3 bg-primary text-primary-foreground rounded-lg mr-4">
                  <Building2 className="h-8 w-8" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-card-foreground">Detailed Project Desk</h2>
                  <p className="text-muted-foreground">Comprehensive project planning</p>
                </div>
              </div>
              
              <div className="space-y-4 mb-8">
                <div className="flex items-center text-sm text-muted-foreground">
                  <ArrowRight className="h-4 w-4 mr-2 text-primary" />
                  Multi-component project analysis
                </div>
                <div className="flex items-center text-sm text-muted-foreground">
                  <ArrowRight className="h-4 w-4 mr-2 text-primary" />
                  Material & labor cost breakdown
                </div>
                <div className="flex items-center text-sm text-muted-foreground">
                  <ArrowRight className="h-4 w-4 mr-2 text-primary" />
                  Project data persistence
                </div>
                <div className="flex items-center text-sm text-muted-foreground">
                  <ArrowRight className="h-4 w-4 mr-2 text-primary" />
                  Detailed cost summaries
                </div>
              </div>

              <Button 
                onClick={() => setActiveModule("detailed")}
                className="w-full"
                size="lg"
              >
                Open Project Desk
              </Button>
            </div>
          </Card>

          {/* Steel Weight Calculator Card */}
          <Card className="bg-gradient-card shadow-card hover:shadow-elevated transition-all duration-300 border-0">
            <div className="p-8">
              <div className="flex items-center mb-6">
                <div className="p-3 bg-secondary text-secondary-foreground rounded-lg mr-4">
                  <Scale className="h-8 w-8" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-card-foreground">Steel Weight Calculator</h2>
                  <p className="text-muted-foreground">Civil engineering calculations</p>
                </div>
              </div>
              
              <div className="space-y-4 mb-8">
                <div className="flex items-center text-sm text-muted-foreground">
                  <ArrowRight className="h-4 w-4 mr-2 text-secondary" />
                  IS 456 compliant calculations
                </div>
                <div className="flex items-center text-sm text-muted-foreground">
                  <ArrowRight className="h-4 w-4 mr-2 text-secondary" />
                  Beam, column & slab support
                </div>
                <div className="flex items-center text-sm text-muted-foreground">
                  <ArrowRight className="h-4 w-4 mr-2 text-secondary" />
                  Cutting length calculations
                </div>
                <div className="flex items-center text-sm text-muted-foreground">
                  <ArrowRight className="h-4 w-4 mr-2 text-secondary" />
                  Accurate steel weight estimates
                </div>
              </div>

              <Button 
                onClick={() => setActiveModule("steel")}
                className="w-full bg-secondary hover:bg-secondary/90 text-secondary-foreground"
                size="lg"
              >
                Calculate Steel Weight
              </Button>
            </div>
          </Card>
        </div>

        {/* Features Overview */}
        <div className="mt-16 text-center max-w-3xl mx-auto">
          <h3 className="text-2xl font-bold mb-6 text-foreground">Professional Construction Estimation</h3>
          <p className="text-muted-foreground text-lg leading-relaxed">
            Our estimation suite provides construction professionals with the tools they need for accurate project costing. 
            From quick field calculations to comprehensive project analysis, make informed decisions with confidence.
          </p>
        </div>
      </main>
    </div>
  );
};

export default Index;