import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useNavigationType, useLocation } from 'react-router-dom';
import {
    GridComponent,
    ColumnsDirective,
    ColumnDirective,
    Inject,
    Toolbar,
    Edit,
    Aggregate,
    AggregateColumnsDirective,
    AggregateColumnDirective,
    AggregateDirective,
    AggregatesDirective,
    DetailRow
} from '@syncfusion/ej2-react-grids';
import { createElement, L10n } from '@syncfusion/ej2-base';
import { DropDownList } from '@syncfusion/ej2-dropdowns';
import { StudentLayout } from '../../StudentLayout';
import {
    ClassesClient,
    UserClassesClient,
    RegistrationSchedulesClient,
    ClassTypesClient,
    CurrentRegistrationScheduleInfoClient,
    ClassRegisterClient,
    CurrentUserInfoClient,
    CurrentUserRegistrationResultClient,
    CurrentUserRegistrationRecordClient
} from '../../../web-api-client.ts';
import './reg-result.css'

const RegistrationResult = () => {
    const [currentUserInfo, setCurrentUserInfo] = useState(null);
    const [currentRegScheduleInfo, setCurrentRegScheduleInfo] = useState({});
    const [userClassData, setUserClassData] = useState({
        result: [],
        count: 0
    });
    const [regRecord, setRegRecord] = useState({
        result: [],
        count: 0
    });
    let gridInstance;
    let recordGridInstance;
    const fields = { text: 'text', value: 'value' };
    const toolbarOptions = ['Delete'];
    const check = {
        type: 'CheckBox'
    };
    const select = {
        persistSelection: true,
        type: 'Multiple',
        checkboxOnly: true
    };
    const editSettings = {
        allowEditing: false,
        allowAdding: false,
        allowDeleting: true,
        showDeleteConfirmDialog: true
    };
    const dateFormat = {
        type: 'dateTime',
        format: 'dd/MM/yyyy hh:mm a'
    };
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
    
    async function getData() {
        const currentUserInfoClient = new CurrentUserInfoClient();
        let currentUser = await currentUserInfoClient.getUserInfo();
        setCurrentUserInfo(currentUser);

        const currentRegistrationScheduleInfoClient = new CurrentRegistrationScheduleInfoClient();
        let currentReg = await currentRegistrationScheduleInfoClient.getCurrentRegistrationSchedule();
        setCurrentRegScheduleInfo(currentReg);

        const currentUserRegistrationResultClient = new CurrentUserRegistrationResultClient();
        let currentRegRes = await currentUserRegistrationResultClient.getCurrentUserRegistrationResult(currentUser.id);
        setUserClassData(currentRegRes);

        const currentUserRegistrationRecordClient = new CurrentUserRegistrationRecordClient();
        let currentRegRecord = await currentUserRegistrationRecordClient.getCurrentUserRegistrationRecord(currentUser.id);
        setRegRecord(currentRegRecord);
    }

    useEffect(() => {
        getData();
    }, [])

    function dataSourceChanged(args) {
        console.log(args);
        const userClassesClient = new UserClassesClient();
        if (args.requestType === 'delete') {
            args.data.forEach((deleteData) => {
                userClassesClient.removeUserFromClass(deleteData.id);
            });
        }
        const currentUserRegistrationResultClient = new CurrentUserRegistrationResultClient();
        currentUserRegistrationResultClient.getCurrentUserRegistrationResult(currentUserInfo.id)
            .then((gridData) => { gridInstance.dataSource = gridData });

        const currentUserRegistrationRecordClient = new CurrentUserRegistrationRecordClient();
        currentUserRegistrationRecordClient.getCurrentUserRegistrationRecord(currentUserInfo.id)
            .then((gridData) => { recordGridInstance.dataSource = gridData });
    }

    function dataStateChange(args) {
        console.log(args);
        const currentUserRegistrationResultClient = new CurrentUserRegistrationResultClient();
        currentUserRegistrationResultClient.getCurrentUserRegistrationResult(currentUserInfo.id)
            .then((gridData) => { gridInstance.dataSource = gridData });
    }

    function detailRowTemplate(props) {
        return (<table className="detailtable" style={{ width: "100%" }}>
            <colgroup>
                <col style={{ width: "40%" }} />
                <col style={{ width: "30%" }} />
                <col style={{ width: "30%" }} />
            </colgroup>
            <tbody>
                <tr>
                    <td>
                        <span style={{ fontWeight: 500 }}>Thứ: </span> {props.class.dayOfWeek}
                    </td>
                    <td>
                        <span style={{ fontWeight: 500 }}>Đã đăng ký: </span> {props.userClassCount}
                    </td>
                </tr>
                <tr>
                    <td>
                        <span style={{ fontWeight: 500 }}>Tiết bắt đầu: </span> {props.class.startPeriod}
                    </td>
                    <td>
                        <span style={{ fontWeight: 500 }}>Số lượng: </span> {props.class.capacity}
                    </td>
                </tr>
                <tr>
                    <td>
                        <span style={{ fontWeight: 500 }}>Tiết kết thúc: </span> {props.class.endPeriod}
                    </td>
                </tr>
            </tbody>
        </table>);
    }

    const template = detailRowTemplate;

    function footerInfo(props) {
        return (<span>Tổng:</span>);
    }

    function footerSum(props) {
        return (<span>{props.Sum}</span>);
    }

    function valueAccess(field, data, column) {
        var value = data[column.field];
        if (data['fee'] % 2 === 0) {
            value = '' + value;
            var parts = value.toString().split('.');
            parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
            return parts.join('.');
        } else {
            value = '' + value;
            var parts = value.toString().split('.');
            parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, '.');
            return parts.join(',');
        }
    }

    return (
        <StudentLayout>
            <h2>Kết quả đăng ký</h2>
            <h2>{currentRegScheduleInfo.name}</h2>
            <div className='control-pane'>
                <div className='control-section'>
                    <div style={{ paddingBottom: '18px' }}></div>
                    <GridComponent
                        id="overviewgrid1"
                        dataSource={userClassData}
                        toolbar={toolbarOptions}
                        editSettings={editSettings}
                        enableStickyHeader={true}
                        enableAdaptiveUI={true}
                        rowRenderingMode='Horizontal'
                        enableHover={true}
                        loadingIndicator={{ indicatorType: 'Shimmer' }}
                        rowHeight={38}
                        ref={(g) => { gridInstance = g; }}
                        allowSelection={true}
                        selectionSettings={select}
                        enableHeaderFocus={true}
                        dataSourceChanged={dataSourceChanged.bind(this)}
                        dataStateChange={dataStateChange.bind(this)}
                        detailTemplate={template.bind(this)}
                        locale='vi-VN'
                    >
                        <ColumnsDirective>
                            <ColumnDirective type='checkbox' width='40'></ColumnDirective>
                            <ColumnDirective field='id' visible={false} headerText='ID' width='100' isPrimaryKey={true}></ColumnDirective>
                            <ColumnDirective field='class.classCode' headerText='Mã lớp' width='40' clipMode='EllipsisWithTooltip' />
                            <ColumnDirective field='courseName' headerText='Tên lớp' width='100' clipMode='EllipsisWithTooltip' />
                            <ColumnDirective field='departmentName' headerText='Khoa' width='40' clipMode='EllipsisWithTooltip' />
                            <ColumnDirective field='classType' headerText='Loại lớp' width='40' clipMode='EllipsisWithTooltip' />
                            <ColumnDirective field='class.credit' headerText='Tín chỉ' width='40' clipMode='EllipsisWithTooltip' />
                            {/*<ColumnDirective field='class.dayOfWeek' headerText='Thứ' width='40' clipMode='EllipsisWithTooltip' />*/}
                            {/*<ColumnDirective*/}
                            {/*    columns={*/}
                            {/*        [*/}
                            {/*            { field: 'class.startPeriod', headerText: 'Bắt đầu', width: 40 },*/}
                            {/*            { field: 'class.endPeriod', headerText: 'Kết thúc', width: 40 }*/}
                            {/*        ]*/}
                            {/*    }*/}
                            {/*    headerText='Tiết' >*/}
                            {/*</ColumnDirective>*/}
                            {/*<ColumnDirective field='userClassCount' headerText='Đã đăng ký' width='40'></ColumnDirective>*/}
                            {/*<ColumnDirective field='class.capacity' headerText='Số lượng' width='40'></ColumnDirective>*/}
                            <ColumnDirective field='fee' headerText='Học phí' width='80' valueAccessor={valueAccess.bind(this)}></ColumnDirective>
                        </ColumnsDirective>
                        <AggregatesDirective>
                            <AggregateDirective>
                                <AggregateColumnsDirective>
                                    <AggregateColumnDirective field='classType' type='Sum' format='N' footerTemplate={footerInfo}> </AggregateColumnDirective>
                                    <AggregateColumnDirective field='class.credit' type='Sum' format='N' footerTemplate={footerSum}> </AggregateColumnDirective>
                                    <AggregateColumnDirective field='fee' type='Sum' format='N' footerTemplate={footerSum}> </AggregateColumnDirective>
                                </AggregateColumnsDirective>
                            </AggregateDirective>
                        </AggregatesDirective>
                        <Inject services={[Edit, Toolbar, Aggregate, DetailRow]} />
                    </GridComponent>                    
                </div>
            </div>
            <div style={{ paddingBottom: '18px' }}></div>
            <h2>Lịch sử đăng ký</h2>
            <div className='control-pane'>
                <div className='control-section'>
                    <div style={{ paddingBottom: '18px' }}></div>
                    <GridComponent
                        id="overviewgrid2"
                        dataSource={regRecord}
                        enableStickyHeader={true}
                        enableAdaptiveUI={true}
                        rowRenderingMode='Horizontal'
                        enableHover={true}
                        height='300'
                        loadingIndicator={{ indicatorType: 'Shimmer' }}
                        rowHeight={38}
                        ref={(g) => { recordGridInstance = g; }}
                        enableHeaderFocus={true}
                    >
                        <ColumnsDirective>
                            <ColumnDirective field='id' visible={false} headerText='ID' width='100' isPrimaryKey={true}></ColumnDirective>
                            <ColumnDirective field='created' textAlign='Right' headerText='Thời gian' width='60' format={dateFormat} clipMode='EllipsisWithTooltip' />
                            <ColumnDirective field='class.classCode' headerText='Mã lớp' width='40' clipMode='EllipsisWithTooltip' />
                            <ColumnDirective field='requestType' headerText='Hành động' width='40' clipMode='EllipsisWithTooltip' />
                            <ColumnDirective field='result' headerText='Kết quả' width='40' clipMode='EllipsisWithTooltip' />
                            <ColumnDirective field='message' headerText='Chi tiết' width='60' clipMode='EllipsisWithTooltip' />
                        </ColumnsDirective>
                    </GridComponent>
                </div>
            </div>
        </StudentLayout>
    )
}

export default RegistrationResult;