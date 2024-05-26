import React, { Component, useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { AdminLayout } from '../../AdminLayout';
import { CoursesClient, ClassesClient, CourseByIdClient } from '../../../web-api-client.ts';

const CourseDetails = () => {
    const { courseId } = useParams();
    const [ course, setCourse ] = useState(null);

    async function getCourseData() {
        const courseClient = new CourseByIdClient();
        let data = await courseClient.getCourseById(courseId);
        setCourse(data);
    }

    useEffect(() => {
        getCourseData();
    }, [])

    return (
        <AdminLayout>
            <h2>{course?.courseCode}</h2>
            <h3>{course?.courseName}</h3>
            <br />

        </AdminLayout>
    )
}

export default CourseDetails;