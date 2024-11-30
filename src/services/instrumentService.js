import axios from 'axios';

const API_URL = 'http://localhost:5000/api/instruments'; // Adjust the endpoint as needed

export const fetchInstruments = async () => {
    const response = await axios.get(API_URL);
    return response.data; // Assuming your backend returns the instrument data
};

export const fetchInstrumentById = async (id) => {
    const response = await axios.get(`${API_URL}/${id}`);
    return response.data; // Assuming your backend returns the instrument data by id
};
