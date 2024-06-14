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

const RegistrationHistoryDetails = () => {
    const { registrationScheduleId } = useParams();
    const [currentUserInfo, setCurrentUserInfo] = useState(null);
    const [regScheduleInfo, setRegScheduleInfo] = useState({});
    const [userClassData, setUserClassData] = useState({
        result: [],
        count: 0
    });
    const [regRecord, setRegRecord] = useState({
        result: [],
        count: 0
    });
    let gridInstance;
    const check = {
        type: 'CheckBox'
    };
    const dateFormat = {
        type: 'dateTime',
        format: 'dd/MM/yyyy hh:mm a'
    };

    async function getData() {
        const currentUserInfoClient = new CurrentUserInfoClient();
        let currentUser = await currentUserInfoClient.getUserInfo();
        setCurrentUserInfo(currentUser);

        //const regScheduleClient = new RegistrationSchedulesClient();
        //let thisReg = await regScheduleClient.getRegistrationScheduleById(registrationScheduleId);
        //setRegScheduleInfo(thisReg);

        const currentUserRegistrationResultClient = new CurrentUserRegistrationResultClient();
        let currentRegRes = await currentUserRegistrationResultClient.getCurrentUserRegistrationResult(currentUser.id);
        setUserClassData(currentRegRes);
    }

    useEffect(() => {
        getData();
    }, [])

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
            <h2>Kết quả đợt đăng ký: Học kỳ 1, 2023-2024</h2>
            <div className='control-pane'>
                <div className='control-section'>
                    <div style={{ paddingBottom: '18px' }}></div>
                    <GridComponent
                        id="overviewgrid1"
                        dataSource={userClassData}
                        enableStickyHeader={true}
                        enableAdaptiveUI={true}
                        rowRenderingMode='Horizontal'
                        enableHover={true}
                        loadingIndicator={{ indicatorType: 'Shimmer' }}
                        rowHeight={38}
                        ref={(g) => { gridInstance = g; }}
                        enableHeaderFocus={true}
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
                        <Inject services={[Aggregate, DetailRow]} />
                    </GridComponent>
                </div>
            </div>
        </StudentLayout>
    )
}

export default RegistrationHistoryDetails;