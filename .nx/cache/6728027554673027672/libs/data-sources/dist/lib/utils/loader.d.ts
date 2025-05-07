/**
 * Fetches data from a URL and returns it as a string.
 *
 * The method will cache the result using the `LocalStorageUtil` so that
 * subsequent calls with the same URL will not trigger a network request.
 *
 * @param url The URL of the CSV data.
 * @returns A promise that resolves to the data or rejects with an error if the
 * fetching fails.
 */
export declare function fetchData(url: string): Promise<string>;
/**
 * Fetches data from a CSV URL and returns it as an array of objects.
 *
 * The method will cache the result using the `LocalStorageUtil` so that
 * subsequent calls with the same URL will not trigger a network request.
 *
 * The method will also attempt to parse the CSV data and return an array of
 * objects if successful. If the parsing fails, the method will throw an error.
 *
 * @param url The URL of the CSV data.
 * @returns A promise that resolves to an array of objects or rejects with an
 * error if the parsing fails.
 */
export declare function fetchCsvData(url: string): Promise<Record<string, unknown>[]>;
//# sourceMappingURL=loader.d.ts.map