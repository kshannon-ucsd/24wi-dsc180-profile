'use client';

import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './card';
import { Button } from './button';
import { Input } from './input';
import { Label } from './label';
import { Progress } from './progress';
import { AlertCircle, Upload, ChevronRight, Activity, LineChart, BrainCircuit, Info, RefreshCw, RotateCw } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from './alert';

const AnimatedBackground = () => (
  <div className="fixed inset-0 -z-10 overflow-hidden">
    <div className="absolute inset-0 bg-gradient-to-br from-blue-100 to-indigo-50">
      {[...Array(20)].map((_, i) => (
        <div
          key={i}
          className="absolute rounded-full opacity-20 animate-pulse"
          style={{
            width: Math.random() * 100 + 50 + 'px',
            height: Math.random() * 100 + 50 + 'px',
            left: Math.random() * 100 + '%',
            top: Math.random() * 100 + '%',
            backgroundColor: `rgba(${Math.random() * 100 + 155}, ${Math.random() * 100 + 155}, 255, 0.1)`,
            animationDelay: Math.random() * 5 + 's',
            animationDuration: Math.random() * 5 + 3 + 's'
          }}
        />
      ))}
    </div>
  </div>
);

interface InfoCardProps {
  title: string;
  children: React.ReactNode;
}

const InfoCard: React.FC<InfoCardProps> = ({ title, children }) => (
  <Card className="mb-3">
    <CardHeader className="flex flex-row items-center space-x-2 py-3">
      <Info className="h-5 w-5 text-indigo-600" />
      <CardTitle className="text-lg">{title}</CardTitle>
    </CardHeader>
    <CardContent className="py-2">
      <p className="text-gray-600 text-sm">{children}</p>
    </CardContent>
  </Card>
);

const stages = [
  { id: 1, name: 'Image Upload & Validation', icon: Upload, description: 'Validating JPEG format and image quality' },
  { id: 2, name: 'Pneumonia Detection', icon: Activity, description: 'Analyzing chest X-ray for pneumonia' },
  { id: 3, name: 'Clinical Data Analysis', icon: LineChart, description: 'Processing patient lab results and vitals' },
  { id: 4, name: 'Risk Assessment', icon: BrainCircuit, description: 'Calculating final sepsis risk predictions' }
];

interface PatientMetadata {
  bilirubin: string;
  creatinine: string;
  heart_rate: string;
  inr: string;
  mbp: string;
  platelet: string;
  ptt: string;
  resp_rate: string;
  sbp: string;
  wbc: string;
  temperature: string;
  bands: string;
  lactate: string;
}

const ModelDemo = () => {
  const [currentFile, setCurrentFile] = useState<string | null>(null);
  const [rawFile, setRawFile] = useState<File | null>(null);
  const [fileError, setFileError] = useState<string>('');
  const [currentStage, setCurrentStage] = useState(0);
  const [anomalyResult, setAnomalyResult] = useState<string | null>(null);
  const [apiError, setApiError] = useState<string | null>(null);
  const [sepsisRisk, setSepsisRisk] = useState<any>(null);
  const [showMetadataForm, setShowMetadataForm] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [metadata, setMetadata] = useState<PatientMetadata>({
    bilirubin: '',
    creatinine: '',
    heart_rate: '',
    inr: '',
    mbp: '',
    platelet: '',
    ptt: '',
    resp_rate: '',
    sbp: '',
    wbc: '',
    temperature: '',
    bands: '',
    lactate: ''
  });

  const resetAnalysis = () => {
    setCurrentStage(0);
    setAnomalyResult(null);
    setSepsisRisk(null);
    setShowMetadataForm(false);
    setApiError(null);
    setIsProcessing(false);
  };

  const rerunAnalysis = () => {
    setAnomalyResult(null);
    setSepsisRisk(null);
    setCurrentStage(0);
    setApiError(null);
    setIsProcessing(false);
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    setFileError('');
    setApiError(null);
    resetAnalysis();
    
    if (file) {
      if (!file.type.includes('image')) {
        setFileError('Please upload only image files');
        return;
      }
  
        if (!file.type.includes('jpeg')) {
          setFileError('Please upload only JPEG images');
          return;
        }
      
      setRawFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setCurrentFile(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleMetadataChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMetadata({
      ...metadata,
      [e.target.name]: e.target.value
    });
  };

  // First stage: Anomaly Detection using the API
  const runAnomalyDetection = async () => {
    if (!rawFile) {
      setFileError('No file selected');
      return;
    }

    setApiError(null);
    setCurrentStage(1);
    setIsProcessing(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      setCurrentStage(2);
      
      const formData = new FormData();
      formData.append('image', rawFile);
      
      const response = await fetch('https://dsc180-resnet.bobbyzhu.com/predict', {
        method: 'POST',
        body: formData
      });
      if (!response.ok) {
        throw new Error(`API error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      
      // Direct access to the prediction field from the new API response format
      if (data && data.prediction !== undefined) {
        let result;
        
        if (data.prediction === 1) {
          result = 'Pneumonia Detected';
        } else {
          result = 'No Pneumonia Detected';
        }
        
        setAnomalyResult(result);
        setShowMetadataForm(true);
        setIsProcessing(false);
      } else {
        setApiError('Invalid API response format');
        setIsProcessing(false);
      }
    } catch (error) {
      setApiError(`Error: ${error instanceof Error ? error.message : 'Unknown error occurred'}`);
      setCurrentStage(1);
      setIsProcessing(false);
    }
  };

  // Second stage: Sepsis Risk Assessment
  const runSepsisRiskAssessment = async () => {
    setCurrentStage(3);
    setIsProcessing(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    setCurrentStage(4);
    
    try {
      // Prepare data for the API - include all the metadata fields and the pneumonia result
      const requestData = {
        ...metadata,
        // Convert string values to numbers
        bilirubin: parseFloat(metadata.bilirubin),
        creatinine: parseFloat(metadata.creatinine),
        heart_rate: parseFloat(metadata.heart_rate),
        inr: parseFloat(metadata.inr),
        mbp: parseFloat(metadata.mbp),
        platelet: parseFloat(metadata.platelet),
        ptt: parseFloat(metadata.ptt),
        resp_rate: parseFloat(metadata.resp_rate),
        sbp: parseFloat(metadata.sbp),
        wbc: parseFloat(metadata.wbc),
        temperature: parseFloat(metadata.temperature),
        bands: parseFloat(metadata.bands),
        lactate: parseFloat(metadata.lactate),
        // Add pneumonia result from first stage
        pneumonia: anomalyResult === 'Pneumonia Detected' ? 1 : 0
      };
      
      const response = await fetch('https://dsc180-rf.bobbyzhu.com/predict', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestData)
      });
      
      if (!response.ok) {
        throw new Error(`API error: ${response.status} ${response.statusText}`);
      }
      
      const data = await response.json();
      
      // Set risk based on API response
      setSepsisRisk({
        hasSepsis: data.prediction === 1
      });
      setIsProcessing(false);
    } catch (error) {
      setApiError(`Error: ${error instanceof Error ? error.message : 'Unknown error occurred'}`);
      setCurrentStage(3);
      setIsProcessing(false);
    }
  };

  const loadExample = async () => {
    resetAnalysis();
    
    try {
      const xrayImages = [
        './assets/xrays/N_Xray1.jpeg',
        './assets/xrays/N_Xray2.jpeg',
        './assets/xrays/N_Xray3.jpeg',
        './assets/xrays/N_Xray4.jpeg',
        './assets/xrays/N_Xray5.jpeg',
        './assets/xrays/N_Xray6.jpeg',
        './assets/xrays/N_Xray7.jpeg',
        './assets/xrays/N_Xray8.jpeg',
        './assets/xrays/P_Xray1.jpeg',
        './assets/xrays/P_Xray2.jpeg',
        './assets/xrays/P_Xray3.jpeg',
        './assets/xrays/P_Xray4.jpeg',
        './assets/xrays/P_Xray5.jpeg',
        './assets/xrays/P_Xray6.jpeg',
        './assets/xrays/P_Xray7.jpeg',
        './assets/xrays/P_Xray8.jpeg',
      ];
      
      // Helper function to pick a random image.
      const getRandomXray = (): string => {
        const randomIndex = Math.floor(Math.random() * xrayImages.length);
        return xrayImages[randomIndex];
      };
      const response = await fetch(getRandomXray());
      if (!response.ok) throw new Error("Failed to load xray.jpeg");
      
      const blob = await response.blob();
      const file = new File([blob], "xray.jpeg", { type: "image/jpeg" });
      
      setCurrentFile(URL.createObjectURL(blob));
      setRawFile(file);
      
      setMetadata({
        bilirubin: '1.2',
        creatinine: '1.1',
        heart_rate: '88',
        inr: '1.1',
        mbp: '85',
        platelet: '150',
        ptt: '30',
        resp_rate: '18',
        sbp: '120',
        wbc: '8.5',
        temperature: '38.1',
        bands: '10',
        lactate: '2.2'
      });
    } catch (err) {
      setFileError(`Error loading example: ${err instanceof Error ? err.message : 'Unknown error'}`);
    }
  };
  
  // Function to generate random values within normal ranges
  const generateRandomValues = () => {
    // Define ranges for each parameter (min, max)
    const ranges = {
      bilirubin: [0.3, 1.2],
      creatinine: [0.7, 1.3],
      heart_rate: [60, 100],
      inr: [0.8, 1.2],
      mbp: [70, 100],
      platelet: [150, 450],
      ptt: [25, 35],
      resp_rate: [12, 20],
      sbp: [90, 120],
      wbc: [4.5, 11.0],
      temperature: [36.5, 37.5],
      bands: [0, 10],
      lactate: [0.5, 2.0]
    };
    
    // Generate random value within range and format appropriately
    const randomValue = (min: number, max: number, decimals: number = 1) => {
      const value = min + Math.random() * (max - min);
      return value.toFixed(decimals);
    };
    
    // Create new metadata object with random values
    const newMetadata: PatientMetadata = {
      bilirubin: randomValue(ranges.bilirubin[0], ranges.bilirubin[1]),
      creatinine: randomValue(ranges.creatinine[0], ranges.creatinine[1]),
      heart_rate: randomValue(ranges.heart_rate[0], ranges.heart_rate[1], 0),
      inr: randomValue(ranges.inr[0], ranges.inr[1]),
      mbp: randomValue(ranges.mbp[0], ranges.mbp[1], 0),
      platelet: randomValue(ranges.platelet[0], ranges.platelet[1], 0),
      ptt: randomValue(ranges.ptt[0], ranges.ptt[1], 0),
      resp_rate: randomValue(ranges.resp_rate[0], ranges.resp_rate[1], 0),
      sbp: randomValue(ranges.sbp[0], ranges.sbp[1], 0),
      wbc: randomValue(ranges.wbc[0], ranges.wbc[1]),
      temperature: randomValue(ranges.temperature[0], ranges.temperature[1], 1),
      bands: randomValue(ranges.bands[0], ranges.bands[1], 0),
      lactate: randomValue(ranges.lactate[0], ranges.lactate[1])
    };
    
    setMetadata(newMetadata);
  };
  
  const resetAll = () => {
    setCurrentFile(null);
    setRawFile(null);
    setFileError('');
    setApiError(null);
    setCurrentStage(0);
    setAnomalyResult(null);
    setSepsisRisk(null);
    setShowMetadataForm(false);
    setIsProcessing(false);
    setMetadata({
      bilirubin: '',
      creatinine: '',
      heart_rate: '',
      inr: '',
      mbp: '',
      platelet: '',
      ptt: '',
      resp_rate: '',
      sbp: '',
      wbc: '',
      temperature: '',
      bands: '',
      lactate: ''
    });
  };

  return (
    <>
      <AnimatedBackground />
      <div className="container mx-auto p-3 relative">
        <Tabs defaultValue="demo" className="w-full">
          <TabsList className="grid w-full grid-cols-1">
            <TabsTrigger value="demo">Model Demo</TabsTrigger>
          </TabsList>

          <TabsContent value="demo">
            <div className="space-y-3">
              <InfoCard title="About This Demo">
                This two-stage analysis system first detects anomalies in chest X-rays, then combines these results 
                with patient lab results and vitals to assess sepsis risk. Upload an image to begin the analysis.
              </InfoCard>

              <Card className="shadow-md border-indigo-100">
                <CardHeader className="flex flex-row items-center justify-between py-4">
                  <div>
                    <CardTitle className="text-indigo-900">Sepsis Detection Model Demo</CardTitle>
                    <CardDescription>
                      Our two-stage approach combines chest X-ray analysis with clinical data for comprehensive sepsis risk assessment.
                    </CardDescription>
                  </div>
                  <Button 
                    variant="outline" 
                    size="icon" 
                    onClick={resetAll}
                    className="h-8 w-8 text-indigo-700 hover:bg-indigo-50"
                  >
                    <RefreshCw className="h-4 w-4" />
                  </Button>
                </CardHeader>
                <CardContent className="p-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-3">
                      <div className="flex flex-col space-y-2">
                        <Label className="text-indigo-800 font-medium">Chest X-Ray Image</Label>
                        <div className="border-2 border-dashed rounded-lg p-3 text-center border-indigo-200">
                          {currentFile ? (
                            <div className="relative">
                              <img 
                                src={currentFile} 
                                alt="X-ray preview" 
                                className="max-w-full h-72 mx-auto w-72 object-contain"
                              />
                              {anomalyResult && (
                                <div className={`absolute top-2 right-2 rounded-full px-3 py-1 text-xs font-medium text-white ${
                                  anomalyResult === 'Pneumonia Detected' ? 'bg-purple-600' : 'bg-green-600'
                                }`}>
                                  {anomalyResult}
                                </div>
                              )}
                            </div>
                          ) : (
                            <div className="py-8">
                              <Upload className="mx-auto h-12 w-12 text-indigo-300" />
                              <p className="mt-2 text-indigo-700">Drop your X-ray image here or click to upload</p>
                            </div>
                          )}
                          <Input
                            type="file"
                            accept=".jpeg"
                            onChange={handleFileChange}
                            className="mt-4"
                          />
                          {fileError && (
                            <p className="text-red-500 mt-2 text-sm">{fileError}</p>
                          )}
                          {apiError && (
                            <Alert variant="destructive" className="mt-2">
                              <AlertCircle className="h-4 w-4" />
                              <AlertTitle>Error</AlertTitle>
                              <AlertDescription>{apiError}</AlertDescription>
                            </Alert>
                          )}
                        </div>
                      </div>

                      {showMetadataForm && (
                        <div className="space-y-3">
                          <div className="flex items-center justify-between mb-2">
                            <Label className="text-indigo-800 font-medium">Patient Lab Results & Vitals</Label>
                            <div className="flex items-center space-x-2">
                              <Button 
                                onClick={generateRandomValues} 
                                size="sm" 
                                variant="outline" 
                                className="h-7 py-0 px-2 text-xs bg-indigo-50 text-indigo-700 border-indigo-200 hover:bg-indigo-100"
                              >
                                Generate Random Values
                              </Button>
                              <span className="text-xs text-indigo-600 bg-indigo-50 px-2 py-1 rounded-md">All fields required</span>
                            </div>
                          </div>
                          <div className="bg-white p-3 rounded-lg border border-indigo-100 shadow-sm">
                            <div className="mb-2">
                              <h4 className="text-sm font-medium text-indigo-800 mb-1">Vital Signs</h4>
                              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-x-2 gap-y-1">
                                <div className="flex items-center space-x-1">
                                  <Label className="text-xs whitespace-nowrap">Heart Rate:</Label>
                                  <Input
                                    name="heart_rate"
                                    value={metadata.heart_rate}
                                    onChange={handleMetadataChange}
                                    placeholder="bpm"
                                    className="h-7 text-sm flex-1 min-w-0"
                                  />
                                </div>
                                <div className="flex items-center space-x-1">
                                  <Label className="text-xs whitespace-nowrap">SBP:</Label>
                                  <Input
                                    name="sbp"
                                    value={metadata.sbp}
                                    onChange={handleMetadataChange}
                                    placeholder="mmHg"
                                    className="h-7 text-sm flex-1 min-w-0"
                                  />
                                </div>
                                <div className="flex items-center space-x-1">
                                  <Label className="text-xs whitespace-nowrap">MBP:</Label>
                                  <Input
                                    name="mbp"
                                    value={metadata.mbp}
                                    onChange={handleMetadataChange}
                                    placeholder="mmHg"
                                    className="h-7 text-sm flex-1 min-w-0"
                                  />
                                </div>
                                <div className="flex items-center space-x-1">
                                  <Label className="text-xs whitespace-nowrap">Resp Rate:</Label>
                                  <Input
                                    name="resp_rate"
                                    value={metadata.resp_rate}
                                    onChange={handleMetadataChange}
                                    placeholder="/min"
                                    className="h-7 text-sm flex-1 min-w-0"
                                  />
                                </div>
                                <div className="flex items-center space-x-1">
                                  <Label className="text-xs whitespace-nowrap">Temp:</Label>
                                  <Input
                                    name="temperature"
                                    value={metadata.temperature}
                                    onChange={handleMetadataChange}
                                    placeholder="°C"
                                    className="h-7 text-sm flex-1 min-w-0"
                                  />
                                </div>
                              </div>
                            </div>
                            
                            <div className="mb-2">
                              <h4 className="text-sm font-medium text-indigo-800 mb-1">Blood Parameters</h4>
                              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-x-2 gap-y-1">
                                <div className="flex items-center space-x-1">
                                  <Label className="text-xs whitespace-nowrap">WBC:</Label>
                                  <Input
                                    name="wbc"
                                    value={metadata.wbc}
                                    onChange={handleMetadataChange}
                                    placeholder="K/µL"
                                    className="h-7 text-sm flex-1 min-w-0"
                                  />
                                </div>
                                <div className="flex items-center space-x-1">
                                  <Label className="text-xs whitespace-nowrap">Bands:</Label>
                                  <Input
                                    name="bands"
                                    value={metadata.bands}
                                    onChange={handleMetadataChange}
                                    placeholder="%"
                                    className="h-7 text-sm flex-1 min-w-0"
                                  />
                                </div>
                                <div className="flex items-center space-x-1">
                                  <Label className="text-xs whitespace-nowrap">Platelet:</Label>
                                  <Input
                                    name="platelet"
                                    value={metadata.platelet}
                                    onChange={handleMetadataChange}
                                    placeholder="K/µL"
                                    className="h-7 text-sm flex-1 min-w-0"
                                  />
                                </div>
                                <div className="flex items-center space-x-1">
                                  <Label className="text-xs whitespace-nowrap">INR:</Label>
                                  <Input
                                    name="inr"
                                    value={metadata.inr}
                                    onChange={handleMetadataChange}
                                    placeholder="ratio"
                                    className="h-7 text-sm flex-1 min-w-0"
                                  />
                                </div>
                                <div className="flex items-center space-x-1">
                                  <Label className="text-xs whitespace-nowrap">PTT:</Label>
                                  <Input
                                    name="ptt"
                                    value={metadata.ptt}
                                    onChange={handleMetadataChange}
                                    placeholder="sec"
                                    className="h-7 text-sm flex-1 min-w-0"
                                  />
                                </div>
                              </div>
                            </div>
                            
                            <div>
                              <h4 className="text-sm font-medium text-indigo-800 mb-1">Chemistry</h4>
                              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-x-2 gap-y-1">
                                <div className="flex items-center space-x-1">
                                  <Label className="text-xs whitespace-nowrap">Creatinine:</Label>
                                  <Input
                                    name="creatinine"
                                    value={metadata.creatinine}
                                    onChange={handleMetadataChange}
                                    placeholder="mg/dL"
                                    className="h-7 text-sm flex-1 min-w-0"
                                  />
                                </div>
                                <div className="flex items-center space-x-1">
                                  <Label className="text-xs whitespace-nowrap">Bilirubin:</Label>
                                  <Input
                                    name="bilirubin"
                                    value={metadata.bilirubin}
                                    onChange={handleMetadataChange}
                                    placeholder="mg/dL"
                                    className="h-7 text-sm flex-1 min-w-0"
                                  />
                                </div>
                                <div className="flex items-center space-x-1">
                                  <Label className="text-xs whitespace-nowrap">Lactate:</Label>
                                  <Input
                                    name="lactate"
                                    value={metadata.lactate}
                                    onChange={handleMetadataChange}
                                    placeholder="mmol/L"
                                    className="h-7 text-sm flex-1 min-w-0"
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}

                      <div className="flex flex-wrap gap-2">
                        {!anomalyResult && (
                          <Button 
                            onClick={runAnomalyDetection} 
                            className="bg-indigo-600 hover:bg-indigo-700 flex items-center"
                            disabled={!currentFile || isProcessing}
                          >
                            {isProcessing ? (
                              <>
                                <RotateCw className="mr-2 h-4 w-4 animate-spin" />
                                Processing...
                              </>
                            ) : (
                              <>
                                Run Pneumonia Detection
                                <ChevronRight className="ml-1 h-4 w-4" />
                              </>
                            )}
                          </Button>
                        )}
                        {anomalyResult && !sepsisRisk && (
                          <Button 
                            onClick={runSepsisRiskAssessment} 
                            className="bg-indigo-600 hover:bg-indigo-700 flex items-center"
                            disabled={isProcessing}
                          >
                            {isProcessing ? (
                              <>
                                <RotateCw className="mr-2 h-4 w-4 animate-spin" />
                                Processing...
                              </>
                            ) : (
                              <>
                                Run Sepsis Risk Assessment
                                <ChevronRight className="ml-1 h-4 w-4" />
                              </>
                            )}
                          </Button>
                        )}
                        <Button onClick={loadExample} variant="outline" className="border-indigo-300 text-indigo-700">
                          Load Example
                        </Button>
                        {(anomalyResult || sepsisRisk) && (
                          <Button 
                            onClick={rerunAnalysis} 
                            variant="secondary"
                            className="bg-indigo-100 text-indigo-800 flex items-center"
                          >
                            <RotateCw className="mr-1 h-4 w-4" />
                            Re-run Analysis
                          </Button>
                        )}
                      </div>
                    </div>

                    <div className="space-y-4">
                      {/* Analysis Progress */}
                      <div className="flex flex-col space-y-2">
                        <Label className="text-indigo-800 font-medium">Results</Label>
                      <div className="space-y-3 bg-indigo-50 p-3 rounded-lg">
                        <h3 className="text-lg font-semibold text-indigo-900">Analysis Progress</h3>
                        <div className="space-y-2">
                          {stages.map((stage) => {
                            const StageIcon = stage.icon;
                            const isActive = currentStage >= stage.id;
                            const isComplete = currentStage > stage.id || 
                              (stage.id === 2 && anomalyResult) || 
                              (stage.id === 4 && sepsisRisk);
                            
                            return (
                              <div 
                                key={stage.id}
                                className={`flex items-center space-x-3 p-2 rounded-md ${
                                  isActive ? 'bg-indigo-100' : ''
                                }`}
                              >
                                <div className={`p-2 rounded-full ${
                                  isActive ? 'bg-indigo-200' : 'bg-gray-100'
                                }`}>
                                  <StageIcon className={`h-5 w-5 ${isActive ? 'text-indigo-700' : 'text-gray-400'}`} />
                                </div>
                                <div className="flex-1">
                                  <p className={`font-medium ${isActive ? 'text-indigo-900' : 'text-gray-500'}`}>{stage.name}</p>
                                  <p className="text-xs text-gray-500">{stage.description}</p>
                                  {isComplete && (
                                    <p className="text-xs text-green-600">Completed</p>
                                  )}
                                </div>
                                {isActive && !isComplete && (
                                  <Progress value={66} className="w-16 bg-indigo-200" />
                                )}
                                {isComplete && (
                                  <Progress value={100} className="w-16 bg-indigo-200" />
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      {/* Results Section */}
                      {anomalyResult && (
                        <Card className="mt-0 border-l-4 border-l-indigo-400">
                          <CardHeader className="py-3">
                            <CardTitle className="text-base text-indigo-800">Stage 1: Pneumonia Detection Results</CardTitle>
                          </CardHeader>
                          <CardContent className="py-2">
                            <Alert variant={anomalyResult === 'Pneumonia Detected' ? 'default' : 'default'} 
                              className={anomalyResult === 'Pneumonia Detected' ? 'bg-purple-100 text-purple-800 border-purple-300' : 'bg-green-100 text-green-800 border-green-300'}>
                              <AlertCircle className="h-4 w-4" />
                              <AlertTitle>Analysis Complete</AlertTitle>
                              <AlertDescription>{anomalyResult}</AlertDescription>
                            </Alert>
                          </CardContent>
                        </Card>
                      )}

                      {sepsisRisk && (
                        <Card className="mt-0 border-l-4 border-l-indigo-400">
                          <CardHeader className="py-3">
                            <CardTitle className="text-base text-indigo-800">Stage 2: Sepsis Risk Assessment</CardTitle>
                          </CardHeader>
                          <CardContent className="py-2">
                            <Alert variant={sepsisRisk.hasSepsis ? 'default' : 'default'}
                              className={sepsisRisk.hasSepsis ? 'bg-purple-100 text-purple-800 border-purple-300' : 'bg-green-100 text-green-800 border-green-300'}>
                              <AlertCircle className="h-4 w-4" />
                              <AlertTitle>Assessment Complete</AlertTitle>
                              <AlertDescription>
                                {sepsisRisk.hasSepsis 
                                  ? 'Patient is at high risk for sepsis. Immediate clinical evaluation recommended.' 
                                  : 'No sepsis detected. Continue routine monitoring.'}
                              </AlertDescription>
                            </Alert>
                          </CardContent>
                        </Card>
                      )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <Card className="bg-indigo-50 h-full shadow-sm">
                  <CardHeader className="py-3">
                    <CardTitle className="text-sm font-medium text-indigo-900">Image Requirements</CardTitle>
                  </CardHeader>
                  <CardContent className="py-2">
                    <ul className="text-xs space-y-1 text-indigo-800">
                      <li>Clear, high-quality chest X-ray</li>
                      <li>Proper orientation (AP/PA view)</li>
                      <li>No artifacts or overlays</li>
                      <li>JPEG file format</li>
                    </ul>
                  </CardContent>
                </Card>

                <Card className="bg-indigo-50 h-full shadow-sm">
                  <CardHeader className="py-3">
                    <CardTitle className="text-sm font-medium text-indigo-900">Clinical Parameters</CardTitle>
                  </CardHeader>
                  <CardContent className="py-2">
                    <div className="grid grid-cols-2 gap-1 text-xs text-indigo-800">
                      <div>Bilirubin: 0.3-1.2 mg/dL</div>
                      <div>Creatinine: 0.7-1.3 mg/dL</div>
                      <div>Heart Rate: 60-100 bpm</div>
                      <div>INR: 0.8-1.2</div>
                      <div>Mean BP: 70-100 mmHg</div>
                      <div>Platelets: 150-450 K/µL</div>
                      <div>PTT: 25-35 seconds</div>
                      <div>Resp Rate: 12-20/min</div>
                      <div>Systolic BP: 90-120 mmHg</div>
                      <div>WBC: 4.5-11.0 K/µL</div>
                      <div>Temperature: 36.5-37.5°C</div>
                      <div>Bands: 0-10%</div>
                      <div>Lactate: 0.5-2.0 mmol/L</div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-indigo-50 h-full shadow-sm">
                  <CardHeader className="py-3">
                    <CardTitle className="text-sm font-medium text-indigo-900">Important Note</CardTitle>
                  </CardHeader>
                  <CardContent className="py-2">
                    <p className="text-xs text-indigo-800">
                      This is a clinical decision support tool. Results should be interpreted by healthcare professionals in conjunction with other clinical findings and patient history.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
        </Tabs>
        <footer className="py-3 mt-4">
          <div className="container mx-auto text-center text-indigo-500 text-sm">
            &copy; {new Date().getFullYear()} Sepsis Risk Assessment | UC San Diego
          </div>
        </footer>
      </div>
    </>
  );
};

export default ModelDemo;