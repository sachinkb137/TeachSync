import React from 'react';
import './Timetable.css';

const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const timeSlots = [
  '8:00-9:00', '9:00-10:00', 
  '10:00-10:30', // Short break
  '10:30-11:30', '11:30-12:30',
  '12:30-14:00', // Lunch break
  '14:00-15:00', '15:00-16:00', '16:00-17:00', '17:00-18:00'
];

function TimeTable({ data }) {
  const getSlotDetails = (day, timeSlot) => {
    const [startTime] = timeSlot.split('-');
    const slot = data.slots.find(
      s => s.day === day && s.startTime === `${startTime}`
    );
    
    if (!slot || !slot.subject) return null;

    return {
      subjectName: slot.subject.subjectName,
      subjectType: slot.subject.subjectType,
      teacherName: slot.teacher ? slot.teacher.teacherName : 'N/A',
      room: slot.room ? slot.room : 'N/A'
    };
  };

  return (
    <div className="table-container">
      <table className="time-table">
        <thead>
          <tr>
            <th className="table-header">Day / Time</th>
            {timeSlots.map(timeSlot => (
              <th 
                key={timeSlot}
                className={`table-header ${['10:00-10:30', '12:30-14:00'].includes(timeSlot) ? 'break-column' : ''}`}
              >
                {['10:00-10:30', '12:30-14:00'].includes(timeSlot) ? (
                  <span className="break-label vertical-text">
                    {timeSlot === '10:00-10:30' ? 'Short Break' : 'Lunch Break'}
                  </span>
                ) : (
                  timeSlot
                )}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {days.map((day, idx) => (
            <tr key={day} className={`table-row ${idx % 2 === 0 ? 'even-row' : 'odd-row'}`}>
              <td className="table-cell">{day}</td>
              {timeSlots.map(timeSlot => {
                if (['10:00-10:30', '12:30-14:00'].includes(timeSlot)) {
                  return (
                    <td 
                      key={`${day}-${timeSlot}`} 
                      className="table-cell break-cell"
                    >
                      <span className="vertical-text">
                        {timeSlot === '10:00-10:30' ? 'Short Break' : 'Lunch Break'}
                      </span>
                    </td>
                  );
                }

                const slot = getSlotDetails(day, timeSlot);
                return (
                  <td 
                    key={`${day}-${timeSlot}`} 
                    className="table-cell"
                  >
                    {slot ? (
                      <div className="slot-details">
                        <div className="subject-name">{slot.subjectName}</div>
                        <div className="teacher-name">{slot.teacherName}</div>
                        {/* <div className="room">Room: {slot.room}</div> */}
                        <div className={`subject-type ${slot.subjectType.toLowerCase()}`}>
                          {slot.subjectType}
                        </div>
                      </div>
                    ) : (
                      <span className="no-slot">-</span>
                    )}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default TimeTable;
