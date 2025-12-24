import React, { useState } from 'react';
import { FaUpload, FaCheckCircle, FaExclamationCircle } from 'react-icons/fa';
import './PredictionForm.css'; // Re-using the same CSS file!

const options = {
  bloodGroups: ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'],
  donationTypes: ['Voluntary', 'Replacement', 'Directed'],
  hospitalNames: ['Colombo General', 'Kandy Hospital', 'Galle Hospital', 'Jaffna Hospital', 'Matara Hospital'],
  cities: ['Colombo', 'Kandy', 'Galle', 'Jaffna', 'Matara', 'Gampaha', 'Kurunegala'],
  regions: ['Western', 'Central', 'Southern', 'Northern', 'Eastern', 'North Western', 'North Central', 'Uva', 'Sabaragamuwa'],
  dayTypes: ['Weekday', 'Weekend', 'Holiday'],
  seasons: ['Dry', 'Rainy'],
  reasons: ['Expired', 'Contaminated', 'Storage Error', 'Testing', 'Other']
};

const getInitialDateState = () => {
  const today = new Date();
  return {
    expiry_date: today.toISOString().split('T')[0],
    year: today.getFullYear(),
    month: today.getMonth() + 1,
    weekday: today.getDay(),
  };
};

const initialState = {
  blood_group: 'O+',
  donation_type: 'Voluntary',
  hospital_name: 'Galle Hospital',
  city: 'Galle',
  region: 'Southern',
  ...getInitialDateState(),
  day_type: 'Weekday',
  season: 'Dry',
  population_density: 3000,
  hospital_count: 3,
  donation_drives: 2,
  previous_week_collection: 100,
  hospital_demand: 50,
  emergency_cases: 2,
  staff_on_duty: 5,
  reason: 'Expired'
};

const BloodWastageForm = () => {
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

    if (name === 'expiry_date') {
      const date = new Date(value);
      const newDateState = {
        expiry_date: value,
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
      const response = await fetch('http://localhost:8000/predict/randomforest_blood_wastage', {
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
        <h2>Blood Wastage Prediction Form</h2>
        <p className="form-description">Fill in the details below to predict blood wastage.</p>

        <fieldset>
          <legend>Unit & Location Details</legend>
          <div className="form-grid-4">
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
            <FormGroup label="Hospital Name" error={errors.hospital_name}>
              <select name="hospital_name" value={formData.hospital_name} onChange={handleChange} className={errors.hospital_name ? 'is-invalid' : ''}>
                {options.hospitalNames.map(name => <option key={name} value={name}>{name}</option>)}
              </select>
            </FormGroup>
            <FormGroup label="Wastage Reason" error={errors.reason}>
              <select name="reason" value={formData.reason} onChange={handleChange} className={errors.reason ? 'is-invalid' : ''}>
                {options.reasons.map(r => <option key={r} value={r}>{r}</option>)}
              </select>
            </FormGroup>
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
          </div>
        </fieldset>

        <fieldset>
          <legend>Date & Environment</legend>
          <div className="form-grid-4">
            <FormGroup label="Expiry Date" error={errors.expiry_date}>
              <input type="date" name="expiry_date" value={formData.expiry_date} onChange={handleChange} className={errors.expiry_date ? 'is-invalid' : ''} />
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
                <strong>Success!</strong> Predicted Wastage: {JSON.stringify(apiResponse.data.predicted_wastage)} units.
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

export default BloodWastageForm;