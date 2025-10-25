import React, { useState } from 'react';
import { FaUpload, FaCheckCircle, FaExclamationCircle } from 'react-icons/fa';
import './PredictionForm.css'; // Re-using the same CSS file!

const options = {
  cities: ['Colombo', 'Kandy', 'Galle', 'Jaffna', 'Matara', 'Gampaha', 'Kurunegala'],
  regions: ['Western Province', 'Central Province', 'Southern Province', 'Northern Province', 'Eastern Province', 'North Western Province', 'North Central Province', 'Uva Province', 'Sabaragamuwa Province'],
  organizerTypes: ['NGO', 'Hospital', 'University', 'Corporate', 'Other'],
  adsUsed: ['Yes', 'No'],
  promoChannels: ['Social Media', 'Radio', 'TV', 'Email', 'Posters', 'Other'],
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
  transportAccess: ['Yes', 'No'],
  holidaySeason: ['Yes', 'No'],
  weather: ['Sunny', 'Cloudy', 'Rainy', 'Windy'],
};

const initialState = {
  city: 'Galle',
  region: 'Southern Province',
  organizer_type: 'NGO',
  ads_used: 'No',
  promotion_channels: 'Social Media',
  duration_hours: 6,
  num_organizers: 12,
  previous_camps_by_organizer: 4,
  expected_donors: 180,
  sms_notifications_sent: 150,
  temperature_celsius: 30,
  humidity_percent: 75,
  rainfall_mm: 2,
  num_beds: 10,
  num_medical_staff: 8,
  num_volunteers: 20,
  equipment_quality_score: 9,
  total_registered_donors: 200,
  new_donors: 60,
  repeat_donors: 140,
  average_donations_last_3_camps: 160,
  month: 8,
  weekday: 3,
  public_transport_access: 'Yes',
  holiday_season: 'No',
  weather_condition: 'Sunny',
  population_density: 3000,
  longitude: 80.219,
  latitude: 6.035,
  average_income_level: 50000,
  nearby_hospitals_count: 3,
};

const BloodCampForm = () => {
  const [formData, setFormData] = useState(initialState);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [apiResponse, setApiResponse] = useState(null);

  const validate = (name, value) => {
    if (value === '' || value === null) return 'This field is required.';
    const numberValue = parseFloat(value);
    if (numberValue < 0 && !['longitude', 'latitude', 'temperature_celsius'].includes(name)) {
      return 'Cannot be negative.';
    }
    if (name === 'equipment_quality_score' && (numberValue < 0 || numberValue > 10)) {
      return 'Score must be 0-10.';
    }
    if (name === 'humidity_percent' && (numberValue < 0 || numberValue > 100)) {
      return 'Must be 0-100.';
    }
    return null;
  };

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    let finalValue = type === 'number' ? (value === '' ? '' : parseFloat(value)) : value;
    
    setFormData(prev => ({ ...prev, [name]: finalValue }));
    setErrors(prev => ({ ...prev, [name]: validate(name, finalValue) }));
  };
  
  const handleSubmit = async (e) => {
  e.preventDefault();
  
  console.log("✅ handleSubmit triggered");
  setApiResponse(null);

  // Validate form
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
    const response = await fetch('http://localhost:8080/api/ml/camp', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // If your gateway requires authentication token:
        'Authorization': `Bearer ${localStorage.getItem('authToken')}`

      },
      // Wrap formData inside "data" object
      body: JSON.stringify({ data: formData })
    });

    // Parse JSON
    const result = await response.json();

    console.log("🔍 API Gateway Response:", result);

    if (!response.ok) {
      throw new Error(result.error || 'API Error');
    }

    setApiResponse({ success: true, data: result.prediction || result });
  } catch (err) {
    setApiResponse({ success: false, message: err.message });
  } finally {
    setIsSubmitting(false);
  }
};


  return (
    <div className="prediction-form-wrapper">
      <form onSubmit={handleSubmit} className="dashboard-card prediction-form">
        <h2>Blood Camp Prediction Form</h2>
        <p className="form-description">Fill in the camp details to predict total donations.</p>

        <fieldset>
          <legend>Organization</legend>
          <div className="form-grid-4">
            <FormGroup label="Organizer Type" error={errors.organizer_type}>
              <select name="organizer_type" value={formData.organizer_type} onChange={handleChange} className={errors.organizer_type ? 'is-invalid' : ''}>
                {options.organizerTypes.map(o => <option key={o} value={o}>{o}</option>)}
              </select>
            </FormGroup>
            <FormGroup label="Ads Used?" error={errors.ads_used}>
              <select name="ads_used" value={formData.ads_used} onChange={handleChange} className={errors.ads_used ? 'is-invalid' : ''}>
                {options.adsUsed.map(a => <option key={a} value={a}>{a}</option>)}
              </select>
            </FormGroup>
            <FormGroup label="Promotion Channels" error={errors.promotion_channels}>
              <select name="promotion_channels" value={formData.promotion_channels} onChange={handleChange} className={errors.promotion_channels ? 'is-invalid' : ''}>
                {options.promoChannels.map(p => <option key={p} value={p}>{p}</option>)}
              </select>
            </FormGroup>
             <FormGroup label="Previous Camps by Organizer" error={errors.previous_camps_by_organizer}>
              <input type="number" name="previous_camps_by_organizer" value={formData.previous_camps_by_organizer} onChange={handleChange} className={errors.previous_camps_by_organizer ? 'is-invalid' : ''} />
            </FormGroup>
          </div>
        </fieldset>
        
        <fieldset>
          <legend>Location & Environment</legend>
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
            <FormGroup label="Latitude" error={errors.latitude}>
              <input type="number" name="latitude" value={formData.latitude} onChange={handleChange} className={errors.latitude ? 'is-invalid' : ''} step="any" />
            </FormGroup>
            <FormGroup label="Longitude" error={errors.longitude}>
              <input type="number" name="longitude" value={formData.longitude} onChange={handleChange} className={errors.longitude ? 'is-invalid' : ''} step="any" />
            </FormGroup>
            <FormGroup label="Population Density" error={errors.population_density}>
              <input type="number" name="population_density" value={formData.population_density} onChange={handleChange} className={errors.population_density ? 'is-invalid' : ''} />
            </FormGroup>
            <FormGroup label="Average Income Level" error={errors.average_income_level}>
              <input type="number" name="average_income_level" value={formData.average_income_level} onChange={handleChange} className={errors.average_income_level ? 'is-invalid' : ''} />
            </FormGroup>
            <FormGroup label="Nearby Hospitals Count" error={errors.nearby_hospitals_count}>
              <input type="number" name="nearby_hospitals_count" value={formData.nearby_hospitals_count} onChange={handleChange} className={errors.nearby_hospitals_count ? 'is-invalid' : ''} />
            </FormGroup>
            <FormGroup label="Public Transport Access" error={errors.public_transport_access}>
              <select name="public_transport_access" value={formData.public_transport_access} onChange={handleChange} className={errors.public_transport_access ? 'is-invalid' : ''}>
                {options.transportAccess.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </FormGroup>
          </div>
        </fieldset>

        <fieldset>
          <legend>Camp Date & Weather</legend>
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
             <FormGroup label="Holiday Season?" error={errors.holiday_season}>
              <select name="holiday_season" value={formData.holiday_season} onChange={handleChange} className={errors.holiday_season ? 'is-invalid' : ''}>
                {options.holidaySeason.map(h => <option key={h} value={h}>{h}</option>)}
              </select>
            </FormGroup>
            <FormGroup label="Weather Condition" error={errors.weather_condition}>
              <select name="weather_condition" value={formData.weather_condition} onChange={handleChange} className={errors.weather_condition ? 'is-invalid' : ''}>
                {options.weather.map(w => <option key={w} value={w}>{w}</option>)}
              </select>
            </FormGroup>
            <FormGroup label="Temperature (°C)" error={errors.temperature_celsius}>
              <input type="number" name="temperature_celsius" value={formData.temperature_celsius} onChange={handleChange} className={errors.temperature_celsius ? 'is-invalid' : ''} step="any" />
            </FormGroup>
            <FormGroup label="Humidity (%)" error={errors.humidity_percent}>
              <input type="number" name="humidity_percent" value={formData.humidity_percent} onChange={handleChange} className={errors.humidity_percent ? 'is-invalid' : ''} step="any" />
            </FormGroup>
            <FormGroup label="Rainfall (mm)" error={errors.rainfall_mm}>
              <input type="number" name="rainfall_mm" value={formData.rainfall_mm} onChange={handleChange} className={errors.rainfall_mm ? 'is-invalid' : ''} step="any" />
            </FormGroup>
          </div>
        </fieldset>
        
        <fieldset>
          <legend>Camp Resources</legend>
          <div className="form-grid-4">
            <FormGroup label="Duration (Hours)" error={errors.duration_hours}>
              <input type="number" name="duration_hours" value={formData.duration_hours} onChange={handleChange} className={errors.duration_hours ? 'is-invalid' : ''} step="0.5" />
            </FormGroup>
            <FormGroup label="Number of Organizers" error={errors.num_organizers}>
              <input type="number" name="num_organizers" value={formData.num_organizers} onChange={handleChange} className={errors.num_organizers ? 'is-invalid' : ''} />
            </FormGroup>
            <FormGroup label="Number of Beds" error={errors.num_beds}>
              <input type="number" name="num_beds" value={formData.num_beds} onChange={handleChange} className={errors.num_beds ? 'is-invalid' : ''} />
            </FormGroup>
            <FormGroup label="Medical Staff" error={errors.num_medical_staff}>
              <input type="number" name="num_medical_staff" value={formData.num_medical_staff} onChange={handleChange} className={errors.num_medical_staff ? 'is-invalid' : ''} />
            </FormGroup>
            <FormGroup label="Volunteers" error={errors.num_volunteers}>
              <input type="number" name="num_volunteers" value={formData.num_volunteers} onChange={handleChange} className={errors.num_volunteers ? 'is-invalid' : ''} />
            </FormGroup>
            <FormGroup label="Equipment Quality (0-10)" error={errors.equipment_quality_score}>
              <input type="number" name="equipment_quality_score" value={formData.equipment_quality_score} onChange={handleChange} className={errors.equipment_quality_score ? 'is-invalid' : ''} step="any" />
            </FormGroup>
          </div>
        </fieldset>
        
        <fieldset>
          <legend>Donor Data</legend>
          <div className="form-grid-4">
            <FormGroup label="Expected Donors" error={errors.expected_donors}>
              <input type="number" name="expected_donors" value={formData.expected_donors} onChange={handleChange} className={errors.expected_donors ? 'is-invalid' : ''} />
            </FormGroup>
            <FormGroup label="SMS Notifications Sent" error={errors.sms_notifications_sent}>
              <input type="number" name="sms_notifications_sent" value={formData.sms_notifications_sent} onChange={handleChange} className={errors.sms_notifications_sent ? 'is-invalid' : ''} />
            </FormGroup>
            <FormGroup label="Total Registered" error={errors.total_registered_donors}>
              <input type="number" name="total_registered_donors" value={formData.total_registered_donors} onChange={handleChange} className={errors.total_registered_donors ? 'is-invalid' : ''} />
            </FormGroup>
            <FormGroup label="New Donors" error={errors.new_donors}>
              <input type="number" name="new_donors" value={formData.new_donors} onChange={handleChange} className={errors.new_donors ? 'is-invalid' : ''} />
            </FormGroup>
            <FormGroup label="Repeat Donors" error={errors.repeat_donors}>
              <input type="number" name="repeat_donors" value={formData.repeat_donors} onChange={handleChange} className={errors.repeat_donors ? 'is-invalid' : ''} />
            </FormGroup>
            <FormGroup label="Avg. Donations (Last 3 Camps)" error={errors.average_donations_last_3_camps}>
              <input type="number" name="average_donations_last_3_camps" value={formData.average_donations_last_3_camps} onChange={handleChange} className={errors.average_donations_last_3_camps ? 'is-invalid' : ''} />
            </FormGroup>
          </div>
        </fieldset>

        <div className="form-submit-area">
          <button type="submit" className="submit-btn" onClick={() => console.log("Button clicked")} disabled={isSubmitting}>
            {isSubmitting ? 'Submitting...' : <><FaUpload /> Run Prediction</>}
          </button>
        </div>

        {apiResponse && (
  <div className={`api-response ${apiResponse.success ? 'success' : 'error'}`}>
    {apiResponse.success ? (
      <>
        <FaCheckCircle />
        <strong>Success!</strong> Predicted Collection:{" "}
        {apiResponse.data?.predicted_collection ??
         apiResponse.data?.predicted_donations ??
         apiResponse.data?.prediction ??
         "N/A"} units.
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

export default BloodCampForm;