const BASE_URL = "http://128.199.126.171/~goldorg";

export const fetchClient = async (endpoint, options = {}) => {
  try {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      headers: {
        "Content-Type": "application/json",
        ...(options.headers || {}),
      },
      ...options,
    });

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("FetchClient Error:", error);
    throw error;
  }
};
