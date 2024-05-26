import { Counter } from "./components/Counter";
import { FetchData } from "./components/FetchData";
import { Home } from "./components/Home";
import { AdminIndex } from "./components/admin/AdminIndex";
import { Department } from "./components/admin/department/Department";
import { Course } from "./components/admin/course/Course";
import CourseDetails from "./components/admin/course/CourseDetails";
import { StudentIndex } from "./components/student/StudentIndex";

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
  }
];

export default AppRoutes;
