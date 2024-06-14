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
import { AdminLayout } from '../../AdminLayout';
import { CoursesClient, DepartmentsFKRefClient, LecturersClient } from '../../../web-api-client.ts';

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
            'EditFormTitle': 'Thông tin sinh viên - ID: ',
            'AddFormTitle': 'Thêm sinh viên',
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
            'totalItemInfo': '({0} dòng)',
            'All': 'Tất cả'
        }
    }
});

const Lecturer = () => {
    const [lecturers, setLecturers] = useState({
        result: [],
        count: 0
    });
    const [departments, setDepartments] = useState([{}]);
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
    //const tempLecturer = {
    //    "result": [
    //        {
    //            "id": 1,
    //            "userName": "Dương Minh Thái",
    //            "userCode": "DMT",
    //            "email": "dmt@gm.uit.edu.vn",
    //            "password": null,
    //            "departmentId": 1,
    //            "department": {
    //                "shortName": "CNPM",
    //                "fullName": "Công nghệ phần mềm",
    //                "id": 1
    //            },
    //            "roles": []
    //        }
    //    ],
    //    "count": 1
    //};
    //const tempDapartment = [
    //    {
    //        "departmentId": 1,
    //        "departmentName": "CNPM"
    //    }
    //];

    async function getData() {
        const lecturersClient = new LecturersClient();
        let lecturersData = await lecturersClient.getLecturers(0, 12);
        setLecturers(lecturersData);

        const departmentsClient = new DepartmentsFKRefClient();
        let departmentsData = await departmentsClient.getDepartmentsForFKRef();
        setDepartments(departmentsData);
    }

    useEffect(() => {
        getData();
    }, [])

    const actionBegin = (args) => {
        console.log(args);
        if (gridInstance && (args.requestType === 'beginEdit' || args.requestType === 'add')) {
            const cols = gridInstance.columns;
            for (const col of cols) {
                if (col.field === "password") {
                    col.visible = true;
                }
            }
        }
    };

    const filterBarTemplate = {
        create: (args) => {
            return createElement('input', { className: 'flm-input' });
        },
        write: (args) => {
            departments.splice(0, 0, { 'type': 'All' }); // for clear filtering
            const lecturersClient = new LecturersClient();
            const dropInstance = new DropDownList({
                change: (arg) => {
                    if (gridInstance) {
                        if (arg.value !== 'All') {
                            console.log(arg);
                            orderBy = '';
                            filterAttr = 'departmentId';
                            lecturersClient.getLecturers(
                                0,
                                12,
                                '',
                                filterAttr,
                                filterText
                            )
                                .then((gridData) => { gridInstance.dataSource = gridData });
                        }
                        else {
                            console.log(arg);
                            orderBy = '';
                            filterAttr = '';
                            filterText = '';
                            lecturersClient.getLecturers(
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
                dataSource: departments,
                fields: { text: 'departmentName' },
                index: 0,
                placeholder: 'Chọn khoa',
                popupHeight: '200px'
            });
            dropInstance.appendTo(args.element);
        }
    };

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

            //if (args.action.requestType === 'save') {
            //    filterAttr = '';
            //    filterText = '';
            //    orderBy = '';
            //    classesByCourseIdClient.getClassesByCourseId(courseId, 0, 12)
            //        .then((gridData) => { gridInstance.dataSource = gridData });
            //    return;
            //}

            lecturersClient.getLecturers(args.skip, args.take)
                .then((gridData) => { gridInstance.dataSource = gridData });

        } else {
            lecturersClient.getLecturers(args.skip, args.take)
                .then((gridData) => { gridInstance.dataSource = gridData });
        }
    }

    function dataSourceChanged(args) {
        console.log(args);
        const lecturersClient = new LecturersClient();
        if (args.action === 'add') {
            lecturersClient.createLecturer(args.data);
        } else if (args.action === 'edit') {
            lecturersClient.updateLecturer(args.data.id, args.data);
        } else if (args.requestType === 'delete') {
            args.data.forEach((deleteData) => {
                lecturersClient.deleteLecturer(deleteData.id);
            });
            filterAttr = '';
            filterText = '';
            orderBy = '';
            lecturersClient.getLecturers(0, 12)
                .then((gridData) => { gridInstance.dataSource = gridData });
            return;
        }
        filterAttr = '';
        filterText = '';
        orderBy = '';
        lecturersClient.getLecturers(0, 12)
            .then((gridData) => { gridInstance.dataSource = gridData });
    }

    function onRecordDoubleClick(args) {
        console.log(args);
        //if (args.rowData) {
        //    navigate('./class/' + args.rowData.id);
        //}
    }

    return (
        <AdminLayout>
            <div className='control-pane'>
                <div className='control-section'>
                    <div style={{ paddingBottom: '18px' }}>
                        <h2>Danh sách giảng viên</h2>
                        <br />
                    </div>
                    <GridComponent id="overviewgrid"
                        dataSource={lecturers}
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
                        actionBegin={actionBegin.bind(this)}
                        locale='vi-VN'
                    >
                        <ColumnsDirective>
                            <ColumnDirective type='checkbox' allowSorting={false} allowFiltering={false} width='40'></ColumnDirective>
                            <ColumnDirective field='id' visible={false} headerText='ID' width='100' isPrimaryKey={true}></ColumnDirective>
                            <ColumnDirective field='userCode' headerText='ID' width='100' validationRules={validationRules}></ColumnDirective>
                            <ColumnDirective field='userName' headerText='Tên' width='150' validationRules={validationRules}></ColumnDirective>
                            <ColumnDirective field='email' headerText='Email' width='100' type='email' validationRules={validationRules}></ColumnDirective>
                            <ColumnDirective field='password' headerText='Mật khẩu' type="password" width='80' type='password' visible={false} validationRules={validationRules}></ColumnDirective>
                            <ColumnDirective
                                field='departmentId'
                                foreignKeyValue='departmentName'
                                foreignKeyField='departmentId'
                                dataSource={departments}
                                headerText='Khoa'
                                width='50'
                                validationRules={validationRules}
                                edit={departmentParams}
                                filterBarTemplate={filterBarTemplate}
                                clipMode='EllipsisWithTooltip' />
                        </ColumnsDirective>
                        <Inject services={[Filter, Sort, Toolbar, Edit, Page, ForeignKey]} />
                    </GridComponent>
                </div>
            </div>
        </AdminLayout>
    )
}

export default Lecturer;