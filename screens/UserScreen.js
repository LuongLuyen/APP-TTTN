import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  FlatList,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Header from '../components/Header';
import { icons, images, SIZES, COLORS, FONTS, api } from '../constants'

const UserScreen = ({ navigation }) => {
  const user = {
    name: 'Nguyễn Văn A',
    email: 'nguyenvana@example.com',
    avatar: icons.user,
  };

  const settings = [
    {
      id: '1',
      icon: 'person-outline',
      label: 'Thông tin cá nhân',
      onPress: () => navigation.navigate('ProfileScreen'),
    },
    {
      id: '2',
      icon: 'lock-closed-outline',
      label: 'Đổi mật khẩu',
      onPress: () => navigation.navigate('ChangePasswordScreen'),
    },
    {
      id: '3',
      icon: 'notifications-outline',
      label: 'Thông báo',
      onPress: () => Alert.alert('Thông báo', 'Chức năng đang phát triển'),
    },
    {
      id: '4',
      icon: 'settings-outline',
      label: 'Cài đặt ứng dụng',
      onPress: () => Alert.alert('Cài đặt', 'Chức năng đang phát triển'),
    },
    {
      id: '5',
      icon: 'log-out-outline',
      label: 'Đăng xuất',
      onPress: () => Alert.alert('Đăng xuất', 'Bạn có chắc muốn đăng xuất?'),
    },
  ];

  const renderItem = ({ item }) => (
    <TouchableOpacity style={styles.item} onPress={item.onPress}>
      <Ionicons name={item.icon} size={24} color="#333" />
      <Text style={styles.itemText}>{item.label}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
    <Header></Header>
        <Image source={user.avatar} style={styles.avatar} />
        <Text style={styles.name}>{user.name}</Text>
        <Text style={styles.email}>{user.email}</Text>
      </View>

      <FlatList
        data={settings}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
      />
    </View>
  );
};

export default UserScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f2f2f2',
  },
  header: {
    alignItems: 'center',
    paddingVertical: 30,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 60,
    marginBottom: 10,
    marginTop:40
  },
  name: {
    fontSize: 22,
    fontWeight: 'bold',
  },
  email: {
    fontSize: 16,
    color: 'gray',
  },
  list: {
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomColor: '#ddd',
    borderBottomWidth: 1,
  },
  itemText: {
    marginLeft: 15,
    fontSize: 16,
  },
});
