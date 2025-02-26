import {
  View,
  Text,
  TextInput,
  Alert,
  TouchableOpacity,
  Image,
  ActivityIndicator,
} from "react-native";
import React, { useContext, useState } from "react";
import { useRouter } from "expo-router";
import ApiContext from "@/context/ApiContext";
import * as SecureStore from "expo-secure-store";
import { useFocusEffect } from "@react-navigation/native";
import axios from "axios";

const Login = () => {
  const { setUser, url, verifyToken, setToken, setId } = useContext(ApiContext); 
  const [aadharNumber, setaadharNumber] = useState("");
  const [enrollmentNumber, setEnrollmentNumber] = useState(""); 
  const [isVerifying, setIsVerifying] = useState(true); 
  const router = useRouter(); 
  const [logging, setLogging] = useState(false)

 
  const handleLogin = async () => {
    if (!aadharNumber || !enrollmentNumber) {
      return Alert.alert("Please fill all the fields"); 
    }
    setLogging(true)
    try {
   
      const response = await axios.post(`${url}student/login`, {
        enrollmentNumber,
        aadharNumber: Number(aadharNumber),
      });
      await SecureStore.setItemAsync("token", JSON.stringify(response.data.token));
      await SecureStore.setItemAsync("id", JSON.stringify(response.data.id));
      setToken(response.data.token.replace(/^"|"$/g, ""));
      setId(response.data.id);
      
      setUser(response.data.data);

    
      Alert.alert(`Login Successful: ${response.data.name}`);
      setLogging(false)
     
      router.replace("/home");
    } catch (error) {
     
      if (error.response) {
        Alert.alert(error.response.data.message); 
      } else {
        Alert.alert("Something went wrong. Please try again."); 
      }
    }finally{
      setLogging(false);
    }
  };

 
  useFocusEffect(
    React.useCallback(() => {
     
      const checkToken = async () => {
        try {
          const token = await SecureStore.getItemAsync("token");
          if (!token) {
            setIsVerifying(false);
            return;
          }
          const isValid = await verifyToken(token);
          if (isValid) {
            router.replace("/home"); 
          }
        } catch (error) {
          
        } finally {
          setIsVerifying(false); 
        }
      };

      checkToken(); 
    }, [router, verifyToken]) 
  );

  if (isVerifying) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text style={{ fontSize: 18, marginTop: 20 }}>Verifying...</Text>
      </View>
    );
  }

 
  return (
    <View className="flex-1 justify-center items-center bg-gray-100 p-6">
      <View className="h-48 w-48 bg-white rounded-full overflow-hidden justify-center items-center mb-6">
        <Image
          source={require("@/Assets/logo.png")} 
          className="h-full w-10/12 bg-inherit"
          resizeMode="cover"
        />
      </View>
      <Text className="text-blue-600 font-bold text-2xl mb-4">Login Page</Text>
      <TextInput
        placeholder="Aadhar Number"
        className="w-4/5 h-14 border border-gray-700 mb-6 px-4 rounded-lg bg-white shadow"
        onChangeText={setaadharNumber}
        value={aadharNumber}
        keyboardType="number-pad"
      />
      <TextInput
        placeholder="Enrollment Number"
        className="w-4/5 h-14 border border-gray-700 mb-4 px-4 rounded-lg bg-white shadow"
        onChangeText={setEnrollmentNumber} 
        value={enrollmentNumber}
      />
      <TouchableOpacity
        className="w-4/5 mt-8 flex justify-center items-center bg-orange-400 py-3 px-6 rounded-lg"
        onPress={handleLogin} 
        disabled={logging}
      >
        <Text className="text-white font-bold text-lg">
          {logging ? "logging In" : "Login"}
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        className="w-4/5 mt-6 flex justify-center items-center bg-blue-500 py-3 px-6 rounded-lg"
        onPress={() => router.push("/signup")} 
        disabled={logging}
      >
        <Text className="text-white font-bold text-lg">Register</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Login;
