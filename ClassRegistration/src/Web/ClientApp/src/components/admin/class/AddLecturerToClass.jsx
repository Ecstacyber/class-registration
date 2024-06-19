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
import { useNavigate, useLocation, useParams, Link } from 'react-router-dom';
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

const AddLecturerToClass = () => {
    const { courseId, classId, registrationScheduleId } = useParams();
    const [course, setCourse] = useState(null);
    const [classData, setClassData] = useState(null);
    const [lecturers, setLecturers] = useState({
        result: [],
        count: 0
    });
    const [selectedLecturers, setSelectedLecturers] = useState([]);
    const location = useLocation();
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
        const lecturersClient = new LecturersClient();
        if (args.action) {
            if (args.action.requestType === 'paging') {
                lecturersClient.getLecturers(
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
                    lecturersClient.getLecturers(
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
                    lecturersClient.getLecturers(
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
                    lecturersClient.getLecturers(
                        args.skip,
                        args.take,
                        orderBy,
                        filterAttr,
                        filterText
                    )
                        .then((gridData) => { gridInstance.dataSource = gridData });
                    return;
                } else {
                    lecturersClient.getLecturers(args.skip, args.take)
                        .then((gridData) => { gridInstance.dataSource = gridData });
                    return;
                }

            }

            if (args.action.action === 'clearFilter') {
                filterAttr = '';
                filterText = '';
                lecturersClient.getLecturers(args.skip, args.take)
                    .then((gridData) => { gridInstance.dataSource = gridData });
                return;
            }

            if (args.action.requestType === 'refresh') {
                filterAttr = '';
                filterText = '';
                orderBy = '';
                lecturersClient.getLecturers(0, 12)
                    .then((gridData) => { gridInstance.dataSource = gridData });
                return;
            }

            if (args.action.requestType === 'save') {
                filterAttr = '';
                filterText = '';
                orderBy = '';
                lecturersClient.getLecturers(0, 12)
                    .then((gridData) => { gridInstance.dataSource = gridData });
                return;
            }

            lecturersClient.getLecturers(0, 12)
                .then((gridData) => { gridInstance.dataSource = gridData });

        } else {
            lecturersClient.getLecturers(0, 12)
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
        console.log(selectedLecturers);
        console.log(args);
        setSelectedLecturers([...selectedLecturers, args.data]);
    }

    function onRowDeselected(args) {
        console.log(selectedLecturers);
        console.log(args);
        setSelectedLecturers(selectedLecturers.filter(x => x.id !== args.data.id));
    }

    function AddLecturerButton() {
        if (selectedLecturers.length > 0) {
            //return <ButtonComponent cssClass='e-info' onClick={onAddClick}>Thêm</ButtonComponent>
            return (
                <Button className="py-2" variant="primary" size="lg" onClick={onAddClick}>+ Thêm</Button>
            )
            
        }
        else {
            /*return <ButtonComponent cssClass='e-info' disabled>Thêm</ButtonComponent>*/
            return (
                <Button className="py-2" variant="secondary" size="lg" disabled>+ Thêm</Button>
            )
        }
    }

    async function onAddClick() {
        const userClassesClient = new UserClassesClient();
        let addRes = [];
        for (let i = 0; i < selectedLecturers.length; i++) {
            let newUserClass = {
                classId: classId,
                registrationScheduleId: registrationScheduleId,
                userId: selectedLecturers[i].id,
                passed: 'true'
            }
            let res = await userClassesClient.addUserToClass(newUserClass);
            addRes.push({
                userName: selectedLecturers[i].userName,
                result: res
            });
        }
        console.log(addRes);
    }

    return (
        <AdminLayout>
            <h2>{classData?.classCode}</h2>
            <h3>{classData?.course?.courseName}</h3>
            <h3 className="py-2">Thêm giảng viên</h3>
            <div style={{ paddingBottom: '18px' }}>
                <Link to={'/admin-index/course/' + courseId + '/class/' + classId + '/window/' + registrationScheduleId}>Trở về lớp {classData?.classCode}</Link>
            </div>
            <div className='control-pane'>
                <div className='control-section'>
                    <div style={{ paddingBottom: '18px' }}>
                        <AddLecturerButton />
                    </div>
                    <GridComponent
                        id="studentGrid"
                        dataSource={lecturers}
                        toolbar={toolbarOptions}
                        allowPaging={true}
                        enableHover={true}
                        height='800'
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
                            {/*<ColumnDirective field='userCode' headerText='Mã số' width='60' clipMode='EllipsisWithTooltip' />*/}
                            <ColumnDirective field='userName' headerText='Tên' width='200' clipMode='EllipsisWithTooltip'></ColumnDirective>
                        </ColumnsDirective>
                        <Inject services={[Filter, Sort, Page, Toolbar]} />
                    </GridComponent>
                </div>
            </div>
        </AdminLayout>
    )
}

export default AddLecturerToClass;