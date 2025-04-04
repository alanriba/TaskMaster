# 🚀 TaskMaster Frontend

TaskMaster is a task management application built with **React**, **Vite**, **TypeScript**, and **Bun**, using **Material UI**, **Formik**, **React Router**, and more. It includes testing support via **Vitest** and is CI-ready.

---

## 🧰 Key Technologies

- 🧠 **React 19**
- ⚡ **Vite 6**
- 🧪 **Vitest** for unit testing
- 🧵 **Bun** as the package manager
- 🎨 **Material UI (MUI)** for UI components
- 🔄 **React Query** for data fetching
- 🧾 **Formik + Yup** for form management and validation

---

## 📦 Installation

### 1. Clone the repository

```bash
git clone https://github.com/your-user/taskmaster-frontend.git
cd taskmaster-frontend
```

### 2. Install dependencies using Bun

```bash
bun install
```

> Alternatively, use npm if you don’t have Bun:
> ```bash
> npm install
> ```

---

## 🔧 Environment Configuration

Create your `.env` file from the example provided:

```bash
cp .env.example .env
```

`.env.example` content:

```env
VITE_API_URL=http://localhost:8000/api/
VITE_APP_NAME=TaskMaster
```

---

## ▶️ Development Server

```bash
bun run dev
```

> The app will be available at `http://localhost:5173`

---

## 🛠 Available Scripts

```bash
bun run dev               # Start development server
bun run build             # Build for production
bun run preview           # Preview production build
bun run lint              # Run ESLint
bun run test              # Run tests with Vitest
bun run test:clean        # Clean test caches and run tests
bun run test:basic        # Run tests without cache
bun run test:coverage     # Run tests with coverage report
bun run test:ci           # CI-friendly test run
```

---

## 🧪 Testing with Vitest

- Environment: `jsdom`
- Test files: `src/tests/**/*.{test,spec}.{js,jsx,ts,tsx}`
- Setup file: `src/setupTests.ts`
- Coverage reporters: `text`, `json`, `html`

### Utility Script: `clean-test.js`

This script removes:

- `node_modules/.vitest`
- `node_modules/.vite`
- `coverage/`

And then runs `vitest run`.

```bash
bun run test:clean
```

---

## 📁 Project Structure

```
taskmaster-frontend/
├── public/
├── src/
│   ├── components/
│   ├── pages/
│   ├── services/
│   ├── tests/
│   └── setupTests.ts
├── .env.example
├── vite.config.ts
├── vitest.config.ts
├── tsconfig.json
├── package.json
├── bun.lockb
├── README.md
└── clean-test.js
```

---

## 🧼 Pre-submission Cleanup

The following files/directories have been removed before delivery:

- `node_modules/`
- `dist/`, `.vite/`, `.cache/`
- `.env`
- `coverage/`
- `.vscode/`, `.idea/`, `.DS_Store`
- Any `*.log` files

Everything needed to run the project is included.

---

## 📄 Notes

- Requires [Bun](https://bun.sh) to run commands like `bun install`, `bun run dev`, etc.
- You can still use `npm` if preferred, though `bun` is the default package manager.
- If you encounter issues, ensure your `.env` is properly configured.
