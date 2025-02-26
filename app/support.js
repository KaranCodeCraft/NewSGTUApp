import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { Picker } from "@react-native-picker/picker";

export default function Support() {
  const [formData, setFormData] = useState({
    fullName: "",
    emailAddress: "",
    phoneNumber: "",
    subject: "General Inquiry",
    message: "",
    address: "",
  });
  const [file, setFile] = useState(null);

  const handleChange = (name, value) => {
    setFormData({ ...formData, [name]: value });
  };

  const pickFile = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      setFile(result.assets[0]); // Stores selected file
    }
  };

  const handleSubmit = async () => {
    const formdata = new FormData();
    formdata.append("fullName", formData.fullName);
    formdata.append("emailAddress", formData.emailAddress);
    formdata.append("phoneNumber", formData.phoneNumber);
    formdata.append("subject", formData.subject);
    formdata.append("message", formData.message);
    formdata.append("address", formData.address);

    if (file) {
      formdata.append("attachment", {
        uri: file.uri,
        name: file.fileName || "upload.jpg",
        type: file.mimeType || "image/jpeg",
      });
    }

    try {
      const response = await fetch("https://api.igcsm.online/api/enquiry", {
        method: "POST",
        body: formdata,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      const result = await response.text();
      console.log(result);
      Alert.alert("Success", "Enquiry submitted successfully!");
    } catch (error) {
      console.error("Error:", error);
      Alert.alert("Error", "Failed to submit enquiry.");
    }
  };

  return (
    <View className="flex-1 p-6 pt-12 bg-gray-100">
      <Text className="text-4xl font-bold underline text-center mb-12">
        Help Desk Request Form
      </Text>
      <TextInput
        className="text-xl w-full p-3 bg-white rounded-lg border border-gray-300 mb-6"
        placeholder="Full Name"
        onChangeText={(text) => handleChange("fullName", text)}
      />
      <TextInput
        className="text-xl w-full p-3 bg-white rounded-lg border border-gray-300 mb-6"
        placeholder="Email Address"
        keyboardType="email-address"
        onChangeText={(text) => handleChange("emailAddress", text)}
      />
      <TextInput
        className="text-xl w-full p-3 bg-white rounded-lg border border-gray-300 mb-6"
        placeholder="Mobile Number"
        keyboardType="phone-pad"
        onChangeText={(text) => handleChange("phoneNumber", text)}
      />
      <View className="w-full bg-white rounded-lg border border-gray-300 mb-3">
        <Picker
          selectedValue={formData.subject}
          onValueChange={(itemValue) => handleChange("subject", itemValue)}
        >
          <Picker.Item label="General Inquiry" value="General Inquiry" />
          <Picker.Item label="Support Request" value="Support Request" />
          <Picker.Item label="Billing Issue" value="Billing Issue" />
          <Picker.Item label="Technical Problem" value="Technical Problem" />
        </Picker>
      </View>
      <TextInput
        className="w-full p-3 bg-white rounded-lg border border-gray-300 mb-3 h-32"
        placeholder="Message"
        multiline
        textAlignVertical="top"
        onChangeText={(text) => handleChange("message", text)}
      />
      <TextInput
        className="text-xl w-full p-3 bg-white rounded-lg border border-gray-300 mb-6"
        placeholder="State"
        onChangeText={(text) => handleChange("address", text)}
      />

      <TouchableOpacity
        className="w-full bg-blue-600 p-3 rounded-lg mb-6"
        onPress={pickFile}
      >
        <Text className="text-white text-center font-semibold">
          {file ? "File Selected" : "Select File"}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        className="w-full bg-green-600 p-3 rounded-lg"
        onPress={handleSubmit}
      >
        <Text className="text-white text-center font-semibold">Submit</Text>
      </TouchableOpacity>
    </View>
  );
}
