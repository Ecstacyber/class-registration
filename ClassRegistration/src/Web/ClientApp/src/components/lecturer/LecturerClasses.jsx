import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import {
    GridComponent,
    ColumnsDirective,
    ColumnDirective,
    Filter,
    Inject,
    Sort,
    Page,
    ForeignKey
} from '@syncfusion/ej2-react-grids';
import { L10n } from '@syncfusion/ej2-base';
import { LecturerLayout } from '../lecturer/LecturerLayout';
import {
    ClassesClient,
    UserClassesClient,
    RegistrationSchedulesClient,
    ClassTypesClient,
    CurrentRegistrationScheduleInfoClient,
    ClassRegisterClient,
    CurrentUserInfoClient,
    CurrentUserRegistrationResultClient,
    UserClassByUserIdClient
} from '../../web-api-client.ts';

const LecturerClasses = () => {
    const { registrationScheduleId } = useParams();
    const [currentUserInfo, setCurrentUserInfo] = useState(null);
    const [currentReg, setCurrentReg] = useState(null);
    const [currentUserClass, setCurrentUserClass] = useState({
        result: [],
        count: 0
    })

    async function getData() {
        const currentUserInfoClient = new CurrentUserInfoClient();
        let currentUser = await currentUserInfoClient.getUserInfo();
        setCurrentUserInfo(currentUser);

        const registrationSchedulesClient = new RegistrationSchedulesClient();
        let currentReg = await registrationSchedulesClient.getScheduleById(registrationScheduleId);
        setCurrentReg(currentReg);

        const userClassByUserIdClient = new UserClassByUserIdClient();
        let classes = await userClassByUserIdClient.getUserClassByUserId(currentUser.id);
        setCurrentUserClass(classes);
    }

    useEffect(() => {
        getData();
    }, [])

    let gridInstance;

    //const tempResult = {
    //    "result": [
    //        {
    //            "id": 9,
    //            "classId": 6,
    //            "registrationScheduleId": 3,
    //            "courseName": "Lập trình trực quan",
    //            "departmentName": "CNPM",
    //            "classType": "LT",
    //            "passed": true,
    //            "userClassCount": 1,
    //            "fee": 4000000,
    //            "class": {
    //                "courseId": 12,
    //                "classTypeId": 1,
    //                "classCode": "SE12345",
    //                "dayOfWeek": 2,
    //                "startPeriod": 1,
    //                "endPeriod": 4,
    //                "credit": 4,
    //                "capacity": 40,
    //                "canBeRegistered": true,
    //                "course": null,
    //                "classType": null,
    //                "userClasses": [],
    //                "registrationRecords": [],
    //                "created": "2024-05-30T05:24:36.3195683+00:00",
    //                "createdBy": "d9c06974-258f-4fd7-b6a0-2cf2b4f47fae",
    //                "lastModified": "2024-05-30T05:24:36.3195683+00:00",
    //                "lastModifiedBy": "d9c06974-258f-4fd7-b6a0-2cf2b4f47fae",
    //                "id": 6,
    //                "domainEvents": []
    //            },
    //            "classResult": null,
    //            "user": {
    //                "userName": "student@localhost",
    //                "email": "student@localhost",
    //                "departmentId": 1027,
    //                "department": null,
    //                "userClasses": [],
    //                "tuitionFee": [],
    //                "registrationRecords": [],
    //                "roles": [],
    //                "created": "2024-06-05T04:47:33.1820067+00:00",
    //                "createdBy": null,
    //                "lastModified": "2024-06-05T04:47:33.1820067+00:00",
    //                "lastModifiedBy": null,
    //                "id": 3,
    //                "domainEvents": []
    //            },
    //            "registrationSchedule": {
    //                "name": "Học kỳ 1, 2023-2024",
    //                "startDate": "2024-06-04T09:00:00",
    //                "endDate": "2024-06-11T09:00:00",
    //                "maximumCredit": 25,
    //                "feePerCredit": 1000000,
    //                "classes": [],
    //                "userClasses": [],
    //                "tuitionFees": [],
    //                "registrationRecords": [],
    //                "created": "2024-06-04T14:31:59.5506092+00:00",
    //                "createdBy": "d9c06974-258f-4fd7-b6a0-2cf2b4f47fae",
    //                "lastModified": "2024-06-04T14:31:59.5506092+00:00",
    //                "lastModifiedBy": "d9c06974-258f-4fd7-b6a0-2cf2b4f47fae",
    //                "id": 3,
    //                "domainEvents": []
    //            }
    //        },
    //        {
    //            "id": 25,
    //            "classId": 15,
    //            "registrationScheduleId": 3,
    //            "courseName": "Nhập môn lập trình",
    //            "departmentName": "CNPM",
    //            "classType": "LT",
    //            "passed": true,
    //            "userClassCount": 1,
    //            "fee": 3000000,
    //            "class": {
    //                "courseId": 2,
    //                "classTypeId": 1,
    //                "classCode": "SE100.N11",
    //                "dayOfWeek": 4,
    //                "startPeriod": 6,
    //                "endPeriod": 10,
    //                "credit": 3,
    //                "capacity": 100,
    //                "canBeRegistered": true,
    //                "course": null,
    //                "classType": null,
    //                "userClasses": [],
    //                "registrationRecords": [],
    //                "created": "2024-06-05T18:06:53.2982372+00:00",
    //                "createdBy": "d9c06974-258f-4fd7-b6a0-2cf2b4f47fae",
    //                "lastModified": "2024-06-05T18:06:53.2982372+00:00",
    //                "lastModifiedBy": "d9c06974-258f-4fd7-b6a0-2cf2b4f47fae",
    //                "id": 15,
    //                "domainEvents": []
    //            },
    //            "classResult": null,
    //            "user": {
    //                "userName": "student@localhost",
    //                "email": "student@localhost",
    //                "departmentId": 1027,
    //                "department": null,
    //                "userClasses": [],
    //                "tuitionFee": [],
    //                "registrationRecords": [],
    //                "roles": [],
    //                "created": "2024-06-05T04:47:33.1820067+00:00",
    //                "createdBy": null,
    //                "lastModified": "2024-06-05T04:47:33.1820067+00:00",
    //                "lastModifiedBy": null,
    //                "id": 3,
    //                "domainEvents": []
    //            },
    //            "registrationSchedule": {
    //                "name": "Học kỳ 1, 2023-2024",
    //                "startDate": "2024-06-04T09:00:00",
    //                "endDate": "2024-06-11T09:00:00",
    //                "maximumCredit": 25,
    //                "feePerCredit": 1000000,
    //                "classes": [],
    //                "userClasses": [],
    //                "tuitionFees": [],
    //                "registrationRecords": [],
    //                "created": "2024-06-04T14:31:59.5506092+00:00",
    //                "createdBy": "d9c06974-258f-4fd7-b6a0-2cf2b4f47fae",
    //                "lastModified": "2024-06-04T14:31:59.5506092+00:00",
    //                "lastModifiedBy": "d9c06974-258f-4fd7-b6a0-2cf2b4f47fae",
    //                "id": 3,
    //                "domainEvents": []
    //            }
    //        },
    //        {
    //            "id": 26,
    //            "classId": 9,
    //            "registrationScheduleId": 3,
    //            "courseName": "Lập trình trực quan",
    //            "departmentName": "CNPM",
    //            "classType": "HT1",
    //            "passed": true,
    //            "userClassCount": 1,
    //            "fee": 2000000,
    //            "class": {
    //                "courseId": 12,
    //                "classTypeId": 2,
    //                "classCode": "SE133",
    //                "dayOfWeek": 3,
    //                "startPeriod": 6,
    //                "endPeriod": 10,
    //                "credit": 2,
    //                "capacity": 199,
    //                "canBeRegistered": true,
    //                "course": null,
    //                "classType": null,
    //                "userClasses": [],
    //                "registrationRecords": [],
    //                "created": "2024-05-30T14:03:30.8293679+00:00",
    //                "createdBy": "d9c06974-258f-4fd7-b6a0-2cf2b4f47fae",
    //                "lastModified": "2024-05-30T14:03:30.8293679+00:00",
    //                "lastModifiedBy": "d9c06974-258f-4fd7-b6a0-2cf2b4f47fae",
    //                "id": 9,
    //                "domainEvents": []
    //            },
    //            "classResult": null,
    //            "user": {
    //                "userName": "student@localhost",
    //                "email": "student@localhost",
    //                "departmentId": 1027,
    //                "department": null,
    //                "userClasses": [],
    //                "tuitionFee": [],
    //                "registrationRecords": [],
    //                "roles": [],
    //                "created": "2024-06-05T04:47:33.1820067+00:00",
    //                "createdBy": null,
    //                "lastModified": "2024-06-05T04:47:33.1820067+00:00",
    //                "lastModifiedBy": null,
    //                "id": 3,
    //                "domainEvents": []
    //            },
    //            "registrationSchedule": {
    //                "name": "Học kỳ 1, 2023-2024",
    //                "startDate": "2024-06-04T09:00:00",
    //                "endDate": "2024-06-11T09:00:00",
    //                "maximumCredit": 25,
    //                "feePerCredit": 1000000,
    //                "classes": [],
    //                "userClasses": [],
    //                "tuitionFees": [],
    //                "registrationRecords": [],
    //                "created": "2024-06-04T14:31:59.5506092+00:00",
    //                "createdBy": "d9c06974-258f-4fd7-b6a0-2cf2b4f47fae",
    //                "lastModified": "2024-06-04T14:31:59.5506092+00:00",
    //                "lastModifiedBy": "d9c06974-258f-4fd7-b6a0-2cf2b4f47fae",
    //                "id": 3,
    //                "domainEvents": []
    //            }
    //        },
    //        {
    //            "id": 27,
    //            "classId": 21,
    //            "registrationScheduleId": 3,
    //            "courseName": "Lập trình trực quan",
    //            "departmentName": "CNPM",
    //            "classType": "LT",
    //            "passed": true,
    //            "userClassCount": 1,
    //            "fee": 2000000,
    //            "class": {
    //                "courseId": 12,
    //                "classTypeId": 1,
    //                "classCode": "SE145",
    //                "dayOfWeek": 3,
    //                "startPeriod": 1,
    //                "endPeriod": 4,
    //                "credit": 2,
    //                "capacity": 12,
    //                "canBeRegistered": true,
    //                "course": null,
    //                "classType": null,
    //                "userClasses": [],
    //                "registrationRecords": [],
    //                "created": "2024-06-06T03:25:14.6795664+00:00",
    //                "createdBy": "d9c06974-258f-4fd7-b6a0-2cf2b4f47fae",
    //                "lastModified": "2024-06-06T03:25:14.6795664+00:00",
    //                "lastModifiedBy": "d9c06974-258f-4fd7-b6a0-2cf2b4f47fae",
    //                "id": 21,
    //                "domainEvents": []
    //            },
    //            "classResult": null,
    //            "user": {
    //                "userName": "student@localhost",
    //                "email": "student@localhost",
    //                "departmentId": 1027,
    //                "department": null,
    //                "userClasses": [],
    //                "tuitionFee": [],
    //                "registrationRecords": [],
    //                "roles": [],
    //                "created": "2024-06-05T04:47:33.1820067+00:00",
    //                "createdBy": null,
    //                "lastModified": "2024-06-05T04:47:33.1820067+00:00",
    //                "lastModifiedBy": null,
    //                "id": 3,
    //                "domainEvents": []
    //            },
    //            "registrationSchedule": {
    //                "name": "Học kỳ 1, 2023-2024",
    //                "startDate": "2024-06-04T09:00:00",
    //                "endDate": "2024-06-11T09:00:00",
    //                "maximumCredit": 25,
    //                "feePerCredit": 1000000,
    //                "classes": [],
    //                "userClasses": [],
    //                "tuitionFees": [],
    //                "registrationRecords": [],
    //                "created": "2024-06-04T14:31:59.5506092+00:00",
    //                "createdBy": "d9c06974-258f-4fd7-b6a0-2cf2b4f47fae",
    //                "lastModified": "2024-06-04T14:31:59.5506092+00:00",
    //                "lastModifiedBy": "d9c06974-258f-4fd7-b6a0-2cf2b4f47fae",
    //                "id": 3,
    //                "domainEvents": []
    //            }
    //        }
    //    ],
    //    "count": 4
    //}

    return (
        <LecturerLayout>
            <h2>Danh sách các lớp - {currentReg?.name}</h2>
            <div className='control-pane'>
                <div className='control-section'>
                    <div style={{ paddingBottom: '18px' }}></div>
                    <GridComponent
                        id="lecturerClassesGrid"
                        dataSource={currentUserClass}
                        enableStickyHeader={true}
                        enableAdaptiveUI={true}
                        rowRenderingMode='Horizontal'
                        enableHover={true}
                        loadingIndicator={{ indicatorType: 'Shimmer' }}
                        rowHeight={38}
                        ref={(g) => { gridInstance = g; }}
                        enableHeaderFocus={true}
                        locale='vi-VN'
                    >
                        <ColumnsDirective>
                            <ColumnDirective type='checkbox' width='40'></ColumnDirective>
                            <ColumnDirective field='id' visible={false} headerText='ID' width='100' isPrimaryKey={true}></ColumnDirective>
                            <ColumnDirective field='class.classCode' headerText='Mã lớp' width='40' clipMode='EllipsisWithTooltip' />
                            <ColumnDirective field='courseName' headerText='Tên lớp' width='100' clipMode='EllipsisWithTooltip' />
                            <ColumnDirective field='departmentName' headerText='Khoa' width='40' clipMode='EllipsisWithTooltip' />
                            <ColumnDirective field='classType' headerText='Loại lớp' width='40' clipMode='EllipsisWithTooltip' />
                            <ColumnDirective field='class.dayOfWeek' headerText='Thứ' width='40' clipMode='EllipsisWithTooltip' />
                            <ColumnDirective
                                columns={
                                    [
                                        { field: 'class.startPeriod', headerText: 'Bắt đầu', width: 40 },
                                        { field: 'class.endPeriod', headerText: 'Kết thúc', width: 40 }
                                    ]
                                }
                                headerText='Tiết' >
                            </ColumnDirective>
                            <ColumnDirective field='userClassCount' headerText='Sĩ số' width='40'></ColumnDirective>
                        </ColumnsDirective>
                        <Inject services={[Sort, Filter, Page]} />
                    </GridComponent>
                </div>
            </div>
        </LecturerLayout>
    )
}

export default LecturerClasses;