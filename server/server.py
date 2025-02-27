from flask import Flask, request, jsonify, redirect, url_for
from flask_login import LoginManager, UserMixin, login_user, logout_user, login_required, current_user
from flask_cors import CORS
import firebase_admin
from firebase_admin import credentials, auth, firestore
import os
import sys
import functools
import random 
import schedule
import time
import threading
from datetime import datetime, timedelta
import requests
from google import genai
import json
from google.genai import types

aiClient = genai.Client(api_key="your_api_key")
try:
    firebase_cred_path = os.environ.get('FIREBASE_CREDENTIALS', 'firebase-credentials.json')
    
    if not os.path.exists(firebase_cred_path):
        print(f"Firebase credentials file not found at {firebase_cred_path}")
        sys.exit(1)
    
    cred = credentials.Certificate(firebase_cred_path)
    firebase_admin.initialize_app(cred)
    
  
    db = firestore.client()
except Exception as e:
    print(f"Error initializing Firebase Admin SDK: {e}")
    sys.exit(1)

app = Flask(__name__)
CORS(app, supports_credentials=True)
app.secret_key = os.urandom(24)  


login_manager = LoginManager()
login_manager.init_app(app)
login_manager.login_view = 'login'

class User(UserMixin):
    def __init__(self, id, username, email):
        self.id = id
        self.username = username
        self.email = email

def firebase_login_required(f):
    @functools.wraps(f)
    def decorated_function(*args, **kwargs):
        
        auth_header = request.headers.get('Authorization')
        if not auth_header:
            return jsonify({"error": "No token provided"}), 401
        
        
        try:
            id_token = auth_header.split('Bearer ')[1]
        except IndexError:
            return jsonify({"error": "Invalid token format"}), 401
        
        try:
            
            decoded_token = auth.verify_id_token(id_token)
            uid = decoded_token['uid']
           
            user_ref = db.collection('users').document(uid)
            user_doc = user_ref.get()
            
            if not user_doc.exists:
                return jsonify({"error": "User not found in database"}), 404
            
          
            user_data = user_doc.to_dict()
            current_user = User(uid, user_data.get('username', ''), user_data.get('email', ''))
            login_user(current_user)
            
            return f(*args, **kwargs)
        except auth.InvalidIdTokenError:
            return jsonify({"error": "Invalid token"}), 401
        except auth.ExpiredIdTokenError:
            return jsonify({"error": "Token expired"}), 401
    
    return decorated_function

@login_manager.user_loader
def load_user(user_id):
    try:
        user_ref = db.collection('users').document(user_id)
        user_doc = user_ref.get()
        
        if user_doc.exists:
            user_data = user_doc.to_dict()
            return User(user_id, user_data.get('username', ''), user_data.get('email', ''))
        return None
    except Exception as e:
        print(f"Error loading user: {e}")
        return None


@app.route('/verify-token', methods=['POST'])
def verify_token():
    token = request.json.get('token')
    if not token:
        return jsonify({"status": "error", "message": "No token provided"}), 400
    
    try:
       
        decoded_token = auth.verify_id_token(token)
        uid = decoded_token['uid']
        
       
        user_ref = db.collection('users').document(uid)
        user_doc = user_ref.get()
        
        if not user_doc.exists:
            return jsonify({"status": "error", "message": "User not found"}), 404
        
      
        user_data = user_doc.to_dict()
        user = User(uid, user_data.get('username', ''), user_data.get('email', ''))
        login_user(user)
        
        return jsonify({
            "status": "success", 
            "message": "Token verified successfully",
            "uid": uid,
            "username": user_data.get('username', '')
        })
    except Exception as e:
        print(f"Token verification failed: {e}")
        return jsonify({"status": "error", "message": "Invalid token"}), 401

@app.route('/create-user', methods=['POST'])
def create_user():
    data = request.json
    uid = data.get('uid')
    email = data.get('email')
    username = data.get('username')
    
    if not uid or not email or not username:
        return jsonify({"status": "error", "message": "Missing required fields"}), 400
    
    try:

        user_ref = db.collection('users').document(uid)
        user_ref.set({
            'email': email,
            'username': username,
            'created_at': firestore.SERVER_TIMESTAMP,
            'last_login': firestore.SERVER_TIMESTAMP,
            
           
            'age': 0,  
            'height': 0,  
            'weight': 0,  
            'exercise': 'Not specified',  
            
           
            'profile_complete': False,
            'fitness_goals': [],
            'preferred_workout_types': [],
            
          
            'total_workouts': 0,
            'last_workout_date': None,
            
       
            'units': {
                'weight': 'kg',
                'height': 'cm'
            },

            'diet_info':{
                'goal': '',
                'calories_goal': 2000,
                'carbs': 0,
                'proteins': 0,
                'fats': 0,
                'calories_left': 2000,
                'food_eaten': []
            },

            'exercise_info':{
                'schedule': [],
                'todays_exercise':{
                    'exercises':[]
                },
                'steps': random.randint(0, 20000),
                'calories_burned': random.randint(0, 2000),
                'active_time': random.randint(0, 20000)
            },

        })
        
        return jsonify({
            "status": "success", 
            "message": "User created successfully",
            "uid": uid
        })
    except Exception as e:
        print(f"Error creating user: {e}")
        return jsonify({
            "status": "error", 
            "message": "Failed to create user"
        }), 500

@app.route('/update-user', methods=['POST'])
@firebase_login_required
def update_user():
    data = request.json
    
    try:
       
        user_ref = db.collection('users').document(current_user.id)
        update_data = {}
        
        if 'username' in data:
            update_data['username'] = data['username']
        
        if update_data:
            user_ref.update(update_data)
        
        return jsonify({
            "status": "success", 
            "message": "User updated successfully"
        })
    except Exception as e:
        print(f"Error updating user: {e}")
        return jsonify({"status": "error", "message": "Failed to update user"}), 500

@app.route('/send-ai-chat' , methods=['POST'])
@firebase_login_required
def send_ai_chat():
    try:
        data = request.json
        user_id = current_user.id
        message = data['message']
        chat_ref = db.collection('user_chats').document(user_id)
        chat_doc = chat_ref.get()
        
        if not chat_doc.exists:
            chat_ref.set({'messages': []})
            chat_history = []
        else:
            chat_history = chat_doc.to_dict().get('messages', [])
        
        chat_history.append({'role': 'user', 'content': message})
        instruction = open("ai.txt", "r").read()
        chat_context = ""
        for msg in chat_history[-10:]: 
            chat_context += f"{'User' if msg['role'] == 'user' else 'Assistant'}: {msg['content']}\n"
        full_prompt = f"{chat_context}\nUser: {message}"
        
        response = aiClient.models.generate_content(
            model="gemini-1.5-flash-001",
            config=types.GenerateContentConfig(system_instruction=instruction),
            contents=full_prompt
        )
        
        ai_response = json.loads(response.text)
        chat_history.append({'role': 'assistant', 'content': ai_response})
        
        chat_ref.update({'messages': chat_history})
        
        return ai_response
    except Exception as e:
        print(f"Error in send_ai_chat: {e}")
        return jsonify({"error": "An error occurred processing your request"}), 500

@app.route('/generate-workout-plan' , methods=['POST'])
@firebase_login_required
def generate_workout_plan():
    try:
        data = request.json
        instruction = open("ai.txt", "r").read()
        workoutRotation = generateWorkoutPlan(data)
        
       
        user_ref = db.collection('users').document(current_user.id)
        
      
        first_day = workoutRotation.json[0] if workoutRotation.json else {'exercises': []}
        
        
        for i, exercise in enumerate(first_day['exercises']):
            if 'id' not in exercise:
                exercise['id'] = f"{exercise['exercises_type'].lower()}-{i+1}"
        
        
        user_ref.update({
            'exercise_info': {
                'schedule': workoutRotation.json,  
                'todays_exercise': {
                    'exercises': first_day['exercises']
                },
            }
        })
        
        return workoutRotation
    except Exception as e:
        print(e)
        return jsonify({"error": "An error occurred processing your request"}), 500

def generateWorkoutPlan(workoutData):
    gymInstruction = open("workout.txt", "r").read()
    exercise = []
    print("here")
    print(workoutData['workout']['split_rotation'])
    for x in workoutData['workout']['split_rotation']:
        print(x)
        if(x == "REST"):
            continue
        response = aiClient.models.generate_content(
        model="gemini-1.5-flash-001",
        contents=gymInstruction +"\nWorkout SPLIT: " + x,
        config=types.GenerateContentConfig(
            max_output_tokens=1024,
            temperature=0.1
        ),
        )
        exercise.append(json.loads(response.text))
    
    print(exercise)
    return jsonify( exercise)

@app.route('/todays-exercise-completion', methods=['PUT'])
@firebase_login_required
def todays_exercise_completion():
    try:
        user_ref = db.collection('users').document(current_user.id)
        user_doc = user_ref.get()
        
        if not user_doc.exists:
            return jsonify({"status": "error", "message": "User not found"}), 404
        
        user_data = user_doc.to_dict()
        exercise_info = user_data.get('exercise_info', {})
        schedule = exercise_info.get('schedule', [])
        todays_exercise = exercise_info.get('todays_exercise', {})

        print(schedule)
        
        
        current_index = schedule.index(todays_exercise) if todays_exercise in schedule else -1
        next_index = (current_index + 1) % len(schedule) if schedule else current_index
        
        user_ref.update({
            'exercise_info': {
                'schedule': schedule,
                'todays_exercise': schedule[next_index]
            }
        })
        
        return jsonify({
            "status": "success", 
            "message": "Today's exercise shifted to the next one"
        })
    except Exception as e:
        print(f"Error shifting today's exercise: {e}")
        return jsonify({"status": "error", "message": "Failed to shift today's exercise"}), 500
   


@app.route('/user-profile')
@firebase_login_required
def get_user_profile():
    try:
        user_ref = db.collection('users').document(current_user.id)
        user_doc = user_ref.get()
        
        if not user_doc.exists:
            return jsonify({"status": "error", "message": "User not found"}), 404
        
        user_data = user_doc.to_dict()
        return jsonify({
            "status": "success",
            "user": {
                "id": current_user.id,
                "email": user_data.get('email', ''),
                "username": user_data.get('username', '')
            }
        })
    except Exception as e:
        print(f"Error fetching user profile: {e}")
        return jsonify({"status": "error", "message": "Failed to fetch user profile"}), 500

@app.route('/protected-route')
@firebase_login_required
def protected_route():
    return jsonify({
        "message": "This is a protected route", 
        "user": current_user.id
    })

@app.route('/dashboard-data')
@firebase_login_required
def dashboard_data():
    return jsonify({
        "user_id": current_user.id,
        "dashboard_info": "Sensitive user dashboard data"
    })

@app.route('/workout-data')
@firebase_login_required
def workout_data():
    return jsonify({
        "workouts": [
            {"id": 1, "name": "Morning Workout"},
            {"id": 2, "name": "Evening Workout"}
        ]
    })

@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')
    
    user = users.get(username)
    if user and check_password_hash(user.password_hash, password):
        login_user(user)
        return jsonify({"status": "success", "message": "Logged in successfully"})
    
    return jsonify({"status": "error", "message": "Invalid credentials"}), 401

@app.route('/logout')
@login_required
def logout():
    logout_user()
    return jsonify({"status": "success", "message": "Logged out successfully"})

@app.route('/index')
@login_required
def index():
    return {"index": f"Hello, {current_user.username}!", "version": "1.0.0", "status": "OK"}

@app.route('/protected')
@login_required
def protected():
    return jsonify({
        "message": "This is a protected route", 
        "user": current_user.id
    })

@app.route('/update-user-profile', methods=['POST'])
@firebase_login_required
def update_user_profile():
    data = request.json
    
    try:
   
        update_fields = {}
        
       
        optional_fields = ['age', 'height', 'weight', 'exercise']
        
        for field in optional_fields:
            if field in data:
                update_fields[field] = data[field]
        
        if not update_fields:
            return jsonify({
                "status": "error", 
                "message": "No valid fields to update"
            }), 400
        
        user_ref = db.collection('users').document(current_user.id)
        

        user_ref.update(update_fields)
        
        return jsonify({
            "status": "success", 
            "message": "User profile updated successfully",
            "updated_fields": list(update_fields.keys())
        })
    except Exception as e:
        print(f"Error updating user profile: {e}")
        return jsonify({
            "status": "error", 
            "message": "Failed to update user profile"
        }), 500

@app.route('/get-user-profile')
@firebase_login_required
def get_detailed_user_profile():
    try:
        user_ref = db.collection('users').document(current_user.id)
        user_doc = user_ref.get()
        
        if not user_doc.exists:
            return jsonify({
                "status": "error", 
                "message": "User not found"
            }), 404
        
        user_data = user_doc.to_dict()
    
        profile_data = {
            "id": current_user.id,
            "email": user_data.get('email', ''),
            "username": user_data.get('username', ''),
            "age": user_data.get('age'),
            "height": user_data.get('height'),
            "weight": user_data.get('weight'),
            "exercise": user_data.get('exercise'),
            "diet_info": user_data.get('diet_info', {}),
            "exercise_info": user_data.get('exercise_info', {})
        }
        
        return jsonify({
            "status": "success",
            "user": profile_data
        })
    except Exception as e:
        print(f"Error fetching detailed user profile: {e}")
        return jsonify({
            "status": "error", 
            "message": "Failed to fetch user profile"
        }), 500

@app.route('/get-workouts')
@firebase_login_required
def get_workouts():
    try:
        # Get the user document
        user_ref = db.collection('users').document(current_user.id)
        user_doc = user_ref.get()
        
        if not user_doc.exists:
            return jsonify({
                "status": "error",
                "message": "User not found"
            }), 404

        # Get the exercise_info directly from the user document
        user_data = user_doc.to_dict()
        exercise_info = user_data.get('exercise_info', {})
        
        response_data = {
            "status": "success",
            "active_time": exercise_info.get('active_time', 0),
            "calories_burned": exercise_info.get('calories_burned', 0),
            "schedule": exercise_info.get('schedule', []),
            "steps": exercise_info.get('steps', 0),
            "todays_exercise": exercise_info.get('todays_exercise', {}),
        }

        print(response_data)

        return jsonify(response_data)

    except Exception as e:
        print(f"Error fetching workouts: {e}")
        return jsonify({
            "status": "error", 
            "message": "Failed to fetch workouts"
        }), 500

@app.route('/user-data')
@firebase_login_required
def get_user_data():
    try:
       
        user_ref = db.collection('users').document(current_user.id)
        user_doc = user_ref.get()
        
        if not user_doc.exists:
            return jsonify({
                "status": "error", 
                "message": "User not found"
            }), 404
        
     
        user_data = user_doc.to_dict()
        
        
        workouts_ref = user_ref.collection('workouts')
        workouts_docs = workouts_ref.stream()
        workouts = [
            {**doc.to_dict(), 'id': doc.id} 
            for doc in workouts_docs
        ]
        
    
        response_data = {
            "status": "success",
            "user": {
                "id": current_user.id,
                "email": user_data.get('email', ''),
                "username": user_data.get('username', ''),
                "age": user_data.get('age'),
                "height": user_data.get('height'),
                "weight": user_data.get('weight'),
                "exercise": user_data.get('exercise'),
                "diet_info": user_data.get('diet_info', {}),
                "exercise_info": user_data.get('exercise_info', {}),
            },
            "workouts": workouts
        }
        
        return jsonify(response_data)
    except Exception as e:
        print(f"Error fetching user data: {e}")
        return jsonify({
            "status": "error", 
            "message": "Failed to fetch user data"
        }), 500

@app.route('/add-food-item', methods=['POST'])
@firebase_login_required
def add_food_item():
    try:
     
        uid = current_user.id
        
       
        food_item = request.json
        
       
        standardized_food_item = {
            'id': food_item.get('id', str(firestore.SERVER_TIMESTAMP)),  
            'name': food_item.get('name', ''),
            'timestamp': food_item.get('timestamp', firestore.SERVER_TIMESTAMP),
            'calories': food_item.get('calories', 0),
            'proteins': food_item.get('proteins', 0),
            'carbs': food_item.get('carbs', 0),
            'fats': food_item.get('fats', 0),
        }
        
      
        if not standardized_food_item['name']:
            return jsonify({"error": "Food name is required"}), 400
        
      
        user_ref = db.collection('users').document(uid)
        
       
        user_ref.update({
            'diet_info.food_eaten': firestore.ArrayUnion([standardized_food_item])
        })
        
      
        updated_user_doc = user_ref.get()
        updated_user_data = updated_user_doc.to_dict()
        
      
        print("fetching data")
        diet_info = updated_user_data.get('diet_info', {})
        print("adding Calories")

        
        calories_left = 2000 - sum(item.get('calories', 0) for item in diet_info.get('food_eaten', []))
        
        total_proteins = sum(item.get('proteins', 0) for item in diet_info.get('food_eaten', []))
        print("Added Proteins")
        total_carbs = sum(item.get('carbs', 0) for item in diet_info.get('food_eaten', []))
        print("Added Carbs")
        total_fats = sum(item.get('fats', 0) for item in diet_info.get('food_eaten', []))
        print("Added Fats")
        
        print("Debug - Food Eaten:", diet_info.get('food_eaten', []))
        print("Debug - Total Proteins:", total_proteins)
        print("Debug - Total Carbs:", total_carbs)
        print("Debug - Total Fats:", total_fats)
        print("Debug - Calories Left:", calories_left)
        
        
        user_ref.update({
            'diet_info.calories_left':  calories_left,
            'diet_info.proteins': total_proteins,
            'diet_info.carbs': total_carbs,
            'diet_info.fats': total_fats
        })
        
      
        final_user_doc = user_ref.get()
        final_user_data = final_user_doc.to_dict()
        
        response_data = {
            'user': {
                'id': uid,
                'email': final_user_data.get('email', ''),
                'username': final_user_data.get('username', ''),
                'diet_info': final_user_data.get('diet_info', {})
            },
            'workouts': []  
        }
        
        return jsonify(response_data), 200
    
    except Exception as e:
        print(f"Error adding food item: {e}")
        return jsonify({"error": "Failed to add food item", "details": str(e)}), 500

def reset_daily_metrics():
    """
    Reset daily metrics for all users in the database.
    This includes:
    1. Resetting calories_left to daily calorie goal
    2. Clearing food_eaten list
    3. Resetting exercise-related metrics
    """
    try:

        users_ref = db.collection('users')
        users = users_ref.stream()

        for user_doc in users:
            user_data = user_doc.to_dict()
            
           
            if not user_data.get('diet_info') or not user_data.get('exercise_info'):
                continue

           
            diet_info = user_data['diet_info']
            diet_info['calories_left'] = diet_info.get('calories_goal', 0)  
            diet_info['food_eaten'] = []  
            diet_info['proteins'] = 0
            diet_info['carbs'] = 0
            diet_info['fats'] = 0

            
            exercise_info = user_data['exercise_info']
            exercise_info['calories_burned'] = 0
            exercise_info['active_time'] = 0

          
            users_ref.document(user_doc.id).update({
                'diet_info': diet_info,
                'exercise_info': exercise_info,
                'last_daily_reset': firestore.SERVER_TIMESTAMP
            })

        print(f"Daily reset completed at {datetime.now()}")
    except Exception as e:
        print(f"Error during daily reset: {e}")

def start_daily_reset_scheduler():
    """
    Start a background thread to run daily reset
    """
    def run_schedule():
        schedule.every().day.at("13:00").do(reset_daily_metrics)
        while True:
            schedule.run_pending()
            time.sleep(1)

    
    scheduler_thread = threading.Thread(target=run_schedule, daemon=True)
    scheduler_thread.start()

start_daily_reset_scheduler()

if __name__ == '__main__':
    app.run(debug=True)