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
import { CoursesClient, DepartmentsFKRefClient, StudentsClient } from '../../../web-api-client.ts';
import '../../../custom.css'

const StudentDetails = () => {
    return (
        <AdminLayout>
        </AdminLayout>
    )
}

export default StudentDetails;
