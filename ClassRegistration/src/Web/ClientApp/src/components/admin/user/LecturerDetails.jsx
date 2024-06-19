import { useEffect, useState } from 'react';
import {
    GridComponent,
    ColumnsDirective,
    ColumnDirective,
    Filter,
    Inject,
    Sort,
    Page,
    Toolbar,
    Edit,
    ForeignKey
} from '@syncfusion/ej2-react-grids';
import { createElement, L10n } from '@syncfusion/ej2-base';
import { DropDownList } from '@syncfusion/ej2-dropdowns';
import { useNavigate } from 'react-router-dom';
import { AdminLayout } from '../../AdminLayout';
import { RegistrationSchedulesClient, CoursesClient, DepartmentsFKRefClient, LecturersClient } from '../../../web-api-client.ts';

const LecturerDetails = () => {
    const [scheduleData, setScheduleData] = useState({
        result: [],
        count: 0
    });
    const navigate = useNavigate();
    let orderBy = '';
    let filterAttr = '';
    let filterText = '';
    let gridInstance;
    const fields = { text: 'text', value: 'value' };
    const pageSettings = { pageSizes: true };
    const filter = {
        ignoreAccent: true
    };
    const numericValidationRules = {
        required: true,
        number: true
    }
    const feeParams = {
        params: {
            decimals: 0,
            format: "N",
            min: 0,
            validateDecimalOnType: true
        }
    };

    async function getScheduleData() {
        const registrationSchedulesClient = new RegistrationSchedulesClient();
        let registrationSchedulesData = await registrationSchedulesClient.getRegistrationSchedules(0, 12);
        setScheduleData(registrationSchedulesData);
    }

    useEffect(() => {
        getScheduleData();
    }, []);

    function dataStateChange(args) {
        console.log(args);
        const registrationSchedulesClient = new RegistrationSchedulesClient();
        if (args.action) {
            if (args.action.requestType === 'paging') {
                registrationSchedulesClient.getRegistrationSchedules(
                    args.skip,
                    args.take,
                    orderBy,
                    filterAttr,
                    filterText
                )
                    .then((gridData) => { gridInstance.dataSource = gridData });
                return;
            }

            if (args.action.requestType === 'sorting') {
                if (args.action.columnName && args.action.direction) {
                    orderBy = args.action.columnName + '-' + args.action.direction;
                    registrationSchedulesClient.getRegistrationSchedules(
                        args.skip,
                        args.take,
                        orderBy,
                        filterAttr ? filterAttr : '',
                        filterText ? filterText : ''
                    )
                        .then((gridData) => { gridInstance.dataSource = gridData });
                    return;
                }
                else {
                    orderBy = '';
                    registrationSchedulesClient.getRegistrationSchedules(
                        args.skip,
                        args.take,
                        '',
                        filterAttr ? filterAttr : '',
                        filterText ? filterText : ''
                    )
                        .then((gridData) => { gridInstance.dataSource = gridData });
                    return;
                }
            }

            if (args.action.action === 'filter') {
                if (args.action.currentFilterObject.value && args.action.currentFilterObject.value !== '') {
                    filterAttr = args.action.currentFilterObject.field;
                    filterText = args.action.currentFilterObject.value.toString().substring(0, 24);
                    registrationSchedulesClient.getRegistrationSchedules(
                        args.skip,
                        args.take,
                        orderBy,
                        filterAttr,
                        filterText,
                        args.action.currentFilterObject.operator
                    )
                        .then((gridData) => { gridInstance.dataSource = gridData });
                    return;
                } else {
                    registrationSchedulesClient.getRegistrationSchedules(args.skip, args.take)
                        .then((gridData) => { gridInstance.dataSource = gridData });
                    return;
                }
            }

            if (args.action.action === 'clearFilter') {
                filterAttr = '';
                filterText = '';
                registrationSchedulesClient.getRegistrationSchedules(args.skip, args.take)
                    .then((gridData) => { gridInstance.dataSource = gridData });
                return;
            }

            if (args.action.requestType === 'refresh') {
                filterAttr = '';
                filterText = '';
                orderBy = '';
                registrationSchedulesClient.getRegistrationSchedules(0, 12)
                    .then((gridData) => { gridInstance.dataSource = gridData });
                return;
            }

            if (args.action.requestType === 'save') {
                filterAttr = '';
                filterText = '';
                orderBy = '';
                registrationSchedulesClient.getRegistrationSchedules(0, 12)
                    .then((gridData) => { gridInstance.dataSource = gridData });
                return;
            }

            registrationSchedulesClient.getRegistrationSchedules(0, 12)
                .then((gridData) => { gridInstance.dataSource = gridData });

        } else {
            registrationSchedulesClient.getRegistrationSchedules(0, 12)
                .then((gridData) => { gridInstance.dataSource = gridData });
        }
    }

    function onRecordDoubleClick(args) {
        console.log(args);
        navigate('./window/' + args.rowData.id);
    }

    return (
        <AdminLayout>
            <div className='control-pane'>
                <div className='control-section'>
                    <div style={{ paddingBottom: '18px' }}>
                        <h2>Danh sách đợt đăng ký</h2>
                        <br />
                    </div>
                    <GridComponent id="lecturerRegGrid"
                        dataSource={scheduleData}
                        allowPaging={true}
                        pageSettings={pageSettings}
                        enableHover={true}
                        height='456'
                        loadingIndicator={{ indicatorType: 'Shimmer' }}
                        rowHeight={38}
                        ref={(g) => { gridInstance = g; }}
                        allowFiltering={true}
                        filterSettings={filter}
                        allowSorting={true}
                        allowMultiSorting={true}
                        enableHeaderFocus={true}
                        recordDoubleClick={onRecordDoubleClick.bind(this)}
                        dataStateChange={dataStateChange.bind(this)}
                        locale='vi-VN'
                    >
                        <ColumnsDirective>
                            <ColumnDirective field='id' visible={false} headerText='ID' width='100' isPrimaryKey={true}></ColumnDirective>
                            <ColumnDirective
                                field='name'
                                headerText='Tên'
                                width='160'
                                clipMode='EllipsisWithTooltip' />
                            {/*<ColumnDirective*/}
                            {/*    field='startDate'*/}
                            {/*    headerText='Ngày bắt đầu'*/}
                            {/*    width='60'*/}
                            {/*    validationRules={validationRules}*/}
                            {/*    format={dateFormat}*/}
                            {/*    editType='datetimepickeredit'*/}
                            {/*    edit={dateTimePickerParams}*/}
                            {/*    clipMode='EllipsisWithTooltip' />*/}
                            {/*<ColumnDirective*/}
                            {/*    field='endDate'*/}
                            {/*    headerText='Ngày kết thúc'*/}
                            {/*    width='60'*/}
                            {/*    validationRules={validationRules}*/}
                            {/*    format={dateFormat}*/}
                            {/*    editType='datetimepickeredit'*/}
                            {/*    edit={dateTimePickerParams}*/}
                            {/*    clipMode='EllipsisWithTooltip' />*/}
                        </ColumnsDirective>
                        <Inject services={[Filter, Sort, Page]} />
                    </GridComponent>
                </div>
            </div>
        </AdminLayout>
    )
}

export default LecturerDetails;