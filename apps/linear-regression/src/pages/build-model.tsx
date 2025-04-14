import React, { useEffect, useState } from "react";
import Plot from "react-plotly.js";
import { fetchCsvData } from "../utils/loader";
import { model, train } from "../utils/model";

const BuildModel: React.FC = () => {
    const [data, setData] = useState<any[]>([]);
    const [predictions, setPredictions] = useState<{w: number, b: number}>({w: Math.random(), b: Math.random()});

    useEffect(() => {
        const fetchData = async () => {
            setData(await fetchCsvData(
                "https://raw.githubusercontent.com/Davidportlouis/house_price_prediction/refs/heads/master/dataset/brooklyn.csv"));
        };

        fetchData();
    }, [data]);

    useEffect(() => {
        if (data.length === 0) return;

        const iterations = 10000;
        const alpha = 0.000001;

        const trainGenerator = train(data, iterations, predictions.w, predictions.b, alpha);
        let next = trainGenerator.next();
 
        while(next.done === false) {
            setPredictions(next.value);
            next = trainGenerator.next();
        }
    }, [data]);

    return (
        <div>
            <h1>Linear Regression Model</h1>
            <Plot
                data={[
                    {
                        x: data.map((x: any) => x.size_sqft),
                        y: data.map((x: any) => x.rent),
                        type: "scatter",
                        mode: "markers",
                        marker: { color: "blue" },
                        name: "Actual Data",
                    },
                    {
                        x: data.map((x: any) => x.size_sqft),
                        y: data.map((x: any) => model(x.size_sqft, predictions.w, predictions.b)),
                        type: "scatter",
                        mode: "lines",
                        line: { color: "red" },
                        name: "Regression Line",
                    },
                ]}
                layout={{
                    title: "Linear Regression Model",
                    xaxis: { title: "X" },
                    yaxis: { title: "Y" },
                }}
            />
        </div>
    );
};

export default BuildModel;
