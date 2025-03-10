# 🚀 Beyond - AI Powered Fitness Tracking Web Application (On-Going)
## Tech Stack
[![Google Gemini](https://img.shields.io/badge/Google%20Gemini-886FBF?logo=googlegemini&logoColor=fff)](#)[![Firebase](https://img.shields.io/badge/Firebase-039BE5?logo=Firebase&logoColor=white)](#)[![Google Cloud](https://img.shields.io/badge/Google%20Cloud-%234285F4.svg?logo=google-cloud&logoColor=white)](#)[![Flask](https://img.shields.io/badge/Flask-000?logo=flask&logoColor=fff)](#)[![Next.js](https://img.shields.io/badge/Next.js-black?logo=next.js&logoColor=white)](#)[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=fff)](#)[![Python](https://img.shields.io/badge/Python-3776AB?logo=python&logoColor=fff)](#)[![HTML](https://img.shields.io/badge/HTML-%23E34F26.svg?logo=html5&logoColor=white)](#)[![CSS](https://img.shields.io/badge/CSS-1572B6?logo=css3&logoColor=fff)](#)
- Infrastructure: Firebase + Google Cloud
- AI Model: Gemini 1.5 Flash
- Dataset Source: Kaggle
- Database: Firestore Database
- Backend
  - Language: Python
  - Framework: Flask
  - Authentication: Flask-Login
  - CORS Handling: Flask-CORS
  - Cloud Integration: Firebase Admin SDK
- Frontend
  - Deployment: Firebase Hosting
  - Environment: Web-based application
  - Framework: React + Vite
  - Authentication: Firebase Authentication
- Credentials Management: Firebase Credentials
- Language Used
  - Python: Backend
  - HTML,CSS,TS: Frontend
  - noSql: Firestore

Beyond - Fitness Tracking Web Application is a **_AI powered_** modern, scalable solution designed to help users monitor their fitness routines, track progress, and generate workouts efficiently. Built with a **_firebase_** infrastructure secure **_authentication_**, robust and **_decoupled architecture_**, it combines the flexibility of **_Python and Flask_** on the backend with the dynamic user interface of **_React_** on the frontend entangled with a **_noSQL_** database of Firestore Database. 

> [!NOTE]
> **_You can check out my live demo [here](https://gymapp-d2c36.web.app/)._**
## Features 
### Calorie and Macro Tracker
This app will track your calorie and macro intake on the day to day bases and keep a the food history for the day. Food history, calorie, and macro intake will be reset to zero everyday.
### Workout Generation
Trained AI will generate workouts according to the user's split
### AI Diet and Workout Suggestion
**Coming Soon**
### Apple Health and Google Fit Integration
**Coming Soon**

## Usage
1. Create an account
2. Add food to your calorie tracker manually or ask sprite to add it
3. Generate workout plan with sprite

## Want to run this localy ?
1. Clone this repository
3. Direct to the backend folder ``server/`` and run the virtual enviroment by runnning ``./venv/Scripts/activate``
4. Create and configure ``firebase-credentials.json`` file
5. Run the server by running ``python server.py``
6. In a another console direct to the frontend folder ``deployment/web/`` and host the web by using ``npm run dev`` in the console

>[!TIP]
>**to use the AI you have to create a api key from gemini AI studio**
> **To setup your firebase-credentials you will need to register to firebase and make a project to create a database private key**

