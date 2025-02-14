'use client';

import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './card';
import { Button } from './button';
import { Input } from './input';
import { Label } from './label';
import { Progress } from './progress';
import { AlertCircle, Upload, ChevronRight, Activity, LineChart, BrainCircuit, Info } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from './alert';

// Background animation component
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
  { id: 1, name: 'Upload & Preprocessing', icon: Upload, description: 'Preparing and validating input data' },
  { id: 2, name: 'Lung Anomaly Detection', icon: Activity, description: 'Analyzing chest X-ray with ResNet model' },
  { id: 3, name: 'Metadata Analysis', icon: LineChart, description: 'Processing patient vitals and clinical data' },
  { id: 4, name: 'Risk Assessment', icon: BrainCircuit, description: 'Calculating final sepsis risk predictions' }
];

const ModelDemo = () => {
  const [currentFile, setCurrentFile] = useState(null);
  const [currentStage, setCurrentStage] = useState(0);
  const [prediction, setPrediction] = useState(null);
  const [metadata, setMetadata] = useState({
    temperature: '',
    heartRate: '',
    bloodPressure: '',
    respiratoryRate: '',
    oxygenSaturation: ''
  });

  // Placeholder for the first model (image processing)
  // const processImage = async (image) => {
  //   // TODO: Implement image processing logic
  //   return new Promise((resolve) => {
  //     setTimeout(() => resolve({ anomalyScore: 0.75 }), 2000);
  //   });
  // };

  // Placeholder for the second model (metadata processing)
  // const processMetadata = async (imageResults, metadata) => {
  //   // TODO: Implement metadata processing logic
  //   return new Promise((resolve) => {
  //     setTimeout(() => resolve({
  //       risk1Day: 0.15,
  //       risk2Day: 0.25,
  //       risk3PlusDays: 0.35
  //     }), 2000);
  //   });
  // };

  // const handleFileChange = (event) => {
  //   const file = event.target.files[0];
  //   if (file) {
  //     setCurrentFile(file);
  //     // Create object URL for preview
  //     const reader = new FileReader();
  //     reader.onloadend = () => {
  //       setCurrentFile(reader.result);
  //     };
  //     reader.readAsDataURL(file);
  //   }
  // };

  // const handleMetadataChange = (e) => {
  //   setMetadata({
  //     ...metadata,
  //     [e.target.name]: e.target.value
  //   });
  // };

  const runDemo = async () => {
    setCurrentStage(1);
    // Stage 1: Upload & Preprocessing
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setCurrentStage(2);
    // Stage 2: Lung Anomaly Detection
    // const imageResults = await processImage(currentFile);
    
    setCurrentStage(3);
    // Stage 3: Metadata Analysis
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setCurrentStage(4);
    // Stage 4: Final Risk Assessment
    // const results = await processMetadata(imageResults, metadata);
    // setPrediction(results);
  };

  const loadExample = () => {
    // setCurrentFile('/api/placeholder/400/400');
    setMetadata({
      temperature: '38.5',
      heartRate: '95',
      bloodPressure: '110/70',
      respiratoryRate: '22',
      oxygenSaturation: '94'
    });
  };

  return (
    <>
      <AnimatedBackground />
      <div className="container mx-auto p-4 relative">
        <Tabs defaultValue="demo" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="demo">Model Demo</TabsTrigger>
            <TabsTrigger value="architecture">Cloud Architecture</TabsTrigger>
          </TabsList>

          <TabsContent value="demo">
            <div className="space-y-4">
              <InfoCard title="About This Demo">
                This interactive demo showcases our sepsis detection system that combines chest X-ray analysis with patient vitals 
                to predict sepsis risk. Upload an image or use our example data to see the model in action.
              </InfoCard>

              <Card>
                <CardHeader>
                  <CardTitle>Sepsis Detection Model Demo</CardTitle>
                  <CardDescription className="space-y-2">
                    <p>Our system uses a two-stage approach to predict sepsis risk:</p>
                    <ul className="list-disc pl-4 space-y-1">
                      <li>First, we analyze chest X-rays using a ResNet model to detect lung anomalies</li>
                      <li>Then, we combine these results with patient vitals for comprehensive risk assessment</li>
                    </ul>
                  </CardDescription>
                </CardHeader>
                <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex flex-col space-y-2">
                    <Label>Chest X-Ray Image</Label>
                    <div className="border-2 border-dashed rounded-lg p-4 text-center">
                      {currentFile ? (
                        <img 
                          src={currentFile} 
                          alt="X-ray preview" 
                          className="max-w-full h-auto mx-auto"
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
                        // onChange={handleFileChange}
                        className="mt-4"
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <Label>Patient Vitals</Label>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>Temperature (°C)</Label>
                        <Input
                          name="temperature"
                          value={metadata.temperature}
                          // onChange={handleMetadataChange}
                          placeholder="37.0"
                        />
                      </div>
                      <div>
                        <Label>Heart Rate (bpm)</Label>
                        <Input
                          name="heartRate"
                          value={metadata.heartRate}
                          // onChange={handleMetadataChange}
                          placeholder="75"
                        />
                      </div>
                      <div>
                        <Label>Blood Pressure</Label>
                        <Input
                          name="bloodPressure"
                          value={metadata.bloodPressure}
                          // onChange={handleMetadataChange}
                          placeholder="120/80"
                        />
                      </div>
                      <div>
                        <Label>Respiratory Rate</Label>
                        <Input
                          name="respiratoryRate"
                          value={metadata.respiratoryRate}
                          // onChange={handleMetadataChange}
                          placeholder="16"
                        />
                      </div>
                      <div>
                        <Label>O2 Saturation (%)</Label>
                        <Input
                          name="oxygenSaturation"
                          value={metadata.oxygenSaturation}
                          // onChange={handleMetadataChange}
                          placeholder="98"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex space-x-4">
                    <Button onClick={runDemo} className="flex-1">
                      Run Analysis
                    </Button>
                    <Button onClick={loadExample} variant="outline" className="flex-1">
                      Load Example
                    </Button>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Analysis Progress</h3>
                    <div className="space-y-6">
                      {stages.map((stage) => {
                        const StageIcon = stage.icon;
                        const isActive = currentStage >= stage.id;
                        const isComplete = currentStage > stage.id;
                        
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
                              {isComplete && (
                                <p className="text-sm text-gray-500">Completed</p>
                              )}
                            </div>
                            {isActive && !isComplete && (
                              <Progress value={66} className="w-20" />
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {prediction && (
                    <Card>
                      <CardHeader>
                        <CardTitle>Risk Assessment Results</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div>
                            <Label>1-Day Risk</Label>
                            {/* <Progress value={prediction.risk1Day * 100} className="mt-2" /> */}
                            <p className="text-sm text-gray-500 mt-1">
                              {/* {(prediction.risk1Day * 100).toFixed(1)}% probability */}
                            </p>
                          </div>
                          <div>
                            <Label>2-Day Risk</Label>
                            {/* <Progress value={prediction.risk2Day * 100} className="mt-2" /> */}
                            <p className="text-sm text-gray-500 mt-1">
                              {/* {(prediction.risk2Day * 100).toFixed(1)}% probability */}
                            </p>
                          </div>
                          <div>
                            <Label>3+ Days Risk</Label>
                            {/* <Progress value={prediction.risk3PlusDays * 100} className="mt-2" /> */}
                            <p className="text-sm text-gray-500 mt-1">
                              {/* {(prediction.risk3PlusDays * 100).toFixed(1)}% probability */}
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
                <Card className="bg-blue-50">
                  <CardHeader>
                    <CardTitle className="text-sm font-medium">Quick Tip</CardTitle>
                  </CardHeader>
                  <CardContent>
                    For best results, ensure X-ray images are clear and properly oriented. DICOM format is preferred.
                  </CardContent>
                </Card>

                <Card className="bg-blue-50">
                  <CardHeader>
                    <CardTitle className="text-sm font-medium">Normal Ranges</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="text-sm space-y-1">
                      <li>Temperature: 36.5-37.5°C</li>
                      <li>Heart Rate: 60-100 bpm</li>
                      <li>Blood Pressure: 90/60-120/80</li>
                      <li>Respiratory Rate: 12-20</li>
                      <li>O2 Saturation: 95-100%</li>
                    </ul>
                  </CardContent>
                </Card>

                <Card className="bg-blue-50">
                  <CardHeader>
                    <CardTitle className="text-sm font-medium">Important Note</CardTitle>
                  </CardHeader>
                  <CardContent>
                    This is a demonstration tool. Always consult healthcare professionals for medical decisions.
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="architecture">
            <div className="space-y-4">
              <InfoCard title="Our Cloud Infrastructure">
                Learn how we leverage AWS services to deliver a scalable, reliable, and secure sepsis detection system.
                Our architecture ensures fast processing of medical images and real-time risk assessment.
              </InfoCard>

              <Card>
                <CardHeader>
                  <CardTitle>Cloud Architecture</CardTitle>
                  <CardDescription>
                    A modern, serverless approach to medical image processing and analysis
                  </CardDescription>
                </CardHeader>
                <CardContent>
                <div className="space-y-6">
                <img 
                  src="/api/placeholder/800/400" 
                  alt="Cloud Architecture Diagram"
                  className="w-full rounded-lg shadow-lg"
                />
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Storage</CardTitle>
                      <CardDescription>Amazon S3</CardDescription>
                    </CardHeader>
                    <CardContent>
                      Used for storing and managing chest X-ray images and associated metadata
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle>Deployment</CardTitle>
                      <CardDescription>Amazon ECS</CardDescription>
                    </CardHeader>
                    <CardContent>
                      Containerization and deployment of trained models with scalability
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle>Delivery</CardTitle>
                      <CardDescription>Amazon CloudFront</CardDescription>
                    </CardHeader>
                    <CardContent>
                      Fast and efficient content delivery for web interface and model outputs
                    </CardContent>
                  </Card>
                </div>

                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Documentation Available</AlertTitle>
                  <AlertDescription>
                    For detailed information about our cloud infrastructure, visit our{" "}
                    <a 
                      href="d3i23sy0bznewr.cloudfront.net" 
                      className="font-medium underline"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      internal documentation
                    </a>
                  </AlertDescription>
                </Alert>
              </div>
                </CardContent>
              </Card>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="bg-blue-50">
                  <CardHeader>
                    <CardTitle className="text-sm font-medium">High Availability</CardTitle>
                  </CardHeader>
                  <CardContent>
                    Our system is deployed across multiple availability zones for redundancy and reliability.
                  </CardContent>
                </Card>

                <Card className="bg-blue-50">
                  <CardHeader>
                    <CardTitle className="text-sm font-medium">Security</CardTitle>
                  </CardHeader>
                  <CardContent>
                    All data is encrypted in transit and at rest, following healthcare compliance standards.
                  </CardContent>
                </Card>

                <Card className="bg-blue-50">
                  <CardHeader>
                    <CardTitle className="text-sm font-medium">Scalability</CardTitle>
                  </CardHeader>
                  <CardContent>
                    Automatic scaling based on demand ensures consistent performance under any load.
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
};

export default ModelDemo;
