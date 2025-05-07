/**
 * Represents a data point with a feature and a target value.
 *
 * @template T The type of the data point
 * @property feature The feature value
 * @property target The target value
 */
export type OneFeatureType = {
    feature: number;
    target: number;
};
/**
 * Calculates the mean squared error (cost) for the linear regression model.
 *
 * @param data An array of data points with features and targets
 * @param w Current weight parameter
 * @param b Current bias parameter
 * @returns The mean squared error cost
 */
export declare function cost<T extends OneFeatureType>(data: T[], w: number, b: number): number;
/**
 * Calculates the predicted value using the linear regression model equation.
 *
 * @param x Input feature value
 * @param w Weight parameter
 * @param b Bias parameter
 * @returns Predicted target value
 */
export declare function model(x: number, w: number, b: number): number;
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
export declare function train<T extends OneFeatureType>(data: T[], iterations: number, w?: number, b?: number, alpha?: number): Generator<{
    w: number;
    b: number;
    squaredCost: number;
    i: number;
}>;
//# sourceMappingURL=model.d.ts.map