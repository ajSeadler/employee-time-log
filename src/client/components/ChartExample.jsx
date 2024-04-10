// Home.js

import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart, registerables } from 'chart.js';
import 'chartjs-adapter-date-fns';
import { FaEdit, FaTrash } from 'react-icons/fa';
import PieChart from './PieChart';
import BarGraph from './BarGraph';

Chart.register(...registerables);

const ChartExample = () => {
  const [salesData, setSalesData] = useState([]);
  const [newMonth, setNewMonth] = useState('');
  const [newSales, setNewSales] = useState('');
  const [predictionData, setPredictionData] = useState([]);
  const [showPrediction, setShowPrediction] = useState(false);

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

  const generatePrediction = () => {
    if (salesData.length === 0) {
      console.error('No sales data available for prediction.');
      return;
    }
    
    const lastMonth = new Date(salesData[salesData.length - 1]?.month);
    lastMonth.setMonth(lastMonth.getMonth() + 1); // Get the next month
    const predictions = [];
    
    for (let i = 0; i < 6; i++) {
      const nextMonth = new Date(lastMonth);
      nextMonth.setMonth(nextMonth.getMonth() + i);
      
      const prediction = {
        month: nextMonth.toLocaleString('en-us', { month: 'long', year: 'numeric' }),
        sales: salesData[salesData.length - 1]?.sales + (i + 1) * 0.1 * salesData[salesData.length - 1]?.sales // Simple prediction algorithm
      };
      
      predictions.push(prediction);
    }
    
    setPredictionData(predictions);
    setShowPrediction(true);
  };

  const handleAddData = async () => {
    if (newMonth && newSales) {
      const newData = {
        month: newMonth,
        sales: parseFloat(newSales)
      };

      try {
        const response = await fetch('/api/sales', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(newData)
        });
        if (!response.ok) {
          throw new Error('Failed to add sales data');
        }
        // After adding new data, refetch the sales data to update the chart
        fetchData();
        setNewMonth('');
        setNewSales('');
      } catch (error) {
        console.error('Error adding sales data:', error);
      }
    }
  };

  const handleEdit = async (id) => {
    // Find the sale data to be edited
    const saleToEdit = salesData.find(data => data.id === id);
    
    // Prompt the user to enter the new month and sales
    const editedMonth = prompt('Enter the new month:', saleToEdit.month);
    const editedSales = prompt('Enter the new sales:', saleToEdit.sales);
  
    // Check if the user provided new data
    if (editedMonth !== null && editedSales !== null) {
      const editedData = {
        month: editedMonth,
        sales: parseFloat(editedSales)
      };
  
      try {
        const response = await fetch(`/api/sales/${id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(editedData)
        });
        if (!response.ok) {
          throw new Error('Failed to edit sales data');
        }
        // After editing data, refetch the sales data to update the chart
        fetchData();
      } catch (error) {
        console.error('Error editing sales data:', error);
      }
    }
  };
  

  // const handleDelete = async (id) => {
  //   try {
  //     const response = await fetch(`/api/sales/${id}`, {
  //       method: 'DELETE',
  //     });
  //     if (!response.ok) {
  //       throw new Error('Failed to delete sales data');
  //     }
  //     // After deleting data, refetch the sales data to update the chart
  //     fetchData();
  //   } catch (error) {
  //     console.error('Error deleting sales data:', error);
  //   }
  // };

  const chartData = {
    labels: [...salesData.map(data => data.month), ...predictionData.map(data => data.month)],
    datasets: [
      {
        label: 'Actual Sales',
        data: salesData.map(data => data.sales).concat(Array(6).fill(null)),
        fill: true,
        borderColor: '#7D7461',
        tension: 0.1,
      },
      {
        label: 'Predicted Sales',
        data: Array(salesData.length).fill(null).concat(predictionData.map(data => data.sales)),
        fill: true,
        borderColor: '#FF5733',
        tension: 0.1,
      },
    ],
  };

  const chartOptions = {
    scales: {
      x: {
        type: 'category',
        title: {
          display: true,
          text: 'Month',
        },
      },
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Sales',
        },
      },
    },
  };

  return (
    <>
    <div className="container">
      <h1>Interactive Example</h1>
    <div className="chart-container">
    <h2>Monthly Sales</h2>
    <Line data={chartData} options={chartOptions} />
    <div className="pie">
    <PieChart data={salesData} />
    <BarGraph />
    </div>
    
  </div>
      <div className="input-container">
        <h2>Input Sales Data</h2>
        <table>
        <tr>
              <td>
                <input
                  type="text"
                  value={newMonth}
                  onChange={(e) => setNewMonth(e.target.value)}
                  placeholder="Month"
                />
              </td>
              <td>
                <input
                  type="text"
                  value={newSales}
                  onChange={(e) => setNewSales(e.target.value)}
                  placeholder="Sales"
                />
              </td>
              <td>
                <button onClick={handleAddData}>Add</button>
              </td>
            </tr>
          <thead>
            <tr>
              <th>Month</th>
              <th>Sales</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {salesData.map((data, index) => (
              <tr key={index}>
                <td>{data.month}</td>
                <td>{data.sales}</td>
                <td> <div className="icons">
                  <FaEdit onClick={() => handleEdit(data.id)} />
                  {/* <FaTrash onClick={() => handleDelete(data.id)} />  */}
                  </div>
                </td>
              </tr>
            ))}
            
          </tbody>
        </         table>
        <button onClick={generatePrediction} style={{margin:'3%'}}>Generate 6-Month Prediction</button>
      </div>
      
    </div>
  
  </>
);
};

export default ChartExample;

