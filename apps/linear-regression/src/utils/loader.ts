import Papa from 'papaparse';

export async function fetchData(url: string, transformer?: (data: any) => Promise<any>): Promise<any> {
    const cachedData = localStorage.getItem(url);

    if (cachedData) {
        try {
            return JSON.parse(cachedData);
        } catch (error) {
            console.error("Failed to parse cached data:", error);
        }
    }

    try {
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(`Failed to fetch data from URL: ${response.statusText}`);
        }

        const data = await response.text();
        localStorage.setItem(url, JSON.stringify(transformer ? await transformer(data) : data));

        return data;
    } catch (error) {
        console.error("Error fetching data:", error);
        throw error;
    }
}

export async function fetchCsvData(url: string): Promise<any[]> {
    return fetchData(url, (csvData: string) => new Promise((resolve, reject) => {
        Papa.parse(csvData, {
            header: true,
            dynamicTyping: true,
            complete: function (results) {
                resolve(results.data);
            },
            error: function (error) {
                console.error("Error parsing CSV:", error);
                reject(error);
            }
        })
    }));
}