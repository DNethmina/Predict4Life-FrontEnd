import React, { useState } from 'react';
import { FaUpload, FaCheckCircle, FaExclamationCircle } from 'react-icons/fa';
import './PredictionForm.css'; // Re-using the same CSS file!

const options = {
  bloodGroups: ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'],
  usageTypes: ['Transfusion', 'Research', 'Testing', 'Other'],
  surgeryTypes: ['Cardiac', 'Orthopedic', 'General', 'Trauma', 'None'],
  hospitalNames: ['Colombo General', 'Kandy Hospital', 'Galle Hospital', 'Jaffna Hospital', 'Matara Hospital'],
  cities: ['Colombo', 'Kandy', 'Galle', 'Jaffna', 'Matara', 'Gampaha', 'Kurunegala'],
  regions: ['Western', 'Central', 'Southern', 'Northern', 'Eastern', 'North Western', 'North Central', 'Uva', 'Sabaragamuwa'],
  dayTypes: ['Weekday', 'Weekend', 'Holiday'],
  seasons: ['Dry', 'Rainy'],
};

const getInitialDateState = () => {
  const today = new Date();
  return {
    date_used: today.toISOString().split('T')[0], // 'YYYY-MM-DD'
    year: today.getFullYear(),
    month: today.getMonth() + 1, // JS months are 0-11
    weekday: today.getDay(), // JS day is 0-6 (Sunday=0)
  };
};

const initialState = {
  blood_group: 'B+',
  usage_type: 'Transfusion',
  surgery_type: 'Cardiac',
  hospital_name: 'Colombo General',
  city: 'Colombo',
  region: 'Western',
  ...getInitialDateState(),
  day_type: 'Weekday',
  season: 'Dry',
  population_density: 4000,
  hospital_count: 5,
  donation_drives: 2,
  previous_week_collection: 120,
  hospital_demand: 80,
  emergency_cases: 3,
  staff_on_duty: 6,
};

const BloodUsageForm = () => {
  const [formData, setFormData] = useState(initialState);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [apiResponse, setApiResponse] = useState(null);

  const validate = (name, value) => {
    if (value === '' || value === null) return 'This field is required.';
    const numberValue = parseFloat(value);
    if (['population_density', 'hospital_count', 'donation_drives', 'previous_week_collection', 'hospital_demand', 'emergency_cases', 'staff_on_duty'].includes(name)) {
      if (numberValue < 0) return 'Cannot be negative.';
    }
    return null;
  };

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    let finalValue = type === 'number' ? (value === '' ? '' : parseFloat(value)) : value;

    if (name === 'date_used') {
      const date = new Date(value);
      const newDateState = {
        date_used: value,
        year: date.getFullYear(),
        month: date.getMonth() + 1,
        weekday: date.getDay(),
      };
      const dayType = (date.getDay() === 0 || date.getDay() === 6) ? 'Weekend' : 'Weekday';
      
      setFormData(prev => ({ ...prev, ...newDateState, day_type: dayType }));
      Object.keys(newDateState).forEach(key => {
        setErrors(prev => ({ ...prev, [key]: null }));
      });

    } else {
      setFormData(prev => ({ ...prev, [name]: finalValue }));
      setErrors(prev => ({ ...prev, [name]: validate(name, finalValue) }));
    }
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiResponse(null);
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

    if (!formIsValid) return;
    setIsSubmitting(true);
    
    try {
      const response = await fetch('http://localhost:8000/predict/linearregression_blood_usage', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ data: formData }) 
      });

      const result = await response.json();
      if (!response.ok) throw new Error(result.detail || 'API Error');
      setApiResponse({ success: true, data: result });
    } catch (err) {
      setApiResponse({ success: false, message: err.message });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="prediction-form-wrapper">
      <form onSubmit={handleSubmit} className="dashboard-card prediction-form">
        <h2>Blood Usage Prediction Form</h2>
        <p className="form-description">Fill in the details below to predict blood usage.</p>

        <fieldset>
          <legend>Usage Details</legend>
          <div className="form-grid-4">
            <FormGroup label="Blood Group" error={errors.blood_group}>
              <select name="blood_group" value={formData.blood_group} onChange={handleChange} className={errors.blood_group ? 'is-invalid' : ''}>
                {options.bloodGroups.map(bg => <option key={bg} value={bg}>{bg}</option>)}
              </select>
            </FormGroup>
            <FormGroup label="Usage Type" error={errors.usage_type}>
              <select name="usage_type" value={formData.usage_type} onChange={handleChange} className={errors.usage_type ? 'is-invalid' : ''}>
                {options.usageTypes.map(type => <option key={type} value={type}>{type}</option>)}
              </select>
            </FormGroup>
            <FormGroup label="Surgery Type" error={errors.surgery_type}>
              <select name="surgery_type" value={formData.surgery_type} onChange={handleChange} className={errors.surgery_type ? 'is-invalid' : ''}>
                {options.surgeryTypes.map(type => <option key={type} value={type}>{type}</option>)}
              </select>
            </FormGroup>
            <FormGroup label="Hospital Name" error={errors.hospital_name}>
              <select name="hospital_name" value={formData.hospital_name} onChange={handleChange} className={errors.hospital_name ? 'is-invalid' : ''}>
                {options.hospitalNames.map(name => <option key={name} value={name}>{name}</option>)}
              </select>
            </FormGroup>
          </div>
        </fieldset>

        <fieldset>
          <legend>Location & Time Details</legend>
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
            <FormGroup label="Date Used" error={errors.date_used}>
              <input type="date" name="date_used" value={formData.date_used} onChange={handleChange} className={errors.date_used ? 'is-invalid' : ''} />
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
          <div className="form-grid-4">
            <FormGroup label="Population Density" error={errors.population_density}>
              <input type="number" name="population_density" value={formData.population_density} onChange={handleChange} className={errors.population_density ? 'is-invalid' : ''} />
            </FormGroup>
            <FormGroup label="Hospital Count" error={errors.hospital_count}>
              <input type="number" name="hospital_count" value={formData.hospital_count} onChange={handleChange} className={errors.hospital_count ? 'is-invalid' : ''} />
            </FormGroup>
            <FormGroup label="Donation Drives" error={errors.donation_drives}>
              <input type="number" name="donation_drives" value={formData.donation_drives} onChange={handleChange} className={errors.donation_drives ? 'is-invalid' : ''} />
            </FormGroup>
            <FormGroup label="Previous Week's Collection" error={errors.previous_week_collection}>
              <input type="number" name="previous_week_collection" value={formData.previous_week_collection} onChange={handleChange} className={errors.previous_week_collection ? 'is-invalid' : ''} />
            </FormGroup>
            <FormGroup label="Hospital Demand" error={errors.hospital_demand}>
              <input type="number" name="hospital_demand" value={formData.hospital_demand} onChange={handleChange} className={errors.hospital_demand ? 'is-invalid' : ''} />
            </FormGroup>
            <FormGroup label="Emergency Cases" error={errors.emergency_cases}>
              <input type="number" name="emergency_cases" value={formData.emergency_cases} onChange={handleChange} className={errors.emergency_cases ? 'is-invalid' : ''} />
            </FormGroup>
            <FormGroup label="Staff on Duty" error={errors.staff_on_duty}>
              <input type="number" name="staff_on_duty" value={formData.staff_on_duty} onChange={handleChange} className={errors.staff_on_duty ? 'is-invalid' : ''} />
            </FormGroup>
          </div>
        </fieldset>

        <div className="form-submit-area">
          <button type="submit" className="submit-btn" disabled={isSubmitting}>
            {isSubmitting ? 'Submitting...' : <><FaUpload /> Run Prediction</>}
          </button>
        </div>

        {apiResponse && (
          <div className={`api-response ${apiResponse.success ? 'success' : 'error'}`}>
            {apiResponse.success ? (
              <>
                <FaCheckCircle />
                <strong>Success!</strong> Predicted Usage: {JSON.stringify(apiResponse.data.predicted_usage)} units.
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

const FormGroup = ({ label, children, error }) => (
  <div className="form-group">
    <label>{label}</label>
    {children}
    {error && <span className="error-message">{error}</span>}
  </div>
);

export default BloodUsageForm;