import React, { Component } from 'react';
import { Container } from 'reactstrap';
import { LecturerNavbar } from './LecturerNavbar';

export class LecturerLayout extends Component {
    static displayName = LecturerLayout.name;

    render() {
        return (
            <div>
                <LecturerNavbar />
                <Container tag="main">
                    {this.props.children}
                </Container>
            </div>
        );
    }
}
