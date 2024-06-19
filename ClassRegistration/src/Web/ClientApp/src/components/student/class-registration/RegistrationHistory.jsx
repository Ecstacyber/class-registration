import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
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
    RegistrationSchedulesClient,
} from '../../../web-api-client.ts';

const RegistrationHistory = () => {
    const [scheduleData, setScheduleData] = useState({
        result: [],
        count: 0
    });
    const navigate = useNavigate();
    let gridInstance;
    const dateFormat = {
        type: 'dateTime',
        format: 'dd/MM/yyyy hh:mm a'
    };
    //const tempPrevReg = {
    //    "result": [
    //        {
    //            "id": 1,
    //            "name": "Học kỳ 1, 2022-2023"
    //        },
    //        {
    //            "id": 2,
    //            "name": "Học kỳ 2, 2022-2023"
    //        },
    //        {
    //            "id": 3,
    //            "name": "Học kỳ 1, 2023-2024"
    //        },
    //    ],
    //    "count": 3
    //}

    async function getData() {
        const registrationSchedulesClient = new RegistrationSchedulesClient();
        let registrationSchedulesData = await registrationSchedulesClient.getPreviousRegistrationSchedules(0, 12);
        setScheduleData(registrationSchedulesData);
    }

    function onRecordDoubleClick(args) {
        console.log(args);
        navigate('./' + args.rowData.id);
    }

    useEffect(() => {
        getData();
    }, [])

    return (
        <StudentLayout>
            <h2>Danh sách các đợt đăng ký trước</h2>
            <br />
            <div className='control-pane'>
                <div className='control-section'>
                    <GridComponent id="overviewgrid"
                        dataSource={scheduleData}
                        enableHover={true}
                        height='1000'
                        loadingIndicator={{ indicatorType: 'Shimmer' }}
                        rowHeight={38}
                        ref={(g) => { gridInstance = g; }}
                        enableHeaderFocus={true}
                        recordDoubleClick={onRecordDoubleClick.bind(this)}
                        locale='vi-VN'
                    >
                        <ColumnsDirective>
                            <ColumnDirective field='id' visible={false} headerText='ID' width='100' isPrimaryKey={true}></ColumnDirective>
                            <ColumnDirective width='30'></ColumnDirective>
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
                    </GridComponent>
                </div>
            </div>
        </StudentLayout>
    )
}

export default RegistrationHistory;