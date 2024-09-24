export function normalizeHospitalData(data) {
  const { listData, mapData } = data;

  // Helper function to transform and get hospitals from different structures
  const getHospitals = (dataObject) => {
    if (!dataObject) return [];

    // Check for different data structures and return hospitals
    if (Array.isArray(dataObject.data?.hospitals)) {
      // If dataObject already has hospitals array, return it
      return dataObject.data.hospitals;
    } else if (Array.isArray(dataObject.data?.data)) {
      // Transform the structure from data.data to data.hospitals
      dataObject.data.hospitals = dataObject.data.data;
      delete dataObject.data.data; // Remove the old 'data' key
      return dataObject.data.hospitals;
    }

    // Default to an empty array if no valid structure is found
    return [];
  };

  // Normalize listData and mapData
  const normalizedList = getHospitals(listData);
  const normalizedMap = getHospitals(mapData);

  return {
    list: normalizedList,
    map: normalizedMap,
  };
}
