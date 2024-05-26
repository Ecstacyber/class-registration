import React, { Component, useEffect, useState } from 'react';
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
import { DataManager, WebApiAdaptor } from '@syncfusion/ej2-data';
//import { NavItem, NavLink } from 'reactstrap';
import { useNavigate } from 'react-router-dom';
import { DepartmentsClient, CoursesClient, DepartmentsFKRefClient } from '../../../web-api-client.ts';
import '../../../custom.css'
//import { CourseDialogTemplate } from './CourseDialogTemplate.jsx';

//export class CourseGrid extends Component {
//    static displayName = CourseGrid.name;

//    constructor(props) {
//        super(props);
//        this.state = { depData: [], loading: true };
//    }
    
//    courseClient = new CoursesClient();
//    departmentsClient = new DepartmentsClient();
//    departmentsFKRefClient = new DepartmentsFKRefClient();
//    //departmentData = new DataManager({
//    //    url: 'https://localhost:44447/api/DepartmentsFKRef',
//    //    adaptor: new WebApiAdaptor()
//    //});
//    orderBy = '';
//    filterAttr = '';
//    filterText = '';
//    gridInstance;
//    fields = { text: 'text', value: 'value' };
//    toolbarOptions = ['Add', 'Edit', 'Delete'];
//    editSettings = {
//        allowEditing: true,
//        allowAdding: true,
//        allowDeleting: true,
//        showDeleteConfirmDialog: true,
//        mode: 'Dialog'
//    };
//    validationRules = { required: true };
//    pageSettings = { pageSizes: true };
//    check = {
//        type: 'CheckBox'
//    };
//    select = {
//        persistSelection: true,
//        type: 'Multiple',
//        checkboxOnly: true
//    };
//    filter = {
//        ignoreAccent: true
//    };
//    commands = [
//        { type: 'Edit', buttonOption: { iconCss: ' e-icons e-edit', cssClass: 'e-flat' } }
//    ];

//    componentDidMount() {        
//        this.courseClient.getCourses(0, 12)
//            .then((gridData) => { this.gridInstance.dataSource = gridData });
//    }

//    UNSAFE_componentWillMount() {
//        this.populateDepartmentFKData();
//    }
    
//    onRecordDoubleClick(args) {
//        console.log(args);
//        //const navigate = useNavigate();
//        //navigate('/admin-index/course/details/' + args.rowData.id);
//    }

//    dataStateChange(args) {
//        console.log(args);
//        if (args.action) {
//            if (args.action.requestType === 'paging') {
//                this.courseClient.getCourses(
//                    args.skip,
//                    args.take,
//                    this.orderBy,
//                    this.filterAttr,
//                    this.filterText
//                )
//                    .then((gridData) => { this.gridInstance.dataSource = gridData });
//                return;
//            }

//            if (args.action.requestType === 'sorting') {
//                if (args.action.columnName && args.action.direction) {
//                    this.orderBy = args.action.columnName + '-' + args.action.direction;
//                    this.courseClient.getCourses(
//                        args.skip,
//                        args.take,
//                        this.orderBy,
//                        this.filterAttr ? this.filterAttr : '',
//                        this.filterText ? this.filterText : ''
//                    )
//                        .then((gridData) => { this.gridInstance.dataSource = gridData });
//                    return;
//                }
//                else {
//                    this.orderBy = '';
//                    this.courseClient.getCourses(
//                        args.skip,
//                        args.take,
//                        '',
//                        this.filterAttr ? this.filterAttr : '',
//                        this.filterText ? this.filterText : ''
//                    )
//                        .then((gridData) => { this.gridInstance.dataSource = gridData });
//                    return;
//                }
//            }

//            if (args.action.action === 'filter') {
//                if (args.action.currentFilterObject.value && args.action.currentFilterObject.value !== '') {
//                    this.filterAttr = args.action.currentFilterObject.field;
//                    this.filterText = args.action.currentFilterObject.value;
//                    this.courseClient.getCourses(
//                        args.skip,
//                        args.take,
//                        this.orderBy,
//                        this.filterAttr,
//                        this.filterText
//                    )
//                        .then((gridData) => { this.gridInstance.dataSource = gridData });
//                    return;
//                } else {
//                    this.courseClient.getCourses(args.skip, args.take)
//                        .then((gridData) => { this.gridInstance.dataSource = gridData });
//                    return;
//                }

//            }

//            if (args.action.action === 'clearFilter') {
//                this.filterAttr = '';
//                this.filterText = '';
//                this.courseClient.getCourses(args.skip, args.take)
//                    .then((gridData) => { this.gridInstance.dataSource = gridData });
//                return;
//            }

//            if (args.action.requestType === 'refresh') {
//                this.filterAttr = '';
//                this.filterText = '';
//                this.orderBy = '';
//                this.courseClient.getCourses(0, 12)
//                    .then((gridData) => { this.gridInstance.dataSource = gridData });
//                return;
//            }

//            if (args.action.requestType === 'save') {
//                this.filterAttr = '';
//                this.filterText = '';
//                this.orderBy = '';
//                this.courseClient.getCourses(args.skip, args.take)
//                    .then((gridData) => { this.gridInstance.dataSource = gridData });
//            }

//            this.courseClient.getCourses(args.skip, args.take)
//                .then((gridData) => { this.gridInstance.dataSource = gridData });

//        } else {
//            this.courseClient.getCourses(args.skip, args.take)
//                .then((gridData) => { this.gridInstance.dataSource = gridData });
//        }
//    }

//    dataSourceChanged(args) {
//        if (args.action === 'add') {
//            this.courseClient.createCourse(args.data);
//        } else if (args.action === 'edit') {
//            this.courseClient.updateCourse(args.data.id, args.data);
//        } else if (args.requestType === 'delete') {
//            args.data.forEach((deleteData) => {
//                this.courseClient.deleteCourse(deleteData.id);
//            });           
//        }
//        this.filterAttr = '';
//        this.filterText = '';
//        this.orderBy = '';
//        this.courseClient.getCourses(args.skip, args.take)
//            .then((gridData) => { this.gridInstance.dataSource = gridData });
//    }

//    static renderCoursesGridData(depData) {
//        return (
//            <ColumnsDirective>
//                <ColumnDirective type='checkbox' allowSorting={false} allowFiltering={false} width='40'></ColumnDirective>
//                <ColumnDirective field='id' visible={false} headerText='ID' width='100' isPrimaryKey={true}></ColumnDirective>
//                <ColumnDirective
//                    field='departmentId'
//                    foreignKeyValue='departmentName'
//                    foreignKeyField='departmentId'
//                    dataSource={depData}
//                    headerText='Khoa'
//                    width='50'
//                    validationRules={CourseGrid.validationRules}
//                    clipMode='EllipsisWithTooltip' />
//                <ColumnDirective field='courseCode' headerText='Mã lớp' width='60' validationRules={CourseGrid.validationRules} clipMode='EllipsisWithTooltip' />
//                <ColumnDirective field='courseName' headerText='Tên lớp' width='120' validationRules={CourseGrid.validationRules} clipMode='EllipsisWithTooltip' />
//                <ColumnDirective headerText='Chi tiết' width='50' commands={ }>
                    
//                </ColumnDirective>
//            </ColumnsDirective>

//        )
//    }

//    async populateDepartmentFKData() {
//        let client = new DepartmentsFKRefClient();
//        const data = await client.getDepartmentsForFKRef();
//        this.setState({ depData: data, loading: false });
//    }

//    render() {        
//        let contents = this.state.loading
//            ? <div></div>
//            : CourseGrid.renderCoursesGridData(this.state.depData);
//        return (
//            <div className='control-pane'>
//                <div className='control-section'>
//                    <div style={{ paddingBottom: '18px' }}>
//                        <h2>Danh sách môn học</h2>
//                        <br />
//                    </div>
//                    <GridComponent id="overviewgrid"
//                        dataSource={this.data}
//                        toolbar={this.toolbarOptions}
//                        editSettings={this.editSettings}
//                        allowPaging={true}
//                        pageSettings={this.pageSettings}
//                        enableHover={true}
//                        height='456'
//                        loadingIndicator={{ indicatorType: 'Shimmer' }}
//                        rowHeight={38}
//                        ref={(g) => { this.gridInstance = g; }}
//                        allowFiltering={true}
//                        filterSettings={this.filter}
//                        allowSorting={true}
//                        allowMultiSorting={true}
//                        allowSelection={true}
//                        selectionSettings={this.select}
//                        enableHeaderFocus={true}
//                        dataStateChange={this.dataStateChange.bind(this)}
//                        dataSourceChanged={this.dataSourceChanged.bind(this)}
//                        recordDoubleClick={this.onRecordDoubleClick.bind(this)}
//                    >
//                        {contents}
//                        <Inject services={[Filter, Sort, Toolbar, Edit, Page, ForeignKey]} />
//                    </GridComponent>
//                </div>
//            </div>
//        )
//    }
//}

const CourseGrid = () => {
    const [ courseData, setCourseData ] = useState(null);
    const [ departmentData, setDepartmentData ] = useState(null);
    const navigate = useNavigate();
    //const [orderBy, setOrderBy] = useState('');
    //const [filterAttr, setFilterAttr] = useState('');
    //const [filterText, setFilterText] = useState('');
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

    function dataStateChange(args) {
        console.log(args);
        const coursesClient = new CoursesClient(); 
        if (args.action) {
            if (args.action.requestType === 'paging') {
                coursesClient.getCourses(
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
                    coursesClient.getCourses(
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
                    coursesClient.getCourses(
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
                    coursesClient.getCourses(
                        args.skip,
                        args.take,
                        orderBy,
                        filterAttr,
                        filterText
                    )
                        .then((gridData) => { gridInstance.dataSource = gridData });
                    return;
                } else {
                    coursesClient.getCourses(args.skip, args.take)
                        .then((gridData) => { gridInstance.dataSource = gridData });
                    return;
                }

            }

            if (args.action.action === 'clearFilter') {
                filterAttr = '';
                filterText = '';
                coursesClient.getCourses(args.skip, args.take)
                    .then((gridData) => { gridInstance.dataSource = gridData });
                return;
            }

            if (args.action.requestType === 'refresh') {
                filterAttr = '';
                filterText = '';
                orderBy = '';
                coursesClient.getCourses(0, 12)
                    .then((gridData) => { gridInstance.dataSource = gridData });
                return;
            }

            if (args.action.requestType === 'save') {
                filterAttr = '';
                filterText = '';
                orderBy = '';
                coursesClient.getCourses(args.skip, args.take)
                    .then((gridData) => { gridInstance.dataSource = gridData });
            }

            coursesClient.getCourses(args.skip, args.take)
                .then((gridData) => { gridInstance.dataSource = gridData });

        } else {
            coursesClient.getCourses(args.skip, args.take)
                .then((gridData) => { gridInstance.dataSource = gridData });
        }
    }

    function dataSourceChanged(args) {
        console.log(args);
        const coursesClient = new CoursesClient(); 
        if (args.action === 'add') {
            coursesClient.createCourse(args.data);
        } else if (args.action === 'edit') {
            coursesClient.updateCourse(args.data.id, args.data);
        } else if (args.requestType === 'delete') {
            args.data.forEach((deleteData) => {
                coursesClient.deleteCourse(deleteData.id);
            });
        }
        filterAttr = '';
        filterText = '';
        orderBy = '';
        coursesClient.getCourses(args.skip, args.take)
            .then((gridData) => { gridInstance.dataSource = gridData });
    }

    function onRecordDoubleClick(args) {
        console.log(args);
        navigate('/admin-index/course/' + args.rowData.id);
    }

    async function getData() {
        const departmentsFKRefClient = new DepartmentsFKRefClient();
        let ddata = await departmentsFKRefClient.getDepartmentsForFKRef();
        setDepartmentData(ddata);

        const coursesClient = new CoursesClient();
        let cdata = await coursesClient.getCourses(0, 12);
        setCourseData(cdata);
    }

    useEffect(() => {
        getData();
    }, []);

    if (departmentData !== null) {
        return (
            <div className='control-pane'>
                <div className='control-section'>
                    <div style={{ paddingBottom: '18px' }}>
                        <h2>Danh sách môn học</h2>
                        <br />
                    </div>
                    <GridComponent id="overviewgrid"
                        dataSource={courseData}
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
                        dataStateChange={dataStateChange}
                        dataSourceChanged={dataSourceChanged}
                        recordDoubleClick={onRecordDoubleClick}
                    >
                        <ColumnsDirective>
                            <ColumnDirective type='checkbox' allowSorting={false} allowFiltering={false} width='40'></ColumnDirective>
                            <ColumnDirective field='id' visible={false} headerText='ID' width='100' isPrimaryKey={true}></ColumnDirective>
                            <ColumnDirective
                                field='departmentId'
                                foreignKeyValue = 'departmentName'
                                foreignKeyField = 'departmentId'
                                dataSource = { departmentData }
                                headerText='Khoa'
                                width='50'
                                validationRules={validationRules}
                                clipMode='EllipsisWithTooltip' />
                            <ColumnDirective field='courseCode' headerText='Mã lớp' width='60' validationRules={validationRules} clipMode='EllipsisWithTooltip' />
                            <ColumnDirective field='courseName' headerText='Tên lớp' width='120' validationRules={validationRules} clipMode='EllipsisWithTooltip' />
                        </ColumnsDirective>
                        <Inject services={[Filter, Sort, Toolbar, Edit, Page, ForeignKey]} />
                    </GridComponent>
                </div>
            </div>
        )
    }
}

export default CourseGrid;