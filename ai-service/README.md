# APEER AI Service

<div align="center">

![Python](https://img.shields.io/badge/Python-3.11-3776AB?style=for-the-badge&logo=python)
![Flask](https://img.shields.io/badge/Flask-3.0-000000?style=for-the-badge&logo=flask)
![PyTorch](https://img.shields.io/badge/PyTorch-2.0-EE4C2C?style=for-the-badge&logo=pytorch)

**NLP Microservice for Comment Analysis & Summarization**

</div>

---

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Architecture](#architecture)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Installation](#installation)
- [API Documentation](#api-documentation)
- [Models](#models)
- [Performance](#performance)
- [Deployment](#deployment)

---

## 🎯 Overview

The APEER AI Service is a Python Flask microservice that provides advanced Natural Language Processing capabilities for analyzing student feedback. It uses state-of-the-art transformer models to classify comments, analyze sentiment, and generate intelligent summaries.

### Core Capabilities

- 🏷️ **Comment Classification** - Tag feedback as Constructive, Vague, Off-topic
- 😊 **Sentiment Analysis** - Polarity scoring with VADER & TextBlob
- 📊 **Usefulness Scoring** - Custom algorithm for feedback quality (0-100)
- 📝 **Text Summarization** - Abstractive summarization with BART/T5
- 🚨 **Bias Detection Support** - Statistical analysis integration

---

## ✨ Features

### 1. Comment Classification
```python
# Input: "Great teamwork! Always helps others understand difficult concepts."
# Output: ["Constructive", "Specific", "Polite"]
```

Uses fine-tuned BERT model trained on academic peer review data.

### 2. Sentiment & Usefulness Analysis
```python
# Input: "You did good."
# Output: {
#   "polarity": 0.65,
#   "usefulness": 35,
#   "flagged": True  # Low usefulness
# }
```

Combines:
- **VADER** (rule-based sentiment)
- **TextBlob** (linguistic analysis)
- **Custom heuristics** (length, specificity, constructiveness)

### 3. Feedback Summarization
```python
# Input: [20 comments about Student A]
# Output: {
#   "strengths": "Peers praised exceptional leadership and communication.",
#   "weaknesses": "Multiple comments suggest improving time management.",
#   "themes": ["Collaborative", "Creative", "Technical"]
# }
```

Uses T5-base transformer for abstractive summarization.

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────┐
│              Flask AI Microservice                  │
├─────────────────────────────────────────────────────┤
│                                                     │
│  ┌───────────────────────────────────────────────┐ │
│  │           Flask Routes (/api/*)               │ │
│  │  ├─ /classify                                 │ │
│  │  ├─ /analyze_sentiment                        │ │
│  │  └─ /summarize                                │ │
│  └───────────────┬───────────────────────────────┘ │
│                  │                                  │
│  ┌───────────────▼───────────────────────────────┐ │
│  │           NLP Processing Layer                │ │
│  │  ├─ CommentClassifier (BERT)                  │ │
│  │  ├─ SentimentAnalyzer (VADER + TextBlob)      │ │
│  │  └─ Summarizer (T5/BART)                      │ │
│  └───────────────┬───────────────────────────────┘ │
│                  │                                  │
│  ┌───────────────▼───────────────────────────────┐ │
│  │           Model Inference                     │ │
│  │  ├─ Hugging Face Transformers                 │ │
│  │  ├─ PyTorch Backend                           │ │
│  │  └─ spaCy NLP Pipeline                        │ │
│  └───────────────────────────────────────────────┘ │
│                                                     │
│  External: Spring Boot Backend → HTTP POST         │
└─────────────────────────────────────────────────────┘
```

---

## 🛠️ Tech Stack

| Component          | Technology                    |
|--------------------|-------------------------------|
| Framework          | Flask 3.0                     |
| Language           | Python 3.11                   |
| NLP Library        | Transformers (Hugging Face)   |
| ML Framework       | PyTorch 2.0                   |
| Sentiment          | VADER, TextBlob               |
| NLP Pipeline       | spaCy 3.7                     |
| HTTP Client        | Requests                      |
| Data Processing    | Pandas, NumPy                 |
| Deployment         | Docker + Gunicorn             |

---

## 📁 Project Structure

```
ai-service/
├── app/
│   ├── __init__.py                  # Flask app initialization
│   │
│   ├── routes/                      # API endpoints
│   │   ├── __init__.py
│   │   ├── classify.py              # /api/classify
│   │   ├── sentiment.py             # /api/analyze_sentiment
│   │   └── summarize.py             # /api/summarize
│   │
│   ├── models/                      # ML model wrappers
│   │   ├── __init__.py
│   │   ├── classifier.py            # BERT classification
│   │   ├── sentiment_analyzer.py    # VADER + TextBlob
│   │   └── summarizer.py            # T5/BART summarization
│   │
│   ├── utils/                       # Helper functions
│   │   ├── __init__.py
│   │   ├── preprocessor.py          # Text cleaning
│   │   ├── usefulness_scorer.py     # Custom scoring logic
│   │   └── logger.py                # Logging configuration
│   │
│   └── config/                      # Configuration
│       ├── __init__.py
│       └── settings.py              # App settings
│
├── models/                          # Pre-trained model weights
│   ├── bert_classifier/             # Fine-tuned BERT
│   ├── t5_summarizer/               # T5-base
│   └── model_metadata.json          # Model version info
│
├── tests/                           # Unit tests
│   ├── test_classifier.py
│   ├── test_sentiment.py
│   └── test_summarizer.py
│
├── scripts/                         # Utility scripts
│   ├── download_models.py           # Download pre-trained models
│   └── train_classifier.py          # Fine-tune BERT
│
├── requirements.txt                 # Python dependencies
├── requirements-dev.txt              # Development dependencies
├── Dockerfile                       # Container definition
├── docker-compose.yml               # Multi-container setup
├── .env.example                     # Environment template
├── gunicorn_config.py               # Production server config
└── README.md                        # This file
```

---

## 🚀 Installation

### Prerequisites

- **Python 3.11+**
- **pip** or **conda**
- **CUDA 11.8+** (optional, for GPU acceleration)

### Setup Virtual Environment

```bash
# Navigate to ai-service directory
cd ai-service

# Create virtual environment
python -m venv venv

# Activate (Linux/Mac)
source venv/bin/activate

# Activate (Windows)
venv\Scripts\activate
```

### Install Dependencies

```bash
# Core dependencies
pip install -r requirements.txt

# Development dependencies (optional)
pip install -r requirements-dev.txt
```

### Download Pre-trained Models

```bash
python scripts/download_models.py
```

This downloads:
- `bert-base-uncased` (110M parameters)
- `t5-base` (220M parameters)
- VADER lexicon
- spaCy `en_core_web_sm`

---

## ⚙️ Configuration

### Environment Variables

Create `.env` file:

```bash
cp .env.example .env
```

Edit `.env`:

```bash
# Flask Configuration
FLASK_APP=app
FLASK_ENV=development
FLASK_DEBUG=True

# Server Configuration
HOST=0.0.0.0
PORT=5000

# Model Configuration
MODEL_DIR=./models
USE_GPU=False
MAX_BATCH_SIZE=16

# API Configuration
API_TIMEOUT=30
MAX_CONTENT_LENGTH=5242880  # 5MB

# Logging
LOG_LEVEL=INFO
LOG_FILE=logs/ai-service.log

# Backend Integration
BACKEND_URL=http://localhost:8080
```

---

## 📡 API Documentation

### Base URL

```
http://localhost:5000/api
```

### Endpoints

#### POST /api/classify
**Description**: Classify comment into tags

**Request Body**:
```json
{
  "text": "Great teamwork! Always helps others understand complex topics."
}
```

**Response**:
```json
{
  "tags": ["Constructive", "Specific", "Polite"],
  "confidence": {
    "Constructive": 0.92,
    "Specific": 0.87,
    "Polite": 0.95
  },
  "processing_time_ms": 145
}
```

#### POST /api/analyze_sentiment
**Description**: Analyze sentiment and usefulness

**Request Body**:
```json
{
  "text": "You did okay."
}
```

**Response**:
```json
{
  "polarity_score": 0.45,
  "usefulness_score": 25,
  "flagged": true,
  "sentiment": "NEUTRAL",
  "metrics": {
    "length": 13,
    "specificity": 0.2,
    "constructiveness": 0.3
  }
}
```

#### POST /api/summarize
**Description**: Generate feedback summary

**Request Body**:
```json
{
  "comments": [
    "Excellent communication skills and teamwork.",
    "Always willing to help teammates.",
    "Could improve time management.",
    "Very creative problem solver."
  ]
}
```

**Response**:
```json
{
  "summary": {
    "strengths": "Peers consistently praised excellent communication, teamwork, and creative problem-solving abilities.",
    "weaknesses": "Time management was identified as an area needing improvement.",
    "themes": ["Collaborative", "Creative", "Helpful"]
  },
  "comment_count": 4,
  "processing_time_ms": 1823
}
```

---

## 🤖 Models

### 1. Comment Classifier

**Base Model**: `bert-base-uncased`  
**Fine-tuned on**: 10,000 academic peer reviews  
**Accuracy**: 89.3%

**Tag Categories**:
- ✅ Constructive
- ❌ Vague
- 🚫 Off-topic
- 😊 Polite
- 📊 Specific

### 2. Sentiment Analyzer

**Components**:
- **VADER**: Rule-based (compound score -1 to 1)
- **TextBlob**: Statistical (polarity -1 to 1)
- **Custom Scorer**: Length + keyword analysis

**Usefulness Score Formula**:
```python
usefulness = (
    0.3 * length_score +
    0.4 * specificity_score +
    0.3 * constructiveness_score
) * 100
```

### 3. Summarizer

**Base Model**: `t5-base`  
**Max Input**: 512 tokens (≈ 20 comments)  
**Max Output**: 150 tokens

**Prompt Template**:
```
Summarize the following peer feedback into strengths, 
weaknesses, and common themes: [comments]
```

---

## 📊 Performance

### Benchmarks (CPU: Intel i7-12700K)

| Endpoint              | Avg. Latency | Throughput     |
|-----------------------|--------------|----------------|
| `/classify`           | 145ms        | 40 req/sec     |
| `/analyze_sentiment`  | 85ms         | 70 req/sec     |
| `/summarize`          | 1.8s         | 3 req/sec      |

### GPU Acceleration (NVIDIA RTX 3080)

| Endpoint              | Avg. Latency | Speedup |
|-----------------------|--------------|---------|
| `/classify`           | 35ms         | 4.1x    |
| `/summarize`          | 420ms        | 4.3x    |

---

## 🚀 Running the Service

### Development Mode

```bash
# Start Flask dev server
python -m flask run --host=0.0.0.0 --port=5000

# With auto-reload
FLASK_DEBUG=1 python -m flask run
```

### Production Mode

```bash
# Using Gunicorn (recommended)
gunicorn -c gunicorn_config.py app:create_app()

# With 4 workers
gunicorn -w 4 -b 0.0.0.0:5000 app:create_app()
```

### Docker

```bash
# Build image
docker build -t apeer-ai-service .

# Run container
docker run -p 5000:5000 \
  -e USE_GPU=False \
  apeer-ai-service

# With GPU support
docker run --gpus all -p 5000:5000 \
  -e USE_GPU=True \
  apeer-ai-service
```

---

## 🧪 Testing

### Run All Tests

```bash
pytest tests/
```

### Test Specific Module

```bash
pytest tests/test_classifier.py -v
```

### Test with Coverage

```bash
pytest --cov=app tests/
```

### Manual API Testing

```bash
# Classify endpoint
curl -X POST http://localhost:5000/api/classify \
  -H "Content-Type: application/json" \
  -d '{"text": "Great work on the project!"}'

# Sentiment endpoint
curl -X POST http://localhost:5000/api/analyze_sentiment \
  -H "Content-Type: application/json" \
  -d '{"text": "Could be better."}'
```

---

## 🔧 Troubleshooting

### Common Issues

**Issue**: Out of memory during inference
```python
# Reduce batch size in config
MAX_BATCH_SIZE=8  # default 16
```

**Issue**: Model download fails
```bash
# Manually download models
python -c "from transformers import AutoModel; AutoModel.from_pretrained('bert-base-uncased')"
```

**Issue**: CUDA not detected
```bash
# Check PyTorch CUDA
python -c "import torch; print(torch.cuda.is_available())"

# Reinstall with CUDA support
pip install torch==2.0.0+cu118 --extra-index-url https://download.pytorch.org/whl/cu118
```

---

## 📚 Resources

- [Hugging Face Transformers](https://huggingface.co/docs/transformers)
- [Flask Documentation](https://flask.palletsprojects.com/)
- [VADER Sentiment](https://github.com/cjhutto/vaderSentiment)
- [spaCy NLP](https://spacy.io/)

---

## 🔮 Future Enhancements

- [ ] Real-time streaming inference
- [ ] Multi-language support (Tagalog, Spanish)
- [ ] Advanced bias detection algorithms
- [ ] GPT-4 integration for summarization
- [ ] Model versioning and A/B testing

---

## 📄 License

Part of the APEER academic project © 2025

---

<div align="center">

**Built with 🧠 by the APEER AI Team**

</div>

