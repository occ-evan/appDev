import { useAuth } from "@/contexts/auth-context";
import { useState } from "react";
import { View, Text, TextInput, TouchableOpacity } from "react-native";
import { Link } from 'expo-router';

export default function Login() {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

    const handleLogin = () => {
      login({ email, password }); 
    };

  return (
    <View className="flex-1 items-center justify-center p-4">
      <View className="bg-white shadow-md p-4 w-full gap-4">
        <Text className="text-xl font-bold text-center">Login</Text>
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
        <TouchableOpacity
          onPress={handleLogin}
          className="h-12 rounded-full bg-blue-500 items-center justify-center"
        >
          <Text className="text-white font-bold">Login</Text>
        </TouchableOpacity>
        <View className="items-center justify-center">
                 <Link href={'/(auth)/register'}>
                  <Text className="text-black font-bold">Do not have account?</Text>
                  </Link>
                  </View>
      </View>
    </View>
  );
}
