



import React, { useState, useEffect } from "react";
import axios from "axios";
import 'bootstrap/dist/css/bootstrap.min.css';

const Timetable = () => {
  const [timetableData, setTimetableData] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:5000/api/generate-timetable")
      .then(response => {
        console.log(response, "response");
        setTimetableData(response.data.timetable);
      })
      .catch(error => {
        console.error("Error fetching timetable data: ", error);
      });
  }, []);

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4">Timetable</h2>
      {timetableData.map((item, index) => (
        <div key={index} className="mb-5">
          <h3 className="text-center mb-3">{item.department} - Semester {item.semester}</h3>
          <table className="table table-bordered">
            <thead className="thead-dark">
              <tr>
                <th>Day</th>
                <th>8:00-9:00</th>
                <th>9:00-10:00</th>
                <th>10:30-11:30</th>
                <th>11:30-12:30</th>
                <th>2:00-3:00</th>
                <th>3:00-4:00</th>
                <th>4:00-5:00</th> {/* Added Period 7 */}
              </tr>
            </thead>
            <tbody>
              {item.timetable.map((day, dayIndex) => (
                <tr key={dayIndex}>
                  <td className="font-weight-bold">{["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"][dayIndex]}</td>
                  {day.map((period, periodIndex) => (
                    <td key={periodIndex} className="p-3">
                      <div className="border p-2 bg-light">
                        {period ? `${period.subject} - ${period.teacher}` : "-"}
                      </div>
                    </td>
                  ))}
                  <td className="p-3">
                    <div className="border p-2 bg-light">
                      {day[6] ? `${day[6].subject} - ${day[6].teacher}` : "-"} {/* Display Period 7 */}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ))}
    </div>
  );
};

export default Timetable;
