import React, { Component } from 'react';
import { Container } from 'reactstrap';
/*import { AdminNavbar } from './admin/AdminNavbar';*/
import AdminSidebar from './admin/AdminSidebar';
import AdminHeader from './admin/AdminHeader';

export class AdminLayout extends Component {
  static displayName = AdminLayout.name;

  render() {
    return (
      <div data-coreui-theme='light'>
        <AdminSidebar />
        <div className="wrapper d-flex flex-column min-vh-100">
          <AdminHeader />
          <div className="body flex-grow-1">
            <Container tag="main">
              {this.props.children}
            </Container>
          </div>
        </div>      
      </div>
    );
  }
}
