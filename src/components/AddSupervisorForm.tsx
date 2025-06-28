import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { X, Plus, User, Phone, Users } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Supervisor {
  id: string;
  name: string;
  phoneNumber: string;
  relation: string;
}

interface AddSupervisorFormProps {
  onClose: () => void;
}

const AddSupervisorForm = ({ onClose }: AddSupervisorFormProps) => {
  const [formData, setFormData] = useState({
    name: "",
    phoneNumber: "",
    relation: ""
  });
  const [supervisors, setSupervisors] = useState<Supervisor[]>(() => {
    const saved = localStorage.getItem('supervisors');
    return saved ? JSON.parse(saved) : [];
  });
  const { toast } = useToast();

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleAddSupervisor = () => {
    if (!formData.name.trim() || !formData.phoneNumber.trim() || !formData.relation.trim()) {
      toast({
        title: "Missing Information",
        description: "Please fill in all fields",
        variant: "destructive"
      });
      return;
    }

    // Basic phone number validation
    const phoneRegex = /^\+?[\d\s\-\(\)]{10,}$/;
    if (!phoneRegex.test(formData.phoneNumber)) {
      toast({
        title: "Invalid Phone Number",
        description: "Please enter a valid phone number",
        variant: "destructive"
      });
      return;
    }

    const newSupervisor: Supervisor = {
      id: Date.now().toString(),
      name: formData.name.trim(),
      phoneNumber: formData.phoneNumber.trim(),
      relation: formData.relation.trim()
    };

    const updatedSupervisors = [...supervisors, newSupervisor];
    setSupervisors(updatedSupervisors);
    localStorage.setItem('supervisors', JSON.stringify(updatedSupervisors));

    toast({
      title: "Supervisor Added",
      description: `${formData.name} has been added as a supervisor`
    });

    // Reset form
    setFormData({
      name: "",
      phoneNumber: "",
      relation: ""
    });
  };

  const handleRemoveSupervisor = (id: string) => {
    const updatedSupervisors = supervisors.filter(s => s.id !== id);
    setSupervisors(updatedSupervisors);
    localStorage.setItem('supervisors', JSON.stringify(updatedSupervisors));
    
    toast({
      title: "Supervisor Removed",
      description: "Supervisor has been removed from your list"
    });
  };

  return (
    <div className="min-h-screen bg-amber-50 px-6 py-8">
      <div className="max-w-md mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-orange-600 uppercase tracking-wide">
            Add Supervisor
          </h1>
          <Button
            onClick={onClose}
            className="w-12 h-12 bg-gray-500 hover:bg-gray-600 rounded-2xl text-white"
          >
            <X className="w-6 h-6" />
          </Button>
        </div>

        {/* Add Supervisor Form */}
        <Card className="bg-white rounded-3xl border-4 border-gray-200">
          <CardHeader>
            <CardTitle className="text-lg font-bold text-gray-800 uppercase tracking-wide flex items-center">
              <Plus className="w-5 h-5 mr-2 text-green-500" />
              New Supervisor
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="name" className="text-sm font-medium text-gray-700 mb-2 block">
                Full Name
              </Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500" />
                <Input
                  id="name"
                  type="text"
                  placeholder="Enter supervisor's name"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  className="pl-10 rounded-2xl border-2 border-gray-200 focus:border-orange-400"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="phone" className="text-sm font-medium text-gray-700 mb-2 block">
                Phone Number
              </Label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500" />
                <Input
                  id="phone"
                  type="tel"
                  placeholder="Enter phone number"
                  value={formData.phoneNumber}
                  onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
                  className="pl-10 rounded-2xl border-2 border-gray-200 focus:border-orange-400"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="relation" className="text-sm font-medium text-gray-700 mb-2 block">
                Relation
              </Label>
              <div className="relative">
                <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500" />
                <Input
                  id="relation"
                  type="text"
                  placeholder="e.g., Parent, Teacher, Guardian"
                  value={formData.relation}
                  onChange={(e) => handleInputChange('relation', e.target.value)}
                  className="pl-10 rounded-2xl border-2 border-gray-200 focus:border-orange-400"
                />
              </div>
            </div>

            <Button
              onClick={handleAddSupervisor}
              className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-3 rounded-2xl transition-all duration-200"
            >
              <Plus className="w-5 h-5 mr-2" />
              Add Supervisor
            </Button>
          </CardContent>
        </Card>

        {/* Existing Supervisors */}
        {supervisors.length > 0 && (
          <Card className="bg-white rounded-3xl border-4 border-gray-200">
            <CardHeader>
              <CardTitle className="text-lg font-bold text-gray-800 uppercase tracking-wide">
                Current Supervisors ({supervisors.length})
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {supervisors.map((supervisor) => (
                <div key={supervisor.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-2xl">
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-800">{supervisor.name}</h4>
                    <p className="text-sm text-gray-600">{supervisor.phoneNumber}</p>
                    <p className="text-xs text-gray-500 capitalize">{supervisor.relation}</p>
                  </div>
                  <Button
                    onClick={() => handleRemoveSupervisor(supervisor.id)}
                    variant="ghost"
                    size="sm"
                    className="text-red-500 hover:text-red-700 hover:bg-red-50"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default AddSupervisorForm;
