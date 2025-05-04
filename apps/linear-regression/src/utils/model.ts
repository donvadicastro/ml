import { HousePriceInfoType } from '../types/housePriceInfo';

function gradient(data: HousePriceInfoType[], w: number, b: number) {
    let dj_dw = 0.0;
    let dj_db = 0.0;

    data.filter((x) => x.rent >= 0 && x.size_sqft >= 0).forEach((x) => {
        const value = model(x.size_sqft, w, b);

        dj_dw += (value - x.rent) * x.size_sqft;
        dj_db += value - x.rent;
    });

    dj_dw = dj_dw / data.length;
    dj_db = dj_db / data.length;

    return { dj_dw, dj_db };
}

export function cost(data: HousePriceInfoType[], w: number, b: number) {
    return data.filter(x => x.rent >= 0 && x.size_sqft >= 0).reduce(
        (sum, current) =>
            (sum +
                (model(current.size_sqft, w, b) - current.rent) ** 2),
        0
    ) / (2 * data.length);
}

export function model(x: number, w: number, b: number) {
    return x * w + b;
}

export function* train(
    data: HousePriceInfoType[],
    iterations: number,
    w: number = Math.random(),
    b: number = Math.random(),
    alpha = 0.000001
): Generator<{ w: number; b: number; squaredCost: number; i: number }> {
    for (let i = 0; i < iterations; i++) {
        const { dj_dw, dj_db } = gradient(data, w, b);

        w -= alpha * dj_dw;
        b -= alpha * dj_db;

        if (i % 1000 === 0) {
            const squaredCost = cost(data, w, b);
            yield { w, b, squaredCost, i };
        }
    }

    return { w, b, i: iterations };
}
