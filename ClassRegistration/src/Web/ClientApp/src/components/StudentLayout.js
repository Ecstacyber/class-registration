import React, { Component } from 'react';
import { Container } from 'reactstrap';
import { StudentNavbar } from './student/StudentNavbar';
import '../components/student-layout.css';

export class StudentLayout extends Component {
  static displayName = StudentLayout.name;

  render() {
    return (
      <div>
        <StudentNavbar />
        <Container tag="main">
          {this.props.children}
        </Container>
      </div>
    );
  }
}
