// CalendarComponent.js
import React, { useState } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import moment from 'moment';

const localizer = momentLocalizer(moment);

const CalendarComponent = ({ events }) => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [hoursToAdd, setHoursToAdd] = useState(0);

  const handleSelectSlot = ({ start }) => {
    setSelectedDate(start);
    const hours = prompt('Enter number of hours:');
    if (hours !== null) {
      setHoursToAdd(Number(hours));
    }
  };

  const handleAddHours = async () => {
    if (selectedDate !== null && hoursToAdd > 0) {
      try {
        const token = localStorage.getItem('token'); // Assuming you store the token in localStorage
        const userId = localStorage.getItem('userId'); // Assuming you store the userId in localStorage

        const response = await fetch('/api/stats', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            userId,
            date: selectedDate,
            hours: hoursToAdd
          })
        });

        if (!response.ok) {
          throw new Error('Failed to add hours');
        }

        alert(`Hours added successfully for ${selectedDate}`);
        setSelectedDate(null);
        setHoursToAdd(0);
      } catch (error) {
        console.error('Error adding hours:', error);
        alert('Failed to add hours. Please try again later.');
      }
    } else {
      alert('Please select a date and enter valid hours.');
    }
  };

  return (
    <div style={{ height: '39vh' }}>
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        style={{ margin: '50px' }}
        selectable
        onSelectSlot={handleSelectSlot}
      />
      <button onClick={handleAddHours}>Add Hours</button>
    </div>
  );
};

export default CalendarComponent;
