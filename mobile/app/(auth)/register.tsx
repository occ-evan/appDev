import { useAuth } from "@/contexts/auth-context";
import { useState } from "react";
import { View, Text, TextInput, TouchableOpacity } from "react-native";

export default function Register() {
  const { register } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [password_confirmation, setPasswordConfirmation] = useState("");

  const handleLogin = () => {
    register({ name, email, password, password_confirmation });
  };

  return (
    <View className="flex-1 items-center justify-center p-4">
      <View className="bg-white shadow-md p-4 w-full gap-4">
        <Text className="text-xl font-bold text-center">register</Text>
        <TextInput
          value={name}
          onChangeText={setName}
          className="h-12 px-4 border"
          placeholder="Enter your name"
        />
        <TextInput
          value={email}
          onChangeText={setEmail}
          className="h-12 px-4 border"
          placeholder="Enter your email"
        />
        <TextInput
          value={password}
          onChangeText={setPassword}
          className="h-12 px-4 border"
          placeholder="Enter your password"
          secureTextEntry
        />
        <TextInput
          value={password_confirmation}
          onChangeText={setPasswordConfirmation}
          className="h-12 px-4 border"
          placeholder="Confirm your password"
          secureTextEntry
        />
        <TouchableOpacity
          onPress={handleLogin}
          className="h-12 rounded-full bg-blue-500 items-center justify-center"
        >
          <Text className="text-white font-bold">Create account</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
