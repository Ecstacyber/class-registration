import React, { Component } from 'react';
import followIfLoginRedirect from '../api-authorization/followIfLoginRedirect';
import { AdminLayout } from '../AdminLayout';

export class AdminIndex extends Component {
    static displayName = AdminIndex.name;

    render() {
        return (
            <AdminLayout>
                <div className="container">
                    <div className="row">
                        <h1>This is admin index page</h1>
                    </div>
                </div>
            </AdminLayout>
        );
    }
}