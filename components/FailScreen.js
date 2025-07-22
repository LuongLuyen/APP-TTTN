import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';

const FailScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Image
        // source={require('../assets/fail.png')} // hoặc ảnh URL trực tuyến
        style={styles.image}
      />
      <Text style={styles.title}>Thất bại!</Text>
      <Text style={styles.message}>Đã xảy ra lỗi trong quá trình xử lý giao dịch.</Text>
      <Text style={styles.subMessage}>Vui lòng thử lại hoặc liên hệ bộ phận hỗ trợ.</Text>

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('Home')} // hoặc màn hình trước đó
      >
        <Text style={styles.buttonText}>Về trang chủ</Text>
      </TouchableOpacity>
    </View>
  );
};

export default FailScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff0f0',
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
    color: '#e74c3c',
    marginBottom: 10,
  },
  message: {
    fontSize: 16,
    color: '#555',
    textAlign: 'center',
    marginBottom: 5,
  },
  subMessage: {
    fontSize: 14,
    color: '#777',
    textAlign: 'center',
    marginBottom: 30,
  },
  button: {
    backgroundColor: '#e74c3c',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 25,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
});
