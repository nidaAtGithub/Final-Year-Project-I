import DashboardLayout from "@/components/layouts/DashboardLayout";
import { FileText, MapPin, Calendar, User, Phone, FileCheck } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";
import { toast } from "sonner";

// Fix TypeScript error for window.mediaRecorder
declare global {
  interface Window {
    mediaRecorder?: MediaRecorder;
  }
}



const FileFir = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [crimeCategory, setCrimeCategory] = useState("");
  const [citizenNarrative, setCitizenNarrative] = useState("");
  const [selectedEvidence, setSelectedEvidence] = useState<File[]>([]);
  const [recordedAudio, setRecordedAudio] = useState<string | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [mediaRecorderRef, setMediaRecorderRef] = useState<MediaRecorder | null>(null);
  const navItems = [
    { label: "File FIR", icon: FileText, active: true },
    { label: "My FIRs", icon: FileCheck, active: false },
    { label: "Track Status", icon: MapPin, active: false },
    { label: "Notifications", icon: Calendar, active: false, badge: 3 },
  ];

  // Upload handler
  const handleEvidenceUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      setSelectedEvidence((prev) => [...prev, ...files]); 
    }
  };

  // Remove a selected file
  const handleRemoveEvidence = (index: number) => {
    setSelectedEvidence((prevFiles) => prevFiles.filter((_, i) => i !== index));
  };

  // Generate Description via backend AI
  const handleGenerateDescription = async () => {
    setIsSubmitting(true);

    const formData = {
      full_name: (document.getElementById("name") as HTMLInputElement).value,
      cnic: (document.getElementById("cnic") as HTMLInputElement).value,
      phone: (document.getElementById("phone") as HTMLInputElement).value,
      email: (document.getElementById("email") as HTMLInputElement).value,
      crime_category: crimeCategory,
      location: (document.getElementById("location") as HTMLInputElement).value,
      date_of_incident: (document.getElementById("date") as HTMLInputElement).value,
      suspect_info: (document.getElementById("suspects") as HTMLTextAreaElement)?.value || "",
      citizen_narrative: citizenNarrative,
    };

    try {
      const response = await fetch("http://127.0.0.1:8001/generate-description", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (response.ok && data.description) {
        const descField = document.getElementById("description") as HTMLTextAreaElement;
        descField.value = data.description;
        toast.success("Incident description generated successfully!");
      } else {
        toast.error("Failed to generate description. Check all fields are valid.");
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to connect to backend.");
    } finally {
      setIsSubmitting(false);
    }
  };

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  const payload = {
    full_name: formValues.full_name,
    cnic: formValues.cnic,
    phone: formValues.phone,
    email: formValues.email,
    crime_category: formValues.crime_category,
    location: formValues.location,
    date_of_incident: formValues.date_of_incident,
    citizen_narrative: formValues.narrative,
    suspect_info: formValues.suspect_information,
  };

  try {
    const res = await fetch("http://127.0.0.1:8001/submit-fir", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (res.ok) {
      toast.success("FIR submitted successfully! Reference ID: FIR-2024-001234");
    } else {
      toast.error("Failed to submit FIR.");
    }
  } catch (err) {
    console.error(err);
    toast.error("Backend connection error.");
  }
};
const [formValues, setFormValues] = useState({
  full_name: "",
  cnic: "",
  phone: "",
  email: "",            
  crime_category: "",
  location: "",
  date_of_incident: "",
  time: "",
  narrative: "",
  suspect_information: "",
});


const handleAudioRecording = async () => {
  if (isRecording && mediaRecorderRef) {
    mediaRecorderRef.stop();
    setIsRecording(false);
    toast.info("Recording stopped. Processing...");
    return;
  }

  if (recordedAudio) {
    toast.warning("Only one recording is allowed. Delete it before recording again.");
    return;
  }

  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const mediaRecorder = new MediaRecorder(stream);
    setMediaRecorderRef(mediaRecorder);
    let chunks: BlobPart[] = [];

    mediaRecorder.ondataavailable = (e) => chunks.push(e.data);

    mediaRecorder.onstop = async () => {
      const blob = new Blob(chunks, { type: "audio/webm" });
      const audioURL = URL.createObjectURL(blob);
      setRecordedAudio(audioURL);

      const formData = new FormData();
      formData.append("file", blob, "recording.webm");

      try {
        const res = await fetch("http://127.0.0.1:8000/transcribe-audio", {
          method: "POST",
          body: formData,
        });

        const data = await res.json();

        // Check for backend error first
        if (!res.ok || data.error) {
          console.error("Backend error:", data.error || data);
          toast.error(data.error || "Transcription failed.");
          return;
        }

        // Check if we have transcription
        if (!data.transcription) {
          toast.error("No transcription received.");
          return;
        }

        // ONLY fill the narrative field with transcription
        setFormValues((prev) => ({
          ...prev,
          narrative: data.transcription  // Only narrative gets filled
        }));
        
        toast.success("Narrative filled from audio! Please fill other details manually.");

      } catch (err) {
        console.error("Error connecting to transcription service:", err);
        toast.error("Error connecting to transcription service.");
      }
    };

    mediaRecorder.start();
    setIsRecording(true);
    toast.success("Recording started...");
  } catch (err) {
    console.error("Microphone access denied:", err);
    toast.error("Microphone access denied.");
  }
};


  return (
    <DashboardLayout role="citizen" navItems={navItems} title="Citizen Portal">
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold text-foreground">File New FIR</h2>
          <p className="text-muted-foreground mt-1">Submit a First Information Report online</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>FIR Details</CardTitle>
            <CardDescription>Please provide accurate information about the incident</CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                {/* Personal Info */}
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name *</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="name"
                      value={formValues.full_name}
                      onChange={(e) => setFormValues({ ...formValues, full_name: e.target.value })}
                      placeholder="e.g., Ahmed Khan"
                      className="pl-10"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="cnic">CNIC Number *</Label>
                  <Input
                    id="cnic"
                    value={formValues.cnic}
                    onChange={(e) => setFormValues({ ...formValues, cnic: e.target.value })}
                    placeholder="e.g., 12345-1234567-1"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number *</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="phone"
                      value={formValues.phone}
                      onChange={(e) => setFormValues({ ...formValues, phone: e.target.value })}
                      placeholder="+92 300 1234567"
                      className="pl-10"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formValues.email}
                    onChange={(e) => setFormValues({ ...formValues, email: e.target.value })}
                    placeholder="ahmed.khan@example.com"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="category">Crime Category *</Label>
                  <Select 
                    value={formValues.crime_category}
                    onValueChange={(value) => setFormValues({ ...formValues, crime_category: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="theft">Theft</SelectItem>
                      <SelectItem value="assault">Assault</SelectItem>
                      <SelectItem value="fraud">Fraud</SelectItem>
                      <SelectItem value="cybercrime">Cybercrime</SelectItem>
                      <SelectItem value="vehicle">Vehicle Related</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="date">Date of Incident *</Label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input 
                      id="date" 
                      type="date" 
                      className="pl-10"
                      value={formValues.date_of_incident}
                      onChange={(e) => setFormValues({ ...formValues, date_of_incident: e.target.value })}
                      required 
                    />
                  </div>
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="location">Location of Incident *</Label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="location"
                      value={formValues.location}
                      onChange={(e) => setFormValues({ ...formValues, location: e.target.value })}
                      placeholder="e.g. DHA Islamabad"
                      className="pl-10" 
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="time">Time of Incident *</Label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="time"
                      type="time"
                      className="pl-10 cursor-pointer"
                      value={formValues.time}
                      onChange={(e) => setFormValues({ ...formValues, time: e.target.value })}
                      required
                    />
                  </div>
                </div>

                {/* Citizen Narrative */}
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="citizenNarrative">Citizen Narrative</Label>
                  <Textarea
                    id="citizenNarrative"
                    value={formValues.narrative}
                    onChange={(e) => setFormValues({ ...formValues, narrative: e.target.value })}
                    placeholder="Describe what happened in your own words..."
                    rows={4}
                  />
                </div>

                {/* Suspect Info */}
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="suspects">Suspect Information (if any)</Label>
                  <Textarea 
                    id="suspects" 
                    value={formValues.suspect_information}
                    onChange={(e) => setFormValues({ ...formValues, suspect_information: e.target.value })}
                    placeholder="Describe any known suspects or witnesses..." 
                    rows={3} 
                  />
                </div>

                {/* Incident Description */}
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="description">Incident Description *</Label>
                  <Textarea id="description" placeholder="Generated description will appear here..." rows={6} required />
                </div>

               
                {/* Evidence Upload */}
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="evidence" className="block text-sm font-medium text-gray-700">
                    Upload Evidence (If any)
                  </Label>

                  {/* Hidden file input */}
                  <input
                    id="evidence"
                    type="file"
                    accept=".jpg,.jpeg,.png,.pdf,.mp4,.mov"
                    multiple
                    className="hidden"
                    onChange={handleEvidenceUpload}
                  />

                  {/* Custom Button */}
                  <button
                    type="button"
                    onClick={() => document.getElementById("evidence")?.click()}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                  >
                    Choose Files
                  </button>

                  {/* Helper Text */}
                  <p className="text-sm text-muted-foreground">
                    You may upload images, videos, or documents related to the incident (optional).
                  </p>

                  {/* Display Selected Files */}
                  {selectedEvidence.length > 0 && (
                    <ul className="mt-2 space-y-2">
                      {selectedEvidence.map((file, index) => {
                        const fileURL = URL.createObjectURL(file);
                        const fileType = file.type;

                        return (
                          <li
                            key={index}
                            className="flex items-center justify-between bg-gray-100 px-3 py-2 rounded-md text-sm"
                          >
                            <button
                              type="button"
                              onClick={() => {
                                if (fileType.startsWith("image/") || fileType.startsWith("video/")) {
                                  window.open(fileURL, "_blank");
                                } else if (fileType === "application/pdf") {
                                  window.open(fileURL, "_blank");
                                } else {
                                  alert("Preview not supported for this file type.");
                                }
                              }}
                              className="text-blue-600 hover:underline truncate text-left flex-1"
                            >
                              {file.name}
                            </button>

                            <button
                              type="button"
                              onClick={() => handleRemoveEvidence(index)}
                              className="text-red-500 hover:text-red-700 font-semibold ml-3"
                            >
                              ✕
                            </button>
                          </li>
                        );
                      })}
                    </ul>
                  )}
                </div>

                {/* Audio FIR */}
                <div className="space-y-2 md:col-span-2">
                  <Label>Give audio of narrative (Optional)</Label>
                  <div className="flex items-center gap-3">
                    <Button type="button" id="recordBtn" onClick={handleAudioRecording}>
                      Start Recording
                    </Button>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Speak directly to record your statement. Click again to stop and auto-transcribe.
                  </p>
                </div>
              </div>
              
              <audio
                id="audioPreview"
                controls
                style={{ display: "none", marginTop: "10px" }}
              ></audio>

              {recordedAudio && (
                <div className="relative flex flex-col items-start gap-2 mt-3 bg-gray-50 p-3 rounded-lg shadow-sm w-full md:w-1/2">
                  {/* Delete (Cross) Button */}
                  <Button
                    onClick={() => setRecordedAudio(null)}
                    className="absolute top-2 left-2 text-gray-500 hover:text-red-500 bg-transparent shadow-none z-10"
                    variant="ghost"
                  >
                    ✖
                  </Button>

                  {/* Audio Player */}
                  <audio
                    controls
                    src={recordedAudio}
                    className="w-3/4 rounded-md z-0 mt-5"
                  />
                </div>
              )}

            {/* Buttons */}
              <div className="flex justify-end gap-3">
                <Button type="button" variant="outline">Save as Draft</Button>
                <Button type="button" onClick={handleGenerateDescription} disabled={isSubmitting} variant="secondary">
                  {isSubmitting ? "Generating..." : "Generate Description"}
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Submitting..." : "Submit FIR"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default FileFir;
