# 🏥 Prescription SafetyNet

An AI-powered prescription safety analyzer that detects drug interactions, allergy conflicts, and provides personalized safety recommendations using advanced OCR and Google Gemini AI.

## ✨ Features

### 🔍 **Smart Prescription Analysis**
- **Dual OCR System**: Tesseract OCR with Gemini Vision fallback
- **AI-Powered Analysis**: Google Gemini AI for medical intelligence
- **Drug Interaction Detection**: Identifies dangerous medication combinations
- **Allergy Conflict Checking**: Cross-references patient allergies with prescribed medications
- **Risk Level Assessment**: Critical, High, Medium, Low risk categorization

### 👤 **User Management**
- **Secure Authentication**: JWT-based login system with bcrypt password hashing
- **User Profiles**: Age, gender, and medical allergy management
- **Personalized Analysis**: Tailored recommendations based on user profile

### 📱 **Modern Interface**
- **React + Vite Frontend**: Fast, responsive user interface
- **Tailwind CSS**: Modern, mobile-first design
- **React Router**: Multi-page navigation with dedicated analysis reports
- **Real-time Feedback**: Toast notifications and loading states

### 🤖 **AI-Powered Recommendations**
- **Personalized Safety Advice**: AI-generated medication guidance
- **Dedicated Recommendations Page**: Detailed safety instructions
- **Medical Disclaimers**: Professional healthcare consultation reminders

## 🚀 Tech Stack

### **Backend**
- **Flask** - Python web framework
- **MongoDB** - Document database for user data
- **Google Gemini AI** - Advanced medical analysis
- **Tesseract OCR** - Primary text extraction
- **bcrypt** - Secure password hashing
- **JWT** - Token-based authentication

### **Frontend**
- **React 19** - Modern UI framework
- **Vite** - Fast build tool
- **Tailwind CSS** - Utility-first styling
- **React Router DOM** - Client-side routing
- **Zustand** - State management
- **React Hot Toast** - Notification system
- **Heroicons** - Beautiful icons

## 📋 Prerequisites

### **System Requirements**
- Python 3.8+
- Node.js 16+
- MongoDB 4.4+
- Tesseract OCR (optional - Gemini Vision fallback available)

### **API Keys Required**
- **Google Gemini API Key** - For AI analysis and vision OCR
- **MongoDB Connection String** - For database access

## ⚙️ Installation

### **1. Clone Repository**
```bash
git clone <repository-url>
cd prescription-safety-net
```

### **2. Backend Setup**
```bash
cd Backend
pip install -r requirements.txt
```

### **3. Environment Configuration**
Create `.env` file in Backend directory:
```env
# Gemini AI Configuration
GEMINI_API_KEY=your_gemini_api_key_here
GEMINI_MODEL=gemini-2.0-flash-exp

# Database Configuration
MONGO_URI=mongodb://localhost:27017/

# Security
JWT_SECRET_KEY=your-super-secure-secret-key-here

# OCR Configuration (Optional - if Tesseract installed)
TESSERACT_PATH=C:/Program Files/Tesseract-OCR/tesseract.exe
```

### **4. Frontend Setup**
```bash
cd Frontend
npm install
```

### **5. Database Setup**
- Start MongoDB service
- Database collections will be created automatically

## 🎯 Running the Application

### **Start Backend Server**
```bash
cd Backend
python app.py
```
Backend runs on: `http://localhost:5000`

### **Start Frontend Development Server**
```bash
cd Frontend
npm run dev
```
Frontend runs on: `http://localhost:5173`

## 📁 Project Structure

```
prescription-safety-net/
├── Backend/
│   ├── app.py                 # Main Flask application
│   ├── config.py             # Configuration settings
│   ├── requirements.txt      # Python dependencies
│   └── utils/
│       ├── ai_drug_analyzer.py    # Gemini AI integration
│       ├── auth_manager.py        # User authentication
│       ├── db.py                  # Database operations
│       ├── interaction_checker.py # Drug interaction rules
│       ├── medicine_parser.py     # Medicine name extraction
│       └── ocr.py                 # OCR processing
├── Frontend/
│   ├── src/
│   │   ├── components/       # React components
│   │   │   ├── Header.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── UploadSection.jsx
│   │   │   ├── AnalysisReport.jsx
│   │   │   ├── AllergyManager.jsx
│   │   │   └── WelcomeSection.jsx
│   │   ├── pages/           # Page components
│   │   │   ├── HomePage.jsx
│   │   │   ├── AnalysisPage.jsx
│   │   │   └── RecommendationsPage.jsx
│   │   ├── store.js         # State management
│   │   └── App.jsx          # Main app component
│   ├── package.json
│   └── vite.config.js
└── README.md
```

## 🔄 How It Works

### **1. User Registration & Authentication**
- Users create accounts with medical profile (age, gender, allergies)
- Secure JWT-based authentication system
- Encrypted password storage using bcrypt

### **2. Prescription Upload & Processing**
- Users upload two prescription images/PDFs
- **Primary**: Tesseract OCR extracts text from images
- **Fallback**: If OCR fails, Gemini Vision reads images directly
- Advanced image preprocessing for better accuracy

### **3. AI-Powered Medical Analysis**
- Google Gemini AI analyzes extracted text
- Identifies medication names and dosages
- Cross-references drug interaction databases
- Checks against user's allergy profile
- Generates risk assessment and recommendations

### **4. Results & Recommendations**
- Comprehensive analysis report with risk levels
- Detailed drug interaction explanations
- Allergy conflict warnings
- Personalized AI safety recommendations
- Professional medical disclaimers

## 🔐 Security Features

- **Password Encryption**: bcrypt hashing with salt
- **JWT Authentication**: Secure token-based sessions
- **Input Validation**: Server-side data validation
- **CORS Protection**: Cross-origin request security
- **Medical Data Privacy**: Secure handling of health information

## 📊 OCR Method Tracking

The system provides transparent logging of text extraction methods:

- **✅ TESSERACT**: When OCR successfully reads prescriptions
- **🤖 GEMINI_VISION**: When AI vision is used as fallback
- **❌ ERROR**: When both methods fail

Console output shows exactly which method was used for each prescription.

## 🛡️ Medical Disclaimers

- **Not Medical Advice**: This tool is for informational purposes only
- **Professional Consultation**: Always consult healthcare providers
- **AI Limitations**: AI analysis should not replace medical expertise
- **Emergency Situations**: Seek immediate medical attention for critical interactions

## 🚨 Important Notes

1. **API Keys Required**: System requires valid Gemini API key to function
2. **OCR Optional**: Tesseract OCR is optional - Gemini Vision provides fallback
3. **Database Setup**: MongoDB must be running and accessible
4. **Medical Accuracy**: This is a demonstration project, not certified for medical use
5. **Data Security**: Implement additional security measures for production use

## 🔧 Development

### **Available Scripts**

**Backend:**
```bash
python app.py          # Start development server
```

**Frontend:**
```bash
npm run dev           # Start development server
npm run build         # Build for production
npm run preview       # Preview production build
npm run lint          # Run ESLint
```

### **Environment Variables**
All sensitive configuration should be stored in `.env` files and never committed to version control.

## 📝 License

This project is for educational and demonstration purposes. Please ensure compliance with medical software regulations if adapting for production use.

---

**⚠️ Disclaimer**: This application is a technology demonstration and should not be used as a substitute for professional medical advice, diagnosis, or treatment. Always consult qualified healthcare providers for medical decisions.