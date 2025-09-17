import pandas as pd
import numpy as np
import json
from datetime import datetime, timedelta

# Set random seed for reproducibility
np.random.seed(42)

# Generate synthetic student data
def generate_student_data(n_students=150):
    """Generate synthetic student dataset with cognitive skills and performance metrics"""
    
    # Student basic info
    student_ids = [f"STU{str(i).zfill(4)}" for i in range(1, n_students + 1)]
    names = [
        "Emma Johnson", "Liam Smith", "Olivia Brown", "Noah Davis", "Ava Wilson",
        "Ethan Moore", "Sophia Taylor", "Mason Anderson", "Isabella Thomas", "William Jackson",
        "Mia White", "James Harris", "Charlotte Martin", "Benjamin Thompson", "Amelia Garcia",
        "Lucas Martinez", "Harper Robinson", "Henry Clark", "Evelyn Rodriguez", "Alexander Lewis",
        "Abigail Lee", "Michael Walker", "Emily Hall", "Daniel Allen", "Elizabeth Young",
        "Matthew Hernandez", "Sofia King", "Joseph Wright", "Avery Lopez", "Samuel Hill",
        "Ella Scott", "David Green", "Scarlett Adams", "Carter Baker", "Grace Gonzalez",
        "Owen Nelson", "Chloe Carter", "Wyatt Mitchell", "Lily Perez", "Jack Roberts",
        "Aria Turner", "Luke Phillips", "Nora Campbell", "Grayson Parker", "Hazel Evans",
        "Leo Edwards", "Violet Collins", "Jayden Stewart", "Aurora Sanchez", "Gabriel Morris",
        "Zoey Rogers", "Julian Reed", "Penelope Cook", "Mateo Bailey", "Layla Rivera",
        "Anthony Cooper", "Riley Richardson", "Jaxon Cox", "Norah Howard", "Lincoln Ward",
        "Ellie Torres", "Joshua Peterson", "Lillian Gray", "Christopher Ramirez", "Addison James",
        "Andrew Watson", "Natalie Brooks", "Theodore Kelly", "Hannah Sanders", "Caleb Price",
        "Brooklyn Bennett", "Ryan Wood", "Zoe Barnes", "Nathan Ross", "Leah Henderson",
        "Isaac Coleman", "Audrey Jenkins", "Thomas Perry", "Stella Powell", "Landon Long",
        "Maya Patterson", "Jordan Hughes", "Claire Flores", "Dominic Washington", "Savannah Butler",
        "Nicholas Simmons", "Anna Foster", "Evan Gonzales", "Caroline Bryant", "Connor Alexander",
        "Genesis Russell", "Jeremiah Griffin", "Samantha Diaz", "Cameron Hayes", "Maria Myers",
        "Adrian Ford", "Josephine Hamilton", "Robert Graham", "Heidi Sullivan", "Angel Wallace",
        "Lucy Woods", "Brayden Cole", "Aubrey West", "Greyson Jordan", "Piper Owens",
        "Jose Reynolds", "Ruby Fisher", "Jace Ellis", "Alice Boyd", "Colton Grant",
        "Cora Stone", "Easton Morales", "Jade Webb", "Nolan Tucker", "Remi Crawford"
    ]
    
    # Extend names if needed
    while len(names) < n_students:
        names.extend(names[:min(50, n_students - len(names))])
    
    classes = np.random.choice(['10A', '10B', '10C', '11A', '11B', '11C', '12A', '12B', '12C'], n_students)
    
    # Generate correlated cognitive skills (0-100 scale)
    # Base cognitive abilities with some correlation
    base_ability = np.random.normal(70, 15, n_students)
    base_ability = np.clip(base_ability, 30, 95)
    
    # Comprehension (slightly correlated with base ability)
    comprehension = base_ability + np.random.normal(0, 8, n_students)
    comprehension = np.clip(comprehension, 20, 100)
    
    # Attention (moderately correlated with comprehension)
    attention = 0.6 * comprehension + np.random.normal(20, 12, n_students)
    attention = np.clip(attention, 15, 100)
    
    # Focus (highly correlated with attention)
    focus = 0.7 * attention + np.random.normal(15, 10, n_students)
    focus = np.clip(focus, 10, 100)
    
    # Retention (correlated with comprehension and focus)
    retention = 0.4 * comprehension + 0.3 * focus + np.random.normal(20, 10, n_students)
    retention = np.clip(retention, 25, 100)
    
    # Assessment score (strongly correlated with all cognitive skills)
    assessment_score = (
        0.25 * comprehension + 
        0.20 * attention + 
        0.25 * focus + 
        0.30 * retention + 
        np.random.normal(0, 8, n_students)
    )
    assessment_score = np.clip(assessment_score, 30, 100)
    
    # Engagement time (correlated with attention and focus)
    engagement_time = (
        0.4 * attention + 
        0.4 * focus + 
        np.random.normal(20, 15, n_students)
    )
    engagement_time = np.clip(engagement_time, 10, 120)  # minutes
    
    # Create DataFrame
    df = pd.DataFrame({
        'student_id': student_ids,
        'name': names[:n_students],
        'class': classes,
        'comprehension': np.round(comprehension, 1),
        'attention': np.round(attention, 1),
        'focus': np.round(focus, 1),
        'retention': np.round(retention, 1),
        'assessment_score': np.round(assessment_score, 1),
        'engagement_time': np.round(engagement_time, 1)
    })
    
    return df

# Generate the dataset
print("Generating synthetic student dataset...")
student_data = generate_student_data(150)

# Save to CSV
student_data.to_csv('student_data.csv', index=False)

# Save to JSON for web app
student_data_json = student_data.to_dict('records')
with open('student_data.json', 'w') as f:
    json.dump(student_data_json, f, indent=2)

print(f"Generated dataset with {len(student_data)} students")
print("\nDataset preview:")
print(student_data.head())

print("\nDataset statistics:")
print(student_data.describe())

print("\nCorrelation matrix:")
numeric_cols = ['comprehension', 'attention', 'focus', 'retention', 'assessment_score', 'engagement_time']
print(student_data[numeric_cols].corr().round(3))

print("\nDataset saved as 'student_data.csv' and 'student_data.json'")
