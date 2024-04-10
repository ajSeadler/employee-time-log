import React, { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';

const BarGraph = () => {
  const [salesData, setSalesData] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await fetch('/api/sales');
      if (!response.ok) {
        throw new Error('Failed to fetch sales data');
      }
      const data = await response.json();
      setSalesData(data);
    } catch (error) {
      console.error('Error fetching sales data:', error);
    }
  };

  // Prepare data for the bar graph
  const barData = {
    labels: salesData.map(data => data.month),
    datasets: [
      {
        label: 'Sales',
        data: salesData.map(data => data.sales),
        backgroundColor: '#7D7461', // Bar color
      },
    ],
  };

  // Options to customize the appearance of the bar graph
  const options = {
    maintainAspectRatio: false, // Don't maintain aspect ratio
    responsive: true, // Make the chart responsive
    scales: {
      yAxes: [{
        ticks: {
          beginAtZero: true // Start y-axis from zero
        }
      }]
    }
  };

  return (
    <div className="bar-graph-container">
      <div className="bar-graph" style={{ width: '100%', height: '100%' }}>
        <Bar data={barData} options={options} />
      </div>
    </div>
  );
};

export default BarGraph;
