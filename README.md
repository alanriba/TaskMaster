# 🧩 TaskMaster Fullstack Application

TaskMaster is a fullstack task management application combining a **React + Vite + Bun** frontend with a **Django + PostgreSQL** backend. It supports RESTful APIs, authentication, filtering, and a responsive UI.

---

## ⚙️ Technologies Used

### 🧠 Backend (Django)
- Django 5.1.7
- Django REST Framework
- PostgreSQL
- CORS Headers
- Whitenoise for static file handling
- Environment management via `python-dotenv`
- Testing with Pytest & pytest-django

### ⚛️ Frontend (React)
- React 19 + TypeScript
- Vite 6 for build and dev
- Bun for dependency management
- MUI (Material UI)
- Formik + Yup
- React Router DOM
- React Query
- Testing with Vitest + React Testing Library

---

## 📁 Project Structure

```
TaskMaster/
├── backend/
│   ├── manage.py
│   ├── taskmaster_project/
│   ├── todo_app/
│   ├── requirements.txt
│   ├── .env.example
│   └── pytest.ini
├── frontend/
│   ├── package.json
│   ├── vite.config.ts
│   ├── tsconfig.json
│   ├── .env.example
│   ├── bun.lockb
│   ├── clean-test.js
│   ├── vitest.config.ts
│   └── src/
├── vercel.json
├── README.md
└── .github/workflows/ci-cd.yml
```

---

## 🔧 Environment Variables

### 🔙 Backend `.env.example`
```env
SECRET_KEY=your-django-secret-key-here
IS_PRODUCTION=False
DB_NAME=your-db-name
DB_USER=your-db-user
DB_PASSWORD=your-db-password
DB_HOST=localhost
DB_PORT=5432
# DATABASE_URL=postgres://your-db-user:your-db-password@your-db-host:5432/your-db-name
```

### ⚛️ Frontend `.env.example`
```env
VITE_API_URL=http://localhost:8000/api/
VITE_APP_NAME=TaskMaster
```

---

## ✅ Backend Setup (Django)

1. Create and activate a virtual environment
2. Install dependencies:
```bash
pip install -r requirements.txt
```

3. Apply migrations:
```bash
python manage.py makemigrations
python manage.py migrate
```

4. Run the development server:
```bash
python manage.py runserver
```

5. Run backend tests:
```bash
pytest
```

Pytest is configured using `pytest.ini`:

```ini
[pytest]
DJANGO_SETTINGS_MODULE = taskmaster_project.settings
python_files = tests.py test_*.py *_tests.py
```

---

## ▶️ Frontend Setup (React + Vite + Bun)

1. Navigate to the frontend directory
2. Install dependencies with Bun:
```bash
bun install
```

3. Run development server:
```bash
bun run dev
```

4. Run frontend tests:
```bash
bun run test
```

5. Run tests with coverage:
```bash
bun run test:coverage
```

---

## 🚀 Deployment (Vercel)

The `vercel.json` file configures Python backend deployment using `wsgi.py`:

```json
{
  "builds": [
    {
      "src": "taskmaster_project/wsgi.py",
      "use": "@vercel/python",
      "config": {
        "maxLambdaSize": "15mb",
        "runtime": "python3.11"
      }
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "taskmaster_project/wsgi.py",
      "headers": {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, OPTIONS, DELETE, PUT"
      }
    }
  ]
}
```

---

## 🔄 CI/CD Workflow (GitHub Actions)

Located in `.github/workflows/ci-cd.yml`, this workflow handles:

- Frontend: Bun install, Vitest test, build
- Backend: pip install, Django migrations, Pytest

```yaml
on:
  push:
    branches: [master]
  pull_request:
    branches: [master]
```

The CI runs separately for frontend and backend using different working directories.

---

## 📄 Notes

- Use `.env.example` files as templates and rename them to `.env`
- The project is optimized for local development and Vercel deployment
- Testing is fully automated with support for CI/CD
