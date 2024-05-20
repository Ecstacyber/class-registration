import React, { Component } from 'react';
import { AdminLayout } from '../../AdminLayout';
import { DepartmentGrid } from './DepartmentGrid';

export class Department extends Component {
    static displayName = Department.name;

    render() {
        return (
            <AdminLayout>
                <DepartmentGrid />
            </AdminLayout>           
        );
    }
}