import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000,
});

// Analytics
export const getAnalyticsSummary = async () => {
  const res = await api.get('/analytics/summary');
  return res.data;
};

// Students
export const getStudents = async (params = {}) => {
  const res = await api.get('/students', { params });
  return res.data;
};

export const getStudentDetail = async (id) => {
  const res = await api.get(`/students/${id}`);
  return res.data;
};

export const createStudent = async (data) => {
  const res = await api.post('/students', data);
  return res.data;
};

export const updateStudent = async (id, data) => {
  const res = await api.put(`/students/${id}`, data);
  return res.data;
};

export const deleteStudent = async (id) => {
  const res = await api.delete(`/students/${id}`);
  return res.data;
};

export const uploadStudentsCsv = async (file) => {
  const formData = new FormData();
  formData.append('file', file);
  const res = await api.post('/students/upload-csv', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return res.data;
};

export const getSampleCsvUrl = () => `${API_BASE_URL}/students/sample-csv/download`;

// Companies
export const getCompanies = async (params = {}) => {
  const res = await api.get('/companies', { params });
  return res.data;
};

export const createCompanyDrive = async (data) => {
  const res = await api.post('/companies', data);
  return res.data;
};

export const deleteCompanyDrive = async (id) => {
  const res = await api.delete(`/companies/${id}`);
  return res.data;
};

// Eligibility Engine
export const evaluateEligibility = async (payload) => {
  const res = await api.post('/eligibility/evaluate', payload);
  return res.data;
};

export const checkSkillGap = async (studentId, companyId) => {
  const res = await api.post('/eligibility/skill-gap', {
    student_id: studentId,
    company_id: companyId,
  });
  return res.data;
};

export const exportEligibleCsv = async (payload, onlyEligible = true) => {
  const res = await api.post(`/eligibility/export-csv?only_eligible=${onlyEligible}`, payload, {
    responseType: 'blob',
  });
  return res.data;
};

export const exportEligibleExcel = async (payload, onlyEligible = true) => {
  const res = await api.post(`/eligibility/export-excel?only_eligible=${onlyEligible}`, payload, {
    responseType: 'blob',
  });
  return res.data;
};

// Authentication
export const loginUser = async (loginId, password, role) => {
  const res = await api.post('/auth/login', {
    login_id: loginId,
    password: password,
    role: role,
  });
  return res.data;
};

export const registerStudent = async (studentData) => {
  const res = await api.post('/auth/register', studentData);
  return res.data;
};

export const getDemoCredentials = async () => {
  const res = await api.get('/auth/demo-credentials');
  return res.data;
};

// Drive Applications
export const applyToDrive = async (studentId, companyDriveId) => {
  const res = await api.post('/applications/apply', {
    student_id: studentId,
    company_drive_id: companyDriveId,
  });
  return res.data;
};

export const getStudentApplications = async (studentId) => {
  const res = await api.get(`/applications/student/${studentId}`);
  return res.data;
};

export const getCompanyApplicants = async (companyId) => {
  const res = await api.get(`/applications/company/${companyId}`);
  return res.data;
};

// What-If AI Career Simulator
export const runWhatIfSimulation = async (payload) => {
  const res = await api.post('/eligibility/what-if-simulator', payload);
  return res.data;
};

