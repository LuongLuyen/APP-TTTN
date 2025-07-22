import React from 'react';
import { WebView } from 'react-native-webview';
import { ActivityIndicator, View, Alert } from 'react-native';
import API from '../constants/api';

const RETURN_URL = `${API}/api/v1/payment/vnpay_return`;

export default function VNPAYScreen({ route, navigation }) {
  const { paymentUrl } = route.params;

  const handleNavigationChange = (navState) => {
    const { url } = navState;

    // Kiểm tra khi user quay về RETURN_URL của mình
    if (url.startsWith(RETURN_URL)) {
      const paramsString = url.split('?')[1];
      const params = new URLSearchParams(paramsString);
      const code = params.get('vnp_ResponseCode');

      if (code === '00') {
        navigation.replace('SuccessScreen'); // dùng replace để không cho back về WebView
      } else {
        navigation.replace('FailScreen');
      }
    }
  };

  const handleWebViewError = (syntheticEvent) => {
    const { nativeEvent } = syntheticEvent;
    console.warn('WebView error: ', nativeEvent.description);
    Alert.alert('Lỗi kết nối', 'Không thể tải trang thanh toán VNPay. Vui lòng thử lại sau.');
    navigation.replace('FailScreen');
  };

  return (
    <WebView
      source={{ uri: paymentUrl }}
      onNavigationStateChange={handleNavigationChange}
      onError={handleWebViewError}
      startInLoadingState={true}
      renderLoading={() => (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color="#2ecc71" />
        </View>
      )}
    />
  );
}
