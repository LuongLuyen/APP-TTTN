import React from 'react';
import { View, Text, FlatList, StyleSheet,TouchableOpacity } from 'react-native';
import Header from "../components/Header";

const orders = [
  {
    id: 1,
    restaurantName: "Nhà Hàng Burger Hà Nội",
    date: "2025-07-20",
    items: ["Burger Gà Giòn", "Khoai Tây Chiên Giòn"],
    total: "33.000₫",
    status: "Đã giao"
  },
  {
    id: 2,
    restaurantName: "Nhà Hàng Phở 24",
    date: "2025-07-18",
    items: ["Phở bò đặc biệt"],
    total: "45.000₫",
    status: "Đang chuẩn bị"
  }
];

const OrderHistoryScreen = ({ navigation }) => {
  const renderItem = ({ item }) => (
     <TouchableOpacity
      onPress={() => navigation.navigate("OrderDelivery", {
          status: item.status
      })}
      >
        <View style={styles.card}>
        <Text style={styles.restaurantName}>{item.restaurantName}</Text>
        <Text>🗓️ Ngày: {item.date}</Text>
        <Text>🍽️ Món: {item.items.join(", ")}</Text>
        <Text>💵 Tổng: {item.total}</Text>
        <Text>📦 Trạng thái: {item.status}</Text>
      </View>
      </TouchableOpacity>

  );
  
  return (
    <View style={styles.container}>
      <Header></Header>
      <Text style={styles.title}>📜 Lịch Sử Đặt Hàng</Text>
      <FlatList
        data={orders}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        contentContainerStyle={{ paddingBottom: 20 }}
      />
    </View>
  );
};

export default OrderHistoryScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 50,
    paddingHorizontal: 20,
    backgroundColor: '#f2f2f2',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    marginTop: 40
  },
  card: {
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    backgroundColor: '#fff'
  },
  restaurantName: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 5
  }
});
