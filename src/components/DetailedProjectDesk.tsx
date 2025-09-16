import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Building2, Plus, Trash2, Save, FileText } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Member {
  id: string;
  name: string;
  length: number;
  width: number;
  depth: number;
  quantity: number;
  numberOfBars: number;
  barDiameterMm: number;
}

interface DetailedProjectDeskProps {
  onBack: () => void;
}

const DetailedProjectDesk = ({ onBack }: DetailedProjectDeskProps) => {
  const { toast } = useToast();
  const [projectName, setProjectName] = useState("");
  const [concreteRate, setConcreteRate] = useState<string>("8000");
  const [steelRate, setSteelRate] = useState<string>("65");
  const [concreteLaborRate, setConcreteLaborRate] = useState<string>("1500");
  const [steelLaborRate, setSteelLaborRate] = useState<string>("15");
  
  const [members, setMembers] = useState<Member[]>([
    {
      id: "1",
      name: "Column C1",
      length: 0.3,
      width: 0.3,
      depth: 3.0,
      quantity: 4,
      numberOfBars: 4,
      barDiameterMm: 20
    }
  ]);

  const addMember = () => {
    const newMember: Member = {
      id: Date.now().toString(),
      name: `Member ${members.length + 1}`,
      length: 0,
      width: 0,
      depth: 0,
      quantity: 1,
      numberOfBars: 4,
      barDiameterMm: 20
    };
    setMembers([...members, newMember]);
  };

  const removeMember = (id: string) => {
    setMembers(members.filter(member => member.id !== id));
  };

  const updateMember = (id: string, field: keyof Member, value: string | number) => {
    setMembers(members.map(member => 
      member.id === id ? { ...member, [field]: value } : member
    ));
  };

  // Calculate steel area
  function calculateSteelArea(number_of_bars: number, bar_diameter_mm: number): number {
    const radius = bar_diameter_mm / 2;
    const area_one_bar = Math.PI * Math.pow(radius, 2); // mm²
    return area_one_bar * number_of_bars;
  }

  // Calculate totals
  const calculations = members.reduce((acc, member) => {
    const concreteVolume = member.length * member.width * member.depth * member.quantity;
    const steelArea = calculateSteelArea(member.numberOfBars, member.barDiameterMm); // mm²
    // For cost, estimate steel weight: area (mm²) × length (m) × density (kg/m³)
    // Convert area mm² to m²: steelArea / 1e6
    // Assume bar length = member length × quantity
    const totalBarLength = member.length * member.quantity; // m
    const steelVolume_m3 = (steelArea / 1e6) * totalBarLength; // m³
    const steelDensity = 7850; // kg/m³
    const steelWeight = steelVolume_m3 * steelDensity; // kg

    acc.totalConcreteVolume += concreteVolume;
    acc.totalSteelWeight += steelWeight;
    acc.totalSteelArea += steelArea;
    return acc;
  }, { totalConcreteVolume: 0, totalSteelWeight: 0, totalSteelArea: 0 });

  const materialCost = (calculations.totalConcreteVolume * parseFloat(concreteRate)) + 
                      (calculations.totalSteelWeight * parseFloat(steelRate));
  const laborCost = (calculations.totalConcreteVolume * parseFloat(concreteLaborRate)) + 
                   (calculations.totalSteelWeight * parseFloat(steelLaborRate));
  const grandTotal = materialCost + laborCost;

  const saveProject = () => {
    if (!projectName.trim()) {
      toast({
        title: "Project name required",
        description: "Please enter a project name before saving.",
        variant: "destructive"
      });
      return;
    }

    // In a real application, this would save to Firestore
    toast({
      title: "Project saved successfully",
      description: `"${projectName}" has been saved with ${members.length} members.`,
      variant: "default"
    });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-gradient-primary text-primary-foreground shadow-elevated">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Button
                variant="outline"
                onClick={onBack}
                className="mr-4 bg-white/10 border-white/20 text-primary-foreground hover:bg-white/20"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
              <div className="flex items-center">
                <Building2 className="h-6 w-6 mr-3" />
                <div>
                  <h1 className="text-2xl font-bold">Detailed Project Desk</h1>
                  <p className="text-primary-light">Comprehensive project estimation</p>
                </div>
              </div>
            </div>
            <Button
              onClick={saveProject}
              className="bg-success hover:bg-success/90 text-success-foreground"
            >
              <Save className="h-4 w-4 mr-2" />
              Save Project
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="space-y-8">
          {/* Project Configuration */}
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Project Info */}
            <Card className="bg-gradient-card shadow-card">
              <div className="p-6">
                <h2 className="text-xl font-bold mb-4 text-card-foreground flex items-center">
                  <FileText className="h-5 w-5 mr-2 text-accent" />
                  Project Information
                </h2>
                <div>
                  <Label htmlFor="projectName">Project Name</Label>
                  <Input
                    id="projectName"
                    value={projectName}
                    onChange={(e) => setProjectName(e.target.value)}
                    className="mt-1"
                    placeholder="Enter project name"
                  />
                </div>
              </div>
            </Card>

            {/* Material & Labor Rates */}
            <Card className="bg-gradient-card shadow-card">
              <div className="p-6">
                <h2 className="text-xl font-bold mb-4 text-card-foreground">Material & Labor Rates</h2>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="concreteRate">Concrete (₹/m³)</Label>
                    <Input
                      id="concreteRate"
                      type="number"
                      value={concreteRate}
                      onChange={(e) => setConcreteRate(e.target.value)}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="steelRate">Steel (₹/kg)</Label>
                    <Input
                      id="steelRate"
                      type="number"
                      value={steelRate}
                      onChange={(e) => setSteelRate(e.target.value)}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="concreteLaborRate">Concrete Labor (₹/m³)</Label>
                    <Input
                      id="concreteLaborRate"
                      type="number"
                      value={concreteLaborRate}
                      onChange={(e) => setConcreteLaborRate(e.target.value)}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="steelLaborRate">Steel Labor (₹/kg)</Label>
                    <Input
                      id="steelLaborRate"
                      type="number"
                      value={steelLaborRate}
                      onChange={(e) => setSteelLaborRate(e.target.value)}
                      className="mt-1"
                    />
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* Members Section */}
          <Card className="bg-gradient-card shadow-card">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-card-foreground">Structural Members</h2>
                <Button onClick={addMember} className="bg-accent hover:bg-accent/90">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Member
                </Button>
              </div>

              <div className="space-y-4">
                {members.map((member) => (
                  <Card key={member.id} className="bg-secondary/50 shadow-sm">
                    <div className="p-4">
                      <div className="grid grid-cols-2 md:grid-cols-7 gap-3 items-end">
                        <div>
                          <Label>Name</Label>
                          <Input
                            value={member.name}
                            onChange={(e) => updateMember(member.id, "name", e.target.value)}
                            className="mt-1"
                          />
                        </div>
                        <div>
                          <Label>Length (m)</Label>
                          <Input
                            type="number"
                            step="0.1"
                            value={member.length}
                            onChange={(e) => updateMember(member.id, "length", parseFloat(e.target.value) || 0)}
                            className="mt-1"
                          />
                        </div>
                        <div>
                          <Label>Width (m)</Label>
                          <Input
                            type="number"
                            step="0.1"
                            value={member.width}
                            onChange={(e) => updateMember(member.id, "width", parseFloat(e.target.value) || 0)}
                            className="mt-1"
                          />
                        </div>
                        <div>
                          <Label>Depth (m)</Label>
                          <Input
                            type="number"
                            step="0.1"
                            value={member.depth}
                            onChange={(e) => updateMember(member.id, "depth", parseFloat(e.target.value) || 0)}
                            className="mt-1"
                          />
                        </div>
                        <div>
                          <Label>Quantity</Label>
                          <Input
                            type="number"
                            value={member.quantity}
                            onChange={(e) => updateMember(member.id, "quantity", parseInt(e.target.value) || 0)}
                            className="mt-1"
                          />
                        </div>
                        <div>
                          <Label>Number of Bars</Label>
                          <Input
                            type="number"
                            value={member.numberOfBars}
                            onChange={(e) => updateMember(member.id, "numberOfBars", parseInt(e.target.value) || 0)}
                            className="mt-1"
                          />
                        </div>
                        <div>
                          <Label>Bar Diameter (mm)</Label>
                          <Input
                            type="number"
                            value={member.barDiameterMm}
                            onChange={(e) => updateMember(member.id, "barDiameterMm", parseFloat(e.target.value) || 0)}
                            className="mt-1"
                          />
                        </div>
                        <div>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => removeMember(member.id)}
                            className="w-full"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      
                      {/* Member calculations preview */}
                      {member.length > 0 && member.width > 0 && member.depth > 0 && (
                        <div className="mt-3 pt-3 border-t border-secondary-dark/20">
                          <div className="grid grid-cols-3 gap-4 text-sm">
                            <div>
                              <span className="text-muted-foreground">Concrete: </span>
                              <span className="font-medium">
                                {(member.length * member.width * member.depth * member.quantity).toFixed(3)} m³
                              </span>
                            </div>
                            <div>
                              <span className="text-muted-foreground">Steel Area: </span>
                              <span className="font-medium">
                                {calculateSteelArea(member.numberOfBars, member.barDiameterMm).toFixed(0)} mm²
                              </span>
                            </div>
                            <div>
                              <span className="text-muted-foreground">Cost: </span>
                              <span className="font-medium text-accent">
                                ₹ {(((member.length * member.width * member.depth * member.quantity) * parseFloat(concreteRate)) + 
                                   ((calculateSteelArea(member.numberOfBars, member.barDiameterMm) / 1e6 * member.length * member.quantity * 7850) * parseFloat(steelRate)))
                                   .toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                              </span>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          </Card>

          {/* Project Summary */}
          <Card className="bg-gradient-primary shadow-elevated">
            <div className="p-6">
              <h2 className="text-xl font-bold mb-6 text-primary-foreground">Project Cost Summary</h2>
              
              <div className="grid md:grid-cols-2 gap-8">
                {/* Quantities */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-primary-foreground mb-3">Total Quantities</h3>
                  <div className="bg-white/10 rounded-lg p-4">
                    <div className="text-primary-light text-sm mb-1">Total Concrete Volume</div>
                    <div className="text-2xl font-bold text-primary-foreground">
                      {calculations.totalConcreteVolume.toFixed(3)} m³
                    </div>
                  </div>
                  <div className="bg-white/10 rounded-lg p-4">
                    <div className="text-primary-light text-sm mb-1">Total Steel Area</div>
                    <div className="text-2xl font-bold text-primary-foreground">
                      {calculations.totalSteelArea.toFixed(0)} mm²
                    </div>
                  </div>
                </div>

                {/* Costs */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-primary-foreground mb-3">Cost Breakdown</h3>
                  <div className="bg-white/10 rounded-lg p-4">
                    <div className="text-primary-light text-sm mb-1">Material Cost</div>
                    <div className="text-xl font-bold text-primary-foreground">
                      ₹ {materialCost.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                    </div>
                  </div>
                  <div className="bg-white/10 rounded-lg p-4">
                    <div className="text-primary-light text-sm mb-1">Labor Cost</div>
                    <div className="text-xl font-bold text-primary-foreground">
                      ₹ {laborCost.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                    </div>
                  </div>
                  <div className="bg-white/20 rounded-lg p-4 shadow-calculation">
                    <div className="text-primary-light text-sm mb-1">Grand Total</div>
                    <div className="text-3xl font-bold text-primary-foreground">
                      ₹ {grandTotal.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default DetailedProjectDesk;