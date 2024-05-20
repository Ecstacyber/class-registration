import React, { Component } from 'react';
import { AdminLayout } from '../AdminLayout';
import {
    CCard,
    CCardBody,
    CCardHeader,
    CCol,
    CRow,
    CTable,
    CTableBody,
    CTableCaption,
    CTableDataCell,
    CTableHead,
    CTableHeaderCell,
    CTableRow,
} from '@coreui/react';
import { closest, isNullOrUndefined } from '@syncfusion/ej2-base';
import {
    GridComponent,
    ColumnsDirective,
    ColumnDirective,
    Filter,
    IFilter,
    Inject,
    Grid,
    VirtualScroll,
    Sort,
    SelectionType,
    Selection
} from '@syncfusion/ej2-react-grids';
import { Query, DataManager, UrlAdaptor } from '@syncfusion/ej2-data';
import { DepartmentsClient, WeatherForecastsClient } from '../../web-api-client.ts';
import { DepartmentGrid } from './department/DepartmentGrid';

export class Department extends Component {
    static displayName = Department.name;

    //dReady = false;
    //dtTime = false;
    //isDataBound = false;
    //isDataChanged = true;
    //intervalFun;
    //clrIntervalFun;
    //clrIntervalFun1;
    //clrIntervalFun2;
    //dropSlectedIndex = null;
    //ddObj;
    //gridInstance;
    //stTime;
    //fields = { text: 'text', value: 'value' };

    constructor(props) {
        super(props);
        this.state = { departments: [], loading: true };
    }

    //check = {
    //    type: 'CheckBox'
    //};

    //select = {
    //    persistSelection: true,
    //    type: "Multiple",
    //    checkboxOnly: true
    //};

    //onDataBound() {
    //    clearTimeout(this.clrIntervalFun);
    //    clearInterval(this.intervalFun);
    //    this.dtTime = true;
    //}

    //query = new Query().addParams('dataCount', '1000');

    //onLoad(args) {
    //    document.getElementById('overviewgrid').ej2_instances[0].on('data-ready', () => {
    //        this.dReady = true;
    //        this.stTime = performance.now();
    //    });
    //    var observer = new MutationObserver((mutations) => {
    //        mutations.forEach(() => {
    //            if (this.dReady && this.stTime && this.isDataChanged) {
    //                let msgEle = document.getElementById('msg');
    //                let val = (performance.now() - this.stTime).toFixed(0);
    //                this.stTime = null;
    //                this.dReady = false;
    //                this.dtTime = false;
    //                this.isDataChanged = false;
    //                msgEle.innerHTML = 'Load Time: ' + "<b>" + val + "</b>" + '<b>ms</b>';
    //                msgEle.classList.remove('e-hide');
    //            }
    //        });
    //    });
    //    observer.observe(document.getElementById('overviewgrid'), {
    //        attributes: true,
    //        childList: true,
    //        subtree: true,
    //    });
    //}

    //onComplete(args) {
    //    if (args.requestType === "filterchoicerequest") {
    //        if (args.filterModel.options.field === "Trustworthiness" || args.filterModel.options.field === "Rating" || args.filterModel.options.field === "Status") {
    //            var span = args.filterModel.dialogObj.element.querySelectorAll('.e-selectall')[0];
    //            if (!isNullOrUndefined(span)) {
    //                closest(span, '.e-ftrchk').classList.add("e-hide");
    //            }
    //        }
    //    }
    //}

    //onChange() {
    //    this.ddObj.hidePopup();
    //    this.dropSlectedIndex = null;
    //    let index = this.ddObj.value;
    //    clearTimeout(this.clrIntervalFun2);
    //    this.clrIntervalFun2 = setTimeout(() => {
    //        this.isDataChanged = true;
    //        this.stTime = null;
    //        let contentElement = this.gridInstance.contentModule.getPanel().firstChild;
    //        contentElement.scrollLeft = 0;
    //        contentElement.scrollTop = 0;
    //        this.gridInstance.pageSettings.currentPage = 1;
    //        this.stTime = performance.now();
    //        if (this.gridInstance.query.params.length > 1) {
    //            for (let i = 0; i < this.gridInstance.query.params.length; i++) {
    //                if (this.gridInstance.query.params[i].key === 'dataCount') {
    //                    this.gridInstance.query.params[i].value = index.toString();
    //                    break;
    //                }
    //            }
    //        }
    //        else {
    //            this.gridInstance.query.params[0].value = index.toString();
    //        }
    //        this.gridInstance.setProperties({ dataSource: this.data });
    //    }, 100);
    //}

    //Filter = {
    //    type: 'Menu'
    //}

    //async getDepartmentData() {
    //    let departmetClient = new DepartmentsClient();
    //    const departmentData = await departmetClient.getDepartments();
    //    this.setState({ departments: departmentData, loading: false });
    //}

    //async populateWeatherData() {
    //    let client = new WeatherForecastsClient();
    //    const data = await client.getWeatherForecasts();
    //    this.setState({ forecasts: data, loading: false });
    //}

    //componentDidMount() {
    //    this.getDepartmentData();
    //}

    //static renderDepartmentData(departments) {
    //    return (
    //        <CTableBody>
    //            {departments.map((department, index) =>
    //                <CTableRow>
    //                    <CTableHeaderCell scope="row">{index + 1}</CTableHeaderCell>
    //                    <CTableDataCell>{department.shortName}</CTableDataCell>
    //                    <CTableDataCell>{department.fullName}</CTableDataCell>
    //                    <CTableDataCell>{department.description}</CTableDataCell>
    //                </CTableRow>
    //            )}
    //        </CTableBody>
    //    )
    //}

    render() {
        /*let tableContents = Department.renderDepartmentData(this.state.departments);*/

        return (
            <AdminLayout>
                <DepartmentGrid />
                {/*<div className='control-pane'>*/}
                {/*    <div className='control-section'>*/}
                {/*        <div style={{ paddingBottom: '18px' }}>*/}
                {/*            <h2>Danh sách khoa học</h2>*/}
                {/*            <br />*/}
                {/*        </div>*/}
                {/*        {tableContents}*/}
                {/*    </div>*/}
                {/*</div>*/}

                {/*<CRow>*/}
                {/*    <CCol xs={12}>*/}
                {/*        <CCard>*/}
                {/*            <CCardHeader>*/}
                {/*                <h2>Danh sách khoa học</h2>*/}
                {/*            </CCardHeader>*/}
                {/*            <CCardBody>*/}
                {/*                <CTable>*/}
                {/*                    <CTableHead>*/}
                {/*                        <CTableRow>*/}
                {/*                            <CTableHeaderCell scope="col">STT</CTableHeaderCell>*/}
                {/*                            <CTableHeaderCell scope="col">Mã khoa</CTableHeaderCell>*/}
                {/*                            <CTableHeaderCell scope="col">Tên khoa</CTableHeaderCell>*/}
                {/*                            <CTableHeaderCell scope="col">Mô tả</CTableHeaderCell>*/}
                {/*                        </CTableRow>*/}
                {/*                    </CTableHead>*/}
                {/*                    {tableContents}*/}
                {/*                </CTable>*/}
                {/*            </CCardBody>*/}
                {/*        </CCard>*/}
                {/*    </CCol>*/}
                {/*</CRow>*/}
            </AdminLayout>           
        );
    }
}