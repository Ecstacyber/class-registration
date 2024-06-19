import * as React from "react";
import { useEffect } from 'react';
import {
    ChartComponent,
    SeriesCollectionDirective,
    SeriesDirective,
    Inject,
    Legend,
    Category,
    Tooltip,
    ColumnSeries,
    DataLabel,
    Highlight
} from '@syncfusion/ej2-react-charts';
import { Browser } from '@syncfusion/ej2-base';
import followIfLoginRedirect from '../api-authorization/followIfLoginRedirect';
import { AdminLayout } from '../AdminLayout';

export let data1 = [
    { x: 'Học kỳ 1, 2022-2023', y: 500, toolTipMappingName: 'Học kỳ 1, 2022-2023' },
    { x: 'Học kỳ 2, 2022-2023', y: 1000, toolTipMappingName: 'Học kỳ 2, 2022-2023' },
    { x: 'Học kỳ 1, 2023-2024', y: 800, toolTipMappingName: 'Học kỳ 1, 2023-2024' },
    { x: 'Học kỳ 2, 2023-2024', y: 700, toolTipMappingName: 'Học kỳ 2, 2023-2024' }
];
const SAMPLE_CSS = `
    .control-fluid {
		padding: 0px !important;
    }`;

const AdminIndex = () => {
    const loaded = (args) => {
        let chart = document.getElementById('charts');
        chart.setAttribute('title', '');
    };
    
    return (
        <AdminLayout>
            <div className='control-pane'>
                <style>{SAMPLE_CSS}</style>
                <div className='control-section'>
                    <ChartComponent
                        id='charts'
                        style={{ textAlign: "center" }}
                        legendSettings={{ enableHighlight: true }}
                        primaryXAxis={{ title: 'Đợt đăng ký', labelIntersectAction: Browser.isDevice ? 'None' : 'Trim', labelRotation: Browser.isDevice ? -45 : 0, valueType: 'Category', interval: 1, majorGridLines: { width: 0 }, majorTickLines: { width: 0 } }}
                        primaryYAxis={{ title: 'Học phí (trăm triệu)', majorTickLines: { width: 0 }, lineStyle: { width: 0 }, maximum: 2000, interval: 500 }}
                        chartArea={{ border: { width: 0 } }}
                        tooltip={{ enable: true, header: "<b>${point.tooltip}</b>", shared: true }}
                        width={Browser.isDevice ? '100%' : '75%'}
                        title='Học phí qua các đợt đăng ký'
                        loaded={loaded.bind(this)}>
                        <Inject services={[ColumnSeries, Legend, Tooltip, Category, DataLabel, Highlight]} />
                        <SeriesCollectionDirective>
                            <SeriesDirective dataSource={data1} tooltipMappingName='toolTipMappingName' xName='x' columnSpacing={0.1} yName='y' name='Học phí' type='Column' />
                        </SeriesCollectionDirective>
                    </ChartComponent>
                </div>
            </div>
        </AdminLayout>
    );    
}

export default AdminIndex;