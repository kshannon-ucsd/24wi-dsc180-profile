# Sepsis Detection Application

## 🩺 Overview

This web application provides a two-stage analysis system to detect sepsis risk in patients. The system first detects pneumonia anomalies in chest X-ray images, then combines these results with patient lab results and vital signs to assess the overall sepsis risk.

## 📋 Features

- **Chest X-ray Analysis**: Upload and analyze chest X-rays for pneumonia detection
- **Clinical Data Integration**: Input patient lab results and vital signs
- **Two-Stage Risk Assessment**: Combined analysis of imaging and clinical data
- **Interactive Interface**: User-friendly visualization of analysis progress and results
- **Random Data Generation**: Quick testing with auto-generated random clinical values
- **Example Datasets**: Built-in example X-rays for demonstration purposes

## 🔧 Technologies Used

- React.js
- TypeScript
- Tailwind CSS
- ShadCN UI Components
- Lucide React Icons

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/sepsis-detection-app.git
   cd sepsis-detection-app
   ```

2. Install dependencies:
   ```bash
   npm install
   # or 
   yarn install
   ```

3. Start the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

4. Open your browser and navigate to `http://localhost:3000`

## 🏗️ Main Project Structure

```
sepsis-detection-app/
├── public/
│   └── assets/
│       └── xrays/     # Sample X-ray images
├── src/
│   ├── app/    # CSS and main app
│   └── components/
│       └── ui/        # UI components
│           └── Sepsis_Detection_App.tsx  # Main application component
├── README.md
├── package.json
└── tsconfig.json
```

## 📊 API Endpoints

The application connects to two machine learning models:

1. **Pneumonia Detection API**
   - Endpoint: `https://dsc180-resnet.bobbyzhu.com/predict`
   - Method: POST
   - Input: Chest X-ray image (JPEG format)
   - Output: Binary classification (pneumonia detected/not detected)

2. **Sepsis Risk Assessment API**
   - Endpoint: `https://dsc180-rf.bobbyzhu.com/predict`
   - Method: POST
   - Input: JSON payload with clinical parameters and pneumonia detection result
   - Output: Binary classification (sepsis risk high/low)

## 📝 Clinical Parameters

The application uses the following clinical parameters for sepsis risk assessment:

| Parameter | Normal Range | Unit |
|-----------|--------------|------|
| Bilirubin | 0.3-1.2 | mg/dL |
| Creatinine | 0.7-1.3 | mg/dL |
| Heart Rate | 60-100 | bpm |
| INR | 0.8-1.2 | ratio |
| Mean BP | 70-100 | mmHg |
| Platelets | 150-450 | K/µL |
| PTT | 25-35 | seconds |
| Resp Rate | 12-20 | /min |
| Systolic BP | 90-120 | mmHg |
| WBC | 4.5-11.0 | K/µL |
| Temperature | 36.5-37.5 | °C |
| Bands | 0-10 | % |
| Lactate | 0.5-2.0 | mmol/L |

## ⚠️ Important Note

This application is a clinical decision support tool. Results should be interpreted by healthcare professionals in conjunction with other clinical findings and patient history. This tool does not replace clinical judgment.

## 📸 Screenshots

![Application Screenshot 1](/public/assets/initial_upload_screen.png)
*Initial Upload Screen*

![Application Screenshot 2](/public/assets/result_display_screen.png)
*Results Display Screen*

## 🧪 Model Details

### Pneumonia Detection Model
- Architecture: ResNet-based convolutional neural network
- Training Dataset: Chest X-ray dataset (AP/PA views)
- Performance: 92% accuracy on test set

### Sepsis Risk Assessment Model
- Architecture: CatBoost classifier
- Features: 13 clinical parameters + pneumonia detection result
- Performance: 78% accuracy on test set

## 👥 Team

- [Ahmed Mostafa](https://github.com/ahmostafa147) - Project Manager
- [Bobby Zhu](https://github.com/Bobby-Zhu) - Cloud Engineer
- [Ojas Vashishtha](https://github.com/Ojas6987) - ML Engineer
- [Raine Hoang](https://github.com/Jystine) - Data Engineer
- [Rohan Duvur](https://github.com/rduvur) - ML Engineer
- [Tongxun Hu](https://github.com/Sherrihuu) - Data Scientist

## 🙏 Acknowledgements

- Professor Kyle Shannon for his mentorship and guidance throughout the project
- Halıcıoğlu Data Science Institute for supporting this research
  
---

© 2025 Sepsis Risk Assessment | UC San Diego
