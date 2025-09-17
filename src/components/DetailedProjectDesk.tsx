import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Building2, Plus, Trash2, Save, FileText, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// --- INTERFACES & TYPES ---

interface SteelBar {
  id: string;
  count: number;
  diameter: number;
}

interface Member {
  id: string;
  name: string;
  length: number;
  width: number;
  depth: number;
  quantity: number;
  steelBars: SteelBar[];
}

interface DetailedProjectDeskProps {
  onBack: () => void;
}

const DetailedProjectDesk = ({ onBack }: DetailedProjectDeskProps) => {
  // --- STATE MANAGEMENT ---
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
      steelBars: [{ id: Date.now().toString(), count: 4, diameter: 20 }]
    }
  ]);

  const barDiameters = ['8', '10', '12', '16', '20', '25', '32'];

  // --- HANDLER FUNCTIONS ---

  const addMember = () => {
    const newMember: Member = {
      id: Date.now().toString(),
      name: `Member ${members.length + 1}`,
      length: 0, width: 0, depth: 0, quantity: 1,
      steelBars: [{ id: Date.now().toString(), count: 4, diameter: 16 }]
    };
    setMembers([...members, newMember]);
  };

  const removeMember = (id: string) => {
    setMembers(members.filter(member => member.id !== id));
  };

  const updateMember = (id: string, field: keyof Omit<Member, 'steelBars'>, value: string | number) => {
    setMembers(members.map(member =>
      member.id === id ? { ...member, [field]: value } : member
    ));
  };

  const addBarToMember = (memberId: string) => {
    setMembers(members.map(member => {
      if (member.id === memberId) {
        const newBar: SteelBar = { id: Date.now().toString(), count: 2, diameter: 12 };
        return { ...member, steelBars: [...member.steelBars, newBar] };
      }
      return member;
    }));
  };

  const removeBarFromMember = (memberId: string, barId: string) => {
    setMembers(members.map(member => {
      if (member.id === memberId && member.steelBars.length > 1) {
        return { ...member, steelBars: member.steelBars.filter(bar => bar.id !== barId) };
      }
      return member;
    }));
  };

  const updateBarInMember = (memberId: string, barId: string, field: keyof Omit<SteelBar, 'id'>, value: number) => {
    setMembers(members.map(member => {
      if (member.id === memberId) {
        const updatedBars = member.steelBars.map(bar =>
          bar.id === barId ? { ...bar, [field]: value } : bar
        );
        return { ...member, steelBars: updatedBars };
      }
      return member;
    }));
  };

  // --- CALCULATION HELPERS ---

  const calculateSteelArea = (count: number, diameter: number): number => {
    if (count <= 0 || diameter <= 0) return 0;
    const radius = diameter / 2;
    return Math.PI * radius * radius * count; // Total area in mm²
  };

  const getMemberCalcs = (member: Member) => {
    const concreteVolume = member.length * member.width * member.depth * member.quantity;
    const totalSteelArea = member.steelBars.reduce((acc, bar) => acc + calculateSteelArea(bar.count, bar.diameter), 0);
    const totalBarLength = member.length * member.quantity; // Simplified assumption
    const steelVolume = (totalSteelArea / 1_000_000) * totalBarLength;
    const steelWeight = steelVolume * 7850;
    const concreteCost = concreteVolume * parseFloat(concreteRate || "0");
    const steelCost = steelWeight * parseFloat(steelRate || "0");
    const materialCost = concreteCost + steelCost;
    return { concreteVolume, totalSteelArea, steelWeight, materialCost };
  };

  // --- DERIVED STATE (TOTALS) ---

  const projectTotals = members.reduce((acc, member) => {
    const { concreteVolume, totalSteelArea, steelWeight, materialCost } = getMemberCalcs(member);
    acc.totalConcreteVolume += concreteVolume;
    acc.totalSteelArea += totalSteelArea;
    acc.totalSteelWeight += steelWeight;
    return acc;
  }, { totalConcreteVolume: 0, totalSteelArea: 0, totalSteelWeight: 0 });

  const materialCost = (projectTotals.totalConcreteVolume * parseFloat(concreteRate)) + (projectTotals.totalSteelWeight * parseFloat(steelRate));
  const laborCost = (projectTotals.totalConcreteVolume * parseFloat(concreteLaborRate)) + (projectTotals.totalSteelWeight * parseFloat(steelLaborRate));
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
                  <Input id="projectName" value={projectName} onChange={(e) => setProjectName(e.target.value)} className="mt-1" placeholder="Enter project name" />
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
                    <Input id="concreteRate" type="number" value={concreteRate} onChange={(e) => setConcreteRate(e.target.value)} className="mt-1" />
                  </div>
                  <div>
                    <Label htmlFor="steelRate">Steel (₹/kg)</Label>
                    <Input id="steelRate" type="number" value={steelRate} onChange={(e) => setSteelRate(e.target.value)} className="mt-1" />
                  </div>
                  <div>
                    <Label htmlFor="concreteLaborRate">Concrete Labor (₹/m³)</Label>
                    <Input id="concreteLaborRate" type="number" value={concreteLaborRate} onChange={(e) => setConcreteLaborRate(e.target.value)} className="mt-1" />
                  </div>
                  <div>
                    <Label htmlFor="steelLaborRate">Steel Labor (₹/kg)</Label>
                    <Input id="steelLaborRate" type="number" value={steelLaborRate} onChange={(e) => setSteelLaborRate(e.target.value)} className="mt-1" />
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* Members Section - UPDATED */}
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
                {members.map((member) => {
                  const memberCalcs = getMemberCalcs(member);
                  return (
                    <Card key={member.id} className="bg-secondary/50 shadow-sm overflow-hidden">
                      <div className="p-4">
                        {/* --- Member Details --- */}
                        <div className="grid grid-cols-2 md:grid-cols-6 gap-3 items-end">
                          <div className="col-span-2 md:col-span-1">
                            <Label>Name</Label>
                            <Input value={member.name} onChange={(e) => updateMember(member.id, "name", e.target.value)} className="mt-1" />
                          </div>
                          <div>
                            <Label>Length (m)</Label>
                            <Input type="number" step="0.1" value={member.length} onChange={(e) => updateMember(member.id, "length", parseFloat(e.target.value) || 0)} className="mt-1" />
                          </div>
                          <div>
                            <Label>Width (m)</Label>
                            <Input type="number" step="0.1" value={member.width} onChange={(e) => updateMember(member.id, "width", parseFloat(e.target.value) || 0)} className="mt-1" />
                          </div>
                          <div>
                            <Label>Depth (m)</Label>
                            <Input type="number" step="0.1" value={member.depth} onChange={(e) => updateMember(member.id, "depth", parseFloat(e.target.value) || 0)} className="mt-1" />
                          </div>
                          <div>
                            <Label>Quantity</Label>
                            <Input type="number" value={member.quantity} onChange={(e) => updateMember(member.id, "quantity", parseInt(e.target.value) || 0)} className="mt-1" />
                          </div>
                          <Button variant="destructive" size="sm" onClick={() => removeMember(member.id)} className="w-full">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>

                        {/* --- Reinforcement Section --- */}
                        <div className="mt-4 pt-4 border-t border-secondary-dark/20">
                          <h4 className="text-sm font-semibold mb-2">Reinforcement</h4>
                          <div className="space-y-2">
                            {member.steelBars.map(bar => (
                              <div key={bar.id} className="grid grid-cols-[1fr,1fr,auto] gap-2 items-center">
                                <div>
                                  <Input type="number" value={bar.count} onChange={(e) => updateBarInMember(member.id, bar.id, 'count', parseInt(e.target.value) || 0)} placeholder="No." />
                                </div>
                                <div>
                                  <select value={bar.diameter} onChange={(e) => updateBarInMember(member.id, bar.id, 'diameter', parseInt(e.target.value) || 0)} className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2">
                                    {barDiameters.map(dia => <option key={dia} value={dia}>{dia} mm</option>)}
                                  </select>
                                </div>
                                <Button variant="ghost" size="icon" onClick={() => removeBarFromMember(member.id, bar.id)} disabled={member.steelBars.length <= 1} className="text-muted-foreground hover:text-destructive">
                                  <X className="h-4 w-4" />
                                </Button>
                              </div>
                            ))}
                          </div>
                          <Button variant="outline" size="sm" onClick={() => addBarToMember(member.id)} className="w-full mt-3">
                            <Plus className="h-4 w-4 mr-2" /> Add Bar Type
                          </Button>
                        </div>

                        {/* --- Member Calculations Preview --- */}
                        {memberCalcs.concreteVolume > 0 && (
                          <div className="mt-4 pt-3 border-t border-secondary-dark/20 bg-background/30 -m-4 p-4">
                            <div className="grid grid-cols-3 gap-4 text-sm">
                              <div>
                                <span className="text-muted-foreground">Concrete: </span>
                                <span className="font-medium">{memberCalcs.concreteVolume.toFixed(3)} m³</span>
                              </div>
                              <div>
                                <span className="text-muted-foreground">Steel Area: </span>
                                <span className="font-medium">{memberCalcs.totalSteelArea.toFixed(0)} mm²</span>
                              </div>
                              <div>
                                <span className="text-muted-foreground">Cost: </span>
                                <span className="font-medium text-accent">₹ {memberCalcs.materialCost.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</span>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </Card>
                  )
                })}
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
                      {projectTotals.totalConcreteVolume.toFixed(3)} m³
                    </div>
                  </div>
                  <div className="bg-white/10 rounded-lg p-4">
                    <div className="text-primary-light text-sm mb-1">Total Steel Area</div>
                    <div className="text-2xl font-bold text-primary-foreground">
                      {projectTotals.totalSteelArea.toFixed(0)} mm²
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