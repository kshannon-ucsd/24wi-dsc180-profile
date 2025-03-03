'use client';

import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './card';
import { Button } from './button';
import { Input } from './input';
import { Label } from './label';
import { Progress } from './progress';
import { AlertCircle, Upload, ChevronRight, Activity, LineChart, BrainCircuit, Info, RefreshCw } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from './alert';

const AnimatedBackground = () => (
  <div className="fixed inset-0 -z-10 overflow-hidden">
    <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-white">
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
  <Card className="mb-4">
    <CardHeader className="flex flex-row items-center space-x-2">
      <Info className="h-5 w-5 text-blue-500" />
      <CardTitle className="text-lg">{title}</CardTitle>
    </CardHeader>
    <CardContent>
      <p className="text-gray-600">{children}</p>
    </CardContent>
  </Card>
);

const stages = [
  { id: 1, name: 'Image Upload & Validation', icon: Upload, description: 'Validating PNG format and image quality' },
  { id: 2, name: 'Anomaly Detection', icon: Activity, description: 'Analyzing chest X-ray for anomalies' },
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
    wbc: ''
  });

  const resetAnalysis = () => {
    setCurrentStage(0);
    setAnomalyResult(null);
    setSepsisRisk(null);
    setShowMetadataForm(false);
    setApiError(null);
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
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      setCurrentStage(2);
      
      const formData = new FormData();
      formData.append('image', rawFile);

      const response = await fetch('http://resnet-chestxray-alb-1460798204.us-east-1.elb.amazonaws.com/predict', {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      console.log('API response:', data);
      
      // Check if the response contains a prediction
      if (data && data.body) {
        let result;
        try {
          // Try to parse the JSON string if it's in string format
          const parsedBody = typeof data.body === 'string' ? JSON.parse(data.body) : data.body;
          
          if (parsedBody.prediction === 1) {
            result = 'Anomaly Detected';
          } else {
            result = 'No Anomaly Detected';
          }
          
          setAnomalyResult(result);
          setShowMetadataForm(true);
        } catch (e) {
          console.error('Error parsing response:', e);
          setApiError('Could not parse API response');
        }
      } else {
        setApiError('Invalid API response format');
      }
    } catch (error) {
      console.error('Error calling API:', error);
      setApiError(`Error: ${error instanceof Error ? error.message : 'Unknown error occurred'}`);
      setCurrentStage(1);  // Move back to upload stage
    }
  };

  // Second stage: Sepsis Risk Assessment
  const runSepsisRiskAssessment = async () => {
    setCurrentStage(3);
    await new Promise(resolve => setTimeout(resolve, 1500));
    setCurrentStage(4);
    // Simulated API call for sepsis risk assessment
    await new Promise(resolve => setTimeout(resolve, 2000));
    setSepsisRisk({
      risk1Day: 0.15,
      risk2Day: 0.25,
      risk3PlusDays: 0.35
    });
  };

  const loadExample = () => {
    setCurrentFile('./assets/xray.png');
    resetAnalysis();
    setRawFile(null); // Reset raw file since we're using a URL
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
      wbc: '8.5'
    });
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
      wbc: ''
    });
  };

  return (
    <>
      <AnimatedBackground />
      <div className="container mx-auto p-4 relative">
        <Tabs defaultValue="demo" className="w-full">
          <TabsList className="grid w-full grid-cols-1">
            <TabsTrigger value="demo">Model Demo</TabsTrigger>
          </TabsList>

          <TabsContent value="demo">
            <div className="space-y-4">
              <InfoCard title="About This Demo">
                This two-stage analysis system first detects anomalies in chest X-rays, then combines these results 
                with patient lab results and vitals to assess sepsis risk. Upload an image to begin the analysis.
              </InfoCard>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle>Sepsis Detection Model Demo</CardTitle>
                    <CardDescription>
                      Our two-stage approach combines chest X-ray analysis with clinical data for comprehensive sepsis risk assessment.
                    </CardDescription>
                  </div>
                  <Button 
                    variant="outline" 
                    size="icon" 
                    onClick={resetAll}
                    className="h-8 w-8"
                  >
                    <RefreshCw className="h-4 w-4" />
                  </Button>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div className="flex flex-col space-y-2">
                        <Label>Chest X-Ray Image</Label>
                        <div className="border-2 border-dashed rounded-lg p-4 text-center">
                          {currentFile ? (
                            <img 
                              src={currentFile} 
                              alt="X-ray preview" 
                              className="max-w-full h-80 mx-auto w-80"
                            />
                          ) : (
                            <div className="py-8">
                              <Upload className="mx-auto h-12 w-12 text-gray-400" />
                              <p className="mt-2">Drop your X-ray image here or click to upload</p>
                            </div>
                          )}
                          <Input
                            type="file"
                            accept="image/*"
                            onChange={handleFileChange}
                            className="mt-4"
                          />
                          {fileError && (
                            <p className="text-red-500 mt-2">{fileError}</p>
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
                        <div className="space-y-4">
                          <Label>Patient Lab Results & Vitals</Label>
                          <div className="grid grid-cols-2 gap-4">
                            {Object.entries(metadata).map(([key, value]) => (
                              <div key={key}>
                                <Label>{key.replace('_', ' ').toUpperCase()}</Label>
                                <Input
                                  name={key}
                                  value={value}
                                  onChange={handleMetadataChange}
                                  placeholder="0.0"
                                />
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      <div className="flex space-x-4">
                        {!anomalyResult && (
                          <Button 
                            onClick={runAnomalyDetection} 
                            className="flex-1"
                            disabled={!currentFile}
                          >
                            Run Anomaly Detection
                          </Button>
                        )}
                        {anomalyResult && !sepsisRisk && (
                          <Button 
                            onClick={runSepsisRiskAssessment} 
                            className="flex-1"
                          >
                            Run Sepsis Risk Assessment
                          </Button>
                        )}
                        <Button onClick={loadExample} variant="outline" className="flex-1">
                          Load Example
                        </Button>
                      </div>
                    </div>

                    <div className="space-y-6">
                      {/* Analysis Progress */}
                      <div className="space-y-4">
                        <h3 className="text-lg font-semibold">Analysis Progress</h3>
                        <div className="space-y-4">
                          {stages.map((stage) => {
                            const StageIcon = stage.icon;
                            const isActive = currentStage >= stage.id;
                            const isComplete = currentStage > stage.id || 
                              (stage.id === 2 && anomalyResult) || 
                              (stage.id === 4 && sepsisRisk);
                            
                            return (
                              <div 
                                key={stage.id}
                                className={`flex items-center space-x-4 ${
                                  isActive ? 'text-primary' : 'text-gray-400'
                                }`}
                              >
                                <div className={`p-2 rounded-full ${
                                  isActive ? 'bg-primary/20' : 'bg-gray-100'
                                }`}>
                                  <StageIcon className="h-6 w-6" />
                                </div>
                                <div className="flex-1">
                                  <p className="font-medium">{stage.name}</p>
                                  <p className="text-sm text-gray-500">{stage.description}</p>
                                  {isComplete && (
                                    <p className="text-sm text-green-600">Completed</p>
                                  )}
                                </div>
                                {isActive && !isComplete && (
                                  <Progress value={66} className="w-20" />
                                )}
                                {isComplete && (
                                  <Progress value={100} className="w-20" />
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      {/* Results Section */}
                      {anomalyResult && (
                        <Card className="mt-0">
                          <CardHeader>
                            <CardTitle>Stage 1: Anomaly Detection Results</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <Alert variant={anomalyResult === 'Anomaly Detected' ? 'destructive' : 'default'}>
                              <AlertCircle className="h-4 w-4" />
                              <AlertTitle>Analysis Complete</AlertTitle>
                              <AlertDescription>{anomalyResult}</AlertDescription>
                            </Alert>
                          </CardContent>
                        </Card>
                      )}

                      {sepsisRisk && (
                        <Card className="mt-0">
                          <CardHeader>
                            <CardTitle>Stage 2: Sepsis Risk Assessment</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="space-y-4">
                              <div>
                                <Label>1-Day Risk</Label>
                                <Progress value={sepsisRisk.risk1Day * 100} className="mt-2" />
                                <p className="text-sm text-gray-500 mt-1">
                                  {(sepsisRisk.risk1Day * 100).toFixed(1)}% probability
                                </p>
                              </div>
                              <div>
                                <Label>2-Day Risk</Label>
                                <Progress value={sepsisRisk.risk2Day * 100} className="mt-2" />
                                <p className="text-sm text-gray-500 mt-1">
                                  {(sepsisRisk.risk2Day * 100).toFixed(1)}% probability
                                </p>
                              </div>
                              <div>
                                <Label>3+ Days Risk</Label>
                                <Progress value={sepsisRisk.risk3PlusDays * 100} className="mt-2" />
                                <p className="text-sm text-gray-500 mt-1">
                                  {(sepsisRisk.risk3PlusDays * 100).toFixed(1)}% probability
                                </p>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="bg-blue-50 h-full">
                  <CardHeader>
                    <CardTitle className="text-sm font-medium">Image Requirements</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="text-sm space-y-1">
                      <li>Clear, high-quality chest X-ray</li>
                      <li>Proper orientation (AP/PA view)</li>
                      <li>No artifacts or overlays</li>
                    </ul>
                  </CardContent>
                </Card>

                <Card className="bg-blue-50 h-full">
                  <CardHeader>
                    <CardTitle className="text-sm font-medium">Clinical Parameters</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="text-sm space-y-1">
                      <li>Bilirubin: 0.3-1.2 mg/dL</li>
                      <li>Creatinine: 0.7-1.3 mg/dL</li>
                      <li>Heart Rate: 60-100 bpm</li>
                      <li>INR: 0.8-1.2</li>
                      <li>Mean BP: 70-100 mmHg</li>
                      <li>Platelets: 150-450 K/µL</li>
                      <li>PTT: 25-35 seconds</li>
                      <li>Respiratory Rate: 12-20/min</li>
                      <li>Systolic BP: 90-120 mmHg</li>
                      <li>WBC: 4.5-11.0 K/µL</li>
                    </ul>
                  </CardContent>
                </Card>

                <Card className="bg-blue-50 h-full">
                  <CardHeader>
                    <CardTitle className="text-sm font-medium">Important Note</CardTitle>
                  </CardHeader>
                  <CardContent>
                    This is a clinical decision support tool. Results should be interpreted by healthcare professionals in conjunction with other clinical findings and patient history.
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
        </Tabs>
        <footer className="bg-pink-20 py-4 mt-8">
        <div className="container mx-auto text-center text-gray-600">
          &copy; {new Date().getFullYear()} Sepsis Risk Assessment | UC San Diego
        </div>
      </footer>
      </div>
    </>
  );
};

export default ModelDemo;