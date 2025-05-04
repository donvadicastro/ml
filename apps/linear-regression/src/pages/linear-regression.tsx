import React, { useEffect, useRef, useState } from 'react';
import Plot from 'react-plotly.js';
import Plotly from 'plotly.js/dist/plotly.js';
import { fetchCsvData } from '../utils/loader';
import { model, train } from '../utils/model';
import { HousePriceInfoType } from '../types/housePriceInfo';

const LinearRegression: React.FC = () => {
    const [data, setData] = useState<HousePriceInfoType[]>([]);

    const plotRef = useRef(null);
    const plotCostRef = useRef(null);

    useEffect(() => {
        const fetchData = async () => {
            setData(
                await fetchCsvData(
                    'https://raw.githubusercontent.com/Davidportlouis/house_price_prediction/refs/heads/master/dataset/brooklyn.csv'
                )
            );
        };

        fetchData();
    }, []);

    useEffect(() => {
        if (data.length === 0 || !plotRef.current) return;

        const ref = (plotRef.current as Plotly.PlotlyHTMLElement).el;
        const costRef = (plotCostRef.current as Plotly.PlotlyHTMLElement).el;

        const iterations = 100000;
        const alpha = 0.00000000005;
        const { min, max } = getMinMax(data);
        const history: { w: number; b: number; squaredCost: number; i: number }[] = [];

        const trainGenerator = train(data, iterations, 0, 0, alpha);

        let next = trainGenerator.next();

        while (next.done === false) {
            const value = next.value;
            history.push(value);

            Plotly.addFrames(ref, [
                {
                    name: 'model-training-frames-' + value.i,
                    data: [
                        null,
                        {
                            // eslint-disable-next-line no-loop-func
                            y: [min, max].map((x: number) =>
                                model(x, value.w, value.b)
                            ),
                            text: `Weights: ${value.w.toFixed(2)}<br />Bias: ${value.b.toFixed(2)}`,
                        },
                    ],
                },
            ]);

            Plotly.addFrames(costRef, [
                {
                    name: 'model-training-cost-' + value.i,
                    data: [
                        {
                            x: history.map((i) => i.w),
                            y: history.map((i) => i.squaredCost)
                        },
                    ],
                    layout: {
                        annotations: [
                            {
                              x: history[history.length - 1].w,
                              y: history[history.length - 1].squaredCost,
                              text: `Cost: ${history[history.length - 1].squaredCost.toFixed(2)}<br />Iterations: ${history[history.length - 1].i / 1000} / 100`,
                              arrowhead: 2,
                            }
                          ]
                    },
                },
            ]);

            next = trainGenerator.next();
        }

        Plotly.animate(
            ref,
            history.map((i) => 'model-training-frames-' + i.i),
            {
                frame: { duration: 200, redraw: false },
                transition: { duration: 200, easing: 'back-in-out' },
                mode: 'afterall',
            }
        );

        Plotly.animate(
            costRef,
            history.map((i) => 'model-training-cost-' + i.i),
            {
                frame: { duration: 200, redraw: true },
                transition: { duration: 200, easing: 'back-in-out' },
                mode: 'afterall',
            }
        );
    }, [data]);

    const { min, max } = getMinMax(data);

    return (
        <div>
            <h1>Linear Regression Model</h1>
            <div style={{ display: 'flex' }}>
                <Plot
                    ref={plotRef}
                    data={[
                        {
                            x: data.map((x: HousePriceInfoType) => x.size_sqft),
                            y: data.map((x: HousePriceInfoType) => x.rent),
                            type: 'scatter',
                            mode: 'markers',
                            marker: { color: 'blue' },
                            name: 'Actual Data',
                        },
                        {
                            x: [min, max],
                            y: [0, 0],
                            type: 'scatter',
                            mode: 'lines',
                            line: { color: 'red', width: 5 },
                            name: 'Regression Line',
                        },
                    ]}
                    layout={{
                        title: { text: 'House rent prices' },
                        xaxis: {
                            title: { text: 'size_sqft' },
                        },
                        yaxis: {
                            title: { text: 'price' },
                        },
                    }}
                    style={{ width: '100%', height: '100%' }}
                    config={{
                        modeBarButtonsToRemove: [
                            'zoom2d',
                            'zoomIn2d',
                            'zoomOut2d',
                            'autoScale2d',
                            'resetScale2d',
                            'pan2d',
                            'select2d',
                            'lasso2d',
                        ],
                    }}
                />

                <Plot
                    ref={plotCostRef}
                    data={[
                        {
                            x: [0],
                            y: [0],
                            type: 'scatter',
                            mode: 'lines+markers',
                            marker: { size: 10, color: 'red' },
                            line: { color: 'blue', width: 2 },
                            name: 'Squared Error',
                        },
                    ]}
                    layout={{
                        title: { text: 'Squared Error' },
                        xaxis: {
                            title: { text: 'weight' },
                        },
                        yaxis: {
                            title: { text: 'error' },
                        },
                    }}
                    style={{ width: '100%', height: '100%' }}
                    config={{
                        modeBarButtonsToRemove: [
                            'zoom2d',
                            'zoomIn2d',
                            'zoomOut2d',
                            'autoScale2d',
                            'resetScale2d',
                            'pan2d',
                            'select2d',
                            'lasso2d',
                        ],
                    }}
                />
            </div>
        </div>
    );
};

function getMinMax(data: HousePriceInfoType[]) {
    const size_sqft = data
        .filter((x) => typeof x.size_sqft === 'number')
        .map((x) => x.size_sqft);

    const min = Math.min(...size_sqft);
    const max = Math.max(...size_sqft);

    return { min, max };
}

export default LinearRegression;
