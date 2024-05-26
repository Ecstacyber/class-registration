import * as React from 'react';
import {
    GridComponent,
    ColumnsDirective,
    ColumnDirective,
    Filter,
    Inject,
    Sort,
    Page,
    Toolbar,
    Edit
} from '@syncfusion/ej2-react-grids';
import { DepartmentsClient } from '../../../web-api-client.ts';
import '../department/grid-overview.css';

export class DepartmentGrid extends React.Component {
    static displayName = DepartmentGrid.name;

    departmentClient = new DepartmentsClient();
    data;
    orderBy = '';
    filterAttr = '';
    filterText = '';
    gridInstance;
    fields = { text: 'text', value: 'value' };
    toolbarOptions = ['Add', 'Edit', 'Delete'];
    editSettings = {
        allowEditing: true,
        allowAdding: true,
        allowDeleting: true,
        showDeleteConfirmDialog: true,
        mode: 'Dialog'
    };
    editparams = { params: { popupHeight: '300px' } };
    validationRules = { required: true };
    pageSettings = { pageSizes: true };
    check = {
        type: 'CheckBox'
    };
    select = {
        persistSelection: true,
        type: "Multiple",
        checkboxOnly: true
    };
    filter = {
        ignoreAccent: true
    };
    sortingOption = {
        columns: [
            {
                field: 'shortName',
                direction: 'Ascending'
            }
        ]
    };

    actionComplete(args) {
        //console.log(args);
    }
        
    componentDidMount() {
        this.departmentClient.getDepartments('allpages', 0, 12)
            .then((gridData) => { this.gridInstance.dataSource = gridData });
    }

    actionBegin(args) {
        //console.log(args);
    }

    dataStateChange(state) {
        console.log(state);
        if (state.action) {
            if (state.action.requestType === 'paging') {
                this.departmentClient.getDepartments(
                    'allpages',
                    state.skip,
                    state.take,
                    this.orderBy,
                    this.filterAttr,
                    this.filterText
                )
                    .then((gridData) => { this.gridInstance.dataSource = gridData });
                return;
            }

            if (state.action.requestType === 'sorting') {
                if (state.action.columnName && state.action.direction) {
                    this.orderBy = state.action.columnName + '-' + state.action.direction;
                    this.departmentClient.getDepartments(
                        'allpages',
                        state.skip,
                        state.take,
                        this.orderBy,
                        this.filterAttr ? this.filterAttr : '',
                        this.filterText ? this.filterText : ''
                    )
                        .then((gridData) => { this.gridInstance.dataSource = gridData });
                }
                else {
                    this.departmentClient.getDepartments(
                        'allpages',
                        state.skip,
                        state.take,
                        '',
                        this.filterAttr ? this.filterAttr : '',
                        this.filterText ? this.filterText : ''
                    )
                        .then((gridData) => { this.gridInstance.dataSource = gridData });
                    this.orderBy = '';
                }              
                return;
            }

            if (state.action.action === 'filter') {
                if (state.action.currentFilterObject.value && state.action.currentFilterObject.value !== '') {
                    this.filterText = state.action.currentFilterObject.value;
                    this.filterAttr = state.action.currentFilterObject.field;
                    this.departmentClient.getDepartments(
                        'allpages',
                        state.skip,
                        state.take,
                        this.orderBy,
                        this.filterAttr,
                        this.filterText)
                        .then((gridData) => { this.gridInstance.dataSource = gridData });
                    return;
                } else {
                    this.departmentClient.getDepartments('allpages', state.skip, state.take)
                        .then((gridData) => { this.gridInstance.dataSource = gridData });
                    return;
                }
                
            }

            if (state.action.action === 'clearFilter') {
                this.filterAttr = '';
                this.filterText = '';
                this.departmentClient.getDepartments(
                    'allpages',
                    0,
                    12,
                    this.orderBy,
                    this.filterAttr,
                    this.filterText)
                    .then((gridData) => { this.gridInstance.dataSource = gridData });
                return;
            }
            
            if (state.action.requestType === 'refresh') {
                this.orderBy = '';
                this.filterAttr = '';
                this.filterText = '';
                this.departmentClient.getDepartments('allpages', state.skip, state.take)
                    .then((gridData) => { this.gridInstance.dataSource = gridData });
                return;
            }

            this.departmentClient.getDepartments('allpages', state.skip, state.take)
                .then((gridData) => { this.gridInstance.dataSource = gridData });
        } else {
            this.departmentClient.getDepartments('allpages', state.skip, state.take)
                .then((gridData) => { this.gridInstance.dataSource = gridData });
        }       
    }

    dataSourceChanged(state) {
        //console.log(state);
        if (state.action === 'add') {
            this.departmentClient.createDepartment(state.data);
        } else if (state.action === 'edit') {
            this.departmentClient.updateDeparment(state.data.id, state.data);
        } else if (state.requestType === 'delete') {
            state.data.forEach((deleteData) => {
                this.departmentClient.deleteDepartment(deleteData.id);
            });
        }
        this.departmentClient.getDepartments('allpages', state.skip, state.take)
            .then((gridData) => { this.gridInstance.dataSource = gridData });
    }
    
    render() {
        return (
            <div className='control-pane'>     
                <div className='control-section'>
                    <div style={{ paddingBottom: '18px' }}>
                        <h2>Danh sách khoa</h2>
                        <br />
                    </div>
                    <GridComponent id="overviewgrid"
                        dataSource={this.data}
                        toolbar={this.toolbarOptions}
                        editSettings={this.editSettings}
                        allowPaging={true}
                        pageSettings={this.pageSettings}
                        enableHover={true}
                        height='456'
                        loadingIndicator={{ indicatorType: 'Shimmer' }}
                        rowHeight={38}
                        ref={(g) => { this.gridInstance = g; }}
                        allowFiltering={true}
                        filterSettings={this.filter}
                        allowSorting={true}
                        allowMultiSorting={true}
                        allowSelection={true}
                        selectionSettings={this.select}
                        enableHeaderFocus={true}
                        dataStateChange={this.dataStateChange.bind(this)}
                        dataSourceChanged={this.dataSourceChanged.bind(this)}
                        actionBegin={this.actionBegin.bind(this)}
                        actionComplete={this.actionComplete.bind(this)}
                    >
                        <ColumnsDirective>
                            <ColumnDirective type='checkbox' allowSorting={false} allowFiltering={false} width='20'></ColumnDirective>
                            <ColumnDirective field='id' visible={false} headerText='ID' isPrimaryKey={true} width='100'></ColumnDirective>
                            <ColumnDirective field='shortName' headerText='Mã khoa' width='80' validationRules={this.validationRules} clipMode='EllipsisWithTooltip' />
                            <ColumnDirective field='fullName' headerText='Tên khoa' width='140' validationRules={this.validationRules} clipMode='EllipsisWithTooltip' />
                        </ColumnsDirective>
                        <Inject services={[Filter, Sort, Toolbar, Edit, Page]} />
                    </GridComponent>
                </div>
            </div>
        )
    }
}