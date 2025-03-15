import React from 'react';
import { ScheduleComponent, Day, Week, WorkWeek, Month, Agenda, Inject } from '@syncfusion/ej2-react-schedule';
import '@syncfusion/ej2-base/styles/material.css';
import '@syncfusion/ej2-react-schedule/styles/material.css';

function Schedular() {
  // Sample data
  const data = [
    {
      Id: 1,
      Subject: 'Meeting with team',
      StartTime: new Date(2025, 2, 15, 10, 0), // March 15, 2025, 10:00 AM
      EndTime: new Date(2025, 2, 15, 12, 0),   // March 15, 2025, 12:00 PM
      IsAllDay: false,
      Status: 'Confirmed',
      Priority: 'High'
    },
    {
      Id: 2,
      Subject: 'Project Review',
      StartTime: new Date(2025, 2, 16, 14, 0), // March 16, 2025, 2:00 PM
      EndTime: new Date(2025, 2, 16, 16, 0),   // March 16, 2025, 4:00 PM
      IsAllDay: false,
      Status: 'Tentative',
      Priority: 'Normal'
    }
  ];

  return (
    <div className="App">
      <h2>Syncfusion React Scheduler</h2>
      <ScheduleComponent 
        height='550px' 
        selectedDate={new Date()} 
        eventSettings={{ dataSource: data }}
      >
        <Inject services={[Day, Week, WorkWeek, Month, Agenda]} />
      </ScheduleComponent>
    </div>
  );
}

export default Schedular;