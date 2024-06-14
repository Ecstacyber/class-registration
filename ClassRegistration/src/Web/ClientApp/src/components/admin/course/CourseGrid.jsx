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
    Edit,
    ForeignKey
} from '@syncfusion/ej2-react-grids';
import { createElement, L10n } from '@syncfusion/ej2-base';
import { DropDownList } from '@syncfusion/ej2-dropdowns';
import { useNavigate } from 'react-router-dom';
import { CoursesClient, DepartmentsFKRefClient } from '../../../web-api-client.ts';
import '../../../custom.css'

L10n.load({
    'vi-VN': {
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
            'EditFormTitle': 'Thông tin của khoa - ID: ',
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

const CourseGrid = () => {
    const [courseData, setCourseData] = useState({
        result: [],
        count: 0
    });
    const [ departmentData, setDepartmentData ] = useState(null);
    const navigate = useNavigate();
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
    const numericValidationRules = {
        required: true,
        number: true
    }
    const feeParams = {
        params: {
            decimals: 0,
            format: "N",
            min: 0,
            validateDecimalOnType: true
        }
    };
    const departmentParams = {
        params: {
            allowFiltering: true
        }
    };
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
    //const tempData = {
    //    "result": [
    //        {
    //            "id": 15,
    //            "departmentId": 3,
    //            "courseCode": "IT001",
    //            "courseName": "Nhập môn lập trình",
    //            "description": null,
    //            "department": {
    //                "shortName": "KHMT",
    //                "fullName": "Khoa học máy tính",
    //                "id": 3,
    //                "domainEvents": []
    //            }
    //        },
    //        {
    //            "id": 12,
    //            "departmentId": 2,
    //            "courseCode": "SE313",
    //            "courseName": "Công nghệ Web và Ứng dụng",
    //            "description": null,
    //            "department": {
    //                "shortName": "KTPM",
    //                "fullName": "Kỹ thuật phần mềm",
    //                "id": 2
    //            }
    //        },
    //        {
    //            "id": 11,
    //            "departmentId": 4,
    //            "courseCode": "IE103",
    //            "courseName": "Quản lý thông tin",
    //            "description": null,
    //            "department": {
    //                "shortName": "HTTT",
    //                "fullName": "Hệ thống thông tin",
    //                "id": 4
    //            }
    //        }
    //    ],
    //    "count": 3
    //};
    //const tempDepartmentData = [
    //    {
    //        "departmentId": 2,
    //        "departmentName": "KTPM"
    //    },
    //    {
    //        "departmentId": 3,
    //        "departmentName": "KHMT"
    //    },
    //    {
    //        "departmentId": 4,
    //        "departmentName": "HTTT"
    //    }
    //];

    //const filterBarTemplate = {
    //    create: (args) => {
    //        return createElement('input', { className: 'flm-input' });
    //    },
    //    write: (args) => {
    //        departmentData.splice(0, 0, { 'type': 'All' }); // for clear filtering
    //        const coursesClient = new CoursesClient();
    //        const dropInstance = new DropDownList({
    //            change: (arg) => {
    //                if (gridInstance) {
    //                    if (arg.value !== 'All') {
    //                        console.log(arg);
    //                        orderBy = '';
    //                        filterAttr = 'departmentName';
    //                        filterText = arg.value;
    //                        coursesClient.getCourses(
    //                            0,
    //                            12,
    //                            '',
    //                            filterAttr,
    //                            filterText
    //                        )
    //                            .then((gridData) => { gridInstance.dataSource = gridData });
    //                    }
    //                    else {
    //                        console.log(arg);
    //                        orderBy = '';
    //                        filterAttr = '';
    //                        filterText = '';
    //                        coursesClient.getCourses(
    //                            0,
    //                            12,
    //                            '',
    //                            '',
    //                            ''
    //                        )
    //                            .then((gridData) => { gridInstance.dataSource = gridData });
    //                    }
    //                }
    //            },
    //            dataSource: departmentData,
    //            fields: { text: 'departmentName' },
    //            index: 0,
    //            placeholder: 'Chọn khoa',
    //            popupHeight: '200px'
    //        });
    //        dropInstance.appendTo(args.element);
    //    }
    //};

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
                coursesClient.getCourses(0, 12)
                    .then((gridData) => { gridInstance.dataSource = gridData });
                return;
            }

            coursesClient.getCourses(0, 12)
                .then((gridData) => { gridInstance.dataSource = gridData });

        } else {
            coursesClient.getCourses(0, 12)
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
            filterAttr = '';
            filterText = '';
            orderBy = '';
            coursesClient.getCourses(0, 12)
                .then((gridData) => { gridInstance.dataSource = gridData });
            return;
        }       
    }

    function onRecordDoubleClick(args) {
        //console.log(args);
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
                        dataStateChange={dataStateChange.bind(this)}
                        dataSourceChanged={dataSourceChanged.bind(this)}
                        recordDoubleClick={onRecordDoubleClick.bind(this)}
                        locale='vi-VN'
                    >
                        <ColumnsDirective>
                            <ColumnDirective type='checkbox' allowSorting={false} allowFiltering={false} width='40'></ColumnDirective>
                            <ColumnDirective field='id' visible={false} headerText='ID' width='100' isPrimaryKey={true}></ColumnDirective>
                            <ColumnDirective
                                field='departmentId'
                                foreignKeyValue='departmentName'
                                foreignKeyField='departmentId'
                                dataSource={departmentData}
                                headerText='Khoa'
                                width='50'
                                validationRules={validationRules}
                                edit={departmentParams}
                                clipMode='EllipsisWithTooltip' />
                            <ColumnDirective field='courseCode' headerText='Mã môn học' width='60' validationRules={validationRules} clipMode='EllipsisWithTooltip' />
                            <ColumnDirective field='courseName' headerText='Tên môn học' width='120' validationRules={validationRules} clipMode='EllipsisWithTooltip' />                           
                        </ColumnsDirective>
                        <Inject services={[Filter, Sort, Toolbar, Edit, Page, ForeignKey]} />
                    </GridComponent>
                </div>
            </div>
        )
    }
}

export default CourseGrid;