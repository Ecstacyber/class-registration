import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, useNavigationType, useLocation } from 'react-router-dom';
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
import { AdminLayout } from '../../AdminLayout';
import {
    ClassesClient,
    UserClassesClient,
    StudentsInClassClient,
    LecturersInClassClient
} from '../../../web-api-client.ts';

const ClassDetails = () => {
    const [classData, setClassData] = useState(null);
    const [studentData, setStudentData] = useState({
        result: [],
        count: 0
    });
    const [lecturerData, setLecturerData] = useState({
        result: [],
        count: 0
    });
    const { courseId, classId, registrationScheduleId } = useParams();
    const location = useLocation();
    const navigationType = useNavigationType();
    const navigate = useNavigate();
    const [coursesFKData, setCoursesFKData] = useState(null);
    const [classTypes, setClassTypes] = useState(null);
    const [pcId, setPcId] = useState();
    let studentOrderBy = '';
    let studentFilterAttr = '';
    let studentFilterText = '';
    let lecturerOrderBy = '';
    let lecturerFilterAttr = '';
    let lecturerFilterText = '';
    let studentGridInstance;
    let lecturerGridInstance;
    const fields = { text: 'text', value: 'value' };
    const toolbarOptions = ['Add', 'Delete'];
    const editSettings = {
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
    const prerequisiteCourseParams = {
        params: {
            allowFiltering: true
        }
    }

    async function getData() {
        const studentsInClassClient = new StudentsInClassClient();
        let students = await studentsInClassClient.getStudentsInClass(classId, registrationScheduleId);
        setStudentData(students);

        const lecturersInClassClient = new LecturersInClassClient();
        let lecturers = await lecturersInClassClient.getLecturersInClass(classId, registrationScheduleId);
        setLecturerData(lecturers);
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
        //navigate('/admin-index/course/' + args.rowData.prerequisiteCourseId);
    }
    
    return (
        <AdminLayout>
            <h1>{courseId}</h1>
            <h1>{classId}</h1>
            {/*<h2>{course?.courseCode}</h2>*/}
            {/*<h3>{course?.courseName}</h3>*/}
            {/*<h4>Số tín chỉ: {course?.credit}</h4>*/}
            {/*<h4>Học phí: {course?.fee}</h4>*/}
            {/*<br />*/}
            {/*<div className='control-pane'>*/}
            {/*    <div className='control-section'>*/}
            {/*        <div style={{ paddingBottom: '18px' }}>*/}
            {/*            <h3>Danh sách môn tiên quyết</h3>*/}
            {/*        </div>*/}
            {/*        <GridComponent id="overviewgrid"*/}
            {/*            dataSource={prerequisiteCourseData}*/}
            {/*            toolbar={pcgToolbarOptions}*/}
            {/*            editSettings={pc_editSettings}*/}
            {/*            allowPaging={true}*/}
            {/*            pageSettings={pageSettings}*/}
            {/*            enableHover={true}*/}
            {/*            height='150'*/}
            {/*            loadingIndicator={{ indicatorType: 'Shimmer' }}*/}
            {/*            rowHeight={38}*/}
            {/*            ref={(g) => { pcdGridInstance = g; }}*/}
            {/*            allowFiltering={true}*/}
            {/*            filterSettings={filter}*/}
            {/*            allowSorting={true}*/}
            {/*            allowMultiSorting={true}*/}
            {/*            allowSelection={true}*/}
            {/*            selectionSettings={select}*/}
            {/*            enableHeaderFocus={true}*/}
            {/*            dataStateChange={pcd_dataStateChange.bind(this)}*/}
            {/*            dataSourceChanged={pcd_dataSourceChanged.bind(this)}*/}
            {/*            recordDoubleClick={pcd_onRecordDoubleClick.bind(this)}*/}
            {/*        >*/}
            {/*            <ColumnsDirective>*/}
            {/*                <ColumnDirective type='checkbox' allowSorting={false} allowFiltering={false} width='40'></ColumnDirective>*/}
            {/*                <ColumnDirective field='id' visible={false} headerText='ID' width='100' isPrimaryKey={true}></ColumnDirective>*/}
            {/*                <ColumnDirective*/}
            {/*                    field='prerequisiteCourseId'*/}
            {/*                    foreignKeyValue='courseName'*/}
            {/*                    foreignKeyField='prerequisiteCourseId'*/}
            {/*                    dataSource={coursesFKData}*/}
            {/*                    headerText='Tên lớp'*/}
            {/*                    width='100'*/}
            {/*                    validationRules={validationRules}*/}
            {/*                    edit={prerequisiteCourseParams}*/}
            {/*                    clipMode='EllipsisWithTooltip' />*/}
            {/*                <ColumnDirective*/}
            {/*                    field='requiredPassed'*/}
            {/*                    displayAsCheckBox="true"*/}
            {/*                    editType="booleanedit"*/}
            {/*                    type="boolean"*/}
            {/*                    headerText='Cần qua môn'*/}
            {/*                    width='40'*/}
            {/*                    clipMode='EllipsisWithTooltip' />*/}
            {/*            </ColumnsDirective>*/}
            {/*            <Inject services={[Filter, Sort, Toolbar, Edit, Page, ForeignKey]} />*/}
            {/*        </GridComponent>*/}
            {/*    </div>*/}
            {/*</div>*/}
            {/*<br />*/}
            {/*<div className='control-pane'>*/}
            {/*    <div className='control-section'>*/}
            {/*        <div style={{ paddingBottom: '18px' }}>*/}
            {/*            <h3>Danh sách lớp học</h3>*/}
            {/*        </div>*/}
            {/*        <GridComponent id="overviewgrid"*/}
            {/*            dataSource={classData}*/}
            {/*            toolbar={toolbarOptions}*/}
            {/*            editSettings={editSettings}*/}
            {/*            allowPaging={true}*/}
            {/*            pageSettings={pageSettings}*/}
            {/*            enableHover={true}*/}
            {/*            height='250'*/}
            {/*            loadingIndicator={{ indicatorType: 'Shimmer' }}*/}
            {/*            rowHeight={38}*/}
            {/*            ref={(g) => { gridInstance = g; }}*/}
            {/*            allowFiltering={true}*/}
            {/*            filterSettings={filter}*/}
            {/*            allowSorting={true}*/}
            {/*            allowMultiSorting={true}*/}
            {/*            allowSelection={true}*/}
            {/*            selectionSettings={select}*/}
            {/*            enableHeaderFocus={true}*/}
            {/*            dataStateChange={dataStateChange.bind(this)}*/}
            {/*            dataSourceChanged={dataSourceChanged.bind(this)}*/}
            {/*            recordDoubleClick={onRecordDoubleClick.bind(this)}*/}
            {/*        >*/}
            {/*            <ColumnsDirective>*/}
            {/*                <ColumnDirective type='checkbox' allowSorting={false} allowFiltering={false} width='40'></ColumnDirective>*/}
            {/*                <ColumnDirective field='id' visible={false} headerText='ID' width='100' isPrimaryKey={true}></ColumnDirective>*/}
            {/*                <ColumnDirective field='classCode' headerText='Mã lớp' width='60' validationRules={validationRules} clipMode='EllipsisWithTooltip' />*/}
            {/*                <ColumnDirective*/}
            {/*                    field='classTypeId'*/}
            {/*                    foreignKeyValue='type'*/}
            {/*                    foreignKeyField='classTypeId'*/}
            {/*                    dataSource={classTypes}*/}
            {/*                    headerText='Loại lớp'*/}
            {/*                    width='60'*/}
            {/*                    validationRules={validationRules}*/}
            {/*                    allowSorting={false}*/}
            {/*                    clipMode='EllipsisWithTooltip' />*/}
            {/*                <ColumnDirective*/}
            {/*                    columns={*/}
            {/*                        [*/}
            {/*                            { field: 'dayOfWeek', headerText: 'Thứ', width: 50, validationRules: dowRules, editType: 'numericedit', edit: numericParams },*/}
            {/*                            { field: 'startPeriod', headerText: 'Tiết bắt đầu', width: 50, validationRules: periodRules, editType: 'numericedit', edit: numericParams },*/}
            {/*                            { field: 'endPeriod', headerText: 'Tiết kết thúc', width: 50, validationRules: periodRules, editType: 'numericedit', edit: numericParams }*/}
            {/*                        ]*/}
            {/*                    }*/}
            {/*                    headerText='Thời gian học' >*/}
            {/*                </ColumnDirective>*/}
            {/*                <ColumnDirective*/}
            {/*                    field='capacity'*/}
            {/*                    headerText='Sĩ số'*/}
            {/*                    width='50'*/}
            {/*                    editType='numericedit'*/}
            {/*                    validationRules={capacityRules}*/}
            {/*                    edit={numericParams}></ColumnDirective>*/}
            {/*                <ColumnDirective*/}
            {/*                    field='canBeRegistered'*/}
            {/*                    headerText='Được đăng ký'*/}
            {/*                    width='50'*/}
            {/*                    displayAsCheckBox="true"*/}
            {/*                    editType="booleanedit"*/}
            {/*                    type="boolean"*/}
            {/*                    validationRules={validationRules}>*/}
            {/*                </ColumnDirective>*/}
            {/*            </ColumnsDirective>*/}
            {/*            <Inject services={[Filter, Sort, Toolbar, Edit, Page, ForeignKey]} />*/}
            {/*        </GridComponent>*/}
            {/*    </div>*/}
            {/*</div>*/}
            {/*<br />*/}
        </AdminLayout>
    )  
}

export default ClassDetails;