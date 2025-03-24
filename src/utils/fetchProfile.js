import { useEffect, useState } from 'react';
import axios from 'axios';

function useFetchProfile() {
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");

    const fetchData = async () => {
      try {
        const response = await axios.get("http://127.0.0.1:8000/api/user", {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setUserData(response.data);
        console.log("User Data:", response.data);
      } catch (error) {
        console.error("Unauthorized request", error.response?.data);
      }
    };

    fetchData();
  }, []);

  return userData;
}

export default useFetchProfile;
