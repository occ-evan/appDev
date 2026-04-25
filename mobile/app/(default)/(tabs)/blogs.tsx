import {
  View,
  Text,
  Image,
  FlatList,
  ActivityIndicator,
  RefreshControl,
  TouchableOpacity,
} from "react-native";
import { useEffect, useState } from "react";
import axios from "@/api/axios";
import { useAuth } from "@/contexts/auth-context";

interface Blog {
  id: number;
  user_id: number;
  title: string;
  image: string;
  description: string;
  created_at: string;
}

export default function Blogs() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const { user } = useAuth();

  const fetchBlogs = async () => {
    try {
      const { data } = await axios.get("/blogs");
      setBlogs(data);
    } catch (error) {
      console.log("Fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchBlogs();
    setRefreshing(false);
  };

  const renderBlogCard = ({ item }: { item: Blog }) => (
    <View
      style={{
        backgroundColor: "white",
        marginBottom: 12,
        borderRadius: 12,
        overflow: "hidden",
        shadowColor: "#000",
        shadowOpacity: 0.06,
        shadowRadius: 4,
        elevation: 2,
      }}
    >
      {/* Header */}
      <View
        style={{ flexDirection: "row", alignItems: "center", padding: 12, gap: 10 }}
      >
        <Image
          source={{
            uri: user?.profile_photo
              ? `http://127.0.0.1:8000/storage/${user.profile_photo}`
              : `https://ui-avatars.com/api/?name=${user?.name ?? "User"}&background=random`,
          }}
          style={{ width: 42, height: 42, borderRadius: 21, backgroundColor: "#e5e7eb" }}
        />
        <View>
          <Text style={{ fontWeight: "700", color: "#111827" }}>{user?.name}</Text>
          <Text style={{ fontSize: 11, color: "#9ca3af" }}>
            {new Date(item.created_at).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            })}
          </Text>
        </View>
      </View>

      {/* Title & Description */}
      <View style={{ paddingHorizontal: 12, paddingBottom: 10 }}>
        <Text style={{ fontWeight: "700", fontSize: 16, color: "#1f2937", marginBottom: 4 }}>
          {item.title}
        </Text>
        <Text style={{ color: "#6b7280", lineHeight: 20 }}>{item.description}</Text>
      </View>

      {/* Image */}
      {item.image && (
        <Image
          source={{ uri: `http://127.0.0.1:8000/storage/${item.image}` }}
          style={{ width: "100%", height: 220 }}
          resizeMode="cover"
        />
      )}

      {/* <View
        style={{
          flexDirection: "row",
          gap: 16,
          padding: 12,
          borderTopWidth: 1,
          borderTopColor: "#f3f4f6",
        }}
      >
        <TouchableOpacity>
          <Text style={{ color: "#6b7280" }}>👍 Like</Text>
        </TouchableOpacity>
        <TouchableOpacity>
          <Text style={{ color: "#6b7280" }}>💬 Comment</Text>
        </TouchableOpacity>
        <TouchableOpacity>
          <Text style={{ color: "#6b7280" }}>↗️ Share</Text>
        </TouchableOpacity>
      </View> */}
    </View>
  );

  // if (loading) {
  //   return (
  //     <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
  //       <ActivityIndicator size="large" color="#3b82f6" />
  //     </View>
  //   );
  // }

  return (
    <FlatList
      data={blogs}
      keyExtractor={(item) => item.id.toString()}
      renderItem={renderBlogCard}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      contentContainerStyle={{ padding: 12, backgroundColor: "#f0f2f5" }}
      ListEmptyComponent={
        <View style={{ alignItems: "center", marginTop: 60 }}>
          <Text style={{ fontSize: 40 }}>📭</Text>
          <Text style={{ color: "#9ca3af", marginTop: 8 }}>No posts yet</Text>
        </View>
      }
    />
  );
}