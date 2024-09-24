import axios from 'axios';

const API_BASE_URL = 'https://osunhospitals.onrender.com/api/v1';

export const searchHospitals = async ({
  lat,
  lng,
  lga,
  radius = 20,
  page = 1,
  limit = 10,
  mapLimit = 1000,
}) => {
  if (!API_BASE_URL) {
    throw new Error('API base URL is not set');
  }

  let url = `${API_BASE_URL}/hospitals`;
  const params = new URLSearchParams();

  // Use the latitude and longitude if provided
  if (lat && lng) {
    url = `${API_BASE_URL}/hospitals/hospital-nearby/${radius}/center/${lat},${lng}/unit/km`;
  }
  // If LGA is provided, use LGA-based search
  else if (lga) {
    params.append('lga', lga);
  }
  // If neither coordinates nor LGA are provided, throw an error
  else {
    throw new Error('Either lat/lng or LGA must be provided');
  }

  // Always append page and limit for pagination
  params.append('page', page);
  params.append('limit', limit);

  // For map view, we want all hospitals without pagination
  const mapParams = new URLSearchParams(params);
  mapParams.set('limit', mapLimit);
  mapParams.set('page', 1); // Always get the first page for map data

  try {
    console.log('Making API call to:', url); // Log the API URL
    console.log('With Parameters:', params.toString()); // Log the parameters

    const [listResponse, mapResponse] = await Promise.all([
      axios.get(`${url}?${params}`),
      axios.get(`${url}?${mapParams}`),
    ]);

    // Log the full API response for debugging
    console.log('List Response:', listResponse.data);
    console.log('Map Response:', mapResponse.data);

    // Ensure the response data has the expected structure
    const listData = listResponse.data?.data?.hospitals
      ? listResponse.data
      : { data: { hospitals: [] }, ...listResponse.data };

    const mapData = mapResponse.data?.data?.hospitals
      ? mapResponse.data
      : { data: { hospitals: [] }, ...mapResponse.data };

    return {
      listData,
      mapData,
    };
  } catch (error) {
    console.error('Error fetching hospitals:', error);
    if (axios.isAxiosError(error)) {
      // Handle Axios errors
      const errorMessage = error.response?.data?.message || error.message;
      console.error('API Error Message:', errorMessage); // Log the API error message
      throw new Error(`Failed to fetch hospitals: ${errorMessage}`);
    }
    throw error;
  }
};
