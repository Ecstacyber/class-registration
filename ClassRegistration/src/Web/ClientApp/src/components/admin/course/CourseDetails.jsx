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
    ForeignKey,
    DetailRow
} from '@syncfusion/ej2-react-grids';
import { L10n } from '@syncfusion/ej2-base';
import { AdminLayout } from '../../AdminLayout';
import {
    CoursesClient,
    ClassesClient,
    CourseByIdClient,
    ClassesByCourseIdClient,
    PrerequisiteCoursesClient,
    PrerequisiteCoursesByCourseIdClient,
    CoursesFKClient,
    ClassTypesClient
} from '../../../web-api-client.ts';

L10n.load({
    'vi-VN-1': {
        grid: {
            'Add': 'Thêm',
            'Edit': 'Sửa',
            'Delete': 'Xoá',
            'Cancel': 'Huỷ',
            'Update': 'Cập nhật',
            'Save': 'Lưu',
            'EditOperationAlert': 'Không có dòng được chọn để sửa',
            'DeleteOperationAlert': 'Không có dòng được chọn để xoá',
            'SaveButton': 'Lưu',
            'CancelButton': 'Huỷ',
            'EditFormTitle': 'Thông tin môn tiên quyết - ID: ',
            'AddFormTitle': 'Thêm môn tiên quyết',
            'ConfirmDelete': 'Bạn có chắc chắn muốn xoá?',
            'EmptyRecord': 'Không có dữ liệu',
            'FilterbarTitle': '- thanh tìm kiếm',
            'Matches': 'Không có kết quả'
        },
        'pager': {
            'currentPageInfo': '{0} trên {1} trang ',
            'totalItemsInfo': '({0} dòng)',
            'firstPageTooltip': 'Đầu',
            'lastPageTooltip': 'Cuối',
            'nextPageTooltip': 'Tiếp',
            'previousPageTooltip': 'Trước',
            'nextPagerTooltip': 'Đi đến trang tiếp theo',
            'previousPagerTooltip': 'Trở về trang trước',
            'pagerDropDown': 'Số dòng trên 1 trang',
            'pagerAllDropDown': 'Các dòng',
            'All': 'Tất cả'
        }
    },
    'vi-VN-2': {
        grid: {
            'Add': 'Thêm',
            'Edit': 'Sửa',
            'Delete': 'Xoá',
            'Cancel': 'Huỷ',
            'Update': 'Cập nhật',
            'Save': 'Lưu',
            'EditOperationAlert': 'Không có dòng được chọn để sửa',
            'DeleteOperationAlert': 'Không có dòng được chọn để xoá',
            'SaveButton': 'Lưu',
            'CancelButton': 'Huỷ',
            'EditFormTitle': 'Thông tin lớp - ID: ',
            'AddFormTitle': 'Thêm lớp',
            'ConfirmDelete': 'Bạn có chắc chắn muốn xoá?',
            'EmptyRecord': 'Không có dữ liệu',
            'FilterbarTitle': '- thanh tìm kiếm',
            'Matches': 'Không có kết quả'
        },
        'pager': {
            'currentPageInfo': '{0} trên {1} trang ',
            'totalItemsInfo': '({0} dòng)',
            'firstPageTooltip': 'Đầu',
            'lastPageTooltip': 'Cuối',
            'nextPageTooltip': 'Tiếp',
            'previousPageTooltip': 'Trước',
            'nextPagerTooltip': 'Đi đến trang tiếp theo',
            'previousPagerTooltip': 'Trở về trang trước',
            'pagerDropDown': 'Số dòng trên 1 trang',
            'pagerAllDropDown': 'Các dòng',
            'All': 'Tất cả',
            'totalItemInfo': '({0} dòng)'
        }
    },
});

const CourseDetails = () => {
    const { courseId } = useParams();
    const location = useLocation();
    const navigationType = useNavigationType();
    const navigate = useNavigate();
    const hasReloaded = useRef(false);
    const [course, setCourse] = useState(null);
    const [classData, setClassData] = useState({
        result: [],
        count: 0
    });
    const [prerequisiteCourseData, setPrerequisiteCourseData] = useState({
        result: [],
        count: 0
    });
    const [coursesFKData, setCoursesFKData] = useState(null);
    const [classTypes, setClassTypes] = useState(null);
    const [pcId, setPcId] = useState();
    let orderBy = '';
    let filterAttr = '';
    let filterText = '';
    let pcgOrderBy = '';
    let pcgFilterAttr = '';
    let pcgFilterText = '';
    let gridInstance;
    let pcdGridInstance;
    const fields = { text: 'text', value: 'value' };
    const toolbarOptions = ['Add', 'Edit', 'Delete'];
    const pcgToolbarOptions = ['Add', 'Delete'];
    const editSettings = {
        allowEditing: true,
        allowAdding: true,
        allowDeleting: true,
        showDeleteConfirmDialog: true,
        mode: 'Dialog'
    };
    const pc_editSettings = {
        allowEditing: false,
        allowAdding: true,
        allowDeleting: true,
        showDeleteConfirmDialog: true,
        mode: 'Dialog'
    };
    const validationRules = { required: true };
    const numericValidationRules = { required: true, number: true };
    const numericParams = {
        params: {
            decimals: 0,
            format: "N",
            validateDecimalOnType: true
        }
    }
    const dowRules = { required: true, min: 2, max: 7 };
    const periodRules = { required: true, min: 1, max: 10 };
    const capacityRules = { required: true, min: 1 }
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
    const prerequisiteCourseParams = {
        params: {
            allowFiltering: true
        }
    }
    //const tempClassData = {
    //    "result": [
    //        {
    //            "id": 21,
    //            "courseId": 12,
    //            "classTypeId": 1,
    //            "registrationScheduleId": 0,
    //            "classCode": "SE122.O21",
    //            "departmentName": null,
    //            "lecturerName": null,
    //            "credit": 2,
    //            "dayOfWeek": null,
    //            "startPeriod": null,
    //            "endPeriod": null,
    //            "capacity": 100,
    //            "userClassCount": 0,
    //            "canBeRegistered": true,
    //            "classType": {
    //                "type": "LT",
    //                "id": 1
    //            },
    //            "course": {
    //                "departmentId": 2,
    //                "courseCode": "SE122",
    //                "courseName": "Đồ án 2",
    //                "description": null,
    //                "department": null,
    //                "classes": [],
    //                "current": [],
    //                "prerequisites": [],
    //                "id": 12,
    //            },
    //            "courseResult": null,
    //            "registrationSchedule": null
    //        }
    //    ],
    //    "count": 1
    //};
    //const tempPreCourseData = {
    //    "result": [
    //        {
    //            "courseName": "SE121 - Đồ án 1",
    //            "requiredPassed": false
    //        }
    //    ],
    //    "count": 1
    //};


    //function gridTemplate(props) {
    //    var src = 'src/grid/images/' + props.EmployeeID + '.png';
    //    return (
    //        <table className="detailtable" style={{ width: "100%" }}>
    //            <colgroup>
    //                <col style={{ width: "50%" }} />
    //                <col style={{ width: "50%" }} />
    //            </colgroup>
    //            <tbody>
    //                <tr>
    //                    <td>
    //                        <span style={{ fontWeight: 500 }}>Tiết bắt đầu: </span> {props.startPeriod}
    //                    </td>
    //                    <td>
    //                        <span style={{ fontWeight: 500 }}>Tiết kết thúc: </span> {props.endPeriod}
    //                    </td>
    //                </tr>
    //            </tbody>
    //        </table>
    //    );
    //}
    //const template = gridTemplate;

    async function getData() {
        const courseClient = new CourseByIdClient();
        let co_data = await courseClient.getCourseById(courseId);
        setCourse(co_data);

        const classTypesClient = new ClassTypesClient();
        let classTypesData = await classTypesClient.getClassTypes();
        setClassTypes(classTypesData);

        const prerequisiteCoursesClient = new PrerequisiteCoursesByCourseIdClient();
        let pcd_data = await prerequisiteCoursesClient.getPrerequisiteCoursesByCourseId(courseId, 0, 12);
        setPrerequisiteCourseData(pcd_data);

        const coursesClient = new CoursesFKClient();
        let pcd_fk_data = await coursesClient.getCoursesFK();
        setCoursesFKData(pcd_fk_data);

        const classesByCourseIdClient = new ClassesByCourseIdClient();
        let cl_data = await classesByCourseIdClient.getClassesByCourseId(courseId, 0, 12);
        setClassData(cl_data);
    }

    useEffect(() => {
        getData();
        const handleNavigation = () => {
            const reloadFlag = sessionStorage.getItem('reloadFlag');

            if ((navigationType === 'POP' || navigationType === 'PUSH') && !reloadFlag) {
                sessionStorage.setItem('reloadFlag', 'true');
                window.location.reload();
            } else {
                sessionStorage.removeItem('reloadFlag');
            }
        };
        handleNavigation();
    }, [location, navigationType])

    function dataStateChange(args) {
        console.log(args);
        const classesByCourseIdClient = new ClassesByCourseIdClient();
        if (args.action) {
            if (args.action.requestType === 'paging') {
                classesByCourseIdClient.getClassesByCourseId(
                    courseId,
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
                    classesByCourseIdClient.getClassesByCourseId(
                        courseId,
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
                    classesByCourseIdClient.getClassesByCourseId(
                        courseId,
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
                    classesByCourseIdClient.getClassesByCourseId(
                        courseId,
                        args.skip,
                        args.take,
                        orderBy,
                        filterAttr,
                        filterText
                    )
                        .then((gridData) => { gridInstance.dataSource = gridData });
                    return;
                } else {
                    classesByCourseIdClient.getClassesByCourseId(courseId, args.skip, args.take)
                        .then((gridData) => { gridInstance.dataSource = gridData });
                    return;
                }

            }

            if (args.action.action === 'clearFilter') {
                filterAttr = '';
                filterText = '';
                classesByCourseIdClient.getClassesByCourseId(courseId, args.skip, args.take)
                    .then((gridData) => { gridInstance.dataSource = gridData });
                return;
            }

            if (args.action.requestType === 'refresh') {
                filterAttr = '';
                filterText = '';
                orderBy = '';
                classesByCourseIdClient.getClassesByCourseId(courseId, 0, 12)
                    .then((gridData) => { gridInstance.dataSource = gridData });
                return;
            }

            //if (args.action.requestType === 'save') {
            //    filterAttr = '';
            //    filterText = '';
            //    orderBy = '';
            //    classesByCourseIdClient.getClassesByCourseId(courseId, 0, 12)
            //        .then((gridData) => { gridInstance.dataSource = gridData });
            //    return;
            //}

            classesByCourseIdClient.getClassesByCourseId(courseId, args.skip, args.take)
                .then((gridData) => { gridInstance.dataSource = gridData });

        } else {
            classesByCourseIdClient.getClassesByCourseId(courseId, args.skip, args.take)
                .then((gridData) => { gridInstance.dataSource = gridData });
        }
    }

    //function onActionBegin(args) {
    //    if ((args.action === 'add' || args.action === 'edit') && args.requestType === 'save') {
    //        if (args.data.endPeriod <= args.data.startPeriod) {
    //            args.cancel = true;
    //        }
    //    }
    //}

    function dataSourceChanged(args) {
        console.log(args);
        const classesClient = new ClassesClient();
        const classesByCourseIdClient = new ClassesByCourseIdClient();
        if (args.action === 'add' && args.requestType === 'save') {          
            let newClass = {
                courseId: courseId,
                classCode: args.data.classCode,
                classTypeId: args.data.classTypeId,
                dayOfWeek: args.data.dayOfWeek,
                startPeriod: args.data.startPeriod,
                endPeriod: args.data.endPeriod,
                capacity: args.data.capacity,
                canBeRegistered: args.data.canBeRegistered.toString()
            };
            classesClient.createClass(newClass);
        } else if (args.action === 'edit') {
            if (args.data.endPeriod <= args.data.startPeriod) {
                args.cancel = true;
            }
            let updatedClass = {
                id: args.data.id,
                courseId: courseId,
                classCode: args.data.classCode,
                classTypeId: args.data.classTypeId,
                dayOfWeek: args.data.dayOfWeek,
                startPeriod: args.data.startPeriod,
                endPeriod: args.data.endPeriod,
                capacity: args.data.capacity,
                canBeRegistered: args.data.canBeRegistered.toString()
            };
            classesClient.updateClass(args.data.id, updatedClass);
        } else if (args.requestType === 'delete') {
            args.data.forEach((deleteData) => {
                classesClient.deleteClass(deleteData.id);
            });
        }
        filterAttr = '';
        filterText = '';
        orderBy = '';
        classesByCourseIdClient.getClassesByCourseId(courseId, 0, 12)
            .then((gridData) => { gridInstance.dataSource = gridData });
    }

    function onRecordDoubleClick(args) {
        console.log(args);
        if (args.rowData) {
            navigate('./class/' + args.rowData.id);
        }
    }

    function pcd_dataStateChange(args) {
        console.log(args);
        const prerequisiteCoursesByCourseIdClient = new PrerequisiteCoursesByCourseIdClient();
        if (args.action) {
            if (args.action.requestType === 'paging') {
                prerequisiteCoursesByCourseIdClient.getPrerequisiteCoursesByCourseId(
                    courseId,
                    args.skip,
                    args.take,
                    pcgOrderBy,
                    pcgFilterAttr,
                    pcgFilterText
                )
                    .then((gridData) => { pcdGridInstance.dataSource = gridData });
                return;
            }

            if (args.action.requestType === 'sorting') {
                if (args.action.columnName && args.action.direction) {
                    pcgOrderBy = args.action.columnName + '-' + args.action.direction;
                    prerequisiteCoursesByCourseIdClient.getPrerequisiteCoursesByCourseId(
                        courseId,
                        args.skip,
                        args.take,
                        pcgOrderBy,
                        pcgFilterAttr ? pcgFilterAttr : '',
                        pcgFilterText ? pcgFilterText : ''
                    )
                        .then((gridData) => { pcdGridInstance.dataSource = gridData });
                    return;
                }
                else {
                    pcgOrderBy = '';
                    prerequisiteCoursesByCourseIdClient.getPrerequisiteCoursesByCourseId(
                        courseId,
                        args.skip,
                        args.take,
                        '',
                        pcgFilterAttr ? pcgFilterAttr : '',
                        pcgFilterText ? pcgFilterText : ''
                    )
                        .then((gridData) => { pcdGridInstance.dataSource = gridData });
                    return;
                }
            }

            if (args.action.action === 'filter') {
                if (args.action.currentFilterObject.value && args.action.currentFilterObject.value !== '') {
                    pcgFilterAttr = args.action.currentFilterObject.field;
                    pcgFilterText = args.action.currentFilterObject.value;
                    prerequisiteCoursesByCourseIdClient.getPrerequisiteCoursesByCourseId(
                        courseId,
                        args.skip,
                        args.take,
                        pcgOrderBy,
                        pcgFilterAttr,
                        pcgFilterText
                    )
                        .then((gridData) => { pcdGridInstance.dataSource = gridData });
                    return;
                } else {
                    prerequisiteCoursesByCourseIdClient.getPrerequisiteCoursesByCourseId(courseId, 0, 12)
                        .then((gridData) => { pcdGridInstance.dataSource = gridData });
                    return;
                }
            }

            if (args.action.action === 'clearFilter') {
                pcgFilterAttr = '';
                pcgFilterText = '';
                prerequisiteCoursesByCourseIdClient.getPrerequisiteCoursesByCourseId(courseId, 0, 12)
                    .then((gridData) => { pcdGridInstance.dataSource = gridData });
                return;
            }

            if (args.action.requestType === 'refresh') {
                pcgFilterAttr = '';
                pcgFilterText = '';
                pcgOrderBy = '';
                prerequisiteCoursesByCourseIdClient.getPrerequisiteCoursesByCourseId(courseId, 0, 12)
                    .then((gridData) => { pcdGridInstance.dataSource = gridData });
                return;
            }

            //if (args.action.requestType === 'save') {
            //    pcgFilterAttr = '';
            //    pcgFilterText = '';
            //    pcgOrderBy = '';
            //    prerequisiteCoursesByCourseIdClient.getPrerequisiteCoursesByCourseId(courseId, 0, 12)
            //        .then((gridData) => { pcdGridInstance.dataSource = gridData });
            //    return;
            //}

            prerequisiteCoursesByCourseIdClient.getPrerequisiteCoursesByCourseId(courseId, args.skip, args.take)
                .then((gridData) => { pcdGridInstance.dataSource = gridData });

        } else {
            prerequisiteCoursesByCourseIdClient.getPrerequisiteCoursesByCourseId(courseId, args.skip, args.take)
                .then((gridData) => { pcdGridInstance.dataSource = gridData });
        }
    }

    function pcd_dataSourceChanged(args) {
        console.log(args);
        const prerequisiteCoursesClient = new PrerequisiteCoursesClient();
        if (args.action === 'add' && args.requestType === 'save') {
            let newCoursePrerequisite = {
                courseId: courseId,
                prerequisiteCourseId: args.data.prerequisiteCourseId,
                requirePassed: args.data.requirePassed === 'true' ? true : false
            };
            prerequisiteCoursesClient.createCoursePrerequisite(newCoursePrerequisite);
        } else if (args.action === 'edit') {
            //let updatedPrerequisiteCourse = {
            //    courseId: courseId,
            //    prerequisiteCourseId: args.data.prerequisiteCourseId,
            //    requirePassed: args.data.requirePassed
            //};
            //prerequisiteCoursesClient.updatePrerequisiteCourses(args.data.id, updatedPrerequisiteCourse);
        } else if (args.requestType === 'delete') {
            args.data.forEach((deleteData) => {
                prerequisiteCoursesClient.deleteCoursePrerequisite(deleteData.id);
            });           
        }
        const prerequisiteCoursesByCourseIdClient = new PrerequisiteCoursesByCourseIdClient();
        pcgFilterAttr = '';
        pcgFilterText = '';
        pcgOrderBy = '';
        prerequisiteCoursesByCourseIdClient.getPrerequisiteCoursesByCourseId(courseId, 0, 12)
            .then((gridData) => { pcdGridInstance.dataSource = gridData });
        return;
    }

    function pcd_onRecordDoubleClick(args) {
        console.log(args);
        navigate('/admin-index/course/' + args.rowData.prerequisiteCourseId);
    }
    
    if (coursesFKData !== null) {
        return (
            <AdminLayout>
                <h2>{course?.courseCode}</h2>
                <h3>{course?.courseName}</h3>
                <br />
                <div className='control-pane'>
                    <div className='control-section'>
                        <div style={{ paddingBottom: '18px' }}>
                            <h3>Danh sách môn tiên quyết</h3>
                        </div>
                        <GridComponent id="overviewgrid"
                            dataSource={prerequisiteCourseData}
                            toolbar={pcgToolbarOptions}
                            editSettings={pc_editSettings}
                            allowPaging={true}
                            pageSettings={pageSettings}
                            enableHover={true}
                            height='150'
                            loadingIndicator={{ indicatorType: 'Shimmer' }}
                            rowHeight={38}
                            ref={(g) => { pcdGridInstance = g; }}
                            allowFiltering={true}
                            filterSettings={filter}
                            allowSorting={true}
                            allowMultiSorting={true}
                            allowSelection={true}
                            selectionSettings={select}
                            enableHeaderFocus={true}
                            dataStateChange={pcd_dataStateChange.bind(this)}
                            dataSourceChanged={pcd_dataSourceChanged.bind(this)}
                            recordDoubleClick={pcd_onRecordDoubleClick.bind(this)}
                            locale='vi-VN-1'
                        >
                            <ColumnsDirective>
                                <ColumnDirective type='checkbox' allowSorting={false} allowFiltering={false} width='40'></ColumnDirective>
                                <ColumnDirective field='id' visible={false} headerText='ID' width='100' isPrimaryKey={true}></ColumnDirective>
                                <ColumnDirective
                                    field='prerequisiteCourseId'
                                    foreignKeyValue='courseName'
                                    foreignKeyField='prerequisiteCourseId'
                                    dataSource={coursesFKData}
                                    headerText='Tên lớp'
                                    width='100'
                                    validationRules={validationRules}
                                    edit={prerequisiteCourseParams}
                                    clipMode='EllipsisWithTooltip' />                                
                                <ColumnDirective
                                    field='requiredPassed'
                                    displayAsCheckBox="true"
                                    editType="booleanedit"
                                    type="boolean"
                                    headerText='Cần qua môn'
                                    width='40'
                                    clipMode='EllipsisWithTooltip' />
                            </ColumnsDirective>                           
                            <Inject services={[Filter, Sort, Toolbar, Edit, Page, ForeignKey]} />
                        </GridComponent>
                    </div>
                </div>
                <br />
                <div className='control-pane'>
                    <div className='control-section'>
                        <div style={{ paddingBottom: '18px' }}>
                            <h3>Danh sách lớp học</h3>
                        </div>
                        <GridComponent id="overviewgrid"
                            dataSource={classData}
                            toolbar={toolbarOptions}
                            editSettings={editSettings}
                            allowPaging={true}
                            pageSettings={pageSettings}
                            enableHover={true}
                            height='250'
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
                            locale='vi-VN-2'
                        >
                            <ColumnsDirective>
                                <ColumnDirective type='checkbox' allowSorting={false} allowFiltering={false} width='40'></ColumnDirective>
                                <ColumnDirective field='id' visible={false} headerText='ID' width='100' isPrimaryKey={true}></ColumnDirective>
                                <ColumnDirective field='classCode' headerText='Mã lớp' width='60' validationRules={validationRules} clipMode='EllipsisWithTooltip' />
                                <ColumnDirective
                                    field='classTypeId'
                                    foreignKeyValue='type'
                                    foreignKeyField='classTypeId'
                                    dataSource={classTypes}
                                    headerText='Loại lớp'
                                    width='60'
                                    validationRules={validationRules}
                                    allowSorting={false}
                                    clipMode='EllipsisWithTooltip' />                               
                                <ColumnDirective field='credit' headerText='Tín chỉ' width='40' validationRules={numericValidationRules} editType='numericedit' edit={numericParams} clipMode='EllipsisWithTooltip' />
                                <ColumnDirective
                                    columns={
                                        [
                                            { field: 'dayOfWeek', headerText: 'Thứ', width: 50, validationRules: dowRules, editType: 'numericedit', edit: numericParams },
                                            { field: 'startPeriod', headerText: 'Tiết bắt đầu', width: 50, validationRules: periodRules, editType: 'numericedit', edit: numericParams },
                                            { field: 'endPeriod', headerText: 'Tiết kết thúc', width: 50, validationRules: periodRules, editType: 'numericedit', edit: numericParams }
                                        ]
                                    }
                                    headerText='Thời gian học' >
                                </ColumnDirective>
                                <ColumnDirective
                                    field='capacity'
                                    headerText='Số lượng'
                                    width='50'
                                    editType='numericedit'
                                    validationRules={capacityRules}
                                    edit={numericParams}>
                                </ColumnDirective>
                                <ColumnDirective
                                    field='canBeRegistered'
                                    headerText='Được đăng ký'
                                    width='50'
                                    displayAsCheckBox="true"
                                    editType="booleanedit"
                                    type="boolean"
                                    validationRules={validationRules}>
                                </ColumnDirective>
                            </ColumnsDirective>
                            <Inject services={[Filter, Sort, Toolbar, Edit, Page, ForeignKey, DetailRow]} />
                        </GridComponent>
                    </div>
                </div>
                <br />
            </AdminLayout>
        )
    }
}

export default CourseDetails;