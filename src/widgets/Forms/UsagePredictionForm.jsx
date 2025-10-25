import React, { useState } from 'react';
import { FaUpload, FaCheckCircle, FaExclamationCircle } from 'react-icons/fa';
import './PredictionForm.css'; // Re-using the same CSS file!

// --- Updated Dropdown Options ---
const options = {
  bloodGroups: ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'],
  cities: ['Colombo', 'Kandy', 'Galle', 'Jaffna', 'Matara', 'Gampaha', 'Kurunegala'],
  dayTypes: ['Weekday', 'Weekend', 'Holiday'],
  seasons: ['Dry', 'Rainy'],
};

// --- Updated Initial State ---
const initialState = {
  blood_group: 'A+',
  city: 'Colombo',
  day_type: 'Weekday',
  season: 'Dry',
  hospital_demand: 250,
  emergency_cases: 25,
  donation_drives: 4,
  avg_last_3_weeks: 230,
  lag_1: 220,
  lag_2: 210,
  lag_3: 200,
};

const UsagePredictionForm = () => {
  const [formData, setFormData] = useState(initialState);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [apiResponse, setApiResponse] = useState(null);

  // --- Updated Validation ---
  const validate = (name, value) => {
    if (value === '' || value === null) return 'This field is required.';
    const numberValue = parseFloat(value);
    
    // Check all number fields
    if ([
      'hospital_demand', 'emergency_cases', 'donation_drives', 
      'avg_last_3_weeks', 'lag_1', 'lag_2', 'lag_3'
    ].includes(name)) {
      if (numberValue < 0) return 'Cannot be negative.';
    }
    return null;
  };

  // --- Simplified HandleChange (no date logic) ---
  const handleChange = (e) => {
    const { name, value, type } = e.target;
    let finalValue = type === 'number' ? (value === '' ? '' : parseFloat(value)) : value;

    setFormData(prev => ({ ...prev, [name]: finalValue }));
    setErrors(prev => ({ ...prev, [name]: validate(name, finalValue) }));
  };
  
  // --- Updated HandleSubmit ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiResponse(null);
    let tempErrors = {};
    let formIsValid = true;
    
    // Final validation
    Object.keys(formData).forEach(key => {
      const error = validate(key, formData[key]);
      if (error) {
        tempErrors[key] = error;
        formIsValid = false;
      }
    });
    setErrors(tempErrors);

    if (!formIsValid) return;
    setIsSubmitting(true);
    
    // --- 1. Create the new payload structure ---
    const payload = {
      blood_group: formData.blood_group, // Top-level field
      data: {
        city: formData.city,
        day_type: formData.day_type,
        season: formData.season,
        hospital_demand: formData.hospital_demand,
        emergency_cases: formData.emergency_cases,
        donation_drives: formData.donation_drives,
        avg_last_3_weeks: formData.avg_last_3_weeks,
        lag_1: formData.lag_1,
        lag_2: formData.lag_2,
        lag_3: formData.lag_3
      }
    };

    try {
      // --- 2. Use the new API endpoint ---
      const response = await fetch('http://localhost:8080/api/ml/usage', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload) // --- 3. Send the new payload ---
      });

      const result = await response.json();
      if (!response.ok) throw new Error(result.detail || 'API Error');
      
      // --- 4. Update the success message (guessing the response key) ---
      setApiResponse({ success: true, data: result });
    } catch (err) {
      setApiResponse({ success: false, message: err.message });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="prediction-form-wrapper">
      {/* --- 5. Updated Form Content --- */}
      <form onSubmit={handleSubmit} className="dashboard-card prediction-form">
        <h2>Blood Usage Prediction Form</h2>
        <p className="form-description">Fill in the details below to predict blood usage.</p>

        <fieldset>
          <legend>Prediction Parameters</legend>
          <div className="form-grid-4">
            <FormGroup label="Blood Group" error={errors.blood_group}>
              <select name="blood_group" value={formData.blood_group} onChange={handleChange} className={errors.blood_group ? 'is-invalid' : ''}>
                {options.bloodGroups.map(bg => <option key={bg} value={bg}>{bg}</option>)}
              </select>
            </FormGroup>
            <FormGroup label="City" error={errors.city}>
              <select name="city" value={formData.city} onChange={handleChange} className={errors.city ? 'is-invalid' : ''}>
                {options.cities.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </FormGroup>
            <FormGroup label="Day Type" error={errors.day_type}>
              <select name="day_type" value={formData.day_type} onChange={handleChange} className={errors.day_type ? 'is-invalid' : ''}>
                {options.dayTypes.map(type => <option key={type} value={type}>{type}</option>)}
              </select>
            </FormGroup>
            <FormGroup label="Season" error={errors.season}>
              <select name="season" value={formData.season} onChange={handleChange} className={errors.season ? 'is-invalid' : ''}>
                {options.seasons.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </FormGroup>
          </div>
        </fieldset>

        <fieldset>
          <legend>Operational Data</legend>
          <div className="form-grid-3">
            <FormGroup label="Hospital Demand" error={errors.hospital_demand}>
              <input type="number" name="hospital_demand" value={formData.hospital_demand} onChange={handleChange} className={errors.hospital_demand ? 'is-invalid' : ''} />
            </FormGroup>
            <FormGroup label="Emergency Cases" error={errors.emergency_cases}>
              <input type="number" name="emergency_cases" value={formData.emergency_cases} onChange={handleChange} className={errors.emergency_cases ? 'is-invalid' : ''} />
            </FormGroup>
            <FormGroup label="Donation Drives" error={errors.donation_drives}>
              <input type="number" name="donation_drives" value={formData.donation_drives} onChange={handleChange} className={errors.donation_drives ? 'is-invalid' : ''} />
            </FormGroup>
          </div>
        </fieldset>
        
        <fieldset>
          <legend>Historical Data (Lags)</legend>
          <div className="form-grid-4">
            <FormGroup label="Avg. Last 3 Weeks" error={errors.avg_last_3_weeks}>
              <input type="number" name="avg_last_3_weeks" value={formData.avg_last_3_weeks} onChange={handleChange} className={errors.avg_last_3_weeks ? 'is-invalid' : ''} />
            </FormGroup>
            <FormGroup label="Lag 1 (Previous Week)" error={errors.lag_1}>
              <input type="number" name="lag_1" value={formData.lag_1} onChange={handleChange} className={errors.lag_1 ? 'is-invalid' : ''} />
            </FormGroup>
            <FormGroup label="Lag 2 (2 Weeks Ago)" error={errors.lag_2}>
              <input type="number" name="lag_2" value={formData.lag_2} onChange={handleChange} className={errors.lag_2 ? 'is-invalid' : ''} />
            </FormGroup>
            <FormGroup label="Lag 3 (3 Weeks Ago)" error={errors.lag_3}>
              <input type="number" name="lag_3" value={formData.lag_3} onChange={handleChange} className={errors.lag_3 ? 'is-invalid' : ''} />
            </FormGroup>
          </div>
        </fieldset>

        <div className="form-submit-area">
          <button type="submit" className="submit-btn" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <div className="spinner"></div>
                Calculating...
              </>
            ) : (
              <>
                <FaUpload /> Run Prediction
              </>
            )}
          </button>
        </div>

        {apiResponse && (
          <div className={`api-response ${apiResponse.success ? 'success' : 'error'}`}>
            {apiResponse.success ? (
              <>
                <FaCheckCircle />
                {/* 6. Updated Success Message */}
                <strong>Success!</strong> Predicted Usage: {JSON.stringify(apiResponse.data.predicted_usage)}
              </>
            ) : (
              <>
                <FaExclamationCircle />
                <strong>Error:</strong> {apiResponse.message}
              </>
            )}
          </div>
        )}
      </form>
    </div>
  );
};

// Helper component (unchanged)
const FormGroup = ({ label, children, error }) => (
  <div className="form-group">
    <label>{label}</label>
    {children}
    {error && <span className="error-message">{error}</span>}
  </div>
);

export default UsagePredictionForm;