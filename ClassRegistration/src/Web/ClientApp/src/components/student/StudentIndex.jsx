import React, { Component, useState, useEffect } from 'react';
import followIfLoginRedirect from '../api-authorization/followIfLoginRedirect';
import { StudentLayout } from '../StudentLayout';
import { CurrentRegistrationScheduleInfoClient } from '../../web-api-client.ts'

const StudentIndex = () => {
    const [currentRegWindow, setCurrentRegWindow] = useState(null);
    const [nextRegWindow, setNextRegWindow] = useState(null);

    async function getData() {
        const currentRegistrationScheduleInfoClient = new CurrentRegistrationScheduleInfoClient();
        let currentRegInfo = await currentRegistrationScheduleInfoClient.getCurrentRegistrationSchedule();
        setCurrentRegWindow(currentRegInfo);
    }

    useEffect(() => {
        getData();
    }, [])

    const IndexInfo = () => {
        if (currentRegWindow?.startDate == null) {
            return (
                <StudentLayout>
                    <div className="container">
                        <div className="row">
                            <h1>Chưa có thông tin đợt đăng ký</h1>
                        </div>
                    </div>
                </StudentLayout>
            );
        }
        else {
            return (
                <StudentLayout>
                    <div className="container">
                        <div className="row">
                            <h1>Đợt đăng ký môn học tiếp theo: {currentRegWindow.startDate}</h1>
                        </div>
                    </div>
                </StudentLayout>
            );
        }
    }
   
    return (
        <IndexInfo/>
    )
}

export default StudentIndex;