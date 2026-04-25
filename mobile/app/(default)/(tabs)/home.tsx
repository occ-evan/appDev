import { View, Text, Image, TouchableOpacity } from "react-native";
import { useAuth } from "@/contexts/auth-context";
import { useRouter } from "expo-router";
import { useEffect } from "react";

export default function Home() {
  const { user, getUser } = useAuth();
  const router = useRouter();

  useEffect(() => {
    getUser(); // ✅ refresh user on every visit so profile_photo is always current
  }, []);

  console.log("profile_photo:", user?.profile_photo); // check this in console

  return (
    <View style={{ padding: 16, gap: 12 }}>
      <TouchableOpacity onPress={() => navigation.navigate("../(pages)/home/createProfile")}>
        <Image
          source={{
            uri: user?.profile_photo
              ? `http://127.0.0.1:8000/storage/${user.profile_photo}`
              : `https://ui-avatars.com/api/?name=${user?.name ?? "User"}&background=random`,
          }}
          style={{ width: 100, height: 100, borderRadius: 50 }}
        />
      </TouchableOpacity>

      <Text>Name: {user?.name}</Text>
      <Text>Email: {user?.email}</Text>
    </View>
  );
}