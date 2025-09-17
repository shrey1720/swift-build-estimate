import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Calculator, Zap, Plus, X } from "lucide-react";

interface QuickFieldEstimatorProps {
  onBack: () => void;
}

// Define a type for a steel bar entry for better type safety
interface SteelBar {
  id: number;
  count: string;
  diameter: string;
}

const QuickFieldEstimator = ({ onBack }: QuickFieldEstimatorProps) => {
  // --- STATE MANAGEMENT ---
  const [concreteRate, setConcreteRate] = useState<string>("8000");
  const [steelRate, setSteelRate] = useState<string>("65");
  const [length, setLength] = useState<string>("");
  const [width, setWidth] = useState<string>("");
  const [depth, setDepth] = useState<string>("");
  const [quantity, setQuantity] = useState<string>("1");

  // State for managing multiple steel bar types
  const [steelBars, setSteelBars] = useState<SteelBar[]>([
    { id: Date.now(), count: '4', diameter: '20' },
  ]);

  const [results, setResults] = useState({
    concreteVolume: 0,
    steelArea: 0,
    totalCost: 0
  });

  // Common bar diameters for the select dropdown
  const barDiameters = ['8', '10', '12', '16', '20', '25', '32'];

  // --- CALCULATION LOGIC ---

  // Helper function to calculate the area of steel bars
  const calculateSteelArea = (number_of_bars: number, bar_diameter_mm: number): number => {
    const radius = bar_diameter_mm / 2;
    const area_one_bar = Math.PI * Math.pow(radius, 2); // mm²
    return area_one_bar * number_of_bars;
  };

  // Main calculation effect, runs whenever an input value changes
  useEffect(() => {
    const l = parseFloat(length) || 0;
    const w = parseFloat(width) || 0;
    const d = parseFloat(depth) || 0;
    const q = parseFloat(quantity) || 1;
    const concRate = parseFloat(concreteRate) || 0;
    const stlRate = parseFloat(steelRate) || 0;

    // Calculate concrete volume
    const concreteVolume = l * w * d * q;

    // Calculate total steel area by summing up all bar types
    const totalSteelArea = steelBars.reduce((acc, bar) => {
      const nBars = parseInt(bar.count) || 0;
      const barDia = parseFloat(bar.diameter) || 0;
      return acc + (nBars > 0 && barDia > 0 ? calculateSteelArea(nBars, barDia) : 0);
    }, 0);

    // Estimate total steel weight for cost calculation
    const totalBarLength = l * q; // Simplified assumption: total length of all bars equals member length * quantity
    const steelVolume_m3 = (totalSteelArea / 1_000_000) * totalBarLength; // Convert area from mm² to m²
    const steelDensity = 7850; // Standard density of steel in kg/m³
    const steelWeight = steelVolume_m3 * steelDensity; // kg

    // Calculate total cost
    const totalCost = (concreteVolume * concRate) + (steelWeight * stlRate);

    setResults({
      concreteVolume,
      steelArea: totalSteelArea,
      totalCost
    });
  }, [length, width, depth, quantity, steelBars, concreteRate, steelRate]);


  // --- HANDLER FUNCTIONS for managing steel bars ---

  const handleBarChange = (id: number, field: keyof Omit<SteelBar, 'id'>, value: string) => {
    setSteelBars(steelBars.map(bar =>
      bar.id === id ? { ...bar, [field]: value } : bar
    ));
  };

  const handleAddBar = () => {
    setSteelBars([...steelBars, { id: Date.now(), count: '2', diameter: '16' }]);
  };

  const handleRemoveBar = (id: number) => {
    // Prevent removing the last remaining bar row
    if (steelBars.length > 1) {
      setSteelBars(steelBars.filter(bar => bar.id !== id));
    }
  };

  // --- JSX / RENDER ---
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
          {/* Column 1: Material Rates */}
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

          {/* Column 2: Member Dimensions & Reinforcement */}
          <Card className="bg-gradient-card shadow-card">
            <div className="p-6">
              <h2 className="text-xl font-bold mb-4 text-card-foreground">Member Dimensions</h2>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="length">Length (m)</Label>
                  <Input id="length" type="number" value={length} onChange={(e) => setLength(e.target.value)} className="mt-1" placeholder="Enter length" />
                </div>
                <div>
                  <Label htmlFor="width">Width (m)</Label>
                  <Input id="width" type="number" value={width} onChange={(e) => setWidth(e.target.value)} className="mt-1" placeholder="Enter width" />
                </div>
                <div>
                  <Label htmlFor="depth">Depth/Thickness (m)</Label>
                  <Input id="depth" type="number" value={depth} onChange={(e) => setDepth(e.target.value)} className="mt-1" placeholder="Enter depth" />
                </div>
                 <div>
                  <Label htmlFor="quantity">Quantity</Label>
                  <Input id="quantity" type="number" value={quantity} onChange={(e) => setQuantity(e.target.value)} className="mt-1" />
                </div>
              </div>

              {/* Steel Reinforcement Section */}
              <div className="mt-6 pt-4 border-t border-muted/50">
                <h3 className="text-lg font-semibold mb-3 text-card-foreground">Steel Reinforcement</h3>
                <div className="space-y-3">
                  {steelBars.map((bar, index) => (
                    <div key={bar.id} className="grid grid-cols-[1fr,1fr,auto] gap-2 items-center">
                       <div>
                        <Label htmlFor={`barCount-${bar.id}`} className="sr-only">Number of Bars</Label>
                        <Input
                          id={`barCount-${bar.id}`}
                          type="number"
                          value={bar.count}
                          onChange={(e) => handleBarChange(bar.id, 'count', e.target.value)}
                          placeholder="No."
                        />
                      </div>
                      <div>
                        <Label htmlFor={`barDiameter-${bar.id}`} className="sr-only">Bar Diameter</Label>
                         <select
                           id={`barDiameter-${bar.id}`}
                           value={bar.diameter}
                           onChange={(e) => handleBarChange(bar.id, 'diameter', e.target.value)}
                           className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                         >
                           {barDiameters.map(dia => <option key={dia} value={dia}>{dia} mm</option>)}
                         </select>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleRemoveBar(bar.id)}
                        disabled={steelBars.length <= 1}
                        className="text-muted-foreground hover:text-destructive"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
                <Button variant="outline" onClick={handleAddBar} className="w-full mt-4">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Bar Type
                </Button>
              </div>
            </div>
          </Card>

          {/* Column 3: Results */}
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
                  <div className="text-primary-light text-sm mb-1">Total Steel Area</div>
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
                    <div>Concrete: L × W × D × Qty</div>
                    <div>Steel Area: Sum of all bar areas</div>
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
                <strong>Typical Steel Bar Diameters (mm):</strong>
                <ul className="mt-1 list-disc list-inside">
                  <li>Slabs: 8-12 mm</li>
                  <li>Beams: 12-25 mm</li>
                  <li>Columns: 16-32 mm</li>
                </ul>
              </div>
              <div>
                <strong>Disclaimer:</strong>
                <p className="mt-1">
                  This tool provides a preliminary estimate for quick field reference. Costs are based on simplified assumptions. Always refer to detailed structural drawings and perform a formal quantity survey for accurate billing.
                </p>
              </div>
            </div>
          </div>
        </Card>
      </main>
    </div>
  );
};

export default QuickFieldEstimator;