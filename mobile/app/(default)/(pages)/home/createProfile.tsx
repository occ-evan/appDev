import {
  View,
  Text,
  TouchableOpacity,
  Image,
  ScrollView,
  ActivityIndicator,
  Platform,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { useState } from "react";
import axios from "@/api/axios";
import { useAuth } from "@/contexts/auth-context";
import { useRouter } from "expo-router";

const getMimeType = (fileName: string): string => {
  const ext = fileName.split(".").pop()?.toLowerCase() ?? "";
  const mimeMap: Record<string, string> = {
    jpg: "image/jpeg",
    jpeg: "image/jpeg",
    png: "image/png",
    webp: "image/webp",
    gif: "image/gif",
  };
  return mimeMap[ext] || "image/jpeg";
};

export default function Profile() {
  const [image, setImage] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const { user, getUser } = useAuth();
  const router = useRouter();

  const pickImage = async () => {
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      alert("Permission required");
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });
    if (!result.canceled) {
      setImage(result.assets[0]);
    }
  };

  const handleProfile = async () => {
    if (!image) {
      alert("No image selected");
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();
      const fileName =
        image.fileName || image.uri.split("/").pop() || "photo.jpg";
      const mimeType = getMimeType(fileName);

      if (Platform.OS === "web") {
        // ✅ Web: must convert to real Blob/File
        const res = await fetch(image.uri);
        const blob = await res.blob();
        const file = new File([blob], fileName, { type: mimeType });
        formData.append("profile_photo", file);
      } else {
        // ✅ Native iOS/Android: plain object works
        formData.append("profile_photo", {
          uri: image.uri,
          name: fileName,
          type: mimeType,
        } as any);
      }

      await axios.post("/create/profile", formData);
      await getUser();
      alert("Profile updated successfully!");
      router.push("/(default)/(tabs)/home");
    } catch (error: any) {
      console.log("Status:", error.response?.status);
      console.log("Data:", JSON.stringify(error.response?.data));
      console.log("Message:", error.message);
      alert(`Upload failed: ${JSON.stringify(error.response?.data?.errors)}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={{ padding: 16, gap: 16 }}>
      <View style={{ alignItems: "center", marginTop: 16 }}>
        <Image
          source={{
            uri: image
              ? image.uri
              : user?.profile_photo
              ? `http://127.0.0.1:8000/storage/${user.profile_photo}`
              : `https://ui-avatars.com/api/?name=${user?.name ?? "User"}&background=random`,
          }}
          style={{ width: 110, height: 110, borderRadius: 55 }}
        />
      </View>

      <TouchableOpacity
        onPress={pickImage}
        className="h-12 rounded-full bg-gray-100 border border-gray-300 items-center justify-center"
      >
        <Text className="text-gray-700">📷 Browse Image</Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={handleProfile}
        disabled={loading}
        className="h-12 rounded-full bg-blue-500 items-center justify-center"
      >
        {loading ? (
          <ActivityIndicator color="white" />
        ) : (
          <Text className="text-white font-bold">Upload Image</Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => router.push("/(default)/(tabs)/home")}
        className="h-12 rounded-full bg-gray-200 items-center justify-center"
      >
        <Text className="text-gray-600">Back Home</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}