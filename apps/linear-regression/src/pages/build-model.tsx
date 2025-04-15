import React, { useEffect, useRef, useState } from 'react';
import Plot from 'react-plotly.js';
import Plotly from 'plotly.js/dist/plotly.js';
import { fetchCsvData } from '../utils/loader';
import { model, train } from '../utils/model';
import { HousePriceInfoType } from '../types/housePriceInfo';

const BuildModel: React.FC = () => {
  const [data, setData] = useState<HousePriceInfoType[]>([]);
  const plotRef = useRef(null);

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
    const iterations = 3000;
    const alpha = 0.000001;
    const { min, max } = getMinMax(data);

    const trainGenerator = train(
      data,
      iterations,
      0,
      0,
      alpha
    );

    let next = trainGenerator.next();
    const indexes = [];

    while (next.done === false) {
      indexes.push(next.value.i);

      Plotly.addFrames(ref, [
        {
          name: 'model-training-frames-' + next.value.i,
          data: [
            null,
            {
              // eslint-disable-next-line no-loop-func
              y: [min, max].map((x: number) =>
                model(x, next.value.w, next.value.b)
              ),
              text: `Weights: ${next.value.w.toFixed(2)}<br />Bias: ${next.value.b.toFixed(2)}`,
              // line: { color: ['green', 'red', 'orange', 'blue'][Math.floor(Math.random() * 4)] },
            },
          ],
        },
      ]);

      next = trainGenerator.next();
    }

    Plotly.animate(
      ref,
      indexes.map((i) => 'model-training-frames-' + i),
      {
        frame: { duration: 2000, redraw: false },
        transition: { duration: 2000, easing: 'back-in-out' },
        mode: 'afterall',
      }
    );
  }, [data]);

  const { min, max } = getMinMax(data);

  return (
    <div style={{ width: '70vw', height: '70vh' }}>
      <h1>Linear Regression Model</h1>

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
            range: [min, max],
          },
          yaxis: {
            title: { text: 'price' },
            range: [0, 10000],
          },
        }}
        style={{ width: '100%', height: '100%' }}
      />
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

export default BuildModel;
