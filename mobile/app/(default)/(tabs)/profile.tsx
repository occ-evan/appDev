import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import { useAuth } from "@/contexts/auth-context";

export default function Profile() {
  const { logout } = useAuth();

  return (
    <View>
      <TouchableOpacity
        onPress={logout}
        className="h-12 rounded-full bg-blue-500 items-center justify-center"
      >
        <Text className="text-white font-bold">Logout</Text>
      </TouchableOpacity>
      <TouchableOpacity 
        onPress={() => navigation.navigate('../(pages)/home/createBlog')}
        className="h-12 rounded-full bg-blue-500 items-center justify-center mt-5"
      >
        <Text className="text-white ">Create blog</Text>
      </TouchableOpacity>
    </View>
  );
}
