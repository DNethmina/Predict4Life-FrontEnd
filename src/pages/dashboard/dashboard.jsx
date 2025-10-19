import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import './dashboard.css';

// --- Mock Data (replace with your actual data from an API) ---
const hospitalData = [
    { name: 'City General Hospital', value: 450 },
    { name: 'County Medical Center', value: 300 },
    { name: 'St. Jude\'s Hospital', value: 280 },
    { name: 'Red Cross Center', value: 200 },
];

const eventData = [
    { id: 1, title: 'Annual Blood Drive', location: 'Downtown Community Hall', date: '2025-11-15' },
    { id: 2, title: 'University Campus Campaign', location: 'State University Quad', date: '2025-11-22' },
    { id: 3, title: 'Corporate Wellness Event', location: 'Tech Park Auditorium', date: '2025-12-05' },
];

const donorData = [
    { id: 1, name: 'John Doe', contact: '555-1234', address: '123 Maple St, Colombo', location: 'Colombo' },
    { id: 2, name: 'Jane Smith', contact: '555-5678', address: '456 Oak Ave, Kandy', location: 'Kandy' },
    { id: 3, name: 'Sam Wilson', contact: '555-8765', address: '789 Pine Ln, Galle', location: 'Galle' },
    { id: 4, name: 'Lisa Ray', contact: '555-4321', address: '101 Birch Rd, Jaffna', location: 'Jaffna' },
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
    return (
        <div className="dashboard-container">
            <header className="dashboard-header">
               
            </header>

            <main className="dashboard-grid">
                <section className="dashboard-card chart-card">
                    <h3>Hospital Blood Supply Overview</h3>
                    <div className="chart-and-stats">
                        <div className="pie-chart-container">
                            <ResponsiveContainer width="100%" height={250}>
                                <PieChart>
                                    <Pie data={hospitalData} cx="50%" cy="50%" labelLine={false} outerRadius={80} fill="#8884d8" dataKey="value" nameKey="name">
                                        {hospitalData.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                                    </Pie>
                                    <Tooltip />
                                    <Legend />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                        <div className="stats-container">
                            <div className="stat-item"><h4>Next Month's Need</h4><p>1,250 Units</p></div>
                            <div className="stat-item"><h4>Projected Waste</h4><p>85 Units</p></div>
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
                        <table className="donors-table">
                            <thead><tr><th>Name</th><th>Contact</th><th>Address</th><th>Location</th></tr></thead>
                            <tbody>
                                {donorData.map(donor => (
                                    <tr key={donor.id}>
                                        <td>{donor.name}</td><td>{donor.contact}</td><td>{donor.address}</td><td>{donor.location}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </section>
            </main>
        </div>
    );
};

export default Dashboard;