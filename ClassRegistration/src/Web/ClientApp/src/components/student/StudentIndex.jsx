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
                        <h1>This is student index page</h1>
                    </div>
                </div>
            </StudentLayout>
        );
    }
}