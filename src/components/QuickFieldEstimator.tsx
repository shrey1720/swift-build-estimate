import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Calculator, Zap } from "lucide-react";

interface QuickFieldEstimatorProps {
  onBack: () => void;
}

const QuickFieldEstimator = ({ onBack }: QuickFieldEstimatorProps) => {
  const [concreteRate, setConcreteRate] = useState<string>("8000");
  const [steelRate, setSteelRate] = useState<string>("65");
  const [length, setLength] = useState<string>("");
  const [width, setWidth] = useState<string>("");
  const [depth, setDepth] = useState<string>("");
  const [quantity, setQuantity] = useState<string>("1");
  const [steelPercentage, setSteelPercentage] = useState<string>("1.5");

  const [results, setResults] = useState({
    concreteVolume: 0,
    steelWeight: 0,
    totalCost: 0
  });

  // Calculate results in real-time
  useEffect(() => {
    const l = parseFloat(length) || 0;
    const w = parseFloat(width) || 0;
    const d = parseFloat(depth) || 0;
    const q = parseFloat(quantity) || 0;
    const steelPct = parseFloat(steelPercentage) || 0;
    const concRate = parseFloat(concreteRate) || 0;
    const stlRate = parseFloat(steelRate) || 0;

    const concreteVolume = l * w * d * q;
    const steelWeight = (concreteVolume * (steelPct / 100)) * 7850;
    const totalCost = (concreteVolume * concRate) + (steelWeight * stlRate);

    setResults({
      concreteVolume,
      steelWeight,
      totalCost
    });
  }, [length, width, depth, quantity, steelPercentage, concreteRate, steelRate]);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-gradient-accent text-accent-foreground shadow-elevated">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center">
            <Button
              variant="outline"
              onClick={onBack}
              className="mr-4 bg-white/10 border-white/20 text-accent-foreground hover:bg-white/20"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <div className="flex items-center">
              <Calculator className="h-6 w-6 mr-3" />
              <div>
                <h1 className="text-2xl font-bold">Quick Field Estimator</h1>
                <p className="text-accent-light">Instant on-site calculations</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Material Rates */}
          <Card className="bg-gradient-card shadow-card">
            <div className="p-6">
              <h2 className="text-xl font-bold mb-4 text-card-foreground flex items-center">
                <Zap className="h-5 w-5 mr-2 text-accent" />
                Material Rates
              </h2>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="concreteRate">Concrete Rate (₹ per m³)</Label>
                  <Input
                    id="concreteRate"
                    type="number"
                    value={concreteRate}
                    onChange={(e) => setConcreteRate(e.target.value)}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="steelRate">Steel Rate (₹ per kg)</Label>
                  <Input
                    id="steelRate"
                    type="number"
                    value={steelRate}
                    onChange={(e) => setSteelRate(e.target.value)}
                    className="mt-1"
                  />
                </div>
              </div>
            </div>
          </Card>

          {/* Member Dimensions */}
          <Card className="bg-gradient-card shadow-card">
            <div className="p-6">
              <h2 className="text-xl font-bold mb-4 text-card-foreground">Member Dimensions</h2>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="length">Length (m)</Label>
                  <Input
                    id="length"
                    type="number"
                    value={length}
                    onChange={(e) => setLength(e.target.value)}
                    className="mt-1"
                    placeholder="Enter length"
                  />
                </div>
                <div>
                  <Label htmlFor="width">Width (m)</Label>
                  <Input
                    id="width"
                    type="number"
                    value={width}
                    onChange={(e) => setWidth(e.target.value)}
                    className="mt-1"
                    placeholder="Enter width"
                  />
                </div>
                <div>
                  <Label htmlFor="depth">Depth/Thickness (m)</Label>
                  <Input
                    id="depth"
                    type="number"
                    value={depth}
                    onChange={(e) => setDepth(e.target.value)}
                    className="mt-1"
                    placeholder="Enter depth"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="quantity">Quantity</Label>
                    <Input
                      id="quantity"
                      type="number"
                      value={quantity}
                      onChange={(e) => setQuantity(e.target.value)}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="steelPercentage">Steel % (0.8-4%)</Label>
                    <Input
                      id="steelPercentage"
                      type="number"
                      step="0.1"
                      value={steelPercentage}
                      onChange={(e) => setSteelPercentage(e.target.value)}
                      className="mt-1"
                    />
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* Results */}
          <Card className="bg-gradient-primary shadow-elevated">
            <div className="p-6">
              <h2 className="text-xl font-bold mb-4 text-primary-foreground">Instant Results</h2>
              <div className="space-y-6">
                <div className="bg-white/10 rounded-lg p-4">
                  <div className="text-primary-light text-sm mb-1">Concrete Volume</div>
                  <div className="text-2xl font-bold text-primary-foreground">
                    {results.concreteVolume.toFixed(3)} m³
                  </div>
                </div>
                
                <div className="bg-white/10 rounded-lg p-4">
                  <div className="text-primary-light text-sm mb-1">Steel Weight</div>
                  <div className="text-2xl font-bold text-primary-foreground">
                    {results.steelWeight.toFixed(0)} kg
                  </div>
                </div>
                
                <div className="bg-white/20 rounded-lg p-4 shadow-calculation">
                  <div className="text-primary-light text-sm mb-1">Estimated Cost</div>
                  <div className="text-3xl font-bold text-primary-foreground">
                    ₹ {results.totalCost.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                  </div>
                </div>
              </div>

              {results.concreteVolume > 0 && (
                <div className="mt-6 pt-4 border-t border-white/20">
                  <div className="text-sm text-primary-light space-y-1">
                    <div>Formula: L × W × D × Qty</div>
                    <div>Steel: Volume × {steelPercentage}% × 7850 kg/m³</div>
                  </div>
                </div>
              )}
            </div>
          </Card>
        </div>

        {/* Usage Tips */}
        <Card className="mt-8 bg-muted/50 border-accent/20">
          <div className="p-6">
            <h3 className="text-lg font-semibold mb-3 text-accent">Quick Tips</h3>
            <div className="grid md:grid-cols-2 gap-4 text-sm text-muted-foreground">
              <div>
                <strong>Steel Percentages:</strong>
                <ul className="mt-1 space-y-1">
                  <li>• Slabs: 0.8-1.2%</li>
                  <li>• Beams: 1.0-2.5%</li>
                </ul>
              </div>
              <div>
                <strong>Typical Usage:</strong>
                <ul className="mt-1 space-y-1">
                  <li>• Columns: 1.5-4.0%</li>
                  <li>• Foundations: 0.8-1.5%</li>
                </ul>
              </div>
            </div>
          </div>
        </Card>
      </main>
    </div>
  );
};

export default QuickFieldEstimator;