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
import { CoursesClient, DepartmentsFKRefClient, StudentsClient, UsersClient } from '../../../web-api-client.ts';
import '../../../custom.css'

L10n.load({
    'vi-VN-s': {
        grid: {
            'Add': 'Thêm',
            'Edit': 'Sửa',
            'Delete': 'Vô hiệu hoá',
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


const Student = () => {
    const [students, setStudents] = useState({
        result: [],
        count: 0
    });
    const [departments, setDepartments] = useState(null);
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
    //const tempStudent = {
    //    "result": [
    //        {
    //            "id": 1,
    //            "userName": "Châu Vĩnh Sinh",
    //            "userCode": "20520470",
    //            "email": "20520470@gm.uit.edu.vn",
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
        const studentsClient = new StudentsClient();
        let studentData = await studentsClient.getStudents(0, 12);
        setStudents(studentData);

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
            const studentsClient = new StudentsClient();
            const dropInstance = new DropDownList({
                change: (arg) => {
                    if (gridInstance) {
                        if (arg.value !== 'All') {
                            console.log(arg);
                            orderBy = '';
                            filterAttr = 'departmentId';
                            studentsClient.getStudents(); (
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
                            studentsClient.getStudents(
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

            //if (args.action.requestType === 'save') {
            //    filterAttr = '';
            //    filterText = '';
            //    orderBy = '';
            //    studentsClient.getStudents(0, 12)
            //        .then((gridData) => { gridInstance.dataSource = gridData });
            //    return;
            //}

            studentsClient.getStudents(args.skip, args.take)
                .then((gridData) => { gridInstance.dataSource = gridData });

        } else {
            studentsClient.getStudents(args.skip, args.take)
                .then((gridData) => { gridInstance.dataSource = gridData });
        }
    }

    function dataSourceChanged(args) {
        console.log(args);      
        const usersClient = new UsersClient();
        if (args.action === 'add') {
            let newStudent = {
                userName: args.data.userName,
                passWord: args.data.password,
                userCode: args.data.userCode,
                email: args.data.email,
                departmentId: args.data.departmentId,
                roles: ["student"]
            }
            let addResult = usersClient.createUser(newStudent);
            console.log(addResult);
        } else if (args.action === 'edit') {
            let updatedStudent = {
                id: args.data.id,
                userName: args.data.userName,
                passWord: args.data.password,
                userCode: args.data.userCode,
                email: args.data.email,
                departmentId: args.data.departmentId,
                roles: ["Student"],
                enabled: "true"
            }
            usersClient.editUser(args.data.id, updatedStudent);
        } else if (args.requestType === 'delete') {
            args.data.forEach((deleteData) => {
                usersClient.blockUser(deleteData.id);
            });
        }
        window.location.reload();
        //const studentsClient = new StudentsClient();
        //filterAttr = '';
        //filterText = '';
        //orderBy = '';
        //studentsClient.getStudents(0, 12)
        //    .then((gridData) => { gridInstance.dataSource = gridData; });
        //setTimeout(() => {
        //    window.location.reload();
        //}, 5000);
    }

    function onRecordDoubleClick(args) {
        console.log(args);
        if (args.rowData) {
            navigate('./' + args.rowData.id);
        }
    }

    if (departments != null) {
        return (
            <AdminLayout>
                <div className='control-pane'>
                    <div className='control-section'>
                        <div style={{ paddingBottom: '18px' }}>
                            <h2>Danh sách sinh viên</h2>
                            <br />
                        </div>
                        <GridComponent id="overviewgrid"
                            dataSource={students}
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
                            actionBegin={actionBegin.bind(this)}
                            recordDoubleClick={onRecordDoubleClick.bind(this)}
                            locale='vi-VN-s'
                        >
                            <ColumnsDirective>
                                <ColumnDirective type='checkbox' allowSorting={false} allowFiltering={false} width='40'></ColumnDirective>
                                <ColumnDirective field='id' visible={false} headerText='ID' width='100' isPrimaryKey={true}></ColumnDirective>
                                <ColumnDirective field='userCode' headerText='MSSV' width='50' validationRules={validationRules}></ColumnDirective>
                                <ColumnDirective field='userName' headerText='Tên' width='150' validationRules={validationRules}></ColumnDirective>
                                <ColumnDirective field='email' headerText='Email' width='100' type='email' validationRules={validationRules}></ColumnDirective>
                                <ColumnDirective field='password' headerText='Mật khẩu' type="password" width='80' visible={false} validationRules={validationRules}></ColumnDirective>           
                                <ColumnDirective
                                    field='departmentId'
                                    foreignKeyValue='departmentName'
                                    foreignKeyField='departmentId'
                                    dataSource={departments}
                                    headerText='Khoa'
                                    width='80'
                                    validationRules={validationRules}
                                    edit={departmentParams}
                                    filterBarTemplate={filterBarTemplate}
                                    clipMode='EllipsisWithTooltip' />
                                <ColumnDirective
                                    field='enabled'
                                    headerText='Kích hoạt'
                                    width='50'
                                    displayAsCheckBox="true"
                                    editType="booleanedit"
                                    type="boolean"
                                    validationRules={validationRules}>
                                </ColumnDirective>
                            </ColumnsDirective>
                            <Inject services={[Filter, Sort, Toolbar, Edit, Page, ForeignKey]} />
                        </GridComponent>
                    </div>
                </div>
            </AdminLayout>
        )
    }
}

export default Student;