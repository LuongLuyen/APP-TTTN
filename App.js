import React from 'react';

import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer } from '@react-navigation/native'
import { useFonts } from 'expo-font';



import { Restaurant, OrderDelivery } from './screens'
import VNPAYScreen from './screens/VNPAYScreen';

import Tabs from './navigation/tabs'
import ChatGptScreen from './screens/ChatGptScreen';
import SuccessScreen from './components/SuccessScreen';
import FailScreen from './components/FailScreen';
import UserScreen from './screens/UserScreen';
import OrderHistoryScreen from './screens/OrderHistoryScreen';

const Stack = createStackNavigator();

const App = () => {

    const [loaded] = useFonts({
      "Roboto-Black" : require('./assets/fonts/Roboto-Black.ttf'),
      "Roboto-Bold" : require('./assets/fonts/Roboto-Bold.ttf'),
      "Roboto-Regular" : require('./assets/fonts/Roboto-Regular.ttf'),

    })
    
    if(!loaded){
      return null;
    }
    
    
      return (
          <NavigationContainer>
              <Stack.Navigator
                  screenOptions={{
                      headerShown: false
                  }}
                  initialRouteName={'HomeTabs'}
              >
                  <Stack.Screen name="HomeTabs" component={Tabs} />
                  <Stack.Screen name="Restaurant" component={Restaurant} />
                  <Stack.Screen name="OrderDelivery" component={OrderDelivery} />
                   <Stack.Screen name="VNPAYScreen" component={VNPAYScreen} />
                   <Stack.Screen name="ChatGpt" component={ChatGptScreen} />
                  <Stack.Screen name="SuccessScreen" component={SuccessScreen} />
                  <Stack.Screen name="FailScreen" component={FailScreen} />
                  <Stack.Screen name="UserScreen" component={UserScreen} />
                  <Stack.Screen name="OrderHistoryScreen" component={OrderHistoryScreen} />
              </Stack.Navigator>
          </NavigationContainer>
      )
    
}

export default App;