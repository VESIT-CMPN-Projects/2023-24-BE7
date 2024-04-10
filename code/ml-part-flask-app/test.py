import pandas as pd
from flask import Flask, request
from sklearn.ensemble import RandomForestClassifier
from sklearn.preprocessing import MinMaxScaler
from sklearn.feature_selection import SelectKBest, f_classif
from sklearn.model_selection import train_test_split

app = Flask(__name__)

# Load the data
df1 = pd.read_csv('healthcare-dataset-stroke.csv')
df2 = pd.read_csv('Stroke_analysis1.csv')

# Data preprocessing
df2['age'] = df2['age'].astype(int)
df1.drop(columns=['gender','avg_glucose_level','bmi','smoking_status'], inplace=True)
df2.drop(columns=['Unnamed: 0','mrs','paralysis','cholestrol','tos'], inplace=True)
merged_df = pd.merge(df1, df2, on='age')
merged_df.drop(columns=['pid'], inplace=True)
merged_df.dropna(inplace=True)

# One-hot encode categorical variables
merged_df = pd.get_dummies(merged_df)

# Define features and target
X = merged_df.drop(columns=['risk'])  # Exclude the target column
y = merged_df['risk']

# Initialize MinMaxScaler
scaler = MinMaxScaler()
scaled_data = scaler.fit_transform(X)

# Select top k features using ANOVA F-value
selector_anova = SelectKBest(f_classif, k=10)
X_selected_anova = selector_anova.fit_transform(scaled_data, y)
feature_names = X.columns.tolist()
selected_feature_indices = selector_anova.get_support(indices=True)
selected_feature_names = [feature_names[index] for index in selected_feature_indices]

# Step 1: Create feature matrix with selected features
X_selected_features = scaled_data[:, selected_feature_indices]  # Assuming X_scaled is your preprocessed feature matrix

# Step 2: Split data into training and testing sets
X_train, X_test, y_train, y_test = train_test_split(X_selected_features, y, test_size=0.2, random_state=42)

# Initialize Random Forest classifier
model = RandomForestClassifier(n_estimators=50, max_depth=5, min_samples_split=10, min_samples_leaf=5, random_state=42)

# Train the model
model.fit(X_train, y_train)

@app.route('/')
def home():
    return "Welcome to health-app BE project API endpoint"

@app.route('/predict', methods=['POST'])
def predict():
    if request.method == 'POST':
        data = request.json;

        # Get user input from the form
        age = float(data['age'])
        hypertension = int(data['hypertension'])
        heart_disease = int(data['heart_disease'])
        nhiss = float(data['nhiss'])
        systolic = float(data['systolic'])
        distolic = float(data['distolic'])
        glucose = float(data['glucose'])
        bmi = float(data['bmi'])
        smoking = int(data['smoking'])
        ever_married = int(data['ever_married'])
        work_type = data['work_type']
        residence_type = data['residence_type']
        gender = data['gender']
        
        # Create user input as DataFrame
        user_input = pd.DataFrame({
            'age': [age],
            'hypertension': [hypertension],
            'heart_disease': [heart_disease],
            'nhiss': [nhiss],
            'systolic': [systolic],
            'distolic': [distolic],
            'glucose': [glucose],
            'bmi': [bmi],
            'smoking': [smoking],
            'ever_married': [ever_married],
            'work_type': [work_type],
            'residence_type': [residence_type],
            'gender': [gender]
        })
        
        # One-hot encode categorical variables
        user_input = pd.get_dummies(user_input)
        
        # Ensure all columns present, if not, add them with default value 0
        missing_columns = set(X.columns) - set(user_input.columns)
        for col in missing_columns:
            user_input[col] = 0
        
        # Reorder columns to match X
        user_input = user_input[X.columns]
        
        # Scale the input data
        scaled_input = scaler.transform(user_input)
        
        # Select features
        X_selected_input = scaled_input[:, selected_feature_indices]
        
        # Make prediction
        prediction = model.predict(X_selected_input)
        
        # Map prediction to stroke risk level
        stroke_risk = {0: 'No stroke', 1: 'Low risk', 2: 'Moderate Risk', 3: 'High Risk'}
        return stroke_risk[prediction[0]]


if __name__ == '__main__':
    app.run(debug=True)
