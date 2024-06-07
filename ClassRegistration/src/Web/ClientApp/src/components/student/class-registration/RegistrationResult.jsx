import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useNavigationType, useLocation } from 'react-router-dom';
import {
    GridComponent,
    ColumnsDirective,
    ColumnDirective,
    Inject,
    Toolbar,
    Edit
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
    }

    function dataStateChange(args) {
        console.log(args);
        const currentUserRegistrationResultClient = new CurrentUserRegistrationResultClient();
        currentUserRegistrationResultClient.getCurrentUserRegistrationResult(currentUserInfo.id)
            .then((gridData) => { gridInstance.dataSource = gridData });
    }

    return (
        <StudentLayout>
            <h2>Kết quả đăng ký</h2>
            <h2>{currentRegScheduleInfo.name}</h2>
            <div className='control-pane'>
                <div className='control-section'>
                    <div style={{ paddingBottom: '18px' }}></div>
                    <GridComponent id="overviewgrid"
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
                    >
                        <ColumnsDirective>
                            <ColumnDirective type='checkbox' width='40'></ColumnDirective>
                            <ColumnDirective field='id' visible={false} headerText='ID' width='100' isPrimaryKey={true}></ColumnDirective>
                            <ColumnDirective field='class.classCode' headerText='Mã lớp' width='40' clipMode='EllipsisWithTooltip' />
                            <ColumnDirective field='courseName' headerText='Tên lớp' width='100' clipMode='EllipsisWithTooltip' />
                            <ColumnDirective field='departmentName' headerText='Khoa' width='40' clipMode='EllipsisWithTooltip' />
                            <ColumnDirective field='classType' headerText='Loại lớp' width='40' clipMode='EllipsisWithTooltip' />
                            <ColumnDirective field='class.credit' headerText='Tín chỉ' width='40' clipMode='EllipsisWithTooltip' />
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
                            <ColumnDirective field='userClassCount' headerText='Đã đăng ký' width='40'></ColumnDirective>
                            <ColumnDirective field='class.capacity' headerText='Số lượng' width='40'></ColumnDirective>
                        </ColumnsDirective>
                        <Inject services={[Edit, Toolbar]} />
                    </GridComponent>
                    {/*<div style={{ paddingBottom: '36px' }}></div>*/}
                    {/*<GridComponent id="overviewgrid"*/}
                    {/*    dataSource={regRecord}*/}
                    {/*    toolbar={toolbarOptions}*/}
                    {/*    editSettings={editSettings}*/}
                    {/*    enableStickyHeader={true}*/}
                    {/*    enableAdaptiveUI={true}*/}
                    {/*    rowRenderingMode='Horizontal'*/}
                    {/*    enableHover={true}*/}
                    {/*    loadingIndicator={{ indicatorType: 'Shimmer' }}*/}
                    {/*    rowHeight={38}*/}
                    {/*    ref={(g) => { gridInstance = g; }}*/}
                    {/*    allowSelection={true}*/}
                    {/*    selectionSettings={select}*/}
                    {/*    enableHeaderFocus={true}*/}
                    {/*    dataSourceChanged={dataSourceChanged.bind(this)}*/}
                    {/*    dataStateChange={dataStateChange.bind(this)}*/}
                    {/*>*/}
                    {/*    <ColumnsDirective>*/}
                    {/*        <ColumnDirective type='checkbox' width='40'></ColumnDirective>*/}
                    {/*        <ColumnDirective field='id' visible={false} headerText='ID' width='100' isPrimaryKey={true}></ColumnDirective>*/}
                    {/*        <ColumnDirective field='class.classCode' headerText='Mã lớp' width='40' clipMode='EllipsisWithTooltip' />*/}
                    {/*        <ColumnDirective field='courseName' headerText='Tên lớp' width='100' clipMode='EllipsisWithTooltip' />*/}
                    {/*        <ColumnDirective field='departmentName' headerText='Khoa' width='40' clipMode='EllipsisWithTooltip' />*/}
                    {/*        <ColumnDirective field='classType' headerText='Loại lớp' width='40' clipMode='EllipsisWithTooltip' />*/}
                    {/*        <ColumnDirective field='class.credit' headerText='Tín chỉ' width='40' clipMode='EllipsisWithTooltip' />*/}
                    {/*        <ColumnDirective field='class.dayOfWeek' headerText='Thứ' width='40' clipMode='EllipsisWithTooltip' />*/}
                    {/*        <ColumnDirective*/}
                    {/*            columns={*/}
                    {/*                [*/}
                    {/*                    { field: 'class.startPeriod', headerText: 'Bắt đầu', width: 40 },*/}
                    {/*                    { field: 'class.endPeriod', headerText: 'Kết thúc', width: 40 }*/}
                    {/*                ]*/}
                    {/*            }*/}
                    {/*            headerText='Tiết' >*/}
                    {/*        </ColumnDirective>*/}
                    {/*        <ColumnDirective field='userClassCount' headerText='Đã đăng ký' width='40'></ColumnDirective>*/}
                    {/*        <ColumnDirective field='class.capacity' headerText='Số lượng' width='40'></ColumnDirective>*/}
                    {/*    </ColumnsDirective>*/}
                    {/*</GridComponent>*/}
                </div>
            </div>
        </StudentLayout>
    )
}

export default RegistrationResult;