import React, { useState, useEffect } from 'react';
// --- 1. Import Map Components ---
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, 
  LabelList, Cell
} from 'recharts';
import { FaMapPin, FaTint, FaFilter } from 'react-icons/fa';
import 'leaflet/dist/leaflet.css';
import './Donar.css'; 

// --- 2. MOCK DATA (Now with lat/lng) ---
const allDonors = [
  { id: 1, name: 'John Doe', contact: '077-1234567', address: '123 Galle Rd, Colombo 3', location: 'Colombo', bloodGroup: 'O+', lat: 6.8835, lng: 79.8524 },
  { id: 2, name: 'Jane Smith', contact: '071-8765432', address: '456 Kandy Rd, Kandy', location: 'Kandy', bloodGroup: 'A+', lat: 7.2906, lng: 80.6337 },
  { id: 3, name: 'Sam Wilson', contact: '072-1112223', address: '789 Temple St, Kandy', location: 'Kandy', bloodGroup: 'B+', lat: 7.2930, lng: 80.6350 },
  { id: 4, name: 'Lisa Ray', contact: '076-4455667', address: '101 Marine Dr, Colombo 6', location: 'Colombo', bloodGroup: 'A+', lat: 6.8732, lng: 79.8596 },
  { id: 5, name: 'Mike Ross', contact: '078-9988776', address: '222 Lake Rd, Kandy', location: 'Kandy', bloodGroup: 'O-', lat: 7.2914, lng: 80.6360 },
  { id: 6, name: 'Aruni Perera', contact: '075-3322114', address: '333 Lighthouse St, Galle', location: 'Galle', bloodGroup: 'AB+', lat: 6.0264, lng: 80.2170 },
  { id: 7, name: 'David Lee', contact: '077-5554443', address: '444 Fort, Galle', location: 'Galle', bloodGroup: 'O+', lat: 6.0240, lng: 80.2150 },
  { id: 8, name: 'Nimal Silva', contact: '071-2223334', address: '555 High St, Colombo 4', location: 'Colombo', bloodGroup: 'B-', lat: 6.8900, lng: 79.8510 },
];

const locations = ['All', 'Colombo', 'Kandy', 'Galle', 'Jaffna', 'Matara'];
const bloodGroups = ['All', 'A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'];

const getBloodGroupCounts = (donors, location) => {
  const filtered = location === 'All' 
    ? donors 
    : donors.filter(d => d.location === location);

  const counts = filtered.reduce((acc, donor) => {
    acc[donor.bloodGroup] = (acc[donor.bloodGroup] || 0) + 1;
    return acc;
  }, {});

  return Object.keys(counts).map(key => ({
    name: key,
    count: counts[key],
  }));
};

// --- 3. Location coordinates mapping ---
const locationCoordinates = {
  'Colombo': { center: [6.9271, 79.8612], zoom: 12 },
  'Kandy': { center: [7.2906, 80.6337], zoom: 13 },
  'Galle': { center: [6.0329, 80.2168], zoom: 13 },
  'Jaffna': { center: [9.6615, 80.0255], zoom: 12 },
  'Matara': { center: [5.9549, 80.5550], zoom: 13 },
  'All': { center: [7.8731, 80.7718], zoom: 7 }  // Sri Lanka center
};

// Map Controller Component to handle view updates
const MapController = ({ selectedLocation }) => {
  const map = useMap();

  useEffect(() => {
    const { center, zoom } = locationCoordinates[selectedLocation];
    map.setView(center, zoom, {
      animate: true,
      duration: 1
    });
  }, [selectedLocation, map]);

  return null;
};

const Donor = () => {
  const [selectedLocation, setSelectedLocation] = useState('All');
  const [selectedBloodGroup, setSelectedBloodGroup] = useState('All');
  const [filteredDonors, setFilteredDonors] = useState(allDonors);
  const [chartData, setChartData] = useState(getBloodGroupCounts(allDonors, 'All'));

  useEffect(() => {
    let donorsForTable = allDonors;
    if (selectedLocation !== 'All') {
      donorsForTable = donorsForTable.filter(d => d.location === selectedLocation);
    }
    if (selectedBloodGroup !== 'All') {
      donorsForTable = donorsForTable.filter(d => d.bloodGroup === selectedBloodGroup);
    }
    setFilteredDonors(donorsForTable);

    const newChartData = getBloodGroupCounts(allDonors, selectedLocation);
    setChartData(newChartData);

  }, [selectedLocation, selectedBloodGroup]);


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
            {locations.map(loc => <option key={loc} value={loc}>{loc}</option>)}
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
            <MapController selectedLocation={selectedLocation} />
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {/* --- 5. Add Markers Dynamically --- */}
            {filteredDonors.map(donor => (
              <Marker key={donor.id} position={[donor.lat, donor.lng]}>
                <Popup>
                  <b>{donor.name}</b> ({donor.bloodGroup})<br />
                  {donor.contact}<br />
                  {donor.address}
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
          <table className="donors-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Blood Group</th>
                <th>Contact</th>
                <th>Location</th>
                <th>Address</th>
              </tr>
            </thead>
            <tbody>
              {filteredDonors.length > 0 ? (
                filteredDonors.map(donor => (
                  <tr key={donor.id}>
                    <td>{donor.name}</td>
                    <td><span className="blood-group-tag">{donor.bloodGroup}</span></td>
                    <td>{donor.contact}</td>
                    <td>{donor.location}</td>
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
        </div>
      </div>
    </div>
  );
};

export default Donor;