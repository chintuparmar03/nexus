# NEXUS 🚀
### AI-Powered Personal Skill Graph & Career Intelligence Platform

NEXUS is a modern web application designed to help individuals analyze skill trees, map out interactive career roadmaps, discover skill gaps, and leverage AI to accelerate professional growth.

---

## 📁 Folder Structure

```
nexus/
├── backend/
│   ├── src/
│   │   ├── config/          # Database configuration (MongoDB Mongoose)
│   │   ├── controllers/     # Request handlers (auth, careers, roadmaps, skills, admin)
│   │   ├── middleware/      # Authentication & route protection middleware
│   │   ├── models/          # Database schemas (User, Skill, Career)
│   │   ├── routes/          # Express API route definitions
│   │   ├── seed/            # Initial dataset seeding scripts
│   │   ├── services/        # AI Service (@google/genai integration) & Graph Engine logic
│   │   └── server.ts        # Server entry point
│   ├── .env.example         # Environment variables template
│   ├── package.json         # Backend dependencies & scripts
│   └── tsconfig.json        # TypeScript configuration
├── frontend/
│   ├── public/              # Static assets (logos, images, icons)
│   ├── src/
│   │   ├── components/      # React UI components
│   │   │   ├── auth/        # Protected routes & authentication forms
│   │   │   ├── careers/     # Career gap analysis & career cards
│   │   │   ├── common/      # Global modals & shared widgets
│   │   │   ├── dashboard/   # Analytics & stats visualizations
│   │   │   ├── graph/       # Interactive skill graph canvas & nodes (@xyflow/react)
│   │   │   ├── layout/      # Navbar, Sidebar, and Page navigation
│   │   │   └── roadmap/     # Interactive learning roadmap visualizer
│   │   ├── context/         # Auth & Theme React contexts
│   │   ├── pages/           # App pages (Landing, Profile, Careers, Achievements, Admin, Settings)
│   │   ├── services/        # Axios API client setup
│   │   ├── App.tsx          # Router & main application wrapper
│   │   ├── main.tsx         # React app DOM mounting point
│   │   └── index.css        # Global CSS & Tailwind styling
│   ├── index.html           # HTML template
│   ├── package.json         # Frontend dependencies & scripts
│   ├── tailwind.config.js   # Tailwind CSS configuration
│   └── vite.config.ts       # Vite bundler configuration
├── .gitignore               # Ignored files and directories
└── README.md                # Project documentation
```

---

## 🛠️ Prerequisites

Before you begin, ensure you have the following installed on your system:
- **Node.js**: `v18.x` or higher
- **npm**: `v9.x` or higher
- **MongoDB**: A running MongoDB instance (Local or MongoDB Atlas)
- **Git**: Installed on your system

---

## 🚀 Steps to Run the Project Local

Follow these steps to clone, configure, and run the project locally.

### 1. Clone the Repository

```bash
git clone https://github.com/chintuparmar03/nexus.git
cd nexus
```

---

### 2. Configure & Run Backend

#### Step 2.1: Navigate to the backend directory
```bash
cd backend
```

#### Step 2.2: Install backend dependencies
```bash
npm install
```

#### Step 2.3: Set up Environment Variables
Create a `.env` file inside the `backend` directory based on `.env.example`:

```bash
cp .env.example .env
```

Edit `.env` and configure your credentials:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/nexus_db
JWT_SECRET=your_secret_jwt_key
NODE_ENV=development
GEMINI_API_KEY=your_google_gemini_api_key
CLIENT_URL=http://localhost:5173
```

#### Step 2.4: Seed Initial Database Data (Optional)
```bash
npm run seed
```

#### Step 2.5: Start Backend Development Server
```bash
npm run dev
```
The backend server will run on `http://localhost:5000`.

---

### 3. Configure & Run Frontend

Open a new terminal window or tab and navigate to the `nexus` root directory.

#### Step 3.1: Navigate to the frontend directory
```bash
cd frontend
```

#### Step 3.2: Install frontend dependencies
```bash
npm install
```

#### Step 3.3: Start Frontend Development Server
```bash
npm run dev
```
The frontend application will be running at `http://localhost:5173`.

---

## 📜 Available Scripts

### Backend (`/backend`)
- `npm run dev`: Starts the server with live reloading using `ts-node-dev`.
- `npm run build`: Compiles TypeScript files into the `dist/` directory.
- `npm run start`: Runs the compiled production code from `dist/server.js`.
- `npm run seed`: Populates the MongoDB database with initial sample data.

### Frontend (`/frontend`)
- `npm run dev`: Launches the Vite development server with HMR.
- `npm run build`: Builds optimized production bundle using TypeScript and Vite.
- `npm run preview`: Previews the production build locally.

---

## 🧰 Tech Stack

- **Frontend**: React 19, TypeScript, Vite, Tailwind CSS, Lucide Icons, React Router, Recharts, @xyflow/react, Framer Motion
- **Backend**: Node.js, Express.js, TypeScript, MongoDB & Mongoose, Google Gemini AI (`@google/genai`), JWT, Zod
- **Version Control**: Git & GitHub

---

## 📄 License

This project is open-source and available under the [MIT License](LICENSE).
