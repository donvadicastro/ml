export class LocalStorageUtil {
    static read(key: string): string | null {
        const localStorage = (window as any).localStorage;
        return localStorage.getItem(key);
    }

    static write(key: string, value: string): string {
        const localStorage = (window as any).localStorage;
        localStorage.setItem(key, value);

        return value;
    }

    static remove(key: string): void {
        localStorage.removeItem(key);
    }
}
