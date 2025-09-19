import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Calculator, Info, CheckCircle } from "lucide-react";

interface SteelWeightCalculatorProps {
  onBack: () => void;
}

type ElementType = "beam" | "column" | "slab" | null;

interface BeamInputs {
  length: string;
  width: string;
  depth: string;
  cover: string;
  mainBarDia: string;
  mainBarCount: string;
  stirrupDia: string;
  stirrupSpacing: string;
}

interface ColumnInputs {
  height: string;
  width: string;
  depth: string;
  cover: string;
  mainBarDia: string;
  mainBarCount: string;
  tieDia: string;
  tieSpacing: string;
}

interface SlabInputs {
  length: string;
  width: string;
  thickness: string;
  cover: string;
  mainBarDia: string;
  mainBarSpacing: string;
  distBarDia: string;
  distBarSpacing: string;
}

interface CalculationResult {
  description: string;
  totalLength: number;
  weight: number;
}

const SteelWeightCalculator = ({ onBack }: SteelWeightCalculatorProps) => {
  const [selectedElement, setSelectedElement] = useState<ElementType>(null);
  const [beamInputs, setBeamInputs] = useState<BeamInputs>({
    length: "", width: "", depth: "", cover: "25",
    mainBarDia: "", mainBarCount: "", stirrupDia: "", stirrupSpacing: ""
  });
  const [columnInputs, setColumnInputs] = useState<ColumnInputs>({
    height: "", width: "", depth: "", cover: "40",
    mainBarDia: "", mainBarCount: "", tieDia: "", tieSpacing: ""
  });
  const [slabInputs, setSlabInputs] = useState<SlabInputs>({
    length: "", width: "", thickness: "", cover: "20",
    mainBarDia: "", mainBarSpacing: "", distBarDia: "", distBarSpacing: ""
  });

  const [results, setResults] = useState<CalculationResult[]>([]);
  const [totalWeight, setTotalWeight] = useState<number>(0);

  // Core formula: Weight per meter = D² / 162.2
  const calculateWeightPerMeter = (diameter: number): number => {
    return (diameter * diameter) / 162.2;
  };

  const calculateBeamSteel = () => {
    const L = parseFloat(beamInputs.length) || 0;
    const W = parseFloat(beamInputs.width) || 0;
    const D = parseFloat(beamInputs.depth) || 0;
    const cover = parseFloat(beamInputs.cover) || 0;
    const mainDia = parseFloat(beamInputs.mainBarDia) || 0;
    const mainCount = parseFloat(beamInputs.mainBarCount) || 0;
    const stirrupDia = parseFloat(beamInputs.stirrupDia) || 0;
    const stirrupSpacing = parseFloat(beamInputs.stirrupSpacing) || 0;

    if (!L || !W || !D || !mainDia || !mainCount || !stirrupDia || !stirrupSpacing) return;

    const calculationResults: CalculationResult[] = [];

    // Main Bars Calculation
    const mainBarLength = L - (2 * cover / 1000) + (2 * 9 * mainDia / 1000); // Convert mm to m
    const totalMainLength = mainBarLength * mainCount;
    const mainWeight = totalMainLength * calculateWeightPerMeter(mainDia);
    
    calculationResults.push({
      description: `Main Bars (${mainDia} mm)`,
      totalLength: totalMainLength,
      weight: mainWeight
    });

    // Stirrups Calculation
    const a = W - (2 * cover);
    const b = D - (2 * cover);
    const stirrupLength = (2 * a + 2 * b + 2 * 10 * stirrupDia) / 1000; // Convert mm to m
    const stirrupCount = (L * 1000 / stirrupSpacing) + 1; // Convert L to mm for calculation
    const totalStirrupLength = stirrupLength * stirrupCount;
    const stirrupWeight = totalStirrupLength * calculateWeightPerMeter(stirrupDia);

    calculationResults.push({
      description: `Stirrups (${stirrupDia} mm)`,
      totalLength: totalStirrupLength,
      weight: stirrupWeight
    });

    const total = calculationResults.reduce((sum, result) => sum + result.weight, 0);
    setResults(calculationResults);
    setTotalWeight(total);
  };

  const calculateColumnSteel = () => {
    const H = parseFloat(columnInputs.height) || 0;
    const W = parseFloat(columnInputs.width) || 0;
    const D = parseFloat(columnInputs.depth) || 0;
    const cover = parseFloat(columnInputs.cover) || 0;
    const mainDia = parseFloat(columnInputs.mainBarDia) || 0;
    const mainCount = parseFloat(columnInputs.mainBarCount) || 0;
    const tieDia = parseFloat(columnInputs.tieDia) || 0;
    const tieSpacing = parseFloat(columnInputs.tieSpacing) || 0;

    if (!H || !W || !D || !mainDia || !mainCount || !tieDia || !tieSpacing) return;

    const calculationResults: CalculationResult[] = [];

    // Main Bars Calculation
    const mainBarLength = H; // No bends for simple column
    const totalMainLength = mainBarLength * mainCount;
    const mainWeight = totalMainLength * calculateWeightPerMeter(mainDia);
    
    calculationResults.push({
      description: `Main Bars (${mainDia} mm)`,
      totalLength: totalMainLength,
      weight: mainWeight
    });

    // Lateral Ties Calculation
    const a = W - (2 * cover);
    const b = D - (2 * cover);
    const tieLength = (2 * a + 2 * b + 2 * 10 * tieDia) / 1000; // Convert mm to m
    const tieCount = (H * 1000 / tieSpacing) + 1; // Convert H to mm for calculation
    const totalTieLength = tieLength * tieCount;
    const tieWeight = totalTieLength * calculateWeightPerMeter(tieDia);

    calculationResults.push({
      description: `Lateral Ties (${tieDia} mm)`,
      totalLength: totalTieLength,
      weight: tieWeight
    });

    const total = calculationResults.reduce((sum, result) => sum + result.weight, 0);
    setResults(calculationResults);
    setTotalWeight(total);
  };

  const calculateSlabSteel = () => {
    const L = parseFloat(slabInputs.length) || 0;
    const W = parseFloat(slabInputs.width) || 0;
    const cover = parseFloat(slabInputs.cover) || 0;
    const mainDia = parseFloat(slabInputs.mainBarDia) || 0;
    const mainSpacing = parseFloat(slabInputs.mainBarSpacing) || 0;
    const distDia = parseFloat(slabInputs.distBarDia) || 0;
    const distSpacing = parseFloat(slabInputs.distBarSpacing) || 0;

    if (!L || !W || !mainDia || !mainSpacing || !distDia || !distSpacing) return;

    const calculationResults: CalculationResult[] = [];

    // Main Bars Calculation
    const mainBarLength = W - (2 * cover / 1000); // Convert mm to m
    const mainBarCount = (L * 1000 / mainSpacing) + 1; // Convert L to mm for calculation
    const totalMainLength = mainBarLength * mainBarCount;
    const mainWeight = totalMainLength * calculateWeightPerMeter(mainDia);
    
    calculationResults.push({
      description: `Main Bars (${mainDia} mm)`,
      totalLength: totalMainLength,
      weight: mainWeight
    });

    // Distribution Bars Calculation
    const distBarLength = L - (2 * cover / 1000); // Convert mm to m
    const distBarCount = (W * 1000 / distSpacing) + 1; // Convert W to mm for calculation
    const totalDistLength = distBarLength * distBarCount;
    const distWeight = totalDistLength * calculateWeightPerMeter(distDia);

    calculationResults.push({
      description: `Distribution Bars (${distDia} mm)`,
      totalLength: totalDistLength,
      weight: distWeight
    });

    const total = calculationResults.reduce((sum, result) => sum + result.weight, 0);
    setResults(calculationResults);
    setTotalWeight(total);
  };

  const handleCalculate = () => {
    setResults([]);
    setTotalWeight(0);
    
    switch (selectedElement) {
      case "beam":
        calculateBeamSteel();
        break;
      case "column":
        calculateColumnSteel();
        break;
      case "slab":
        calculateSlabSteel();
        break;
    }
  };

  const resetCalculator = () => {
    setSelectedElement(null);
    setResults([]);
    setTotalWeight(0);
  };

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
                <h1 className="text-2xl font-bold">Civil Engineering Steel Weight Calculator</h1>
                <p className="text-accent-light">Accurate steel reinforcement calculations</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {!selectedElement ? (
          // Step 1: Element Type Selection
          <div className="max-w-4xl mx-auto">
            <Card className="bg-gradient-card shadow-card mb-8">
              <div className="p-6">
                <h2 className="text-2xl font-bold mb-4 text-card-foreground flex items-center">
                  <Info className="h-6 w-6 mr-3 text-accent" />
                  Welcome! Let's Calculate Steel Reinforcement Weight
                </h2>
                <p className="text-muted-foreground mb-6">
                  I'm your Civil Engineering Assistant. I'll help you calculate the total weight of steel reinforcement 
                  required for concrete elements using standard IS 456 guidelines.
                </p>
                <div className="bg-muted/50 p-4 rounded-lg">
                  <p className="text-sm text-muted-foreground">
                    <strong>Formula Used:</strong> Weight per meter (kg/m) = D² / 162.2 (where D = diameter in mm)
                  </p>
                </div>
              </div>
            </Card>

            <Card className="bg-gradient-card shadow-card">
              <div className="p-6">
                <h3 className="text-xl font-bold mb-6 text-card-foreground">
                  Select the structural element you want to calculate:
                </h3>
                <div className="grid md:grid-cols-3 gap-6">
                  <Button
                    onClick={() => setSelectedElement("beam")}
                    className="h-auto p-6 flex flex-col items-center space-y-3 bg-accent hover:bg-accent/90"
                  >
                    <div className="text-2xl">🏗️</div>
                    <div className="text-lg font-semibold">Beam</div>
                    <div className="text-sm text-center opacity-90">
                      Horizontal structural element
                    </div>
                  </Button>
                  
                  <Button
                    onClick={() => setSelectedElement("column")}
                    className="h-auto p-6 flex flex-col items-center space-y-3 bg-primary hover:bg-primary/90"
                  >
                    <div className="text-2xl">🏛️</div>
                    <div className="text-lg font-semibold">Column</div>
                    <div className="text-sm text-center opacity-90">
                      Vertical structural element
                    </div>
                  </Button>
                  
                  <Button
                    onClick={() => setSelectedElement("slab")}
                    className="h-auto p-6 flex flex-col items-center space-y-3 bg-secondary hover:bg-secondary/90"
                  >
                    <div className="text-2xl">🔲</div>
                    <div className="text-lg font-semibold">Slab</div>
                    <div className="text-sm text-center opacity-90">
                      Horizontal flat element
                    </div>
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        ) : (
          // Step 2 & 3: Input Form and Calculations
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold capitalize">
                {selectedElement} Steel Weight Calculation
              </h2>
              <Button variant="outline" onClick={resetCalculator}>
                Change Element Type
              </Button>
            </div>

            <div className="grid lg:grid-cols-2 gap-8">
              {/* Input Form */}
              <Card className="bg-gradient-card shadow-card">
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-4">Enter {selectedElement} details:</h3>
                  
                  {selectedElement === "beam" && (
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label>Beam Length (m)</Label>
                          <Input
                            type="number"
                            value={beamInputs.length}
                            onChange={(e) => setBeamInputs({...beamInputs, length: e.target.value})}
                            placeholder="e.g., 6"
                          />
                        </div>
                        <div>
                          <Label>Beam Width (mm)</Label>
                          <Input
                            type="number"
                            value={beamInputs.width}
                            onChange={(e) => setBeamInputs({...beamInputs, width: e.target.value})}
                            placeholder="e.g., 230"
                          />
                        </div>
                        <div>
                          <Label>Beam Depth (mm)</Label>
                          <Input
                            type="number"
                            value={beamInputs.depth}
                            onChange={(e) => setBeamInputs({...beamInputs, depth: e.target.value})}
                            placeholder="e.g., 450"
                          />
                        </div>
                        <div>
                          <Label>Concrete Cover (mm)</Label>
                          <Input
                            type="number"
                            value={beamInputs.cover}
                            onChange={(e) => setBeamInputs({...beamInputs, cover: e.target.value})}
                            placeholder="25 (IS 456 typical)"
                          />
                        </div>
                      </div>
                      
                      <div className="border-t pt-4">
                        <h4 className="font-semibold mb-3">Main Bar Details</h4>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label>Main Bar Diameter (mm)</Label>
                            <Input
                              type="number"
                              value={beamInputs.mainBarDia}
                              onChange={(e) => setBeamInputs({...beamInputs, mainBarDia: e.target.value})}
                              placeholder="e.g., 16"
                            />
                          </div>
                          <div>
                            <Label>Number of Main Bars</Label>
                            <Input
                              type="number"
                              value={beamInputs.mainBarCount}
                              onChange={(e) => setBeamInputs({...beamInputs, mainBarCount: e.target.value})}
                              placeholder="e.g., 4"
                            />
                          </div>
                        </div>
                      </div>

                      <div className="border-t pt-4">
                        <h4 className="font-semibold mb-3">Stirrup Details</h4>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label>Stirrup Diameter (mm)</Label>
                            <Input
                              type="number"
                              value={beamInputs.stirrupDia}
                              onChange={(e) => setBeamInputs({...beamInputs, stirrupDia: e.target.value})}
                              placeholder="e.g., 8"
                            />
                          </div>
                          <div>
                            <Label>Stirrup Spacing (mm)</Label>
                            <Input
                              type="number"
                              value={beamInputs.stirrupSpacing}
                              onChange={(e) => setBeamInputs({...beamInputs, stirrupSpacing: e.target.value})}
                              placeholder="e.g., 200"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {selectedElement === "column" && (
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label>Column Height (m)</Label>
                          <Input
                            type="number"
                            value={columnInputs.height}
                            onChange={(e) => setColumnInputs({...columnInputs, height: e.target.value})}
                            placeholder="e.g., 3"
                          />
                        </div>
                        <div>
                          <Label>Column Width (mm)</Label>
                          <Input
                            type="number"
                            value={columnInputs.width}
                            onChange={(e) => setColumnInputs({...columnInputs, width: e.target.value})}
                            placeholder="e.g., 230"
                          />
                        </div>
                        <div>
                          <Label>Column Depth (mm)</Label>
                          <Input
                            type="number"
                            value={columnInputs.depth}
                            onChange={(e) => setColumnInputs({...columnInputs, depth: e.target.value})}
                            placeholder="e.g., 300"
                          />
                        </div>
                        <div>
                          <Label>Concrete Cover (mm)</Label>
                          <Input
                            type="number"
                            value={columnInputs.cover}
                            onChange={(e) => setColumnInputs({...columnInputs, cover: e.target.value})}
                            placeholder="40 (IS 456 typical)"
                          />
                        </div>
                      </div>
                      
                      <div className="border-t pt-4">
                        <h4 className="font-semibold mb-3">Main Bar Details</h4>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label>Main Bar Diameter (mm)</Label>
                            <Input
                              type="number"
                              value={columnInputs.mainBarDia}
                              onChange={(e) => setColumnInputs({...columnInputs, mainBarDia: e.target.value})}
                              placeholder="e.g., 20"
                            />
                          </div>
                          <div>
                            <Label>Number of Main Bars</Label>
                            <Input
                              type="number"
                              value={columnInputs.mainBarCount}
                              onChange={(e) => setColumnInputs({...columnInputs, mainBarCount: e.target.value})}
                              placeholder="e.g., 8"
                            />
                          </div>
                        </div>
                      </div>

                      <div className="border-t pt-4">
                        <h4 className="font-semibold mb-3">Lateral Tie Details</h4>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label>Tie Diameter (mm)</Label>
                            <Input
                              type="number"
                              value={columnInputs.tieDia}
                              onChange={(e) => setColumnInputs({...columnInputs, tieDia: e.target.value})}
                              placeholder="e.g., 8"
                            />
                          </div>
                          <div>
                            <Label>Tie Spacing (mm)</Label>
                            <Input
                              type="number"
                              value={columnInputs.tieSpacing}
                              onChange={(e) => setColumnInputs({...columnInputs, tieSpacing: e.target.value})}
                              placeholder="e.g., 200"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {selectedElement === "slab" && (
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label>Slab Length (m)</Label>
                          <Input
                            type="number"
                            value={slabInputs.length}
                            onChange={(e) => setSlabInputs({...slabInputs, length: e.target.value})}
                            placeholder="e.g., 4"
                          />
                        </div>
                        <div>
                          <Label>Slab Width (m)</Label>
                          <Input
                            type="number"
                            value={slabInputs.width}
                            onChange={(e) => setSlabInputs({...slabInputs, width: e.target.value})}
                            placeholder="e.g., 3"
                          />
                        </div>
                        <div>
                          <Label>Slab Thickness (mm)</Label>
                          <Input
                            type="number"
                            value={slabInputs.thickness}
                            onChange={(e) => setSlabInputs({...slabInputs, thickness: e.target.value})}
                            placeholder="e.g., 150"
                          />
                        </div>
                        <div>
                          <Label>Concrete Cover (mm)</Label>
                          <Input
                            type="number"
                            value={slabInputs.cover}
                            onChange={(e) => setSlabInputs({...slabInputs, cover: e.target.value})}
                            placeholder="20 (IS 456 typical)"
                          />
                        </div>
                      </div>
                      
                      <div className="border-t pt-4">
                        <h4 className="font-semibold mb-3">Main Bar Details</h4>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label>Main Bar Diameter (mm)</Label>
                            <Input
                              type="number"
                              value={slabInputs.mainBarDia}
                              onChange={(e) => setSlabInputs({...slabInputs, mainBarDia: e.target.value})}
                              placeholder="e.g., 12"
                            />
                          </div>
                          <div>
                            <Label>Main Bar Spacing (mm)</Label>
                            <Input
                              type="number"
                              value={slabInputs.mainBarSpacing}
                              onChange={(e) => setSlabInputs({...slabInputs, mainBarSpacing: e.target.value})}
                              placeholder="e.g., 200"
                            />
                          </div>
                        </div>
                      </div>

                      <div className="border-t pt-4">
                        <h4 className="font-semibold mb-3">Distribution Bar Details</h4>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label>Distribution Bar Diameter (mm)</Label>
                            <Input
                              type="number"
                              value={slabInputs.distBarDia}
                              onChange={(e) => setSlabInputs({...slabInputs, distBarDia: e.target.value})}
                              placeholder="e.g., 10"
                            />
                          </div>
                          <div>
                            <Label>Distribution Bar Spacing (mm)</Label>
                            <Input
                              type="number"
                              value={slabInputs.distBarSpacing}
                              onChange={(e) => setSlabInputs({...slabInputs, distBarSpacing: e.target.value})}
                              placeholder="e.g., 200"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  <Button 
                    onClick={handleCalculate}
                    className="w-full mt-6 bg-accent hover:bg-accent/90"
                    size="lg"
                  >
                    Calculate Steel Weight
                  </Button>
                </div>
              </Card>

              {/* Results */}
              <Card className="bg-gradient-primary shadow-elevated">
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-4 text-primary-foreground">
                    Calculation Results
                  </h3>
                  
                  {results.length > 0 ? (
                    <div className="space-y-4">
                      {results.map((result, index) => (
                        <div key={index} className="bg-white/10 rounded-lg p-4">
                          <div className="flex items-center mb-2">
                            <CheckCircle className="h-4 w-4 mr-2 text-primary-light" />
                            <div className="text-primary-foreground font-semibold">
                              {result.description}
                            </div>
                          </div>
                          <div className="text-primary-light text-sm mb-1">
                            Total Length: {result.totalLength.toFixed(2)} m
                          </div>
                          <div className="text-primary-foreground font-bold text-lg">
                            Weight: {result.weight.toFixed(2)} kg
                          </div>
                        </div>
                      ))}
                      
                      <div className="bg-white/20 rounded-lg p-4 shadow-calculation">
                        <div className="text-primary-light text-sm mb-1">Total Steel Weight Required</div>
                        <div className="text-3xl font-bold text-primary-foreground">
                          {totalWeight.toFixed(2)} kg
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-primary-light text-center py-8">
                      Enter all required values and click "Calculate Steel Weight" to see results.
                    </div>
                  )}
                </div>
              </Card>
            </div>

            {/* Assumptions & Notes */}
            {results.length > 0 && (
              <Card className="mt-8 bg-muted/50 border-accent/20">
                <div className="p-6">
                  <h3 className="text-lg font-semibold mb-3 text-accent">Calculation Assumptions</h3>
                  <div className="text-sm text-muted-foreground space-y-2">
                    <div>• Unit weight formula: Weight per meter (kg/m) = D² / 162.2</div>
                    <div>• Standard 90° bends included for main bars (9D development length)</div>
                    <div>• 135° hooks included for stirrups/ties (10D hook length)</div>
                    <div>• Concrete cover as per IS 456:2000 guidelines</div>
                    <div>• Results are based on theoretical calculations - add safety factors as required</div>
                  </div>
                </div>
              </Card>
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default SteelWeightCalculator;