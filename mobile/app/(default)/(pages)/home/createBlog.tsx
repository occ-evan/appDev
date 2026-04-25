import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { useState } from "react";
import axios from "@/api/axios";
import { useAuth } from "@/contexts/auth-context";
import { useRouter } from "expo-router";

export default function Create() {
  const [title, setTitle] = useState("");
  const [image, setImage] = useState<any>(null);
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const router = useRouter();

  const pickImage = async () => {
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      alert("Permission required");
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0]);
    }
  };

  const handleCreateBlog = async () => {
    if (!title || !description || !image) {
      alert("Please fill in all fields and select an image.");
      return;
    }

    setLoading(true);

    const formData = new FormData();
    const fileName = image.fileName || image.uri.split("/").pop() || "photo.jpg";
    const ext = fileName.split(".").pop()?.toLowerCase();
    const mimeMap: Record<string, string> = {
      jpg: "image/jpeg",
      jpeg: "image/jpeg",
      png: "image/png",
      webp: "image/webp",
    };
    const mimeType = mimeMap[ext ?? ""] || "image/jpeg";

    formData.append("title", title);
    formData.append("description", description);
    formData.append("image", {
      uri: image.uri,
      name: fileName,
      type: mimeType,
    } as any);

    try {
      await axios.post("/create/blog", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      alert("Blog created!");
      setTitle("");
      setDescription("");
      setImage(null);
      router.back(); // ✅ go back after posting
    } catch (error: any) {
      if (error.response) {
        console.log("Laravel Error:", error.response.data);
        alert(`Failed: ${JSON.stringify(error.response.data.errors)}`);
      } else {
        console.log("Error:", error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView
      contentContainerStyle={{ padding: 16, gap: 12, backgroundColor: "#f0f2f5" }}
    >
      {/* Header */}
      <View className="flex-row items-center gap-3 bg-white p-3 rounded-xl">
        <Image
          source={{
            uri: user?.profile_photo
              ? `http://127.0.0.1:8000/storage/${user.profile_photo}`
              : `https://ui-avatars.com/api/?name=${user?.name ?? "User"}&background=random`,
          }}
          style={{ width: 42, height: 42, borderRadius: 21 }}
        />
        <Text className="text-gray-400 text-base">What's on your mind?</Text>
      </View>

      {/* Form */}
      <View className="bg-white rounded-xl p-4 gap-3">
        <TextInput
          value={title}
          onChangeText={setTitle}
          placeholder="Title"
          className="border border-gray-200 rounded-lg px-3 h-10"
        />
        <TextInput
          value={description}
          onChangeText={setDescription}
          placeholder="What's on your mind..."
          multiline
          numberOfLines={4}
          textAlignVertical="top"
          className="border border-gray-200 rounded-lg px-3 py-2 min-h-24"
        />

        {/* Image Preview */}
        {image && (
          <View>
            <Image
              source={{ uri: image.uri }}
              style={{ width: "100%", height: 200, borderRadius: 8 }}
              resizeMode="cover"
            />
            <TouchableOpacity
              onPress={() => setImage(null)}
              className="absolute top-2 right-2 bg-black/50 rounded-full px-2 py-1"
            >
              <Text className="text-white text-xs">✕ Remove</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      {/* Actions */}
      <View className="flex-row gap-2">
        <TouchableOpacity
          onPress={pickImage}
          className="flex-1 h-11 bg-white border border-gray-200 rounded-xl items-center justify-center flex-row gap-2"
        >
          <Text className="text-gray-600">📷 Add Photo</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={handleCreateBlog}
          disabled={loading}
          className="flex-1 h-11 bg-blue-500 rounded-xl items-center justify-center"
        >
          {loading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text className="text-white font-bold">Post</Text>
          )}
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        onPress={() => router.push('/(default)/(tabs)/blogs')}
        className="h-11 bg-gray-200 rounded-xl items-center justify-center"
      >
        <Text className="text-gray-600">Go back</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}