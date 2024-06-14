import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
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
    ExcelExport
} from '@syncfusion/ej2-react-grids';
import { DropDownListComponent } from '@syncfusion/ej2-react-dropdowns';
import { Browser, L10n } from '@syncfusion/ej2-base';
import Button from 'react-bootstrap/Button';
//import Modal from 'react-bootstrap/Modal';
import { AdminLayout } from '../../AdminLayout';
import {
    UserClassesClient,
    StudentsInClassClient,
    LecturersInClassClient,
    ClassByIdClient,
    StudentsClient
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
            'EditFormTitle': 'Thông tin giảng viên - ID: ',
            'AddFormTitle': 'Thêm khoa',
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
            'pagerDropDown': 'Số dòng trên một trang',
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
            'EditFormTitle': 'Thông tin sinh viên - ID: ',
            'AddFormTitle': 'Thêm khoa',
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
    }
});

const ClassDetails = () => {
    const { courseId, classId, registrationScheduleId } = useParams();
    const [classData, setClassData] = useState({});
    const [studentData, setStudentData] = useState({
        result: [],
        count: 0
    });
    const [lecturerData, setLecturerData] = useState({
        result: [],
        count: 0
    });
    const [modalShow, setModalShow] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();
    let studentOrderBy = '';
    let studentFilterAttr = '';
    let studentFilterText = '';
    let lecturerOrderBy = '';
    let lecturerFilterAttr = '';
    let lecturerFilterText = '';
    let studentGridInstance;
    let lecturerGridInstance;
    const fields = { text: 'text', value: 'value' };
    const studentToolbarOptions = ['Add', 'Edit', 'Delete', 'ExcelExport'];
    const lecturerToolbarOptions = ['Add', 'Delete'];
    const studentEditSettings = {
        allowEditing: true,
        allowAdding: false,
        allowDeleting: true,
        showDeleteConfirmDialog: true,
        mode: 'Dialog'
    };
    const lecturerEditSettings = {
        allowEditing: false,
        allowAdding: false,
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
    };
    const tempStudent = {
        "result": [
            {
                "id": 1,
                "userCode": "20520716",
                "user": {
                    "userName": "Cấn Đức Quang"
                }
            }
        ],
        "count": 1
    };
    const tempLecturer = {
        "result": [
            {
                "userName": "Dương Minh Thái"
            }
        ],
        count: 1
    }

    async function getData() {
        const studentsInClassClient = new StudentsInClassClient();
        let students = await studentsInClassClient.getStudentsInClass(classId, registrationScheduleId);
        setStudentData(students);

        const lecturersInClassClient = new LecturersInClassClient();
        let lecturers = await lecturersInClassClient.getLecturersInClass(classId, registrationScheduleId);
        setLecturerData(lecturers);

        const classByIdClient = new ClassByIdClient();
        let currentClass = await classByIdClient.getClassById(classId);
        setClassData(currentClass);
    }

    useEffect(() => {
        getData();
    }, [])

    function dataStateChange(args) {
        console.log(args);
        //const studentsInClassClient = new StudentsInClassClient();
        //const lecturersInClassClient = new LecturersInClassClient();
        //if (args.action) {
        //    if (args.action.requestType === 'paging') {
        //        studentsInClassClient.getStudentsInClass(classId, registrationScheduleId.then((gridData) => { studentGridInstance.dataSource = gridData }));
        //        lecturersInClassClient.getLecturersInClass(classId, registrationScheduleId.then((gridData) => { lecturerGridInstance.dataSource = gridData }));
        //        return;
        //    }

        //    if (args.action.requestType === 'sorting') {
        //        if (args.action.columnName && args.action.direction) {
        //            orderBy = args.action.columnName + '-' + args.action.direction;
        //            classesByCourseIdClient.getClassesByCourseId(
        //                courseId,
        //                args.skip,
        //                args.take,
        //                orderBy,
        //                filterAttr ? filterAttr : '',
        //                filterText ? filterText : ''
        //            )
        //                .then((gridData) => { gridInstance.dataSource = gridData });
        //            return;
        //        }
        //        else {
        //            orderBy = '';
        //            classesByCourseIdClient.getClassesByCourseId(
        //                courseId,
        //                args.skip,
        //                args.take,
        //                '',
        //                filterAttr ? filterAttr : '',
        //                filterText ? filterText : ''
        //            )
        //                .then((gridData) => { gridInstance.dataSource = gridData });
        //            return;
        //        }
        //    }

        //    if (args.action.action === 'filter') {
        //        if (args.action.currentFilterObject.value && args.action.currentFilterObject.value !== '') {
        //            filterAttr = args.action.currentFilterObject.field;
        //            filterText = args.action.currentFilterObject.value;
        //            classesByCourseIdClient.getClassesByCourseId(
        //                courseId,
        //                args.skip,
        //                args.take,
        //                orderBy,
        //                filterAttr,
        //                filterText
        //            )
        //                .then((gridData) => { gridInstance.dataSource = gridData });
        //            return;
        //        } else {
        //            classesByCourseIdClient.getClassesByCourseId(courseId, args.skip, args.take)
        //                .then((gridData) => { gridInstance.dataSource = gridData });
        //            return;
        //        }

        //    }

        //    if (args.action.action === 'clearFilter') {
        //        filterAttr = '';
        //        filterText = '';
        //        classesByCourseIdClient.getClassesByCourseId(courseId, args.skip, args.take)
        //            .then((gridData) => { gridInstance.dataSource = gridData });
        //        return;
        //    }

        //    if (args.action.requestType === 'refresh') {
        //        filterAttr = '';
        //        filterText = '';
        //        orderBy = '';
        //        classesByCourseIdClient.getClassesByCourseId(courseId, 0, 12)
        //            .then((gridData) => { gridInstance.dataSource = gridData });
        //        return;
        //    }

        //    if (args.action.requestType === 'save') {
        //        filterAttr = '';
        //        filterText = '';
        //        orderBy = '';
        //        classesByCourseIdClient.getClassesByCourseId(courseId, 0, 12)
        //            .then((gridData) => { gridInstance.dataSource = gridData });
        //        return;
        //    }

        //    classesByCourseIdClient.getClassesByCourseId(courseId, args.skip, args.take)
        //        .then((gridData) => { gridInstance.dataSource = gridData });

        //} else {
        //    classesByCourseIdClient.getClassesByCourseId(courseId, args.skip, args.take)
        //        .then((gridData) => { gridInstance.dataSource = gridData });
        //}
    }

    function onActionBegin(args) {
        //if ((args.action === 'add' || args.action === 'edit') && args.requestType === 'save') {
        //    if (args.data.endPeriod <= args.data.startPeriod) {
        //        args.cancel = true;
        //    }
        //}
    }

    function dataSourceChanged(args) {
        console.log(args);
        //const classesClient = new ClassesClient();
        //const classesByCourseIdClient = new ClassesByCourseIdClient();
        //if (args.action === 'add' && args.requestType === 'save') {
        //    let newClass = {
        //        courseId: courseId,
        //        classCode: args.data.classCode,
        //        classTypeId: args.data.classTypeId,
        //        dayOfWeek: args.data.dayOfWeek,
        //        startPeriod: args.data.startPeriod,
        //        endPeriod: args.data.endPeriod,
        //        capacity: args.data.capacity
        //    };
        //    classesClient.createClass(newClass);
        //} else if (args.action === 'edit') {
        //    if (args.data.endPeriod <= args.data.startPeriod) {
        //        args.cancel = true;
        //    }
        //    let updatedClass = {
        //        id: args.data.id,
        //        courseId: courseId,
        //        classCode: args.data.classCode,
        //        classTypeId: args.data.classTypeId,
        //        dayOfWeek: args.data.dayOfWeek,
        //        startPeriod: args.data.startPeriod,
        //        endPeriod: args.data.endPeriod,
        //        capacity: args.data.capacity
        //    };
        //    classesClient.updateClass(args.data.id, updatedClass);
        //} else if (args.requestType === 'delete') {
        //    args.data.forEach((deleteData) => {
        //        classesClient.deleteClass(deleteData.id);
        //    });
        //}
        //filterAttr = '';
        //filterText = '';
        //orderBy = '';
        //classesByCourseIdClient.getClassesByCourseId(courseId, 0, 12)
        //    .then((gridData) => { gridInstance.dataSource = gridData });
    }

    function onRecordDoubleClick(args) {
        console.log(args);

    }

    function pcd_dataStateChange(args) {
        console.log(args);
        //const prerequisiteCoursesByCourseIdClient = new PrerequisiteCoursesByCourseIdClient();
        //if (args.action) {
        //    if (args.action.requestType === 'paging') {
        //        prerequisiteCoursesByCourseIdClient.getPrerequisiteCoursesByCourseId(
        //            courseId,
        //            args.skip,
        //            args.take,
        //            pcgOrderBy,
        //            pcgFilterAttr,
        //            pcgFilterText
        //        )
        //            .then((gridData) => { pcdGridInstance.dataSource = gridData });
        //        return;
        //    }

        //    if (args.action.requestType === 'sorting') {
        //        if (args.action.columnName && args.action.direction) {
        //            pcgOrderBy = args.action.columnName + '-' + args.action.direction;
        //            prerequisiteCoursesByCourseIdClient.getPrerequisiteCoursesByCourseId(
        //                courseId,
        //                args.skip,
        //                args.take,
        //                pcgOrderBy,
        //                pcgFilterAttr ? pcgFilterAttr : '',
        //                pcgFilterText ? pcgFilterText : ''
        //            )
        //                .then((gridData) => { pcdGridInstance.dataSource = gridData });
        //            return;
        //        }
        //        else {
        //            pcgOrderBy = '';
        //            prerequisiteCoursesByCourseIdClient.getPrerequisiteCoursesByCourseId(
        //                courseId,
        //                args.skip,
        //                args.take,
        //                '',
        //                pcgFilterAttr ? pcgFilterAttr : '',
        //                pcgFilterText ? pcgFilterText : ''
        //            )
        //                .then((gridData) => { pcdGridInstance.dataSource = gridData });
        //            return;
        //        }
        //    }

        //    if (args.action.action === 'filter') {
        //        if (args.action.currentFilterObject.value && args.action.currentFilterObject.value !== '') {
        //            pcgFilterAttr = args.action.currentFilterObject.field;
        //            pcgFilterText = args.action.currentFilterObject.value;
        //            prerequisiteCoursesByCourseIdClient.getPrerequisiteCoursesByCourseId(
        //                courseId,
        //                args.skip,
        //                args.take,
        //                pcgOrderBy,
        //                pcgFilterAttr,
        //                pcgFilterText
        //            )
        //                .then((gridData) => { pcdGridInstance.dataSource = gridData });
        //            return;
        //        } else {
        //            prerequisiteCoursesByCourseIdClient.getPrerequisiteCoursesByCourseId(courseId, 0, 12)
        //                .then((gridData) => { pcdGridInstance.dataSource = gridData });
        //            return;
        //        }
        //    }

        //    if (args.action.action === 'clearFilter') {
        //        pcgFilterAttr = '';
        //        pcgFilterText = '';
        //        prerequisiteCoursesByCourseIdClient.getPrerequisiteCoursesByCourseId(courseId, 0, 12)
        //            .then((gridData) => { pcdGridInstance.dataSource = gridData });
        //        return;
        //    }

        //    if (args.action.requestType === 'refresh') {
        //        pcgFilterAttr = '';
        //        pcgFilterText = '';
        //        pcgOrderBy = '';
        //        prerequisiteCoursesByCourseIdClient.getPrerequisiteCoursesByCourseId(courseId, 0, 12)
        //            .then((gridData) => { pcdGridInstance.dataSource = gridData });
        //        return;
        //    }

        //    //if (args.action.requestType === 'save') {
        //    //    pcgFilterAttr = '';
        //    //    pcgFilterText = '';
        //    //    pcgOrderBy = '';
        //    //    prerequisiteCoursesByCourseIdClient.getPrerequisiteCoursesByCourseId(courseId, 0, 12)
        //    //        .then((gridData) => { pcdGridInstance.dataSource = gridData });
        //    //    return;
        //    //}

        //    prerequisiteCoursesByCourseIdClient.getPrerequisiteCoursesByCourseId(courseId, args.skip, args.take)
        //        .then((gridData) => { pcdGridInstance.dataSource = gridData });

        //} else {
        //    prerequisiteCoursesByCourseIdClient.getPrerequisiteCoursesByCourseId(courseId, args.skip, args.take)
        //        .then((gridData) => { pcdGridInstance.dataSource = gridData });
        //}
    }

    function pcd_dataSourceChanged(args) {
        console.log(args);
        //const prerequisiteCoursesClient = new PrerequisiteCoursesClient();
        //if (args.action === 'add' && args.requestType === 'save') {
        //    let newCoursePrerequisite = {
        //        courseId: courseId,
        //        prerequisiteCourseId: args.data.prerequisiteCourseId,
        //        requirePassed: args.data.requirePassed
        //    };
        //    prerequisiteCoursesClient.createCoursePrerequisite(newCoursePrerequisite);
        //} else if (args.action === 'edit') {
        //    //let updatedPrerequisiteCourse = {
        //    //    courseId: courseId,
        //    //    prerequisiteCourseId: args.data.prerequisiteCourseId,
        //    //    requirePassed: args.data.requirePassed
        //    //};
        //    //prerequisiteCoursesClient.updatePrerequisiteCourses(args.data.id, updatedPrerequisiteCourse);
        //} else if (args.requestType === 'delete') {
        //    args.data.forEach((deleteData) => {
        //        prerequisiteCoursesClient.deleteCoursePrerequisite(deleteData.id);
        //    });
        //    const prerequisiteCoursesByCourseIdClient = new PrerequisiteCoursesByCourseIdClient();
        //    pcgFilterAttr = '';
        //    pcgFilterText = '';
        //    pcgOrderBy = '';
        //    prerequisiteCoursesByCourseIdClient.getPrerequisiteCoursesByCourseId(courseId, 0, 12)
        //        .then((gridData) => { pcdGridInstance.dataSource = gridData });
        //    return;
        //}
    }

    function pcd_onRecordDoubleClick(args) {
        console.log(args);
    }

    //function studentDialogTemplate(props) {
    //    return (<StudentDialogTemplate {...props} />);
    //}

    //function actionComplete(args) {
    //    if ((args.requestType === 'beginEdit' || args.requestType === 'add')) {
    //        if (Browser.isDevice) {
    //            args.dialog.height = window.innerHeight - 90 + 'px';
    //            args.dialog.dataBind();
    //        }
    //    }
    //}

    function onAddLecturerClick() {
        navigate('./add-lecturer', { state: { from: location.pathname } });
    }
    
    return (
        <AdminLayout>
            <h2>{classData?.classCode}</h2>
            <h3>{classData?.course?.courseName}</h3>
            <br />
            <div className='control-pane'>
                <div className='control-section'>
                    <div style={{ paddingBottom: '18px' }}>
                        <h3>Giảng viên</h3>
                    </div>
                    <div style={{ paddingBottom: '18px' }}>
                        <Button variant="primary" onClick={onAddLecturerClick}>+ Thêm giảng viên</Button>
                    </div>
                    <GridComponent
                        id="lecturerGrid"
                        dataSource={lecturerData}
                        toolbar={lecturerToolbarOptions}
                        editSettings={lecturerEditSettings}
                        pageSettings={pageSettings}
                        enableHover={true}
                        height='100'
                        loadingIndicator={{ indicatorType: 'Shimmer' }}
                        rowHeight={38}
                        ref={(g) => { lecturerGridInstance = g; }}
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
                                field='user.userName'
                                headerText='Tên'
                                width='150'
                                clipMode='EllipsisWithTooltip' />
                        </ColumnsDirective>
                        <Inject services={[Toolbar, Edit]} />
                    </GridComponent>
                </div>
            </div>
            <br />
            <div className='control-pane'>
                <div className='control-section'>
                    <div style={{ paddingBottom: '18px' }}>
                        <h3>Danh sách sinh viên</h3>
                    </div>
                    <GridComponent
                        id="studentGrid"
                        dataSource={studentData}
                        toolbar={studentToolbarOptions}
                        editSettings={studentEditSettings}
                        allowPaging={true}
                        pageSettings={pageSettings}
                        enableHover={true}
                        height='500'
                        loadingIndicator={{ indicatorType: 'Shimmer' }}
                        rowHeight={38}
                        ref={(g) => { studentGridInstance = g; }}
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
                            <ColumnDirective field='userCode' allowEditing={false} headerText='MSSV' width='60' clipMode='EllipsisWithTooltip' />                           
                            <ColumnDirective field='user.userName' headerText='Tên' allowEditing={false} width='200' clipMode='EllipsisWithTooltip'></ColumnDirective>
                            <ColumnDirective
                                field='passed'
                                headerText='Qua môn'
                                width='40'
                                displayAsCheckBox="true"
                                editType="booleanedit"
                                type="boolean" clipMode='EllipsisWithTooltip' />
                        </ColumnsDirective>
                        <Inject services={[Filter, Sort, Page, ExcelExport]} />
                    </GridComponent>
                </div>
            </div>
            {/*<AddStudentModal*/}
            {/*    show={modalShow}*/}
            {/*    onHide={() => setModalShow(false)}*/}
            {/*/>*/}
        </AdminLayout>
    )  
}

//function AddStudentModal(props) {
//    const [selectedUser, setSelectedUser] = useState([]);

//    return (
//        <Modal
//            {...props}
//            size="lg"
//            aria-labelledby="contained-modal-title-vcenter"
//            centered
//        >
//            <Modal.Header closeButton>
//                <Modal.Title id="contained-modal-title-vcenter">
//                    Thêm sinh viên
//                </Modal.Title>
//            </Modal.Header>
//            <Modal.Body>
//                <h4>Centered Modal</h4>
//                <p>
//                    Cras mattis consectetur purus sit amet fermentum. Cras justo odio,
//                    dapibus ac facilisis in, egestas eget quam. Morbi leo risus, porta ac
//                    consectetur ac, vestibulum at eros.
//                </p>
//            </Modal.Body>
//            <Modal.Footer>
//                <Button onClick={props.onHide}>Close</Button>
//            </Modal.Footer>
//        </Modal>
//    );
//}

//function StudentDialogTemplate(props) {
//    const [students, setStudents] = useState({});

//    async function getStudentData() {
//        const studentClient = new StudentsClient();
//        let allStudent = studentClient.getStudents();
//        setStudents(allStudent);
//    }

//    useEffect(() => {
//        getStudentData();
//    }, [])
    
//    return (        
//        <div className="form-row">
//            <div className="form-group">
//                <DropDownListComponent
//                    id="userName"
//                    dataSource={students}
//                    fields={{ text: 'user.userName', value: 'user.userName' }}
//                    placeholder="Tên sinh viên"
//                    popupHeight='300px'
//                    floatLabelType='Always'>
//                </DropDownListComponent>
//            </div>
//        </div>
//    );
//}

export default ClassDetails;