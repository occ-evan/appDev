import { View, Text } from "react-native";
import React from "react";
import { useAuth } from "@/contexts/auth-context";

export default function Home() {
  const { user } = useAuth();

  return (
    <View>
      <Text>Name: {user?.name}</Text>
      <Text>Email: {user?.email}</Text>
    </View>
  );
}
