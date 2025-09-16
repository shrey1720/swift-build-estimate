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
  const [numberOfBars, setNumberOfBars] = useState<string>("4");
  const [barDiameterMm, setBarDiameterMm] = useState<string>("20");

  const [results, setResults] = useState({
    concreteVolume: 0,
    steelArea: 0,
    totalCost: 0
  });

  // Calculate steel area
  function calculateSteelArea(number_of_bars: number, bar_diameter_mm: number): number {
    // Area of one bar: π × (d/2)^2
    const radius = bar_diameter_mm / 2;
    const area_one_bar = Math.PI * Math.pow(radius, 2); // mm²
    return area_one_bar * number_of_bars;
  }

  // Calculate results in real-time
  useEffect(() => {
    const l = parseFloat(length) || 0;
    const w = parseFloat(width) || 0;
    const d = parseFloat(depth) || 0;
    const q = parseFloat(quantity) || 0;
    const nBars = parseInt(numberOfBars) || 0;
    const barDia = parseFloat(barDiameterMm) || 0;
    const concRate = parseFloat(concreteRate) || 0;
    const stlRate = parseFloat(steelRate) || 0;

    const concreteVolume = l * w * d * q;
    const steelArea = calculateSteelArea(nBars, barDia); // mm²
    // For cost, estimate steel weight: area (mm²) × length (m) × density (kg/m³)
    // Convert area mm² to m²: steelArea / 1e6
    // Assume bar length = member length × quantity
    const totalBarLength = l * q; // m
    const steelVolume_m3 = (steelArea / 1e6) * totalBarLength; // m³
    const steelDensity = 7850; // kg/m³
    const steelWeight = steelVolume_m3 * steelDensity; // kg
    const totalCost = (concreteVolume * concRate) + (steelWeight * stlRate);

    setResults({
      concreteVolume,
      steelArea,
      totalCost
    });
  }, [length, width, depth, quantity, numberOfBars, barDiameterMm, concreteRate, steelRate]);

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
                    <Label htmlFor="numberOfBars">Number of Steel Bars</Label>
                    <Input
                      id="numberOfBars"
                      type="number"
                      value={numberOfBars}
                      onChange={(e) => setNumberOfBars(e.target.value)}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="barDiameterMm">Bar Diameter (mm)</Label>
                    <Input
                      id="barDiameterMm"
                      type="number"
                      value={barDiameterMm}
                      onChange={(e) => setBarDiameterMm(e.target.value)}
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
                  <div className="text-primary-light text-sm mb-1">Steel Area</div>
                  <div className="text-2xl font-bold text-primary-foreground">
                    {results.steelArea.toFixed(0)} mm²
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
                    <div>Steel Area: π × (diameter/2)<sup>2</sup> × number of bars</div>
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
                <strong>Steel Bar Diameters (mm):</strong>
                <ul className="mt-1 space-y-1">
                  <li>• Slabs: 8-12 mm</li>
                  <li>• Beams: 12-20 mm</li>
                </ul>
              </div>
              <div>
                <strong>Typical Number of Bars:</strong>
                <ul className="mt-1 space-y-1">
                  <li>• Columns: 4-8 bars</li>
                  <li>• Foundations: 6-12 bars</li>
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