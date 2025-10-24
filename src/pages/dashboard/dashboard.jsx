import React, { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import './dashboard.css';

// Function to process donor data by city
const processDonorsByCity = (donors) => {
    const cityCount = donors.reduce((acc, donor) => {
        const addressParts = (donor.address || '').split(',');
        const city = addressParts.length > 1 ? addressParts[addressParts.length - 1].trim() : 'Unknown';
        acc[city] = (acc[city] || 0) + 1;
        return acc;
    }, {});

    return Object.entries(cityCount)
        .map(([name, value]) => ({ name, value }))
        .sort((a, b) => b.value - a.value); // Sort by count in descending order
};

const eventData = [
    { id: 1, title: 'Annual Blood Drive', location: 'Downtown Community Hall', date: '2025-11-15' },
    { id: 2, title: 'University Campus Campaign', location: 'State University Quad', date: '2025-11-22' },
    { id: 3, title: 'Corporate Wellness Event', location: 'Tech Park Auditorium', date: '2025-12-05' },
];



const bloodGroupData = [
    { name: 'A+', percentage: Math.min(85, 100) },
    { name: 'O+', percentage: Math.min(60, 100) },
    { name: 'B+', percentage: Math.min(45, 100) },
    { name: 'AB+', percentage: Math.min(30, 100) },
    { name: 'A-', percentage: Math.min(70, 100) },
    { name: 'O-', percentage: Math.min(95, 100) },
    { name: 'B-', percentage: Math.min(25, 100) },
    { name: 'AB-', percentage: Math.min(55, 100) },
];

const COLORS = ['#d9232d', '#b01c25', '#8a161f', '#621016'];

const Dashboard = () => {
    const [donors, setDonors] = useState([]);
    const [cityData, setCityData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchDonors = async () => {
            try {
                const response = await fetch('https://predict4-life-donor-service.vercel.app/api/donors');
                if (!response.ok) {
                    throw new Error('Failed to fetch donor data');
                }
                const data = await response.json();
                
                // Detailed logging of the API response
                console.log('Raw API Response:', data);
                if (data.length > 0) {
                    console.log('Sample donor fields:', Object.keys(data[0]));
                    console.log('Sample donor data:', data[0]);
                }
                
                // Log detailed donor data for debugging
                console.log('Raw donor data:', data);
                if (data.length > 0) {
                    console.log('First donor data:', {
                        name: data[0].name,
                        address: data[0].address,
                        blood_group: data[0].blood_group,
                        email: data[0].email
                    });
                }
                setDonors(data);
                
                // Process city data for pie chart
                const processedCityData = processDonorsByCity(data);
                console.log('City data:', processedCityData);
                setCityData(processedCityData);
                setIsLoading(false);
            } catch (err) {
                setError(err.message);
                setIsLoading(false);
            }
        };

        fetchDonors();
    }, []);

    return (
        <div className="dashboard-container">
            <header className="dashboard-header">
               
            </header>

            <main className="dashboard-grid">
                <section className="dashboard-card chart-card">
                    <h3>Donor Distribution by City</h3>
                    <div className="chart-and-stats">
                        <div className="pie-chart-container">
                            {isLoading ? (
                                <div className="loading-message">Loading data...</div>
                            ) : error ? (
                                <div className="error-message">{error}</div>
                            ) : (
                                <ResponsiveContainer width="100%" height={250}>
                                    <PieChart>
                                        <Pie 
                                            data={cityData} 
                                            cx="50%" 
                                            cy="50%" 
                                            labelLine={true}
                                            outerRadius={80} 
                                            fill="#8884d8" 
                                            dataKey="value" 
                                            nameKey="name"
                                            label={(entry) => `${entry.name}: ${entry.value}`}
                                        >
                                            {cityData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                            ))}
                                        </Pie>
                                        <Tooltip formatter={(value, name) => [`${value} donors`, `${name}`]} />
                                        <Legend />
                                    </PieChart>
                                </ResponsiveContainer>
                            )}
                        </div>
                        <div className="stats-container">
                            <div className="stat-item">
                                <h4>Total Donors</h4>
                                <p>{donors.length}</p>
                            </div>
                            <div className="stat-item">
                                <h4>Cities</h4>
                                <p>{cityData.length}</p>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="dashboard-card events-card">
                    <h3>Upcoming Events</h3>
                    <div className="events-grid">
                        {eventData.map(event => (
                            <div key={event.id} className="event-item">
                                <h4>{event.title}</h4>
                                <p className="event-detail">{event.location} - {event.date}</p>
                                <button className="event-button">View Details</button>
                            </div>
                        ))}
                    </div>
                </section>

                <section className="dashboard-card blood-group-card">
                    <h3>Current Blood Levels (%)</h3>
                    <div className="blood-drops-container">
                        {bloodGroupData.map((group) => (
                            <div key={group.name} className="blood-drop-wrapper">
                                <div 
                                    className="blood-drop" 
                                    // This style attribute is the key change!
                                    style={{ '--fill-percentage': `${group.percentage}%` }}
                                >
                                    <div className="blood-drop-content">{group.percentage}%</div>
                                </div>
                                <div className="blood-drop-label">{group.name}</div>
                            </div>
                        ))}
                    </div>
                </section>

                <section className="dashboard-card table-card">
                    <h3>Donor Locations</h3>
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
                                        <th>Address</th>
                                        <th>Blood Group</th>
                                        <th>Email</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {donors.map((donor) => (
                                        <tr key={donor._id || donor.id}>
                                            <td>{donor.name || 'N/A'}</td>
                                            <td>{donor.address || 'N/A'}</td>
                                            <td>{donor.blood_group || 'N/A'}</td>
                                            <td>{donor.email || 'N/A'}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>
                </section>
            </main>
        </div>
    );
};

export default Dashboard;