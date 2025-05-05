import Papa from 'papaparse';
import { LocalStorageUtil } from './cache.js';

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
export async function fetchData(url: string): Promise<string> {
    // Check if data is already cached
    const cachedData = LocalStorageUtil.read(url);

    if (cachedData) {
        return cachedData;
    }

    try {
        // Fetch data from the URL
        const response = await fetch(url);

        // Check if the response is successful
        if (!response.ok) {
            throw new Error(
                `Failed to fetch data from URL: ${response.statusText}`
            );
        }

        // Get the text data
        const data = await response.text();

        // Cache and return the data
        return LocalStorageUtil.write(url, data);
    } catch (error) {
        console.error('Error fetching data:', error);
        throw error;
    }
}

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
export async function fetchCsvData(
    url: string
): Promise<Record<string, unknown>[]> {
    return new Promise((resolve, reject) => {
        fetchData(url)
            .then((data: string) => {
                // Parse CSV using Papa Parse with header and dynamic typing
                Papa.parse<Record<string, unknown>>(data, {
                    header: true,
                    dynamicTyping: true,
                    complete: (results: Papa.ParseResult<Record<string, unknown>>) => {
                        resolve(results.data);
                    },
                });
            })
            .catch((error) => {
                console.error('Error fetching CSV data:', error);
                reject(error);
            });
    });
}
