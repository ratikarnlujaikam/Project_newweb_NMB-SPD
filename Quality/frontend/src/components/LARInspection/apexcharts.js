// BarChart.js
import React from 'react';
import Chart from 'react-apexcharts';
import { useHistory } from 'react-router-dom';

const BarChart = () => {
    const history = useHistory();

    const chartOptions = {
        chart: {
            type: 'bar',
            events: {
                dataPointSelection: (event, chartContext, config) => {
                    // ค่าตัวแปรที่ต้องการส่งไปด้วย
                    const category = chartOptions.xaxis.categories[config.dataPointIndex];
                    const value = chartSeries[0].data[config.dataPointIndex];
                    const seriesName = chartSeries[0].name;
                    history.push(`/Yield_Monitoring_By_Team?category=${category}&value=${value}&series=${seriesName}`);
                }
            }
        },
        xaxis: {
            categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
        }
    };

    const chartSeries = [{
        name: 'series-1',
        data: [30, 40, 45, 50, 49, 60]
    }];

    return (
        <div>
            <Chart
                options={chartOptions}
                series={chartSeries}
                type="bar"
                height="350"
            />
        </div>
    );
};

export default BarChart;
