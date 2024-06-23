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
} from '@syncfusion/ej2-react-grids';
import { createElement, L10n } from '@syncfusion/ej2-base';
import { DropDownList } from '@syncfusion/ej2-dropdowns';
import { ButtonComponent } from '@syncfusion/ej2-react-buttons';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { AdminLayout } from '../../AdminLayout';
import Button from 'react-bootstrap/Button';
import {
    CoursesClient,
    DepartmentsFKRefClient,
    StudentsClient,
    UserClassesClient,
    ClassByIdClient,
    LecturersClient
} from '../../../web-api-client.ts';
import '../../../custom.css'

L10n.load({
    'vi-VN': {
        grid: {
            'EmptyRecord': 'Không có dữ liệu',
            'FilterbarTitle': '- thanh tìm kiếm',
            'Matches': 'Không có kết quả',
            'Search': 'Tìm kiếm'
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

const AddStudentToClass = () => {
    const { courseId, classId, registrationScheduleId } = useParams();
    const [course, setCourse] = useState(null);
    const [classData, setClassData] = useState(null);
    const [students, setStudents] = useState({
        result: [],
        count: 0
    });
    const [selectedStudents, setSelectedStudents] = useState([]);
    const [successfulAddResult, setSuccessfulAddResult] = useState([]);
    const [failedAddResult, setFailedAddResult] = useState([]);
    const navigate = useNavigate();
    let orderBy = '';
    let filterAttr = '';
    let filterText = '';
    let gridInstance;
    const fields = { text: 'text', value: 'value' };
    const toolbarOptions = ['Search'];
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
    //let toastObj;
    //let position = { X: 'Right' };
    //const tempLecturer = {
    //    "result": [
    //        {
    //            "id": 1,
    //            "userCode": "KONG",
    //            "userName": "Nguyễn Bá Công"
    //        }
    //    ],
    //    "count": 1
    //};

    async function getData() {
        const classByIdClient = new ClassByIdClient();
        let currentClass = await classByIdClient.getClassById(classId);
        setClassData(currentClass);
    }

    useEffect(() => {
        getData();
    }, [])

    function dataStateChange(args) {
        console.log(args);
        const studentsClient = new StudentsClient();
        if (args.action) {
            if (args.action.requestType === 'paging') {
                studentsClient.getStudents(
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
                    studentsClient.getStudents(
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
                    studentsClient.getStudents(
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
                    studentsClient.getStudents(
                        args.skip,
                        args.take,
                        orderBy,
                        filterAttr,
                        filterText
                    )
                        .then((gridData) => { gridInstance.dataSource = gridData });
                    return;
                } else {
                    studentsClient.getStudents(args.skip, args.take)
                        .then((gridData) => { gridInstance.dataSource = gridData });
                    return;
                }

            }

            if (args.action.action === 'clearFilter') {
                filterAttr = '';
                filterText = '';
                studentsClient.getStudents(args.skip, args.take)
                    .then((gridData) => { gridInstance.dataSource = gridData });
                return;
            }

            if (args.action.requestType === 'refresh') {
                filterAttr = '';
                filterText = '';
                orderBy = '';
                studentsClient.getStudents(0, 12)
                    .then((gridData) => { gridInstance.dataSource = gridData });
                return;
            }

            if (args.action.requestType === 'save') {
                filterAttr = '';
                filterText = '';
                orderBy = '';
                studentsClient.getStudents(0, 12)
                    .then((gridData) => { gridInstance.dataSource = gridData });
                return;
            }

            studentsClient.getStudents(0, 12)
                .then((gridData) => { gridInstance.dataSource = gridData });

        } else {
            studentsClient.getStudents(0, 12)
                .then((gridData) => { gridInstance.dataSource = gridData });
        }
    }

    function dataSourceChanged(args) {
        console.log(args);
        //const coursesClient = new CoursesClient();
        //if (args.action === 'add') {
        //    coursesClient.createCourse(args.data);
        //} else if (args.action === 'edit') {
        //    coursesClient.updateCourse(args.data.id, args.data);
        //} else if (args.requestType === 'delete') {
        //    args.data.forEach((deleteData) => {
        //        coursesClient.deleteCourse(deleteData.id);
        //    });
        //    filterAttr = '';
        //    filterText = '';
        //    orderBy = '';
        //    coursesClient.getCourses(0, 12)
        //        .then((gridData) => { gridInstance.dataSource = gridData });
        //    return;
        //}
    }

    function onRowSelected(args) {
        setSelectedStudents([...selectedStudents, args.data]);
    }

    function onRowDeselected(args) {
        setSelectedStudents(selectedStudents.filter(x => x.id !== args.data.id));
    }

    function AddStudentButton() {
        if (selectedStudents.length > 0) {
            return (
                <Button className="py-2" variant="primary" size="lg" onClick={onAddClick}>+ Thêm</Button>
            )

        }
        else {
            return (
                <Button className="py-2" variant="secondary" size="lg" disabled>+ Thêm</Button>
            )
        }
    }

    async function onAddClick() {
        const userClassesClient = new UserClassesClient();
        let success = [];
        let failed = [];
        for (let i = 0; i < selectedStudents.length; i++) {
            let newUserClass = {
                classId: classId,
                registrationScheduleId: registrationScheduleId,
                userId: selectedStudents[i].id,
                passed: 'true'
            }
            let res = await userClassesClient.addUserToClass(newUserClass);
            if (res === 0 || res === 1) {
                failed.push({
                    userName: selectedStudents[i].userName,
                    result: res
                });
            }
            else {
                success.push({
                    userName: selectedStudents[i].userName,
                    result: res
                });
            }       
        }
        if (failed.length === 0) {
            navigate('/admin-index/course/' + courseId + '/class/' + classId + '/window/' + registrationScheduleId);
        }
        else if (success.length > 0 && failed.length > 0) {
            let alertContent = 'Thêm ' + success.length + ' sinh viên thành công, ' + failed.length + ' sinh viên thất bại';
            for (let i = 0; i < failed.length; i++) {
                alertContent += '\n' + failed[i].userName + ' - ';
                if (failed[i].res === 0) {
                    alertContent += 'Người dùng không tồn tại';
                }
                else if (failed[i].res === 1) {
                    alertContent += 'Người dùng đã có trong lớp';
                }
            }
            alert(alertContent);
        }
        else if (failed.length > 0) {
            let alertContent = 'Thêm ' + failed.length + ' sinh viên thất bại';
            for (let i = 0; i < failed.length; i++) {
                alertContent += '\n' + failed[i].userName + ' - ';
                if (failed[i].res === 0) {
                    alertContent += 'Người dùng không tồn tại';
                }
                else if (failed[i].res === 1) {
                    alertContent += 'Người dùng đã có trong lớp';
                }
            }
            alert(alertContent);
        }
    }

    return (
        <div>
            <AdminLayout>
                <h2>{classData?.classCode}</h2>
                <h3>{classData?.course?.courseName}</h3>
                <h3 className="py-2">Thêm sinh viên</h3>
                <div style={{ paddingBottom: '18px' }}>
                    <Link to={'/admin-index/course/' + courseId + '/class/' + classId + '/window/' + registrationScheduleId}>Trở về lớp {classData?.classCode}</Link>
                </div>
                <div className='control-pane'>
                    <div className='control-section'>
                        <div style={{ paddingBottom: '18px' }}>
                            <AddStudentButton />
                        </div>
                        <GridComponent
                            id="studentGrid"
                            dataSource={students}
                            toolbar={toolbarOptions}
                            allowPaging={true}
                            enableHover={true}
                            height='600'
                            loadingIndicator={{ indicatorType: 'Shimmer' }}
                            rowHeight={38}
                            ref={(g) => { gridInstance = g; }}
                            allowFiltering={true}
                            filterSettings={filter}
                            allowSorting={true}
                            allowMultiSorting={true}
                            allowSelection={true}
                            enableHeaderFocus={true}
                            dataStateChange={dataStateChange.bind(this)}
                            dataSourceChanged={dataSourceChanged.bind(this)}
                            rowSelected={onRowSelected.bind(this)}
                            rowDeselected={onRowDeselected.bind(this)}
                            locale='vi-VN'
                        >
                            <ColumnsDirective>
                                <ColumnDirective type='checkbox' allowSorting={false} allowFiltering={false} width='40'></ColumnDirective>
                                <ColumnDirective field='id' visible={false} headerText='ID' width='100' isPrimaryKey={true}></ColumnDirective>
                                <ColumnDirective field='userCode' headerText='MSSV' width='60' clipMode='EllipsisWithTooltip' />
                                <ColumnDirective field='userName' headerText='Tên' width='200' clipMode='EllipsisWithTooltip'></ColumnDirective>
                            </ColumnsDirective>
                            <Inject services={[Filter, Sort, Page, Toolbar]} />
                        </GridComponent>
                    </div>
                </div>
            </AdminLayout>
        </div>
    )
}

export default AddStudentToClass;