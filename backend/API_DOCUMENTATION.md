# LMS Backend - API Documentation

## Overview
Learning Management System (LMS) backend built with Node.js, Express, PostgreSQL, and Prisma ORM.
- **Base URL:** `http://localhost:3000`
- **Authentication:** JWT Bearer Token (24-hour expiry)
- **Database:** PostgreSQL with Prisma ORM

---

## Authentication

### Login Endpoint
**POST** `/api/auth/login`

Supports multiple login methods for **Mahasiswa** and **Dosen**:
- **Mahasiswa**: Email or NIM
- **Dosen**: Email or NIP
- Also supports nomorInduk (U001, U002, etc.)

**Request Body Examples:**

**Mahasiswa by Email:**
```json
{
  "nomorInduk": "budi.santoso@kampus.ac.id",
  "password": "password123",
  "role": "MAHASISWA"
}
```

**Mahasiswa by NIM:**
```json
{
  "nomorInduk": "2021002",
  "password": "password123",
  "role": "MAHASISWA"
}
```

**Dosen by Email:**
```json
{
  "nomorInduk": "lestari@kampus.ac.id",
  "password": "password123",
  "role": "DOSEN"
}
```

**Dosen by NIP:**
```json
{
  "nomorInduk": "197803252005012002",
  "password": "password123",
  "role": "DOSEN"
}
```

**Response (200 OK):**
```json
{
  "status": "success",
  "message": "Login berhasil.",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "nomorInduk": "U002",
      "nama": "Budi Santoso",
      "email": "budi.santoso@kampus.ac.id",
      "role": "MAHASISWA"
    }
  }
}
```

**Headers for Protected Endpoints:**
```
Authorization: Bearer <token>
```

---

## Public Endpoints (No Authentication Required)

### Get All Users
**GET** `/api/users`

**Response (200 OK):**
```json
[
  {
    "nomorInduk": "U001",
    "nama": "Ahmad Rizki",
    "email": "ahmad.rizki@kampus.ac.id",
    "role": "ADMIN"
  },
  {
    "nomorInduk": "U002",
    "nama": "Budi Santoso",
    "email": "budi.santoso@kampus.ac.id",
    "role": "MAHASISWA"
  }
]
```

---

## Protected Endpoints (Require JWT Token)

### Dashboard - Mahasiswa
**GET** `/api/dashboard/mahasiswa`

Returns student dashboard data including progress and courses.

**Response (200 OK):**
```json
{
  "progress": 65,
  "mataKuliah": [...],
  "threads": [...]
}
```

---

### Mata Kuliah (Courses)

#### Get All Courses
**GET** `/api/mata-kuliah`

**Response (200 OK):**
```json
[
  {
    "idMataKuliah": 1,
    "kodeMataKuliah": "MK001",
    "namaMataKuliah": "Pemrograman Web",
    "sks": 3,
    "semester": 3
  }
]
```

#### Get Course Detail
**GET** `/api/mata-kuliah/:idMataKuliah`

**Response (200 OK):**
```json
{
  "idMataKuliah": 1,
  "kodeMataKuliah": "MK001",
  "namaMataKuliah": "Pemrograman Web",
  "sks": 3,
  "semester": 3
}
```

#### Get Course Detail with ID
**GET** `/api/mata-kuliah/:idMataKuliah/detail`

**Response (200 OK):** Similar to above

#### Create Course
**POST** `/api/mata-kuliah`

**Request Body:**
```json
{
  "kodeMataKuliah": "MK002",
  "namaMataKuliah": "Database Design",
  "sks": 4,
  "semester": 4
}
```

**Response (201 Created):** Created course object

#### Update Course
**PATCH** `/api/mata-kuliah/:id`

**Request Body:**
```json
{
  "namaMataKuliah": "Advanced Database Design",
  "sks": 4
}
```

**Response (200 OK):** Updated course object

#### Delete Course
**DELETE** `/api/mata-kuliah/:id`

**Response (200 OK):**
```json
{
  "message": "Mata kuliah berhasil dihapus",
  "deletedMataKuliah": { ... }
}
```

---

### Nilai (Grades)

#### Get Student Grades
**GET** `/api/nilai/:nomorInduk`

Get all grades for a specific student.

**Response (200 OK):**
```json
[
  {
    "idNilai": 1,
    "nomorInduk": "U002",
    "idMataKuliah": 1,
    "nilaiUts": 85,
    "nilaiUas": 90,
    "nilaiTugas": 88,
    "nilaiAkhir": 87.67
  }
]
```

#### Create Grade Entry
**POST** `/api/nilai`

**Request Body:**
```json
{
  "nomorInduk": "U002",
  "idMataKuliah": 1,
  "nilaiUts": 85,
  "nilaiUas": 90,
  "nilaiTugas": 88
}
```

**Response (201 Created):** Created grade object

#### Update Grade Entry
**PATCH** `/api/nilai/:id`

**Request Body:**
```json
{
  "nilaiUts": 86,
  "nilaiUas": 91
}
```

**Response (200 OK):** Updated grade object

#### Get Student Transcript
**GET** `/api/nilai/transkrip/mahasiswa`

Get complete transcript for authenticated student.

**Response (200 OK):**
```json
[
  {
    "idNilai": 1,
    "nomorInduk": "U002",
    "idMataKuliah": 1,
    "namaMataKuliah": "Pemrograman Web",
    "nilaiAkhir": 87.67,
    "grade": "A"
  }
]
```

---

### Presensi (Attendance)

#### Get Attendance by Course
**GET** `/api/presensi/mata-kuliah/:idMataKuliah`

Get attendance records for a specific course.

**Response (200 OK):**
```json
[
  {
    "idPresensi": 1,
    "nomorInduk": "U002",
    "idMataKuliah": 1,
    "tanggal": "2026-04-01",
    "status": "HADIR"
  }
]
```

#### Create Attendance Record
**POST** `/api/presensi`

**Request Body:**
```json
{
  "nomorInduk": "U002",
  "idMataKuliah": 1,
  "tanggal": "2026-04-01",
  "status": "HADIR"
}
```

**Response (201 Created):** Created attendance object

#### Update Attendance Record
**PATCH** `/api/presensi/:id`

**Request Body:**
```json
{
  "status": "IZIN"
}
```

**Response (200 OK):** Updated attendance object

---

### Forum (Discussion)

#### Get Forum Threads by Course
**GET** `/api/forum/mata-kuliah/:idMataKuliah`

Get all discussion threads for a specific course.

**Response (200 OK):**
```json
[
  {
    "id": 1,
    "authorName": "Budi Santoso",
    "authorRole": "MAHASISWA",
    "time": "2026-04-28T10:30:00Z",
    "content": "Bagaimana cara implementasi REST API di Express?",
    "comments": [
      {
        "id": 1,
        "authorName": "Ahmad Rizki",
        "content": "Gunakan routing dan middleware Express...",
        "time": "2026-04-28T11:00:00Z"
      }
    ]
  }
]
```

#### Create Forum Thread
**POST** `/api/forum/create`

**Request Body:**
```json
{
  "idMataKuliah": 1,
  "nomorInduk": "U002",
  "judul": "Bagaimana cara implementasi REST API?",
  "isiForum": "Saya ingin belajar cara membuat REST API di Express..."
}
```

**Response (201 Created):** Created thread object

---

### Kuis (Quiz) - Stub Implementation

#### Get Quiz Questions
**GET** `/api/kuis/:idKuis/soal`

Returns quiz questions for a specific quiz.

**Response (200 OK):**
```json
{
  "message": "KuisController belum diimplementasi",
  "status": "pending"
}
```

**Note:** This endpoint returns placeholder data. Full implementation pending.

---

## Test Credentials

### Mahasiswa (Student)
```
Name: Budi Santoso
Email: budi.santoso@kampus.ac.id
NIM: 2021002
Password: password123
Role: MAHASISWA

Login methods:
- Email: budi.santoso@kampus.ac.id + password123
- NIM: 2021002 + password123
```

### Dosen (Lecturer)
```
Name: Dr. Lestari, M.Pd
Email: lestari@kampus.ac.id
NIP: 197803252005012002
Password: password123
Role: DOSEN

Login methods:
- Email: lestari@kampus.ac.id + password123
- NIP: 197803252005012002 + password123
```

### Other Users
```
nomorInduk: U001
nama: Ahmad Rizki
email: ahmad.rizki@kampus.ac.id
role: ADMIN
password: password123

nomorInduk: U003
nama: Citra Wijaya
email: citra.wijaya@kampus.ac.id
role: DOSEN
password: password123
```

---

## HTTP Status Codes

| Code | Meaning |
|------|---------|
| 200  | OK - Request succeeded |
| 201  | Created - Resource created successfully |
| 400  | Bad Request - Invalid input |
| 401  | Unauthorized - Invalid/missing token |
| 403  | Forbidden - No permission |
| 404  | Not Found - Resource doesn't exist |
| 500  | Internal Server Error |

---

## Error Response Format

```json
{
  "status": "error",
  "message": "Error description",
  "error": "Detailed error information"
}
```

---

## Architecture

- **Controllers** (`src/interfaces/controllers/`) - Handle HTTP requests
- **UseCases** (`src/usecases/`) - Business logic
- **Repositories** (`src/infrastucture/repositories/`) - Database access (Prisma)
- **Entities** (`src/domain/entities/`) - Data models
- **Middlewares** (`src/interfaces/middlewares/`) - Authentication, validation
- **Routes** (`src/interfaces/routes/`) - API endpoint definitions

---

## Database Models

- **User** - System users (Admin, Dosen, Mahasiswa)
- **Role** - User roles (ADMIN, DOSEN, MAHASISWA)
- **MataKuliah** - Courses
- **Nilai** - Grades
- **Presensi** - Attendance records
- **ForumDiskusi** - Forum threads
- **KomentarForum** - Forum comments

---

## Environment Variables

Required `.env` file:
```
DATABASE_URL=postgresql://user:password@localhost:5432/lms_db
JWT_SECRET=your_secret_key
PORT=3000
```

---

**Last Updated:** April 28, 2026
**Status:** ✅ All endpoints functional
