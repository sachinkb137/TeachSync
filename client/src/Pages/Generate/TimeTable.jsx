import React from 'react';

const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const timeSlots = [
  '8:00-9:00', '9:00-10:00',
  '10:30-11:30', '11:30-12:30',
  '14:00-15:00', '15:00-16:00', '16:00-17:00', '17:00-18:00'
];

function TimeTable({ data }) {
  const getSlotDetails = (day, timeSlot) => {
    const [startTime] = timeSlot.split('-');
    const slot = data.slots.find(
      s => s.day === day && s.startTime === `${startTime}`
    );
    
    if (!slot) return null;

    return {
      subjectName: slot.subject.subjectName,
      subjectType: slot.subject.subjectType,
      teacherName: slot.teacher.teacherName,
      room: slot.room
    };
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Day / Time
            </th>
            {timeSlots.map(timeSlot => (
              <th 
                key={timeSlot}
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                {timeSlot}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {days.map(day => (
            <tr key={day}>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                {day}
              </td>
              {timeSlots.map(timeSlot => {
                const slot = getSlotDetails(day, timeSlot);
                return (
                  <td key={`${day}-${timeSlot}`} className="px-6 py-4 whitespace-nowrap">
                    {slot ? (
                      <div className="text-sm">
                        <div className="font-medium text-gray-900">{slot.subjectName}</div>
                        <div className="text-gray-500">{slot.teacherName}</div>
                        <div className="text-gray-500">Room: {slot.room}</div>
                        <div className={`text-xs mt-1 inline-flex items-center px-2.5 py-0.5 rounded-full ${
                          slot.subjectType === 'Theory' ? 'bg-blue-100 text-blue-800' :
                          slot.subjectType === 'Lab' ? 'bg-green-100 text-green-800' :
                          'bg-purple-100 text-purple-800'
                        }`}>
                          {slot.subjectType}
                        </div>
                      </div>
                    ) : null}
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
