# 🚀 Beyond - Fitness Tracking Web Application (On-Going)
## Tech Stack
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

Beyond - Fitness Tracking Web Application is a modern, scalable solution designed to help users monitor their fitness routines, track progress, and manage workouts efficiently. Built with a secure **_authentication_**, robust and **_decoupled architecture_**, it combines the flexibility of **_Python and Flask_** on the backend with the dynamic user interface of **_React_** on the frontend, all powered by **_Firebase_** for seamless **_cloud integration_**. 

> [!NOTE]
> **_You can check out my live demo [here](https://gymapp-d2c36.web.app/)._**
## Features 
### Calorie and Macro Tracker
This app will track your calorie and macro intake on the day to day bases and keep a the food history for the day. Food history, calorie, and macro intake will be reset to zero everyday.
### Apple Health and Google Fit Integration
**Coming Soon**
### Workout Planner
**Coming Soon**
### AI Diet and Workout Suggestion
**Coming Soon**

## Want to run this localy ?
1. Clone this repository
3. Direct to the backend folder ``server/`` and run the virtual enviroment by runnning ``./venv/Scripts/activate``
4. Create and configure ``firebase-credentials.json`` file
5. Run the server by running ``python server.py``
6. In a another console direct to the frontend folder ``deployment/web/`` and host the web by using ``npm run dev`` in the console

>[!TIP]
> **To setup your firebase-credentials you will need to register to firebase and make a project to create a database private key**

