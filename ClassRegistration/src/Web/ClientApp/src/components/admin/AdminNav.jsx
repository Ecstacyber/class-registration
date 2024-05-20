import React from 'react'
import { CNavGroup, CNavItem, CNavTitle } from '@coreui/react'
import CIcon from '@coreui/icons-react'
import {
    cilHouse,
    cilNewspaper
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
        name: 'Khoa học',
        to: '/admin-index/department',
        icon: <CIcon icon={cilNewspaper} customClassName="nav-icon" />
    }
]

export default AdminNav