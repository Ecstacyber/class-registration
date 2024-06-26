﻿import { useEffect, useState } from 'react';
import { AdminLayout } from '../../AdminLayout';
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
import { useNavigate } from 'react-router-dom';
import { RegistrationSchedulesClient } from '../../../web-api-client.ts';

const RegistrationDetails = () => {
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
    const toolbarOptions = ['Add', 'Edit', 'Delete'];
    const editSettings = {
        allowEditing: true,
        allowAdding: true,
        allowDeleting: true,
        showDeleteConfirmDialog: true,
        mode: 'Dialog'
    };
    const dateFormat = {
        type: 'dateTime',
        format: 'dd/MM/yyyy hh:mm a'
    };
    const dateTimePickerParams = {
        params: {
            format: 'dd/MM/yyyy hh:mm a'
        }
    };
    const validationRules = { required: true };
    const pageSettings = { pageSizes: true };
    const check = {
        type: 'CheckBox'
    };
    const select = {
        persistSelection: true,
        type: 'Multiple',
        checkboxOnly: true
    };
    const filter = {
        ignoreAccent: true
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
                    filterText = args.action.currentFilterObject.value;
                    registrationSchedulesClient.getRegistrationSchedules(
                        args.skip,
                        args.take,
                        orderBy,
                        filterAttr,
                        filterText
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

    function dataSourceChanged(args) {
        console.log(args);
        const registrationSchedulesClient = new RegistrationSchedulesClient();
        if (args.action === 'add') {
            registrationSchedulesClient.createRegistrationSchedule(args.data);
        } else if (args.action === 'edit') {
            registrationSchedulesClient.updateRegistrationSchedule(args.data.id, args.data);
        } else if (args.requestType === 'delete') {
            args.data.forEach((deleteData) => {
                registrationSchedulesClient.deleteRegistrationSchedule(deleteData.id);
            });
            filterAttr = '';
            filterText = '';
            orderBy = '';
            registrationSchedulesClient.getRegistrationSchedules(0, 12)
                .then((gridData) => { gridInstance.dataSource = gridData });
            return;
        }
    }

    function onRecordDoubleClick(args) {
        console.log(args);
        //navigate('/admin-index/registration-schedule/' + args.rowData.id);
    }

    return (
        <AdminLayout>
            <div className='control-pane'>
                <div className='control-section'>
                    <div style={{ paddingBottom: '18px' }}>
                        <h2>Danh sách đợt đăng ký</h2>
                        <br />
                    </div>
                    <GridComponent id="overviewgrid"
                        dataSource={scheduleData}
                        toolbar={toolbarOptions}
                        editSettings={editSettings}
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
                        allowSelection={true}
                        selectionSettings={select}
                        enableHeaderFocus={true}
                        dataStateChange={dataStateChange.bind(this)}
                        dataSourceChanged={dataSourceChanged.bind(this)}
                        recordDoubleClick={onRecordDoubleClick.bind(this)}
                    >
                        <ColumnsDirective>
                            <ColumnDirective type='checkbox' allowSorting={false} allowFiltering={false} width='40'></ColumnDirective>
                            <ColumnDirective field='id' visible={false} headerText='ID' width='100' isPrimaryKey={true}></ColumnDirective>
                            <ColumnDirective
                                field='name'
                                headerText='Tên'
                                width='160'
                                validationRules={validationRules}
                                clipMode='EllipsisWithTooltip' />
                            <ColumnDirective
                                field='startDate'
                                headerText='Ngày bắt đầu'
                                width='60'
                                validationRules={validationRules}
                                allowSorting={false}
                                allowFiltering={false}
                                format={dateFormat}
                                editType='datetimepickeredit'
                                edit={dateTimePickerParams}
                                clipMode='EllipsisWithTooltip' />
                            <ColumnDirective
                                field='endDate'
                                headerText='Ngày kết thúc'
                                width='60'
                                validationRules={validationRules}
                                allowSorting={false}
                                allowFiltering={false}
                                format={dateFormat}
                                editType='datetimepickeredit'
                                edit={dateTimePickerParams}
                                clipMode='EllipsisWithTooltip' />
                        </ColumnsDirective>
                        <Inject services={[Filter, Sort, Toolbar, Edit, Page]} />
                    </GridComponent>
                </div>
            </div>
        </AdminLayout>
    );
}

export default RegistrationDetails;