import React from 'react';
import { useState } from 'react';
import { FaUpload, FaCheckCircle, FaExclamationCircle } from 'react-icons/fa';
import './PredictionForm.css';

// --- Dropdown Options ---
// Using dropdowns is better for validation than free-text input
const options = {
  bloodGroups: ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'],
  donationTypes: ['Voluntary', 'Replacement', 'Directed'],
  centers: ['Center_1', 'Center_2', 'Center_3', 'Center_4', 'Center_5'],
  months: [
    { name: 'January', value: 1 }, { name: 'February', value: 2 }, { name: 'March', value: 3 },
    { name: 'April', value: 4 }, { name: 'May', value: 5 }, { name: 'June', value: 6 },
    { name: 'July', value: 7 }, { name: 'August', value: 8 }, { name: 'September', value: 9 },
    { name: 'October', value: 10 }, { name: 'November', value: 11 }, { name: 'December', value: 12 },
  ],
  weekdays: [
    { name: 'Sunday', value: 0 }, { name: 'Monday', value: 1 }, { name: 'Tuesday', value: 2 },
    { name: 'Wednesday', value: 3 }, { name: 'Thursday', value: 4 }, { name: 'Friday', value: 5 },
    { name: 'Saturday', value: 6 },
  ],
  dayTypes: ['Weekday', 'Weekend', 'Holiday'],
  seasons: ['Dry', 'Rainy'],
  cities: ['Colombo', 'Kandy', 'Galle', 'Jaffna', 'Matara', 'Gampaha', 'Kurunegala'],
  regions: ['Western Province', 'Central Province', 'Southern Province', 'Northern Province', 'Eastern Province', 'North Western Province', 'North Central Province', 'Uva Province', 'Sabaragamuwa Province'],
};

// --- Initial State for the form ---
const initialState = {
  blood_group: 'A+',
  donation_type: 'Voluntary',
  collection_center: 'Center_3',
  average_donor_age: 32,
  male_donor_ratio: 0.55,
  month: 8,
  weekday: 3,
  day_type: 'Weekday',
  season: 'Dry',
  city: 'Galle',
  region: 'Southern Province',
  population_density: 3000,
  hospital_count: 3,
  donation_drives: 2,
  previous_week_collection: 150,
  hospital_demand: 120,
  emergency_cases: 5,
  staff_on_duty: 8,
};

const PredictionForm = () => {
  const [formData, setFormData] = useState(initialState);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [apiResponse, setApiResponse] = useState(null);

  const validate = (name, value) => {
    let error = null;
    if (value === '' || value === null) {
      return 'This field is required.';
    }
    
    // Number validations
    const numberValue = parseFloat(value);
    if (['average_donor_age', 'population_density', 'hospital_count', 'donation_drives', 'previous_week_collection', 'hospital_demand', 'emergency_cases', 'staff_on_duty'].includes(name)) {
      if (numberValue < 0) error = 'Cannot be negative.';
    }
    if (name === 'average_donor_age' && numberValue < 18) {
      error = 'Age must be 18 or older.';
    }
    if (name === 'male_donor_ratio' && (numberValue < 0 || numberValue > 1)) {
      error = 'Ratio must be between 0 and 1.';
    }
    return error;
  };

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    const finalValue = type === 'number' ? (value === '' ? '' : parseFloat(value)) : value;
    
    // Update form data
    setFormData(prev => ({
      ...prev,
      [name]: finalValue
    }));

    // Validate and update errors
    const error = validate(name, finalValue);
    setErrors(prev => ({
      ...prev,
      [name]: error
    }));
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiResponse(null);
    
    // Final validation check for all fields
    let tempErrors = {};
    let formIsValid = true;
    Object.keys(formData).forEach(key => {
      const error = validate(key, formData[key]);
      if (error) {
        tempErrors[key] = error;
        formIsValid = false;
      }
    });

    setErrors(tempErrors);

    if (!formIsValid) {
      return; // Stop submission if form is invalid
    }

    setIsSubmitting(true);
    
    try {
      const response = await fetch('http://localhost:8000/predict/gradientboosting_blood_collection', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        // Send data in the exact format your API expects
        body: JSON.stringify({ data: formData }) 
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.detail || 'An error occurred during prediction.');
      }
      
      // Success!
      setApiResponse({ success: true, data: result });
      // console.log('Prediction Result:', result);

    } catch (err) {
      // Error
      setApiResponse({ success: false, message: err.message });
      console.error('Submission Error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="prediction-form-wrapper">
      <form onSubmit={handleSubmit} className="dashboard-card prediction-form">
        <h2>Blood Collection Prediction Form</h2>
        <p className="form-description">
          Fill in the details below to get a prediction for future blood collection volumes.
        </p>

        {/* --- Group 1: Donation Details --- */}
        <fieldset>
          <legend>Donation Details</legend>
          <div className="form-grid-3">
            <FormGroup label="Blood Group" error={errors.blood_group}>
              <select name="blood_group" value={formData.blood_group} onChange={handleChange} className={errors.blood_group ? 'is-invalid' : ''}>
                {options.bloodGroups.map(bg => <option key={bg} value={bg}>{bg}</option>)}
              </select>
            </FormGroup>
            <FormGroup label="Donation Type" error={errors.donation_type}>
              <select name="donation_type" value={formData.donation_type} onChange={handleChange} className={errors.donation_type ? 'is-invalid' : ''}>
                {options.donationTypes.map(type => <option key={type} value={type}>{type}</option>)}
              </select>
            </FormGroup>
            <FormGroup label="Collection Center" error={errors.collection_center}>
              <select name="collection_center" value={formData.collection_center} onChange={handleChange} className={errors.collection_center ? 'is-invalid' : ''}>
                {options.centers.map(center => <option key={center} value={center}>{center}</option>)}
              </select>
            </FormGroup>
          </div>
        </fieldset>

        {/* --- Group 2: Temporal Details --- */}
        <fieldset>
          <legend>Temporal Details</legend>
          <div className="form-grid-4">
            <FormGroup label="Month" error={errors.month}>
              <select name="month" value={formData.month} onChange={handleChange} className={errors.month ? 'is-invalid' : ''}>
                {options.months.map(m => <option key={m.value} value={m.value}>{m.name}</option>)}
              </select>
            </FormGroup>
            <FormGroup label="Weekday" error={errors.weekday}>
              <select name="weekday" value={formData.weekday} onChange={handleChange} className={errors.weekday ? 'is-invalid' : ''}>
                {options.weekdays.map(w => <option key={w.value} value={w.value}>{w.name}</option>)}
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

        {/* --- Group 3: Location Details --- */}
        <fieldset>
          <legend>Location Details</legend>
          <div className="form-grid-4">
            <FormGroup label="City" error={errors.city}>
              <select name="city" value={formData.city} onChange={handleChange} className={errors.city ? 'is-invalid' : ''}>
                {options.cities.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </FormGroup>
            <FormGroup label="Region" error={errors.region}>
              <select name="region" value={formData.region} onChange={handleChange} className={errors.region ? 'is-invalid' : ''}>
                {options.regions.map(r => <option key={r} value={r}>{r}</option>)}
              </select>
            </FormGroup>
            <FormGroup label="Population Density" error={errors.population_density}>
              <input type="number" name="population_density" value={formData.population_density} onChange={handleChange} className={errors.population_density ? 'is-invalid' : ''} step="1" />
            </FormGroup>
            <FormGroup label="Hospital Count" error={errors.hospital_count}>
              <input type="number" name="hospital_count" value={formData.hospital_count} onChange={handleChange} className={errors.hospital_count ? 'is-invalid' : ''} step="1" />
            </FormGroup>
          </div>
        </fieldset>
        
        {/* --- Group 4: Donor & Staff Details --- */}
        <fieldset>
          <legend>Donor & Staff Details</legend>
          <div className="form-grid-3">
             <FormGroup label="Average Donor Age" error={errors.average_donor_age}>
              <input type="number" name="average_donor_age" value={formData.average_donor_age} onChange={handleChange} className={errors.average_donor_age ? 'is-invalid' : ''} step="1" />
            </FormGroup>
            <FormGroup label="Male Donor Ratio (0-1)" error={errors.male_donor_ratio}>
              <input type="number" name="male_donor_ratio" value={formData.male_donor_ratio} onChange={handleChange} className={errors.male_donor_ratio ? 'is-invalid' : ''} step="0.01" />
            </FormGroup>
             <FormGroup label="Staff on Duty" error={errors.staff_on_duty}>
              <input type="number" name="staff_on_duty" value={formData.staff_on_duty} onChange={handleChange} className={errors.staff_on_duty ? 'is-invalid' : ''} step="1" />
            </FormGroup>
          </div>
        </fieldset>

        {/* --- Group 5: Operational Data --- */}
        <fieldset>
          <legend>Operational Data</legend>
          <div className="form-grid-4">
            <FormGroup label="Donation Drives" error={errors.donation_drives}>
              <input type="number" name="donation_drives" value={formData.donation_drives} onChange={handleChange} className={errors.donation_drives ? 'is-invalid' : ''} step="1" />
            </FormGroup>
            <FormGroup label="Previous Week's Collection" error={errors.previous_week_collection}>
              <input type="number" name="previous_week_collection" value={formData.previous_week_collection} onChange={handleChange} className={errors.previous_week_collection ? 'is-invalid' : ''} step="1" />
            </FormGroup>
            <FormGroup label="Hospital Demand" error={errors.hospital_demand}>
              <input type="number" name="hospital_demand" value={formData.hospital_demand} onChange={handleChange} className={errors.hospital_demand ? 'is-invalid' : ''} step="1" />
            </FormGroup>
            <FormGroup label="Emergency Cases" error={errors.emergency_cases}>
              <input type="number" name="emergency_cases" value={formData.emergency_cases} onChange={handleChange} className={errors.emergency_cases ? 'is-invalid' : ''} step="1" />
            </FormGroup>
          </div>
        </fieldset>

        {/* --- Submission Area --- */}
        <div className="form-submit-area">
          <button type="submit" className="submit-btn" disabled={isSubmitting}>
            {isSubmitting ? 'Submitting...' : (
              <>
                <FaUpload /> Run Prediction
              </>
            )}
          </button>
        </div>

        {/* --- API Response Message --- */}
        {apiResponse && (
          <div className={`api-response ${apiResponse.success ? 'success' : 'error'}`}>
            {apiResponse.success ? (
              <>
                <FaCheckCircle />
                <strong>Success!</strong> Predicted Collection: {JSON.stringify(apiResponse.data.predicted_collection)} units.
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

// Helper component for form groups to keep code clean
const FormGroup = ({ label, children, error }) => (
  <div className="form-group">
    <label>{label}</label>
    {children}
    {error && <span className="error-message">{error}</span>}
  </div>
);

export default PredictionForm;