import { useState } from "react";
import ApiContext from "./ApiContext";
import axios from "axios";
import * as SecureStore from "expo-secure-store";

const ApiState = (props) => {
  const url = "https://api.sikkimglobaltechnicaluniversity.co.in/";
  // const url = "http://192.168.1.100:5005/";
  const [user, setUser] = useState("");
  const [token, setToken] = useState(null)
  const [id, setId] = useState(null)
  const [notification, setNotification] = useState([])

  async function verifyToken(oldtken) {
    try {  
      const response = await axios.get(`${url}verifyToken`, {
        headers: {
          Authorization: `Bearer ${oldtken}`,
        },
      });
      const ntkn = response.data.user.id
      setId(ntkn);
      // setUser(response.data.user)
      await SecureStore.setItemAsync("id", JSON.stringify(ntkn));
      const newdata = await axios.post(`${url}student/login`, {
        enrollmentNumber: response.data.user.enrollmentNumber,
        aadharNumber: response.data.user.aadharNumber,
      });
      setUser(newdata.data.data);
      return true
    } catch (error) {
      console.error("Error verifying token:", error);
      return false;
    }
  }
  
  async function fetchnotifcation(){
    try {
      const response = await axios.get(`${url}notification`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setNotification(response.data.notifications);
    } catch (error) {
      console.log("Error fetching Notification", error);
    }
  }

  return (
    <ApiContext.Provider
      value={{
        url,
        token,
        user,
        setUser,
        verifyToken,
        notification,
        setToken,
        fetchnotifcation,
        id,
        setId,
      }}
    >
      {props.children}
    </ApiContext.Provider>
  );
};

export default ApiState;
