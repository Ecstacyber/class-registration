import React, { Component } from 'react';
import followIfLoginRedirect from '../api-authorization/followIfLoginRedirect';
import { AdminNavbar } from './AdminNavbar';
import { Layout } from '../Layout';

export class AdminIndex extends Component {
    static displayName = AdminIndex.name;

    render() {
        return (
            <Layout>
                <div className="container">
                    <div className="row">
                        <h1>This is admin index page</h1>
                    </div>
                </div>
            </Layout>
        );
    }
}