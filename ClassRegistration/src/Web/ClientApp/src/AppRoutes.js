import { Counter } from "./components/Counter";
import { FetchData } from "./components/FetchData";
import Home from "./components/Home";
import AdminIndex from "./components/admin/AdminIndex";
import { Department } from "./components/admin/department/Department";
import { Course } from "./components/admin/course/Course";
import CourseDetails from "./components/admin/course/CourseDetails";
import ClassDetails from "./components/admin/class/ClassDetails";
import ClassRegistrationWindows from "./components/admin/class/ClassRegistrationWindows";
import StudentIndex from "./components/student/StudentIndex";
import RegistrationSchedule from './components/admin/registration-schedule/RegistrationSchedule'
import ClassRegistration from "./components/student/class-registration/ClassRegistration";
import RegistrationResult from "./components/student/class-registration/RegistrationResult";
import RegistrationHistory from "./components/student/class-registration/RegistrationHistory";
import Student from "./components/admin/user/Student";
import StudentClasses from "./components/admin/user/StudentClasses";
import StudentDetails from "./components/admin/user/StudentDetails";
import Lecturer from "./components/admin/user/Lecturer";
import LecturerDetails from "./components/admin/user/LecturerDetails";
import LecturerDetailsClasses from "./components/admin/user/LecturerDetailsClasses";
import AddStudentToClass from "./components/admin/class/AddStudentToClass";
import AddLecturerToClass from "./components/admin/class/AddLecturerToClass";
import RegistrationHistoryDetails from "./components/student/class-registration/RegistrationHistoryDetails";
import LecturerIndex from "./components/lecturer/LecturerIndex"
import LecturerClasses from "./components/lecturer/LecturerClasses"

const AppRoutes = [
  {
    index: true,
    element: <Home />
  },
  {
    path: '/counter',
    element: <Counter />
  },
  {
    path: '/fetch-data',
    element: <FetchData />
  },
  {
    path: '/admin-index',
    name: 'Home',
    element: <AdminIndex />
  },
  {
    path: '/student-index',
    name: 'Home',
    element: <StudentIndex />
  },
  {
    path: '/admin-index/department',
    name: 'Department',
    element: <Department />
  },
  {
    path: '/admin-index/course',
    name: 'Course',
    element: <Course />
  },
  {
    path: 'admin-index/course/:courseId',
    element: <CourseDetails />
  },
  {
    path: 'admin-index/course/:courseId/class/:classId',
    element: <ClassRegistrationWindows />
  },
  {
    path: 'admin-index/course/:courseId/class/:classId/window/:registrationScheduleId',
    element: <ClassDetails />
  },
  {
    path: 'admin-index/course/:courseId/class/:classId/window/:registrationScheduleId/add-student',
    element: <AddStudentToClass />
  },
  {
    path: 'admin-index/course/:courseId/class/:classId/window/:registrationScheduleId/add-lecturer',
    element: <AddLecturerToClass />
  },
  {
    path: '/admin-index/registration-schedule',
    name: 'Registration Schedule',
    element: <RegistrationSchedule />
  },
  {
    path: '/student-index/class-registration',
    element: <ClassRegistration />
  },
  {
    path: '/student-index/registration-result',
    element: <RegistrationResult />
  },
  {
    path: '/student-index/registration-history',
    element: <RegistrationHistory />
  },
  {
    path: '/student-index/registration-history/:registrationScheduleId',
    element: <RegistrationHistoryDetails />
  },
  {
    path: '/admin-index/users/students',
    element: <Student />
  },
  {
    path: '/admin-index/users/students/:userId',
    element: <StudentDetails />
  },
  {
    path: '/admin-index/users/students/:userId/window/:registrationScheduleId',
    element: <StudentClasses />
  },
  {
    path: '/admin-index/users/lecturers',
    element: <Lecturer />
  },
  {
    path: '/admin-index/users/lecturers/:userId',
    element: <LecturerDetails />
  },
  {
    path: '/admin-index/users/lecturers/:userId/window/:registrationScheduleId',
    element: <LecturerDetailsClasses />
  },
  {
    path: '/lecturer-index',
    element: <LecturerIndex />
  },
  {
    path: '/lecturer-index/:registrationScheduleId',
    element: <LecturerClasses />
  }
];

export default AppRoutes;
