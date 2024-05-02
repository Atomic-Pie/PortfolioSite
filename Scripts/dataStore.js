class DataStore {
    constructor() {
        this.data = null; // This will hold the fetched data
    }

    async fetchData() {
        if (this.data) return this.data; // Return cached data if it exists

        try {
            const response = await fetch('sections.json');
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            this.data = await response.json();
            return this.data;
        } catch (error) {
            console.error('Failed to fetch data:', error);
            throw error;
        }
    }
}

// Create a singleton instance of DataStore
export const dataStore = new DataStore();
