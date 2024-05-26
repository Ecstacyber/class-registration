import React, { Component } from 'react';
import { extend, isNullOrUndefined } from '@syncfusion/ej2-base';
import { DropDownListComponent } from '@syncfusion/ej2-react-dropdowns';
import { DataUtil } from '@syncfusion/ej2-data';
import { DepartmentsClient, CoursesClient } from '../../../web-api-client.ts';

export class CourseDialogTemplate extends Component {
    static displayName = CourseDialogTemplate.name;

    departmentClient = new DepartmentsClient();
    courseClient = new CoursesClient();
    dropDownListInstance;
    departmentData;
    courseData;
    departmentName;
    courseCode;
    courseName;
    
    constructor(props) {
        super(props);
        this.state = extend({}, {}, props, true);
    }

    onChange(args) {
        let key = args.target.name;
        let value = args.target.value;
        this.setState({ [key]: value });
    }

    componentDidMount() {
        let state = this.state;

        this.departmentClient.getDepartments().then((data) => {
            this.departmentData = data.result;
            this.dropDownListInstance.dataSource = data.result;
        });

        this.courseClient.getCourses().then((data) => {
            this.courseData = data.result;
        })
        
        // Set initial Focus
        //state.isAdd ? this.courseCode.focus() : this.courseName.focus();
    }

    actionBegin(args) {
        console.log(args);
        if (args.requestType === 'save') {
            for (var i = 0; i < this.courseData.length; i++) {
                if (this.courseData[i].courseName === args.data.courseName) {
                    args.cancel = true;
                    alert('Mã lớp đã tồn tại');
                }
            }
        }
    }

    render() {
        let data = this.state;
        // react warning error purpose
        if (data.isAdd) {
            let keys = Object.keys(data);
            for (let i = 0; i < keys.length; i++) {
                if (data[keys[i]] !== 'isAdd' && isNullOrUndefined(data[keys[i]])) {
                    data[keys[i]] = '';
                }
            }
        }
        return (
            <div>
                <div className="form-row">
                    <div className="form-group">
                        <DropDownListComponent
                            id="departmentName"
                            ref={(d) => { this.dropDownListInstance = d; }}
                            dataSource={this.departmentClient.getDepartments()}
                            fields={{ text: 'shortName', value: 'id' }}
                            popupHeight='300px'
                            floatLabelType='Always'
                            allowFiltering={true}
                        >
                        </DropDownListComponent>
                    </div>
                </div>
                <div className="form-row">
                    <div className="form-group">
                        <div className="e-float-input e-control-wrapper">
                            <input
                                ref={input => this.courseCode = input}
                                id="courseCode" name="courseCode"
                                type="text"
                                value={data.OrderID}
                                onChange={this.onChange.bind(this)} />
                            <span className="e-float-line"></span>
                            <label className="e-float-text e-label-top">Mã môn học</label>
                        </div>
                    </div>                
                </div>
                <div className="form-row">
                    <div className="form-group">
                        <div className="e-float-input e-control-wrapper">
                            <input
                                ref={input => this.courseName = input}
                                value={data.CustomerName}
                                id="CustomerName"
                                name="CustomerName"
                                type="text"
                                onChange={this.onChange.bind(this)} />
                            <span className="e-float-line"></span>
                            <label className="e-float-text e-label-top">Tên môn học</label>
                        </div>
                    </div>
                </div>           
            </div>
        );
    }
}