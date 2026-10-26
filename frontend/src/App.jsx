import { Route, Routes } from 'react-router-dom'
import AdminLayout from './layouts/AdminLayout'
import Dashboard from './pages/Dashboard'
import Students from './pages/Students'
import Courses from './pages/Courses'
import Instructors from './pages/Instructors'
import Enrollments from './pages/Enrollments'
import Payments from './pages/Payments'
import Assignments from './pages/Assignments'
import Results from './pages/Results'
import ServiceStatus from './pages/ServiceStatus'
import NotFound from './pages/NotFound'

export default function App() {
  return (
    <Routes>
      <Route element={<AdminLayout />}>
        <Route index element={<Dashboard />} />
        <Route path="students" element={<Students />} />
        <Route path="courses" element={<Courses />} />
        <Route path="instructors" element={<Instructors />} />
        <Route path="enrollments" element={<Enrollments />} />
        <Route path="payments" element={<Payments />} />
        <Route path="assignments" element={<Assignments />} />
        <Route path="results" element={<Results />} />
        <Route path="service-status" element={<ServiceStatus />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  )
}
