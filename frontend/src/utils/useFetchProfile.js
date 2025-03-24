import { useEffect, useState } from 'react';
import axios from 'axios';

function useFetchProfile() {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    console.log("token:")
    console.log(token)
    if (!token) {
      
      setLoading(false); // <== завершити, якщо токена немає
      return;
    }

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
        setUserData(null)
        console.error("Unauthorized request", error.response?.data);
      } finally{
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return {userData,loading};
}

export default useFetchProfile;
