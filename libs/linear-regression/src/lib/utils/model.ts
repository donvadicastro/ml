/**
 * Represents a data point with a feature and a target value.
 * 
 * @template T The type of the data point
 * @property feature The feature value
 * @property target The target value
 */
export type OneFeatureType = { feature: number; target: number };

/**
 * Calculates the gradient for linear regression using the current weights and bias.
 * 
 * @param data An array of data points with features and targets
 * @param w Current weight parameter
 * @param b Current bias parameter
 * @returns An object containing the gradients for weight (dj_dw) and bias (dj_db)
 */
function gradient<T extends OneFeatureType>(data: T[], w: number, b: number) {
    let dj_dw = 0.0;
    let dj_db = 0.0;

    // Filter out negative values and calculate gradient for each data point
    data.filter((x) => x.target >= 0 && x.feature >= 0).forEach((x) => {
        const value = model(x.feature, w, b);

        dj_dw += (value - x.target) * x.feature;
        dj_db += value - x.target;
    });

    // Average the gradients
    dj_dw = dj_dw / data.length;
    dj_db = dj_db / data.length;

    return { dj_dw, dj_db };
}

/**
 * Calculates the mean squared error (cost) for the linear regression model.
 * 
 * @param data An array of data points with features and targets
 * @param w Current weight parameter
 * @param b Current bias parameter
 * @returns The mean squared error cost
 */
export function cost<T extends OneFeatureType>(data: T[], w: number, b: number) {
    // Filter out negative values and calculate squared error for each data point
    return data.filter(x => x.target >= 0 && x.feature >= 0).reduce(
        (sum, current) =>
            (sum +
                (model(current.feature, w, b) - current.target) ** 2),
        0
    ) / (2 * data.length);
}

/**
 * Calculates the predicted value using the linear regression model equation.
 * 
 * @param x Input feature value
 * @param w Weight parameter
 * @param b Bias parameter
 * @returns Predicted target value
 */
export function model(x: number, w: number, b: number) {
    return x * w + b;
}

/**
 * Generator function for training a linear regression model using gradient descent.
 * 
 * @param data An array of data points with features and targets
 * @param iterations Number of training iterations
 * @param w Initial weight parameter (random if not specified)
 * @param b Initial bias parameter (random if not specified)
 * @param alpha Learning rate for gradient descent
 * @yields Intermediate training results every 1000 iterations
 * @returns A generator that provides model parameters and cost during training
 */
export function* train<T extends OneFeatureType>(
    data: T[],
    iterations: number,
    w: number = Math.random(),
    b: number = Math.random(),
    alpha = 0.000001
): Generator<{ w: number; b: number; squaredCost: number; i: number }> {
    for (let i = 0; i < iterations; i++) {
        // Calculate gradients
        const { dj_dw, dj_db } = gradient(data, w, b);

        // Update weights and bias using gradient descent
        w -= alpha * dj_dw;
        b -= alpha * dj_db;

        // Yield intermediate results every 1000 iterations
        if (i % 1000 === 0) {
            const squaredCost = cost(data, w, b);
            yield { w, b, squaredCost, i };
        }
    }

    return { w, b, i: iterations };
}
