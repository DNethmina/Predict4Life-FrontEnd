import React, { useState, useEffect } from 'react';
// --- 1. Import Map Components ---
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, 
  LabelList, Cell
} from 'recharts';
import L from 'leaflet';
import { FaMapPin, FaTint, FaFilter } from 'react-icons/fa';
import 'leaflet/dist/leaflet.css';
import './Donar.css'; 

// Blood group and location options

// Cities will be dynamically populated from data
const bloodGroups = ['All', 'A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'];

const getBloodGroupCounts = (donors) => {
  const counts = donors.reduce((acc, donor) => {
    if (donor.blood_group && donor.blood_group !== 'N/A') {
      acc[donor.blood_group] = (acc[donor.blood_group] || 0) + 1;
    }
    return acc;
  }, {});

  return Object.keys(counts).map(key => ({
    name: key,
    count: counts[key],
  }));
};

// --- 3. Location coordinates mapping ---
const defaultCoordinates = { center: [7.8731, 80.7718], zoom: 7 }; // Sri Lanka center

// Custom marker icon
const customIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const locationCoordinates = {
  'All': defaultCoordinates,
  'Colombo': { center: [6.9271, 79.8612], zoom: 12 },
  'Kandy': { center: [7.2906, 80.6337], zoom: 13 },
  'Galle': { center: [6.0329, 80.2168], zoom: 13 },
  'Jaffna': { center: [9.6615, 80.0255], zoom: 12 },
  'Matara': { center: [5.9549, 80.5550], zoom: 13 },
  'Anuradhapura': { center: [8.3114, 80.4037], zoom: 13 },
  'Negombo': { center: [7.2111, 79.8386], zoom: 13 },
  'Kurunegala': { center: [7.4818, 80.3609], zoom: 13 }
};

// Map Controller Component to handle view updates
const MapController = ({ selectedLocation, filteredDonors }) => {
  const map = useMap();

  useEffect(() => {
    if (filteredDonors.length > 0) {
      // Calculate center based on filtered donors
      const lats = filteredDonors.map(d => d.lat);
      const lngs = filteredDonors.map(d => d.lng);
      const centerLat = (Math.max(...lats) + Math.min(...lats)) / 2;
      const centerLng = (Math.max(...lngs) + Math.min(...lngs)) / 2;
      
      // Adjust zoom level based on the number of donors
      const zoom = selectedLocation === 'All' ? 7 : 13;
      map.setView([centerLat, centerLng], zoom);
    } else {
      // If no donors match the filter, show default view
      const coords = locationCoordinates[selectedLocation] || defaultCoordinates;
      map.setView(coords.center, coords.zoom);
    }
  }, [selectedLocation, filteredDonors, map]);

  return null;
};

const Donor = () => {
  const [allDonors, setAllDonors] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState('All');
  const [selectedBloodGroup, setSelectedBloodGroup] = useState('All');
  const [filteredDonors, setFilteredDonors] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [availableLocations, setAvailableLocations] = useState(['All']);

  // Fetch donors data from API
  useEffect(() => {
    const fetchDonors = async () => {
      try {
        const response = await fetch('https://predict4-life-donor-service.vercel.app/api/donors');
        if (!response.ok) {
          throw new Error('Failed to fetch donor data');
        }
        const data = await response.json();
        
        // Log the first donor data to check fields
        if (data.length > 0) {
          console.log('First donor data from API:', data[0]);
          console.log('Available fields:', Object.keys(data[0]));
        }
        
        // Transform the data to match our structure
        const transformedData = data.map(donor => {
          // Extract city from address (assuming format: "street, city")
          const addressParts = (donor.address || '').split(',');
          const city = addressParts.length > 1 ? addressParts[addressParts.length - 1].trim() : 'Unknown';
          
          return {
            id: donor._id,
            name: donor.name || 'N/A',
            blood_group: donor.blood_group || 'N/A',
            contact_number: donor.contact_number || 'N/A',
            last_donation_date: donor.last_donation_date ? new Date(donor.last_donation_date).toLocaleDateString() : 'N/A',
            address: donor.address || 'N/A',
            city: city,
            lat: donor.latitude || 0,
            lng: donor.longitude || 0
          };
        });

        console.log('Fetched donor data:', transformedData);
        
        // Extract unique cities and sort them
        const cities = [...new Set(transformedData.map(donor => donor.city))].sort();
        setAvailableLocations(['All', ...cities]);
        
        setAllDonors(transformedData);
        setFilteredDonors(transformedData);
        setChartData(getBloodGroupCounts(transformedData));
        setIsLoading(false);
      } catch (err) {
        console.error('Error fetching donors:', err);
        setError(err.message);
        setIsLoading(false);
      }
    };

    fetchDonors();
  }, []);

  useEffect(() => {
    let donorsForTable = allDonors;
    if (selectedLocation !== 'All') {
      donorsForTable = donorsForTable.filter(d => d.city === selectedLocation);
    }
    if (selectedBloodGroup !== 'All') {
      donorsForTable = donorsForTable.filter(d => d.blood_group === selectedBloodGroup);
    }
    setFilteredDonors(donorsForTable);

    const newChartData = getBloodGroupCounts(donorsForTable);
    setChartData(newChartData);

  }, [selectedLocation, selectedBloodGroup, allDonors]);


  return (
    <div className="donors-page-wrapper">
      <header className="donors-header">
        <h2>Find a Donor</h2>
        <p>Filter donors by location and blood group to see analytics and details.</p>
      </header>

      {/* --- Filter Controls (Unchanged) --- */}
      <div className="filter-controls">
        <div className="filter-group">
          <FaMapPin className="filter-icon" />
          <label htmlFor="location-filter">Location</label>
          <select 
            id="location-filter"
            className="filter-select"
            value={selectedLocation}
            onChange={(e) => setSelectedLocation(e.target.value)}
          >
            {availableLocations.map(loc => <option key={loc} value={loc}>{loc}</option>)}
          </select>
        </div>
        <div className="filter-group">
          <FaTint className="filter-icon" />
          <label htmlFor="blood-filter">Blood Group</label>
          <select 
            id="blood-filter"
            className="filter-select"
            value={selectedBloodGroup}
            onChange={(e) => setSelectedBloodGroup(e.target.value)}
          >
            {bloodGroups.map(bg => <option key={bg} value={bg}>{bg}</option>)}
          </select>
        </div>
      </div>

      {/* --- Visuals Grid (Chart & Map) --- */}
      <div className="donors-visuals-grid">
        <div className="dashboard-card chart-card">
          <h3>Blood Group Distribution ({selectedLocation})</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData} margin={{ top: 20, right: 20, left: -20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" />
              <XAxis 
                dataKey="name" 
                stroke="var(--text-secondary)"
                tick={{ fill: 'var(--text-secondary)' }}
              />
              <YAxis 
                stroke="var(--text-secondary)"
                tick={{ fill: 'var(--text-secondary)' }}
              />
              <Tooltip 
                cursor={{ fill: 'var(--bg-secondary)' }}
                contentStyle={{ 
                  backgroundColor: 'var(--card-bg)', 
                  border: '1px solid var(--border-color)', 
                  borderRadius: '8px',
                  color: 'var(--text-primary)'
                }} 
              />
              <Legend 
                wrapperStyle={{ color: 'var(--text-primary)' }}
              />
              <Bar 
                dataKey="count" 
                name="Number of Donors"
                radius={[8, 8, 0, 0]}
              >
                {chartData.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill="var(--accent-color)"
                  />
                ))}
                <LabelList 
                  dataKey="count" 
                  position="top" 
                  offset={8} 
                  className="bar-label"
                  formatter={(value) => `${value}`}
                />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* --- 4. Map Component --- */}
        <div className="dashboard-card map-card">
          <h3>Donor Locations ({selectedLocation})</h3>
          <MapContainer 
            center={locationCoordinates[selectedLocation].center} 
            zoom={locationCoordinates[selectedLocation].zoom} 
            scrollWheelZoom={false} 
            className="map-container"
          >
            <MapController selectedLocation={selectedLocation} filteredDonors={filteredDonors} />
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {/* --- 5. Add Markers Dynamically --- */}
            {filteredDonors.map(donor => (
              <Marker 
                key={donor.id} 
                position={[donor.lat, donor.lng]}
                icon={customIcon}
              >
                <Popup className="donor-popup">
                  <div className="donor-popup-content">
                    <h4>{donor.name}</h4>
                    <p><strong>Blood Group:</strong> {donor.blood_group}</p>
                    <p><strong>Contact:</strong> {donor.contact_number}</p>
                    <p><strong>Address:</strong> {donor.address}</p>
                    <p><strong>Last Donation:</strong> {donor.last_donation_date}</p>
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>
      </div>

      {/* --- Donors Table (Unchanged) --- */}
      <div className="dashboard-card table-card">
        <h3>Donor Details</h3>
        {/* ... Table (Unchanged) ... */}
        <p>Showing {filteredDonors.length} donors matching your criteria</p>
        <div className="table-wrapper">
          {isLoading ? (
            <div className="loading-message">Loading donor data...</div>
          ) : error ? (
            <div className="error-message">{error}</div>
          ) : (
            <table className="donors-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Blood Group</th>
                  <th>Contact</th>
                  <th>Last Donation</th>
                  <th>Address</th>
                </tr>
              </thead>
              <tbody>
                {filteredDonors.length > 0 ? (
                  filteredDonors.map(donor => (
                    <tr key={donor.id}>
                      <td>{donor.name}</td>
                      <td><span className="blood-group-tag">{donor.blood_group}</span></td>
                      <td>{donor.contact_number}</td>
                      <td>{donor.last_donation_date}</td>
                      <td>{donor.address}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="no-donors-found">
                      No donors found matching your criteria.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default Donor;