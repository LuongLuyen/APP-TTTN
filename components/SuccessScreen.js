import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';

const SuccessScreen = ({ navigation, route }) => {
  return (
    <View style={styles.container}>
      <Image
        // source={require('../assets/success.png')} // hoặc dùng ảnh online
        style={styles.image}
      />
      <Text style={styles.title}>Thành công!</Text>
      <Text style={styles.message}>Cảm ơn bạn đã sử dụng dịch vụ.</Text>

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('Home')} // hoặc bất kỳ màn hình nào khác
      >
        <Text style={styles.buttonText}>Về trang chủ</Text>
      </TouchableOpacity>
    </View>
  );
};

export default SuccessScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  image: {
    width: 120,
    height: 120,
    marginBottom: 30,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2ecc71',
    marginBottom: 10,
  },
  message: {
    fontSize: 16,
    color: '#333',
    textAlign: 'center',
    marginBottom: 30,
  },
  button: {
    backgroundColor: '#2ecc71',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 25,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
});
