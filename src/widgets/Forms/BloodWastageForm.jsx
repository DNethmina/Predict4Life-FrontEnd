import React, { useState } from 'react';
import { FaUpload } from 'react-icons/fa';
import './PredictionForm.css';

const BloodWastageForm = () => {
  const [formData, setFormData] = useState({
    bloodGroup: '',
    city: '',
    month: '',
    season: '',
    temperature: '',
    humidity: '',
    storageCondition: '',
    transportationTime: '',
    processingDelay: '',
    qualityControl: '',
    inventoryAge: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [response, setResponse] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();


    setIsSubmitting(true);
    setError(null);
    setResponse(null);

    try {
      const res = await fetch('http://localhost:8080/api/ml/usage', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Prediction failed');
      setResponse(data);
    } catch (error) {
      console.error('Error submitting form:', error);
      setError('Something went wrong. Please try again.');
    }
    setIsSubmitting(false);
  };

  const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
  const cities = ['Colombo', 'Gampaha', 'Kalutara', 'Kandy', 'Matale', 'Nuwara Eliya'];
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  const seasons = ['Dry', 'Wet', 'Intermediate'];
  const storageConditions = ['Optimal', 'Sub-optimal', 'Poor'];
  const qualityLevels = ['High', 'Medium', 'Low'];

  return (
    <div className="prediction-form-wrapper">
      <form className="prediction-form" onSubmit={handleSubmit}>
        <h2>Blood Wastage Prediction</h2>
        <p className="form-description">
          Predict blood wastage based on environmental and operational factors.
        </p>

        {error && <div className="error-message">{error}</div>}

        {/* =========================== */}
        {/*       RESPONSE SECTION       */}
        {/* =========================== */}
        {response && (
          <div className="response-message">
            <h3>Prediction Result</h3>
            <p><strong>Blood Group:</strong> {response.blood_group}</p>
            <h4>Weekly Forecast for Next 3 Months:</h4>

            <div className="forecast-table">
              <table>
                <thead>
                  <tr>
                    <th>Week</th>
                    <th>Predicted Usage (Units)</th>
                  </tr>
                </thead>
                <tbody>
                  {response.weekly_forecast_next_3_months.map((value, index) => (
                    <tr key={index}>
                      <td>Week {index + 1}</td>
                      <td>{value.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        <fieldset>
          <legend>Basic Information</legend>
          <div className="form-grid-3">
            <div className="form-group">
              <label htmlFor="bloodGroup">Blood Group</label>
              <select id="bloodGroup" name="bloodGroup" value={formData.bloodGroup} onChange={handleChange} required>
                <option value="">Select Blood Group</option>
                {bloodGroups.map(group => (
                  <option key={group} value={group}>{group}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="city">City</label>
              <select id="city" name="city" value={formData.city} onChange={handleChange} required>
                <option value="">Select City</option>
                {cities.map(city => (
                  <option key={city} value={city}>{city}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="month">Month</label>
              <select id="month" name="month" value={formData.month} onChange={handleChange} required>
                <option value="">Select Month</option>
                {months.map(month => (
                  <option key={month} value={month}>{month}</option>
                ))}
              </select>
            </div>
          </div>
        </fieldset>

        <fieldset>
          <legend>Environmental Factors</legend>
          <div className="form-grid-3">
            <div className="form-group">
              <label htmlFor="season">Season</label>
              <select id="season" name="season" value={formData.season} onChange={handleChange} required>
                <option value="">Select Season</option>
                {seasons.map(season => (
                  <option key={season} value={season}>{season}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="temperature">Temperature (°C)</label>
              <input type="number" id="temperature" name="temperature" value={formData.temperature} onChange={handleChange} required min="0" max="50" step="0.1" />
            </div>

            <div className="form-group">
              <label htmlFor="humidity">Humidity (%)</label>
              <input type="number" id="humidity" name="humidity" value={formData.humidity} onChange={handleChange} required min="0" max="100" step="0.1" />
            </div>
          </div>
        </fieldset>

        <fieldset>
          <legend>Operational Factors</legend>
          <div className="form-grid-3">
            <div className="form-group">
              <label htmlFor="storageCondition">Storage Condition</label>
              <select id="storageCondition" name="storageCondition" value={formData.storageCondition} onChange={handleChange} required>
                <option value="">Select Storage Condition</option>
                {storageConditions.map(condition => (
                  <option key={condition} value={condition}>{condition}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="transportationTime">Transportation Time (hours)</label>
              <input type="number" id="transportationTime" name="transportationTime" value={formData.transportationTime} onChange={handleChange} required min="0" max="72" step="0.5" />
            </div>

            <div className="form-group">
              <label htmlFor="processingDelay">Processing Delay (hours)</label>
              <input type="number" id="processingDelay" name="processingDelay" value={formData.processingDelay} onChange={handleChange} required min="0" max="48" step="0.5" />
            </div>
          </div>
        </fieldset>

        <fieldset>
          <legend>Quality Metrics</legend>
          <div className="form-grid-2">
            <div className="form-group">
              <label htmlFor="qualityControl">Quality Control Level</label>
              <select id="qualityControl" name="qualityControl" value={formData.qualityControl} onChange={handleChange} required>
                <option value="">Select Quality Level</option>
                {qualityLevels.map(level => (
                  <option key={level} value={level}>{level}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="inventoryAge">Inventory Age (days)</label>
              <input type="number" id="inventoryAge" name="inventoryAge" value={formData.inventoryAge} onChange={handleChange} required min="0" max="42" step="1" />
            </div>
          </div>
        </fieldset>

        <div className="form-actions">
          <button type="submit" className="submit-btn" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <div className="spinner"></div> Calculating...
              </>
            ) : (
              <>
                <FaUpload /> Run Prediction
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};



export default BloodWastageForm;
