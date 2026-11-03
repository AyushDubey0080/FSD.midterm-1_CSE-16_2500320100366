const express = require('express');
const app = express();
const PORT = 3000;
const students = [];
const requiredFields = ['id', 'name', 'email', 'course', 'age'];
const updateFields = ['name', 'email', 'course', 'age'];

app.use(express.json());

function validateStudent(student, fields) {
  if (!student || typeof student !== 'object' || Array.isArray(student)) {
    return { error: 'Request body must be a JSON object.' };
  }

  const missingFields = fields.filter((field) =>
    student[field] === undefined || student[field] === null || student[field] === ''
  );
  if (missingFields.length > 0) {
    return { error: 'Missing mandatory fields.', missingFields };
  }

  if (fields.includes('id') && (!Number.isInteger(student.id) || student.id <= 0)) {
    return { error: 'id must be a positive integer.' };
  }
  if (typeof student.name !== 'string' || typeof student.email !== 'string' ||
      typeof student.course !== 'string' || !Number.isInteger(student.age) || student.age <= 0) {
    return { error: 'name, email, and course must be strings; age must be a positive integer.' };
  }
  if (!/^\S+@\S+\.\S+$/.test(student.email.trim())) {
    return { error: 'email must be a valid email address.' };
  }
  if (!student.name.trim() || !student.course.trim()) {
    return { error: 'name and course must not be blank.' };
  }
  return null;
}

function findStudentIndex(id) {
  return students.findIndex((student) => student.id === Number(id));
}

app.post('/api/students', (req, res) => {
  const student = req.body;
  const validationError = validateStudent(student, requiredFields);
  if (validationError) return res.status(400).json(validationError);

  if (students.some((record) => record.id === student.id)) {
    return res.status(409).json({ error: `A student with id ${student.id} already exists.` });
  }

  const createdStudent = {
    id: student.id,
    name: student.name.trim(),
    email: student.email.trim(),
    course: student.course.trim(),
    age: student.age,
  };
  students.push(createdStudent);
  return res.status(201).json({ message: 'Student created successfully.', student: createdStudent });
});

app.get('/api/students', (req, res) => {
  return res.status(200).json(students);
});

app.get('/api/students/:id', (req, res) => {
  const studentIndex = findStudentIndex(req.params.id);
  if (studentIndex === -1) {
    return res.status(404).json({ error: `Student with id ${req.params.id} was not found.` });
  }
  return res.status(200).json(students[studentIndex]);
});

app.put('/api/students/:id', (req, res) => {
  const studentIndex = findStudentIndex(req.params.id);
  if (studentIndex === -1) {
    return res.status(404).json({ error: `Student with id ${req.params.id} was not found.` });
  }

  const validationError = validateStudent(req.body, updateFields);
  if (validationError) return res.status(400).json(validationError);

  const updatedStudent = {
    id: students[studentIndex].id,
    name: req.body.name.trim(),
    email: req.body.email.trim(),
    course: req.body.course.trim(),
    age: req.body.age,
  };
  students[studentIndex] = updatedStudent;
  return res.status(200).json({ message: 'Student updated successfully.', student: updatedStudent });
});

app.delete('/api/students/:id', (req, res) => {
  const studentIndex = findStudentIndex(req.params.id);
  if (studentIndex === -1) {
    return res.status(404).json({ error: `Student with id ${req.params.id} was not found.` });
  }

  const [deletedStudent] = students.splice(studentIndex, 1);
  return res.status(200).json({ message: 'Student deleted successfully.', student: deletedStudent });
});

app.listen(PORT, () => {
  console.log(`Student API is running at http://localhost:${PORT}`);
});
