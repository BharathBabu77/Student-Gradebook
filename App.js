import React, { useState, useEffect } from 'react';
import axios from 'axios';

const App = () => {
  const [students, setStudents] = useState([]);
  const [grades, setGrades] = useState([]);
  const [newStudent, setNewStudent] = useState({ name: '' });
  const [newGrade, setNewGrade] = useState({ value: 0, student_id: 0 });

  useEffect(() => {
    axios.get('http://localhost:5000/students')
      .then(response => setStudents(response.data))
      .catch(error => console.error('Error fetching students:', error));

    axios.get('http://localhost:5000/grades')
      .then(response => setGrades(response.data))
      .catch(error => console.error('Error fetching grades:', error));
  }, []);

  const addStudent = () => {
    axios.post('http://localhost:5000/students', newStudent)
      .then(response => setStudents([...students, response.data]))
      .catch(error => console.error('Error adding student:', error));
  };

  const addGrade = () => {
    axios.post('http://localhost:5000/grades', newGrade)
      .then(response => setGrades([...grades, response.data]))
      .catch(error => console.error('Error adding grade:', error));
  };

  return (
    <div>
      <h1>Student Gradebook</h1>
      <div>
        <input type="text" placeholder="Student Name" value={newStudent.name} onChange={(e) => setNewStudent({ ...newStudent, name: e.target.value })} />
        <button onClick={addStudent}>Add Student</button>
      </div>
      <div>
        <select onChange={(e) => setNewGrade({ ...newGrade, student_id: parseInt(e.target.value) })}>
          <option value="">Select Student</option>
          {students.map(student => (
            <option key={student.id} value={student.id}>{student.name}</option>
          ))}
        </select>
        <input type="number" placeholder="Grade Value" value={newGrade.value} onChange={(e) => setNewGrade({ ...newGrade, value: parseFloat(e.target.value) || 0 })} />
        <button onClick={addGrade}>Add Grade</button>
      </div>
      <ul>
        {grades.map(grade => (
          <li key={grade.id}>
            {`Student ID ${grade.student_id}: ${grade.value}`}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default App;
