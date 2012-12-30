//This program is free software: you can redistribute it and/or modify
//'    it under the terms of the GNU General Public License as published by
//'    the Free Software Foundation, either version 3 of the License, or
//'    (at your option) any later version.

//'    This program is distributed in the hope that it will be useful,
//'    but WITHOUT ANY WARRANTY; without even the implied warranty of
//'    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
//'    GNU General Public License for more details.

//'    You should have received a copy of the GNU General Public License
//'    along with this program.  If not, see <http://www.gnu.org/licenses/>.


// Load the Visualization API and the piechart package.
google.load('visualization', '1.0', { 'packages': ['corechart'] });
google.load('visualization', '1', { packages: ['table'] });
// Set a callback to run when the Google Visualization API is loaded.
// Don't mind about this part
google.setOnLoadCallback(drawCharts);

// Callback that creates and populates a data table,
// instantiates the pie chart, passes in the data and
// draws it.
function drawCharts() {
    // Create the data table.
    var data = new google.visualization.DataTable();
    //Add the two column
    data.addColumn('date', 'Date');
    data.addColumn('number', 'Value');
    //Get Today Date
    var today = new Date();
    //Set all the time values to 0, !IMPORTANT else grouping does not work
    today.setMilliseconds(0);
    today.setSeconds(0);
    today.getMinutes(0);
    today.getHours(0);
    //Add records with dates manually with value = 0
    //20 days added from today
    for (var i = 0; i < 20; i++) {
        var currentDate = new Date();
        //Set all the time values to 0, !IMPORTANT else grouping does not work
        currentDate.setMilliseconds(0);
        currentDate.setSeconds(0);
        currentDate.getMinutes(0);
        currentDate.getHours(0);
        currentDate.setDate(today.getDate() + i);
        data.addRow([currentDate, 0]);
    }
    //Add 50 records randomly with value - random Date [0..30]
    for (var j = 0; j < 50; j++) {
        //Set a random date between today (0) to 30 days more (31)
        var randomNbDays = Math.floor(Math.random() * 31);
        //Set a random value
        var randomValue = Math.floor(Math.random() * 501);
        //Create the random value
        var randomDate = new Date();
        //Set all the time values to 0, !IMPORTANT else grouping does not work
        randomDate.setMilliseconds(0);
        randomDate.setSeconds(0);
        randomDate.getMinutes(0);
        randomDate.getHours(0);
        randomDate.setDate(today.getDate() + randomNbDays);
        //Add the record
        data.addRow([randomDate, randomValue]);
    }
    //Group the data on date
    var grouped_data = google.visualization.data.group(data, [0],
					[{ 'column': 1, 'aggregation': google.visualization.data.sum, 'type': 'number'}]);
    // Instantiate and draw a table to check data
    var table = new google.visualization.Table(document.getElementById('divChartTable'));
    table.draw(grouped_data, { showRowNumber: false });
    // Instantiate and draw our charts, passing in some options.
    // Set chart options - Line
    var options = { 'title': 'Graph Line - Data Group and Empty Data on Dates',
        'height': 300
    };
    var chart = new google.visualization.LineChart(document.getElementById('divChartLine'));
    chart.draw(grouped_data, options);
    // Set chart options 2 - Column
    var options2 = { 'title': 'Graph Column - Data Group and Empty Data on Dates',
        'height': 300
    };
    var chart2 = new google.visualization.ColumnChart(document.getElementById('divChartColumn'));
    chart2.draw(grouped_data, options2);
}
