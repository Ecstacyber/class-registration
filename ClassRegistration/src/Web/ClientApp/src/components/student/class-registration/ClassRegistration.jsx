import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, useNavigationType, useLocation } from 'react-router-dom';
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
import { ButtonComponent } from '@syncfusion/ej2-react-buttons';
import { StudentLayout } from '../../StudentLayout';
import {
    ClassesClient,
    UserClassesClient,
    RegistrationSchedulesClient,
    ClassTypesClient,
    CurrentRegistrationScheduleInfoClient,
    ClassRegisterClient,
    CurrentUserInfoClient
} from '../../../web-api-client.ts';

const ClassRegistration = () => {
    const [currentUserInfo, setCurrentUserInfo] = useState(null);
    const [classData, setClassData] = useState({
        result: [],
        count: 0
    });
    const [currentRegScheduleInfo, setCurrentRegScheduleInfo] = useState({});
    const [classTypes, setClassTypes] = useState(null);
    const [selectedClasses, setSelectedClasses] = useState([]);
    const [creditCount, setCreditCount] = useState(0);
    let orderBy = '';
    let filterAttr = '';
    let filterText = '';
    let gridInstance;
    const fields = { text: 'text', value: 'value' };
    const pageSettings = {
        pageSizes: true
    };
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
    const toolbarOptions = ['Add', 'Cancel'];
    const editSettings = {
        allowEditing: false,
        allowAdding: true,
        allowDeleting: false,
        mode: 'Dialog'
    };

    //const clickHandler = (args) => {
    //    if (gridInstance && args.item.id === 'register') {
    //        const classRegisterClient = new ClassRegisterClient();
    //        for (let i = 0; i < selectedClasses.length; i++) {
    //            classRegisterClient.registerStudent(currentUserInfo.id, selectedClasses[i].id, currentRegScheduleInfo.id);
    //        }
    //        gridInstance.clearSelection();
    //        setSelectedClasses([]);
    //        const classesClient = new ClassesClient();
    //        classesClient.getClasses(0, 12).then((gridData) => gridInstance.dataSource = gridData);
    //    }
    //};

    const created = () => {
        let toolbar = gridInstance.element.querySelector('.e-toolbar');
        gridInstance.element.appendChild(toolbar);
    };

    const headerTemplate = () => {
        return (<div></div>);
    }

    const filterBarTemplate = {
        create: (args) => {
            return createElement('input', { className: 'flm-input' });
        },
        write: (args) => {
            classTypes.splice(0, 0, { 'type': 'All' }); // for clear filtering
            const classesClient = new ClassesClient();
            const dropInstance = new DropDownList({
                change: (arg) => {
                    if (gridInstance) {
                        if (arg.value !== 'All') {
                            console.log(arg);
                            orderBy = '';
                            filterAttr = 'classType';
                            if (arg.value === 'Lý thuyết') {
                                filterText = 'Lý thuyết';
                                let classes = classesClient.getClasses(
                                    0,
                                    12,
                                    '',
                                    filterAttr,
                                    filterText
                                )
                                    .then((gridData) => { gridInstance.dataSource = gridData });
                            }
                            if (arg.value === 'Thực hành') {
                                filterText = 'Thực hành';
                                let classes = classesClient.getClasses(
                                    0,
                                    12,
                                    '',
                                    filterAttr,
                                    filterText
                                )
                                    .then((gridData) => { gridInstance.dataSource = gridData });
                            }                          
                        }
                        else {
                            console.log(arg);
                            orderBy = '';
                            filterAttr = '';
                            filterText = '';
                            classesClient.getClasses(
                                0,
                                12,
                                '',
                                '',
                                ''
                            )
                                .then((gridData) => { gridInstance.dataSource = gridData });
                        }
                    }
                },
                dataSource: classTypes,
                fields: { text: 'type' },
                index: 0,
                placeholder: 'Chọn loại lớp',
                popupHeight: '200px'
            });
            dropInstance.appendTo(args.element);
        }
    };

    async function getData() {
        const currentUserInfoClient = new CurrentUserInfoClient();
        let currentUser = await currentUserInfoClient.getUserInfo();
        setCurrentUserInfo(currentUser);

        const currentRegistrationScheduleInfoClient = new CurrentRegistrationScheduleInfoClient();
        let currentRegInfo = await currentRegistrationScheduleInfoClient.getCurrentRegistrationSchedule();
        setCurrentRegScheduleInfo(currentRegInfo);

        const classesClient = new ClassesClient();
        let cl_data = await classesClient.getClasses(0, 12);
        setClassData(cl_data);

        const classTypesClient = new ClassTypesClient();
        let classTypesData = await classTypesClient.getClassTypes();
        setClassTypes(classTypesData);
    }

    useEffect(() => {
        getData();
    }, [])

    function onRowSelected(args) {
        console.log(selectedClasses);
        console.log(args);
        setSelectedClasses([...selectedClasses, args.data]);
        setCreditCount(creditCount + args.data.credit);
    }

    function onRowDeselected(args) {
        console.log(selectedClasses);
        console.log(args);
        setSelectedClasses(selectedClasses.filter(x => x.id !== args.data.id));
        setCreditCount(creditCount - args.data.credit);
    }
    

    function dataStateChange(args) {
        console.log(args);
        const classesClient = new ClassesClient();
        if (args.action) {
            if (args.action.requestType === 'paging') {
                classesClient.getClasses(
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
                    classesClient.getClasses(
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
                    classesClient.getClasses(
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
                    classesClient.getClasses(
                        args.skip,
                        args.take,
                        orderBy,
                        filterAttr,
                        filterText
                    )
                        .then((gridData) => { gridInstance.dataSource = gridData });
                    return;
                } else {
                    classesClient.getClasses(args.skip, args.take)
                        .then((gridData) => { gridInstance.dataSource = gridData });
                    return;
                }

            }

            if (args.action.action === 'clearFilter') {
                filterAttr = '';
                filterText = '';
                classesClient.getClasses(args.skip, args.take)
                    .then((gridData) => { gridInstance.dataSource = gridData });
                return;
            }

            if (args.action.requestType === 'refresh') {
                filterAttr = '';
                filterText = '';
                orderBy = '';
                classesClient.getClasses(0, 12)
                    .then((gridData) => { gridInstance.dataSource = gridData });
                return;
            }

            if (args.action.requestType === 'save') {
                filterAttr = '';
                filterText = '';
                orderBy = '';
                classesClient.getClasses(0, 12)
                    .then((gridData) => { gridInstance.dataSource = gridData });
                return;
            }

            classesClient.getClasses(args.skip, args.take)
                .then((gridData) => { gridInstance.dataSource = gridData });

        } else {
            classesClient.getClasses(args.skip, args.take)
                .then((gridData) => { gridInstance.dataSource = gridData });
        }
    }

    function onActionBegin(args) {
        console.log(args);
    }

    function dataSourceChanged(args) {
        console.log(args);
        if (args.action === 'add') {
            const classRegisterClient = new ClassRegisterClient();
            for (let i = 0; i < selectedClasses.length; i++) {
                classRegisterClient.registerStudent(currentUserInfo.id, selectedClasses[i].id, currentRegScheduleInfo.id);
            }
        }
        gridInstance.clearSelection();
        setSelectedClasses([]);
        const classesClient = new ClassesClient();
        filterAttr = '';
        filterText = '';
        orderBy = '';
        classesClient.getClasses(0, 12)
            .then((gridData) => { gridInstance.dataSource = gridData });
    }
    
    //function regDataStateChange(args) {
    //    console.log(args);       
    //}

    //function regDataSourceChanged(args) {
    //    console.log(args);
    //    if (args.requestType === 'delete') {

    //    }
    //}

    //function regGridDataStateChange(args) {
    //    console.log(args);

    //}

    //function regGridDataSourceChanged(args) {
    //    console.log(args);
    //}

    function SelectedClassList() {
        const listItems = selectedClasses.map(selectedClass =>
            <li className="list-group-item">{selectedClass.classCode}</li>
        );
        return <ul style={{ paddingBottom: '9px' }} className="list-group">{listItems}</ul>
    }

    function RegisterButton() {
        if (selectedClasses.length > 0) {
            return <button type="button" className="btn btn-primary float-left" onClick={onRegisterClick}>Đăng ký</button>
        }
        else {
            return <button type="button" className="btn btn-primary float-left" disabled>Đăng ký</button>
        }
    }

    function CreditCounter() {
        return (
            <h5>Số tín chỉ đã chọn: {creditCount}</h5>
        )
    }

    const onRegisterClick = () => {
        const classRegisterClient = new ClassRegisterClient();
        for (let i = 0; i < selectedClasses.length; i++) {
            let regRes = classRegisterClient.registerStudent(currentUserInfo.id, selectedClasses[i].id, currentRegScheduleInfo.id);
            console.log(regRes);
        }
        gridInstance.clearSelection();
        setSelectedClasses([]);
        window.location.reload();
        //const classesClient = new ClassesClient();
        //let classes = classesClient.getClasses(0, 12);
        //setClassData(classes);
        //let classes = classesClient.getClasses(0, 12);
        //filterAttr = '';
        //filterText = '';
        //orderBy = '';
        //setClassData(classes);
        //gridInstance.changeDataSource(classData);
        //gridInstance.changeDataSource(classes);       
    }

    if (classTypes !== null) {
        return (
            <StudentLayout>
                <h2>{currentRegScheduleInfo.name}</h2>
                <div className='control-pane'>
                    <div className='control-section'>                       
                        <div style={{ paddingBottom: '18px' }}></div>
                        <GridComponent id="overviewgrid"
                            dataSource={classData}
                            allowPaging={true}
                            enableStickyHeader={true}
                            enableAdaptiveUI={true}
                            rowRenderingMode='Horizontal'
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
                            rowSelected={onRowSelected.bind(this)}
                            rowDeselected={onRowDeselected.bind(this)}
                        >
                            <ColumnsDirective>
                                <ColumnDirective type='checkbox' allowSorting={false} allowFiltering={false} width='40' headerTemplate={headerTemplate}></ColumnDirective>
                                <ColumnDirective field='id' visible={false} headerText='ID' width='100' isPrimaryKey={true}></ColumnDirective>
                                <ColumnDirective field='classCode' headerText='Mã lớp' width='40' clipMode='EllipsisWithTooltip' />
                                <ColumnDirective field='course.courseName' headerText='Tên lớp' width='105' clipMode='EllipsisWithTooltip' />
                                <ColumnDirective field='departmentName' headerText='Khoa' width='40' clipMode='EllipsisWithTooltip' />
                                <ColumnDirective
                                    field='classTypeId'
                                    foreignKeyValue="type"
                                    foreignKeyField="classTypeId"
                                    dataSource={classTypes}
                                    headerText='Loại lớp'
                                    width='40'
                                    allowSorting={false}
                                    filterBarTemplate={filterBarTemplate}
                                    clipMode='EllipsisWithTooltip' />
                                <ColumnDirective field='credit' headerText='Tín chỉ' width='25' clipMode='EllipsisWithTooltip' />
                                <ColumnDirective field='dayOfWeek' headerText='Thứ' width='25' clipMode='EllipsisWithTooltip' />
                                {/*<ColumnDirective*/}
                                {/*    columns={*/}
                                {/*        [*/}
                                {/*            { field: 'dayOfWeek', headerText: 'Thứ', width: 30 },*/}
                                {/*            { field: 'startPeriod', headerText: 'Tiết bắt đầu', width: 40 },*/}
                                {/*            { field: 'endPeriod', headerText: 'Tiết kết thúc', width: 40 }*/}
                                {/*        ]*/}
                                {/*    }*/}
                                {/*    headerText='Thời gian học' >*/}
                                {/*</ColumnDirective>*/}
                                <ColumnDirective
                                    columns={
                                        [
                                            { field: 'startPeriod', headerText: 'Bắt đầu', width: 30 },
                                            { field: 'endPeriod', headerText: 'Kết thúc', width: 30 }
                                        ]
                                    }
                                    headerText='Tiết' >
                                </ColumnDirective>
                                <ColumnDirective field='userClassCount' headerText='Đã đăng ký' width='40'></ColumnDirective>
                                <ColumnDirective field='capacity' headerText='Số lượng' width='35'></ColumnDirective>                                
                            </ColumnsDirective>
                            <Inject services={[Filter, Sort, Page, ForeignKey]} />
                        </GridComponent>
                    </div>
                </div>
                <br />
                <div className='control-pane'>
                    <div className='control-section'>
                        <div className="row" style={{ paddingBottom: '9px' }}>
                            <div className="col-md-6">
                                <h5>Các môn đã chọn</h5>
                            </div>
                            <div className="col-md-6">
                                <CreditCounter/>
                            </div>
                        </div>
                        {/*<GridComponent id="overviewgrid"*/}
                        {/*    dataSource={selectedClassesGridData}*/}
                        {/*    enableStickyHeader={true}*/}
                        {/*    enableAdaptiveUI={true}*/}
                        {/*    rowRenderingMode='Horizontal'*/}
                        {/*    enableHover={true}*/}
                        {/*    height='200'*/}
                        {/*    loadingIndicator={{ indicatorType: 'Shimmer' }}*/}
                        {/*    rowHeight={38}*/}
                        {/*    ref={(g) => { regGridInstance = g; }}*/}
                        {/*    allowFiltering={true}*/}
                        {/*    filterSettings={filter}*/}
                        {/*    allowSorting={true}*/}
                        {/*    allowSelection={true}*/}
                        {/*    selectionSettings={select}*/}
                        {/*    enableHeaderFocus={true}*/}
                        {/*    dataStateChange={regGridDataStateChange.bind(this)}*/}
                        {/*    dataSourceChanged={regGridDataSourceChanged.bind(this)}*/}
                        {/*>*/}
                        {/*    <ColumnsDirective>*/}
                        {/*        <ColumnDirective type='checkbox' allowSorting={false} allowFiltering={false} width='40'></ColumnDirective>*/}
                        {/*        <ColumnDirective field='id' visible={false} headerText='ID' width='100' isPrimaryKey={true}></ColumnDirective>*/}
                        {/*        <ColumnDirective field='classCode' headerText='Mã lớp' width='60' clipMode='EllipsisWithTooltip' />*/}
                        {/*        <ColumnDirective field='course.courseName' headerText='Tên lớp' width='120' clipMode='EllipsisWithTooltip' />*/}
                        {/*    </ColumnsDirective>*/}
                        {/*</GridComponent>*/}
                        <SelectedClassList />
                        <RegisterButton />
                        {/*<ButtonComponent cssClass='e-primary' onClick={onRegisterClick.bind(this)}>Đăng ký</ButtonComponent>*/}
                    </div>
                </div>
            </StudentLayout>
        )
    }
}

export default ClassRegistration;