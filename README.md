# Campus Placement Intelligence - Frontend Dashboard

A modern, responsive, high-performance web dashboard built with **React 18**, **Vite**, **Tailwind CSS**, **Recharts**, and **Lucide Icons** designed for campus placement officers, corporate recruiters, and students.

---

## Key Modules & Features

1. **Executive Placement Overview & KPIs**:
   - Total Enrolled Students, Conversion Rate %, Cohort Average CGPA, and Active Drive count.
   - Interactive charts: Department-wise placement status, CGPA distribution histogram, Backlog proportions, and top technical skills cloud.

2. **Placement Screening & Eligibility Engine**:
   - Dynamic multi-criteria sliders: Minimum CGPA, 10th & 12th marks, active & history backlogs, branch relevance, and gender diversity filters.
   - Pre-configured corporate presets (Google, Microsoft, Amazon, Qualcomm, Deloitte, TCS Digital, etc.) or custom thresholds.
   - Live candidate pool evaluation with instant status indicators and exact disqualification diagnosis.
   - Instant export to formatted **Excel (.xlsx)** and **CSV**.

3. **Corporate Recruitment Drives Portal**:
   - Cards categorized by tier (*Super Dream*, *Dream*, *Core*).
   - Package (CTC), cutoffs, deadlines, and one-click direct screening button.

4. **Student Master Directory & Profiles**:
   - Searchable, filterable student roster.
   - Deep-dive student modal with academic history, skills, readiness score, and corporate drive clearance checks.

5. **AI Skill Gap & Readiness Simulator**:
   - Select any student and corporate drive to visualize match score, matched skills vs missing skills, and tailored preparation roadmaps.

6. **Cohort Bulk Import**:
   - Drag-and-drop CSV / Excel uploader with sample template download.

---

## Local Setup & Development

### 1. Install Node Dependencies
```bash
npm install
```

### 2. Configure Environment (Optional)
Create `.env` file or use default:
```env
VITE_API_URL=http://localhost:8000/api
```

### 3. Start Development Server
```bash
npm run dev
```
The app will run locally at `http://localhost:5173`.

---

## Deploying to Vercel

1. Push this repository to GitHub: `https://github.com/sanghavimaganti/Campus-Placement-Intelligence_frontend.git`.
2. Go to [Vercel](https://vercel.com) and click **Add New Project**.
3. Import this repository.
4. Configure Project Settings:
   - **Framework Preset**: `Vite`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
5. Add Environment Variable:
   - `VITE_API_URL`: `<your-deployed-render-backend-url>/api` (e.g. `https://campus-placement-backend.onrender.com/api`)
6. Click **Deploy**.
