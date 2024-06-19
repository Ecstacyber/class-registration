import React, { Component } from 'react';
import { AdminLayout } from '../../AdminLayout';
import CourseGrid from './CourseGrid';

export class Course extends Component {
    static displayName = Course.name;

    render() {
        return (
            <AdminLayout>
                <CourseGrid />
            </AdminLayout>
        );
    }
}