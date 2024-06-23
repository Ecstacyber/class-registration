import React, { Component, useState, useEffect } from 'react';
import { format } from 'date-fns';
import followIfLoginRedirect from '../api-authorization/followIfLoginRedirect';
import { StudentLayout } from '../StudentLayout';
import { CurrentRegistrationScheduleInfoClient } from '../../web-api-client.ts'

const StudentIndex = () => {
    const [currentRegWindow, setCurrentRegWindow] = useState(null);
    const [nextRegWindow, setNextRegWindow] = useState(null);
    const [currentEndDate, setCurrentEndDate] = useState('');

    async function getData() {
        const currentRegistrationScheduleInfoClient = new CurrentRegistrationScheduleInfoClient();
        let currentRegInfo = await currentRegistrationScheduleInfoClient.getCurrentRegistrationSchedule();
        setCurrentRegWindow(currentRegInfo);
        if (currentRegInfo !== null) {
            setCurrentEndDate(format(new Date(currentRegInfo.endDate), 'dd/MM/yyyy kk:mm:ss'));
        }
    }

    useEffect(() => {
        getData();
    }, [])

    const IndexInfo = () => {
        if (currentEndDate === '') {
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
                            {/*<h1>Ngày kết thúc đợt đăng ký hiện tại:*/}
                            {/*    {*/}
                            {/*        ' '*/}
                            {/*        + new Date(currentRegWindow?.startDate).getDay()*/}
                            {/*        + '/'*/}
                            {/*        + (new Date(currentRegWindow?.startDate).getMonth() + 1)*/}
                            {/*        + '/'*/}
                            {/*        + new Date(currentRegWindow?.startDate).getFullYear()*/}
                            {/*        + ' '*/}
                            {/*        + new Date(currentRegWindow?.startDate).getHours()*/}
                            {/*        + ':'*/}
                            {/*        + new Date(currentRegWindow?.startDate).getMinutes()*/}
                            {/*        + ':'*/}
                            {/*        + new Date(currentRegWindow?.startDate).getSeconds()*/}
                            {/*    }*/}
                            {/*</h1>*/}
                            <h1>Ngày kết thúc đợt đăng ký hiện tại: {currentEndDate}</h1>
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