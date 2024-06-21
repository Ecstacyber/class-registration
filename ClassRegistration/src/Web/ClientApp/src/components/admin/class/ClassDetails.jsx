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
    StudentsClient,
    RegistrationSchedulesClient
} from '../../../web-api-client.ts';

L10n.load({
    'vi-VN-lecturer': {
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
            'Matches': 'Không có kết quả',
            'Excelexport': 'Xuất ra file excel'
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
    'vi-VN-student': {
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
            'Matches': 'Không có kết quả',
            'Excelexport': 'Xuất ra file excel'
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
    const [currentRegSchedule, setCurrentRegSchedule] = useState({});
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
    const studentToolbarOptions = ['Add', 'Edit', 'Delete'];
    const lecturerToolbarOptions = ['Add', 'Delete', 'ExcelExport'];
    const studentEditSettings = {
        allowEditing: false,
        allowAdding: true,
        allowDeleting: true,
        showDeleteConfirmDialog: true,
        mode: 'Dialog'
    };
    const lecturerEditSettings = {
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
    const gridsToExport = ['lecturerGrid', 'studentGrid'];
    //const prerequisiteCourseParams = {
    //    params: {
    //        allowFiltering: true
    //    }
    //};
    //const tempStudent = {
    //    "result": [
    //        {
    //            "id": 1,
    //            "userCode": "20520716",
    //            "user": {
    //                "userName": "Cấn Đức Quang"
    //            }
    //        }
    //    ],
    //    "count": 1
    //};
    //const tempLecturer = {
    //    "result": [
    //        {
    //            "userName": "Dương Minh Thái"
    //        }
    //    ],
    //    count: 1
    //}

    async function getData() {
        const registrationSchedulesClient = new RegistrationSchedulesClient();
        let reg = await registrationSchedulesClient.getScheduleById(registrationScheduleId);
        setCurrentRegSchedule(reg);

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
        const studentsInClassClient = new StudentsInClassClient();
        studentsInClassClient.getStudentsInClass(classId, registrationScheduleId)
            .then((gridData) => { studentGridInstance.dataSource = gridData; });
        const lecturersInClassClient = new LecturersInClassClient();
        lecturersInClassClient.getLecturersInClass(classId, registrationScheduleId)
            .then((gridData) => { lecturerGridInstance.dataSource = gridData });
    }

    function dataSourceChanged(args) {
        console.log(args);
        const userClassesClient = new UserClassesClient();
        if (args.requestType === 'delete') {
            args.data.forEach((deleteData) => {
                userClassesClient.removeUserFromClass(deleteData.id);
            });
        }
        //const studentsInClassClient = new StudentsInClassClient();
        //studentsInClassClient.getStudentsInClass(classId, registrationScheduleId)
        //    .then((gridData) => { studentGridInstance.dataSource = gridData });
        //const lecturersInClassClient = new LecturersInClassClient();
        //lecturersInClassClient.getLecturersInClass(classId, registrationScheduleId)
        //    .then((gridData) => { lecturerGridInstance.dataSource = gridData });
    }

    function onRecordDoubleClick(args) {
        console.log(args);
    }

    function pcd_dataStateChange(args) {
        console.log(args);
        const studentsInClassClient = new StudentsInClassClient();
        studentsInClassClient.getStudentsInClass(classId, registrationScheduleId)
            .then((gridData) => { studentGridInstance.dataSource = gridData });
        const lecturersInClassClient = new LecturersInClassClient();
        lecturersInClassClient.getLecturersInClass(classId, registrationScheduleId)
            .then((gridData) => { lecturerGridInstance.dataSource = gridData });
    }

    function pcd_dataSourceChanged(args) {
        console.log(args);
        const studentsInClassClient = new StudentsInClassClient();
        studentsInClassClient.getStudentsInClass(classId, registrationScheduleId)
            .then((gridData) => { studentGridInstance.dataSource = gridData });
        const lecturersInClassClient = new LecturersInClassClient();
        lecturersInClassClient.getLecturersInClass(classId, registrationScheduleId)
            .then((gridData) => { lecturerGridInstance.dataSource = gridData });
    }

    function pcd_onRecordDoubleClick(args) {
        console.log(args);
    }

    function getExcelExportProperties() {
        let excelExportProperties = {
            multipleExport: {
                type: 'AppendToSheet',
                    blankRows: 2
            },
            header: {
                headerRows: 6,
                rows: [
                    {
                        index: 1,
                        cells: [
                            {
                                index: 1,
                                colSpan: 3,
                                value: 'DANH SÁCH LỚP',
                                style: { fontSize: 18, hAlign: 'Center', bold: true }
                            }
                        ]
                    },
                    {
                        index: 3,
                        cells: [
                            {
                                index: 1,
                                colSpan: 1,
                                value: 'Mã lớp',
                                style: { fontSize: 13, bold: true }
                            },
                            {
                                index: 2,
                                colSpan: 1,
                                value: classData.classCode,
                                style: { fontSize: 13 }
                            }
                        ]
                    },
                    {
                        index: 4,
                        cells: [
                            {
                                index: 1,
                                colSpan: 1,
                                value: 'Tên lớp',
                                style: { fontSize: 13, bold: true }
                            },
                            {
                                index: 2,
                                colSpan: 2,
                                value: classData.course.courseName,
                                style: { fontSize: 13 }
                            }
                        ]
                    },
                    {
                        index: 5,
                        cells: [
                            {
                                index: 1,
                                colSpan: 1,
                                value: 'Đợt đăng ký',
                                style: { fontSize: 13, bold: true }
                            },
                            {
                                index: 2,
                                colSpan: 2,
                                value: currentRegSchedule.name,
                                style: { fontSize: 13 }
                            }
                        ]
                    },
                    {
                        index: 6,
                        cells: [
                            {
                                index: 1,
                                colSpan: 1,
                                value: 'Giảng viên',
                                style: { fontSize: 13, bold: true }
                            }
                        ]
                    }
                ]
            },
            fileName: classData.classCode + ' - ' + classData.course.courseName + ' - ' + currentRegSchedule.name + '.xlsx'
        };

        //if (lecturerData.result.length > 0) {
        //    excelExportProperties.header.rows.push({
        //        index: 6,
        //        cells: [
        //            {
        //                index: 1,
        //                colSpan: 1,
        //                value: 'Giảng viên',
        //                style: { fontSize: 13, bold: true }
        //            }
        //        ]
        //    });
        //    for (let i = 6; i < 6 + lecturerData.result.length; i++) {
        //        excelExportProperties.header.rows.push({
        //            index: i,
        //            cells: [
        //                {
        //                    index: 2,
        //                    colSpan: 2,
        //                    value: lecturerData.result[i - 6].user.userName,
        //                    style: { fontSize: 13 }
        //                }
        //            ]
        //        });
        //    }
        //}

        return excelExportProperties;
    }

    function lecturerToolbarClick(args) {
        console.log(args);
        if (lecturerGridInstance && args.item.id === 'lecturerGrid_add') {
            navigate('./add-lecturer', { state: { from: location.pathname } });
        }
        if (studentGridInstance && lecturerGridInstance && args.item.id === 'lecturerGrid_excelexport') {            
            const cols = studentGridInstance.columns;
            for (const col of cols) {
                if (col.field === "passed") {
                    col.visible = false;
                }
            }
            lecturerGridInstance.excelExport(getExcelExportProperties(), true).then((lecData) => {
                studentGridInstance.excelExport(getExcelExportProperties(), true, lecData);
            });
        }
    }

    function studentToolbarClick(args) {
        if (studentGridInstance && args.item.id === 'studentGrid_add') {
            navigate('./add-student', { state: { from: location.pathname } });
        }
        //if (studentGridInstance && lecturerGridInstance && args.item.id === 'studentGrid_excelexport') {
        //    console.log(studentGridInstance);
        //    studentGridInstance.excelExport(getExcelExportProperties(), true);
        //}
    }

    function onExcelExportComplete(args) {
        console.log(args);
        const cols = studentGridInstance.columns;
        for (const col of cols) {
            if (col.field === "passed") {
                col.visible = true;
            }
        }
    }
    
    return (
        <AdminLayout>
            <h2>{classData?.classCode}</h2>
            <h3>{classData?.course?.courseName}</h3>
            <br />
            <div className='control-pane'>
                <div className='control-section'>
                    <div style={{ paddingBottom: '18px' }}>
                        <h4>Giảng viên</h4>
                    </div>
                    <GridComponent
                        id="lecturerGrid"
                        dataSource={lecturerData}
                        toolbar={lecturerToolbarOptions}
                        editSettings={lecturerEditSettings}
                        enableHover={true}
                        height='100'
                        loadingIndicator={{ indicatorType: 'Shimmer' }}
                        rowHeight={38}
                        ref={(g) => { lecturerGridInstance = g; }}
                        allowSelection={true}
                        selectionSettings={select}
                        enableHeaderFocus={true}
                        allowExcelExport={true}
                        exportGrids={gridsToExport}
                        dataStateChange={pcd_dataStateChange.bind(this)}
                        dataSourceChanged={pcd_dataSourceChanged.bind(this)}
                        recordDoubleClick={pcd_onRecordDoubleClick.bind(this)}
                        toolbarClick={lecturerToolbarClick.bind(this)}
                        excelExportComplete={onExcelExportComplete.bind(this)}
                        locale='vi-VN-lecturer'
                    >
                        <ColumnsDirective>
                            <ColumnDirective type='checkbox' allowSorting={false} allowFiltering={false} width='40'></ColumnDirective>
                            <ColumnDirective field='id' visible={false} headerText='ID' width='100' isPrimaryKey={true}></ColumnDirective>
                            <ColumnDirective field='user.userName' headerText='Tên' width='150' clipMode='EllipsisWithTooltip' />
                            <ColumnDirective field='user.email' headerText='Email' width='100' clipMode='EllipsisWithTooltip' />
                        </ColumnsDirective>
                        <Inject services={[Toolbar, Edit, ExcelExport]} />
                    </GridComponent>
                </div>
            </div>
            <br />
            <div className='control-pane'>
                <div className='control-section'>
                    <div style={{ paddingBottom: '18px' }}>
                        <h4>Sinh viên</h4>
                    </div>
                    <GridComponent
                        id="studentGrid"
                        dataSource={studentData}
                        toolbar={studentToolbarOptions}
                        editSettings={studentEditSettings}
                        enableHover={true}
                        height='500'
                        loadingIndicator={{ indicatorType: 'Shimmer' }}
                        rowHeight={38}
                        ref={(g) => { studentGridInstance = g; }}
                        allowSelection={true}
                        selectionSettings={select}
                        enableHeaderFocus={true}
                        allowExcelExport={true}
                        dataStateChange={dataStateChange.bind(this)}
                        dataSourceChanged={dataSourceChanged.bind(this)}
                        recordDoubleClick={onRecordDoubleClick.bind(this)}
                        toolbarClick={studentToolbarClick.bind(this)}
                        locale='vi-VN-student'
                    >
                        <ColumnsDirective>
                            <ColumnDirective type='checkbox' allowSorting={false} allowFiltering={false} width='40'></ColumnDirective>
                            <ColumnDirective field='id' visible={false} headerText='ID' width='100' isPrimaryKey={true}></ColumnDirective>
                            <ColumnDirective field='user.userCode' allowEditing={false} headerText='MSSV' width='60' clipMode='EllipsisWithTooltip' />
                            <ColumnDirective field='user.userName' headerText='Tên' allowEditing={false} width='150' clipMode='EllipsisWithTooltip'></ColumnDirective>
                            <ColumnDirective field='user.email' headerText='Email' width='100' clipMode='EllipsisWithTooltip' />
                            {/*<ColumnDirective*/}
                            {/*    field='passed'*/}
                            {/*    headerText='Qua môn'*/}
                            {/*    width='40'*/}
                            {/*    displayAsCheckBox="true"*/}
                            {/*    editType="booleanedit"*/}
                            {/*    type="boolean" clipMode='EllipsisWithTooltip' />*/}
                        </ColumnsDirective>
                        <Inject services={[Toolbar, ExcelExport, Edit]} />
                    </GridComponent>
                </div>
            </div>
        </AdminLayout>
    )  
}

export default ClassDetails;