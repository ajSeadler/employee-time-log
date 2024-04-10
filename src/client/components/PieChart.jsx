// PieChart.js

import React from 'react';
import { Pie } from 'react-chartjs-2';

const PieChart = ({ data }) => {
  const chartData = {
    labels: data.map(item => item.month),
    datasets: [
      {
        label: 'Sales',
        data: data.map(item => item.sales),
        backgroundColor: [
          '#8EB8E5',
          '#7C99B4',
          '#6B7F82',
          '#5B5750',
          '#492C1D',
          '#FF5733', // Additional colors if needed
          '#FFC300',
          '#C70039',
          '#900C3F',
          '#581845',
        ],
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
      },
    },
  };

  return (
    <div className="pie-chart-container" style={{ width: '80%', margin: 'auto' }}>
      <div style={{ position: 'relative', height: '400px', }}>
        <Pie data={chartData} options={chartOptions} />
      </div>
    </div>
  );
};

export default PieChart;
