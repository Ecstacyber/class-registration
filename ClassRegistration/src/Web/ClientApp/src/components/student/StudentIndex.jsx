import React, { Component } from 'react';
import followIfLoginRedirect from '../api-authorization/followIfLoginRedirect';
import { StudentLayout } from '../StudentLayout';

export class StudentIndex extends Component {
    static displayName = StudentIndex.name;

    render() {
        return (
            <StudentLayout>
                <div className="container">
                    <div className="row">
                        <h1>Đợt đăng ký môn học tiếp theo: 16/6/2024 9:00 AM</h1>
                    </div>
                </div>
            </StudentLayout>
        );
    }
}