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

const LecturerDetails = () => {
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
                    >
                        <ColumnsDirective>
                            <ColumnDirective type='checkbox' allowSorting={false} allowFiltering={false} width='40'></ColumnDirective>
                            <ColumnDirective field='id' visible={false} headerText='ID' width='100' isPrimaryKey={true}></ColumnDirective>
                            <ColumnDirective field='userCode' headerText='ID' width='100' validationRules={validationRules}></ColumnDirective>
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

export default LecturerDetails;