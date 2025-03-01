# Sort-IQ Waste Classifier

## Project Overview

Sort-IQ Waste Classifier is an AI-powered waste classification system built during a 36-hour hackathon. The system helps users properly categorize waste items for better waste management and recycling practices.

## Features

The application offers two major functionalities:

### 1. Real-time Waste Detection

- Live webcam-based waste detection and classification using computer vision
- Hybrid detection system using both client-side and server-side models:
  - **TensorFlow.js** (client-side): Low-latency detection running directly in the browser
  - **YOLOv8** (server-side): High-accuracy detection powered by our backend
- Color-coded bounding boxes to highlight detected waste items
- Real-time feedback on waste categorization

### 2. Static Waste Classification with Sort-IQ Analytics

- Upload images of waste items for classification
- Detailed breakdown of detected waste materials
- Trackable total weight

## Waste Categories

The system classifies waste into five distinct categories:

1. **E-waste (Useful)** - Electronic devices that can be repaired or reused

   - Examples: Laptops, phones, clocks, remote controls

2. **E-waste (Not Useful)** - Electronic waste requiring special disposal

   - Examples: Old TVs, broken keyboards, damaged appliances

3. **Non-organic** - Recyclable non-organic materials

   - Examples: Plastic bottles, glass, paper, cardboard, metal items

4. **Biogas** - Organic waste suitable for biogas production

   - Examples: Meat, dairy products, processed food waste

5. **Compost** - Plant-based waste suitable for composting
   - Examples: Fruits, vegetables, plant trimmings

## Technology Stack

### Frontend

- **Next.js** with TypeScript and Tailwind CSS
- **TensorFlow.js** with COCO-SSD model for client-side detection
- React Webcam for camera integration
- Axios for API communication

### Backend

- **FastAPI** Python framework for high-performance API
- **YOLOv8** for advanced object detection and classification
- OpenCV and Pillow for image processing
- Large Language Model integration for analytical recommendations

## Getting Started

### Prerequisites

- Node.js (v16+)
- Python (v3.8+)
- Webcam for real-time detection

### Installation

#### Backend Setup

```bash
# Clone the repository
git clone https://github.com/reswaraa/sort-iq.git
cd sort-iq/backend

# Create and activate virtual environment (optional but recommended)
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Start the backend server
python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

#### Frontend Setup

```bash
# In a new terminal, navigate to the frontend directory
cd ../frontend

# Install dependencies
npm install

# Start the development server
npm run dev
```

Open your browser and navigate to http://localhost:3000 to use the application.

## How It Works

### Real-time Detection

1. The application accesses your webcam feed
2. Each frame is analyzed using either TensorFlow.js (browser) or YOLOv8 (backend)
3. Detected objects are mapped to waste categories
4. Color-coded bounding boxes are drawn around detected waste items
5. Classification results are displayed in real-time

### Static Classification with Analytics

1. Upload an image containing waste items
2. The system analyzes the image using the YOLOv8 model
3. Detected waste items are classified into appropriate categories
4. The LLM analyzes the classification results
5. Detailed recommendations and insights are generated
6. Results are presented with actionable waste management guidance

## Sustainability Impact

This project aims to address several UN Sustainable Development Goals:

- **Responsible Consumption and Production** (SDG 12)
- **Climate Action** (SDG 13)
- **Life Below Water** (SDG 14) - Reducing plastic pollution
- **Life on Land** (SDG 15) - Minimizing waste impact on ecosystems

By helping users properly classify and dispose of waste, we contribute to reducing landfill usage, increasing recycling rates, and promoting circular economy principles.

## Team

- Denzel Elden Wijaya
- Gilbert Adriel Tantoso
- Rasyidan Naja Asardi
- Reswara Anargya Dzakirullah
- Theodore Amadeo Argasetya Atmadja

## Future Work

- Fine-tune detection models specifically for waste materials
- Add support for more waste categories
- Implement user accounts to track recycling habits
- Develop mobile app version for on-the-go waste classification
- Integrate with local recycling facility databases for location-specific recommendations
