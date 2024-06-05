import React from 'react'
import { CNavItem, CNavTitle } from '@coreui/react'
import CIcon from '@coreui/icons-react'
import {
    cilHouse,
    cilNewspaper,
    cilSchool,
    cilCalendar
} from '@coreui/icons'

const AdminNav = [
    {
        component: CNavItem,
        name: 'Trang chủ',
        to: '/admin-index',
        icon: <CIcon icon={cilHouse} customClassName="nav-icon" />
    },
    {
        component: CNavTitle,
        name: 'Quản lý',
    },
    {
        component: CNavItem,
        name: 'Khoa',
        to: '/admin-index/department',
        icon: <CIcon icon={cilNewspaper} customClassName="nav-icon" />
    },
    {
        component: CNavItem,
        name: 'Môn học',
        to: '/admin-index/course',
        icon: <CIcon icon={cilSchool} customClassName="nav-icon" />
    },
    {
        component: CNavItem,
        name: 'Lịch đăng ký',
        to: '/admin-index/registration-schedule',
        icon: <CIcon icon={cilCalendar} customClassName="nav-icon" />
    }
]

export default AdminNav