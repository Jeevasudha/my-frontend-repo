const apiUrl = process.env.REACT_APP_API_URL;

export const fetchData = async () => {
  try {
    const response = await fetch('${apiUrl}/endpoint');
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching data:', error);
    throw error;
  }
};