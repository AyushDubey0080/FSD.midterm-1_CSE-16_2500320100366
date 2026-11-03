# FSD-Mid-Term-1

## Student details

- Student Name: [Add your name]
- Roll Number: [Add your roll number]

## Student Records API

An Express application for creating, retrieving, updating, and deleting student records.
Records are kept in memory and reset when the server restarts.

Each student has `id`, `name`, `email`, `course`, and `age` fields. Create requests require
all five fields. Update requests require `name`, `email`, `course`, and `age`; the ID in
the URL identifies the record. Missing records return HTTP `404`, invalid data returns
HTTP `400`, and duplicate IDs on creation return HTTP `409`.

| Method | Endpoint            | Description           |
| ------ | ------------------- | --------------------- |
| POST   | `/api/students`     | Create a student      |
| GET    | `/api/students`     | Retrieve all students |
| GET    | `/api/students/:id` | Retrieve one student  |
| PUT    | `/api/students/:id` | Update a student      |
| DELETE | `/api/students/:id` | Delete a student      |

## Setup and run

```bash
npm install
npm start
```

The server listens on port `3000`.

## Example request

```bash
curl -X POST http://localhost:3000/api/students `
  -H "Content-Type: application/json" `
  -d '{"id":101,"name":"Rahul Sharma","email":"rahul@gmail.com","course":"CSE","age":21}'
```
