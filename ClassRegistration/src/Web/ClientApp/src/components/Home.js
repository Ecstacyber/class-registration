import React, { Component } from 'react';
import followIfLoginRedirect from './api-authorization/followIfLoginRedirect';
import { WeatherForecastsClient } from '../web-api-client.ts';
import { closest, isNullOrUndefined } from '@syncfusion/ej2-base';
import {
  GridComponent,
  ColumnsDirective,
  ColumnDirective,
  Filter,
  IFilter,
  Inject,
  Grid,
  VirtualScroll,
  Sort,
  SelectionType,
  Selection
} from '@syncfusion/ej2-react-grids';
import { Query, DataManager, UrlAdaptor } from '@syncfusion/ej2-data';
import '../scss/style.scss';
import '../components/admin/department/grid-overview.css';
import '../../node_modules/@syncfusion/ej2/bootstrap5.css';

export class Home extends Component {
  static displayName = Home.name;

  constructor(props) {
    super(props);
    this.state = { forecasts: [], loading: true };
  }

  componentDidMount() {
    this.populateWeatherData();
  }

  select = {
    persistSelection: true,
    type: "Multiple",
    checkboxOnly: true
  };

  static renderForecastsTable(forecasts) {
    return (
      <div>
        <div className='control-pane'>
          <div className='control-section'>
            <GridComponent dataSource={forecasts} height='350' allowSorting={true} allowSelection={true} selectionSettings={this.select}>
              <ColumnsDirective>
                <ColumnDirective type='checkbox' allowSorting={false} allowFiltering={false} width='60'></ColumnDirective>
                <ColumnDirective field='date' headerText='Date' width='120' format='dMy'></ColumnDirective>
                <ColumnDirective field='temperatureC' headerText='Temp. (C)' width='150'></ColumnDirective>
                <ColumnDirective field='temperatureF' headerText='Temp. (F)' width='130' />
                <ColumnDirective field='summary' headerText='Summary' width='120'/>
              </ColumnsDirective>
              <Inject services={[Sort]} />
            </GridComponent>
          </div>
        </div>
        <table className="table table-striped" aria-labelledby="tableLabel">
          <thead>
            <tr>
              <th>Date</th>
              <th>Temp. (C)</th>
              <th>Temp. (F)</th>
              <th>Summary</th>
            </tr>
          </thead>
          <tbody>
            {forecasts.map(forecast =>
              <tr key={forecast.date}>
                <td>{new Date(forecast.date).toLocaleDateString()}</td>
                <td>{forecast.temperatureC}</td>
                <td>{forecast.temperatureF}</td>
                <td>{forecast.summary}</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>     
    );
  }

  render() {
    let contents = this.state.loading
      ? <p><em>Loading...</em></p>
      : Home.renderForecastsTable(this.state.forecasts);

    return (
      <div>
        
        <h1>Hello, world!</h1>
        <p>Welcome to your new single-page application, built with:</p>
        <ul>
          <li><a href='https://get.asp.net/'>ASP.NET Core</a> and <a href='https://msdn.microsoft.com/en-us/library/67ef8sbd.aspx'>C#</a> for cross-platform server-side code</li>
          <li><a href='https://facebook.github.io/react/'>React</a> for client-side code</li>
          <li><a href='http://getbootstrap.com/'>Bootstrap</a> for layout and styling</li>
        </ul>
        <p>To help you get started, we have also set up:</p>
        <ul>
          <li><strong>Client-side navigation</strong>. For example, click <em>Counter</em> then <em>Back</em> to return here.</li>
          <li><strong>Development server integration</strong>. In development mode, the development server from <code>create-react-app</code> runs in the background automatically, so your client-side resources are dynamically built on demand and the page refreshes when you modify any file.</li>
          <li><strong>Efficient production builds</strong>. In production mode, development-time features are disabled, and your <code>dotnet publish</code> configuration produces minified, efficiently bundled JavaScript files.</li>
        </ul>
        <p>The <code>ClientApp</code> subdirectory is a standard React application based on the <code>create-react-app</code> template. If you open a command prompt in that directory, you can run <code>npm</code> commands such as <code>npm test</code> or <code>npm install</code>.</p>               
        <h1 id="tableLabel">Weather forecast</h1>
        <p>This component demonstrates fetching data from the server.</p>
        {contents}
      </div>
    );
  }

  async populateWeatherData() {
    let client = new WeatherForecastsClient();
    const data = await client.getWeatherForecasts();
    this.setState({ forecasts: data, loading: false });
  }

  async populateWeatherDataOld() {
    const response = await fetch('weatherforecast');
    followIfLoginRedirect(response);
    const data = await response.json();
    this.setState({ forecasts: data, loading: false });
  }
}
