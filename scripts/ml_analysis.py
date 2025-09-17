import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestRegressor
from sklearn.linear_model import LinearRegression
from sklearn.metrics import mean_squared_error, r2_score
from sklearn.cluster import KMeans
from sklearn.preprocessing import StandardScaler
import json

# Load the generated data
print("Loading student data...")
df = pd.read_csv('student_data.csv')

print(f"Dataset shape: {df.shape}")
print("\nDataset info:")
print(df.info())

# 1. CORRELATION ANALYSIS
print("\n" + "="*50)
print("CORRELATION ANALYSIS")
print("="*50)

# Calculate correlations between cognitive skills and performance
cognitive_skills = ['comprehension', 'attention', 'focus', 'retention']
performance_metrics = ['assessment_score', 'engagement_time']

correlation_matrix = df[cognitive_skills + performance_metrics].corr()
print("\nCorrelation Matrix:")
print(correlation_matrix.round(3))

# Find strongest correlations with assessment_score
assessment_correlations = correlation_matrix['assessment_score'].drop('assessment_score').sort_values(ascending=False)
print(f"\nStrongest correlations with assessment_score:")
for skill, corr in assessment_correlations.items():
    print(f"  {skill}: {corr:.3f}")

# 2. MACHINE LEARNING MODEL
print("\n" + "="*50)
print("MACHINE LEARNING MODEL")
print("="*50)

# Prepare features and target
X = df[cognitive_skills + ['engagement_time']]
y = df['assessment_score']

# Split the data
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# Train Random Forest model
rf_model = RandomForestRegressor(n_estimators=100, random_state=42)
rf_model.fit(X_train, y_train)

# Make predictions
y_pred_rf = rf_model.predict(X_test)

# Evaluate Random Forest
rf_mse = mean_squared_error(y_test, y_pred_rf)
rf_r2 = r2_score(y_test, y_pred_rf)

print(f"Random Forest Results:")
print(f"  Mean Squared Error: {rf_mse:.3f}")
print(f"  R² Score: {rf_r2:.3f}")

# Feature importance
feature_importance = pd.DataFrame({
    'feature': X.columns,
    'importance': rf_model.feature_importances_
}).sort_values('importance', ascending=False)

print(f"\nFeature Importance:")
for _, row in feature_importance.iterrows():
    print(f"  {row['feature']}: {row['importance']:.3f}")

# Train Linear Regression for comparison
lr_model = LinearRegression()
lr_model.fit(X_train, y_train)
y_pred_lr = lr_model.predict(X_test)

lr_mse = mean_squared_error(y_test, y_pred_lr)
lr_r2 = r2_score(y_test, y_pred_lr)

print(f"\nLinear Regression Results:")
print(f"  Mean Squared Error: {lr_mse:.3f}")
print(f"  R² Score: {lr_r2:.3f}")

# 3. STUDENT CLUSTERING
print("\n" + "="*50)
print("STUDENT CLUSTERING")
print("="*50)

# Prepare data for clustering
clustering_features = cognitive_skills + ['assessment_score', 'engagement_time']
X_cluster = df[clustering_features]

# Standardize features
scaler = StandardScaler()
X_cluster_scaled = scaler.fit_transform(X_cluster)

# Perform K-means clustering
n_clusters = 4
kmeans = KMeans(n_clusters=n_clusters, random_state=42)
cluster_labels = kmeans.fit_predict(X_cluster_scaled)

# Add cluster labels to dataframe
df['learning_persona'] = cluster_labels

# Analyze clusters
print(f"Created {n_clusters} learning personas:")
for i in range(n_clusters):
    cluster_data = df[df['learning_persona'] == i]
    cluster_size = len(cluster_data)
    
    print(f"\nPersona {i+1} ({cluster_size} students):")
    print(f"  Average Assessment Score: {cluster_data['assessment_score'].mean():.1f}")
    print(f"  Average Comprehension: {cluster_data['comprehension'].mean():.1f}")
    print(f"  Average Attention: {cluster_data['attention'].mean():.1f}")
    print(f"  Average Focus: {cluster_data['focus'].mean():.1f}")
    print(f"  Average Retention: {cluster_data['retention'].mean():.1f}")
    print(f"  Average Engagement Time: {cluster_data['engagement_time'].mean():.1f} min")

# Create persona descriptions
persona_descriptions = {
    0: "High Performers - Excellent across all cognitive skills",
    1: "Focused Learners - Strong focus and retention, moderate attention",
    2: "Developing Students - Below average in most areas, need support",
    3: "Engaged Strugglers - High engagement but lower cognitive performance"
}

# Assign more meaningful persona names based on cluster characteristics
cluster_means = df.groupby('learning_persona')[clustering_features].mean()
persona_names = []

for i in range(n_clusters):
    means = cluster_means.loc[i]
    if means['assessment_score'] > 75:
        persona_names.append("High Achievers")
    elif means['engagement_time'] > 80 and means['assessment_score'] < 60:
        persona_names.append("Engaged Strugglers")
    elif means['focus'] > 70 and means['attention'] > 70:
        persona_names.append("Focused Learners")
    else:
        persona_names.append("Developing Students")

# Update persona descriptions
for i, name in enumerate(persona_names):
    print(f"\nPersona {i+1}: {name}")

# 4. GENERATE INSIGHTS
print("\n" + "="*50)
print("KEY INSIGHTS")
print("="*50)

insights = []

# Correlation insights
strongest_predictor = assessment_correlations.index[0]
strongest_correlation = assessment_correlations.iloc[0]
insights.append(f"{strongest_predictor.title()} is the strongest predictor of assessment scores (r={strongest_correlation:.3f})")

# Model performance insight
insights.append(f"Random Forest model can predict assessment scores with {rf_r2:.1%} accuracy")

# Clustering insights
high_performers = df[df['learning_persona'] == cluster_means['assessment_score'].idxmax()]
low_performers = df[df['learning_persona'] == cluster_means['assessment_score'].idxmin()]

insights.append(f"{len(high_performers)} students ({len(high_performers)/len(df)*100:.1f}%) are high performers")
insights.append(f"{len(low_performers)} students ({len(low_performers)/len(df)*100:.1f}%) need additional support")

# Engagement insight
high_engagement = df[df['engagement_time'] > df['engagement_time'].quantile(0.75)]
insights.append(f"Students with high engagement (>75th percentile) have {high_engagement['assessment_score'].mean():.1f} average score vs {df['assessment_score'].mean():.1f} overall")

print("Generated insights:")
for i, insight in enumerate(insights, 1):
    print(f"{i}. {insight}")

# 5. SAVE RESULTS
print("\n" + "="*50)
print("SAVING RESULTS")
print("="*50)

# Save enhanced dataset with clusters
df.to_csv('student_data_with_clusters.csv', index=False)

# Save model results and insights
results = {
    'model_performance': {
        'random_forest': {
            'mse': float(rf_mse),
            'r2_score': float(rf_r2)
        },
        'linear_regression': {
            'mse': float(lr_mse),
            'r2_score': float(lr_r2)
        }
    },
    'feature_importance': feature_importance.to_dict('records'),
    'correlations': correlation_matrix.to_dict(),
    'insights': insights,
    'cluster_analysis': {
        'n_clusters': n_clusters,
        'cluster_means': cluster_means.to_dict(),
        'persona_names': persona_names
    }
}

with open('analysis_results.json', 'w') as f:
    json.dump(results, f, indent=2)

# Save data for web app
web_data = {
    'students': df.to_dict('records'),
    'insights': insights,
    'correlations': correlation_matrix.to_dict(),
    'feature_importance': feature_importance.to_dict('records'),
    'model_performance': results['model_performance'],
    'cluster_analysis': results['cluster_analysis']
}

with open('dashboard_data.json', 'w') as f:
    json.dump(web_data, f, indent=2)

print("Analysis complete! Files saved:")
print("- student_data_with_clusters.csv")
print("- analysis_results.json") 
print("- dashboard_data.json")

print(f"\nDataset summary:")
print(f"- {len(df)} students analyzed")
print(f"- {n_clusters} learning personas identified")
print(f"- Model R² score: {rf_r2:.3f}")
print(f"- {len(insights)} key insights generated")
