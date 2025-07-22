import React from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import MapView, { PROVIDER_GOOGLE, Marker, Polyline } from "react-native-maps";
import { COLORS, FONTS, icons, SIZES, images } from "../constants";
import API from "../constants/api";

const ORS_API_KEY = "eyJvcmciOiI1YjNjZTM1OTc4NTExMTAwMDFjZjYyNDgiLCJpZCI6Ijc1ZTZlY2QwNTBjZjQyNjFhN2E3OWNlMDhmZmFlNDI1IiwiaCI6Im11cm11cjY0In0="; // 🔑 Dán API key OpenRouteService tại đây

const OrderDelivery = ({ route, navigation }) => {
  const mapView = React.useRef();

  const [restaurant, setRestaurant] = React.useState(null);
  const [streetName, setStreetName] = React.useState("");
  const [fromLocation, setFromLocation] = React.useState(null);
  const [toLocation, setToLocation] = React.useState(null);
  const [region, setRegion] = React.useState(null);

  const [duration, setDuration] = React.useState(0);
  const [angle, setAngle] = React.useState(0);
  const [routeCoords, setRouteCoords] = React.useState([]);
  const [loadingRoute, setLoadingRoute] = React.useState(true);
   const [total, setTotal] = React.useState(0);
   const [status, setStatus] = React.useState("");

  React.useEffect(() => {
  const {
    restaurant = {
      id: 1,
      name: "Nhà Hàng Burger Hà Nội",
      rating: 4.8,
      categories: [5, 7],
      priceRating: "affordable",
      photo: "images.burger_restaurant_1",
      duration: "30 - 45 Phút",
      location: {
        latitude: 21.002,
        longitude: 105.8166,
      },
      courier: {
        avatar: images.avatar_1,
        name: "Lan",
      },
      menu: [
        {
          menuId: 1,
          name: "Burger Gà Giòn",
          photo: "images.crispy_chicken_burger",
          description: "Burger với gà giòn, phô mai và rau xà lách",
          calories: 200,
          price: 10,
        },
        {
          menuId: 2,
          name: "Burger Gà Sốt Mù Tạt Mật Ong",
          photo: "images.honey_mustard_chicken_burger",
          description: "Burger gà giòn với sốt mù tạt mật ong",
          calories: 250,
          price: 15,
        },
        {
          menuId: 3,
          name: "Khoai Tây Chiên Giòn",
          photo: "images.baked_fries",
          description: "Khoai tây chiên giòn nướng",
          calories: 194,
          price: 8,
        },
      ],
    },
    currentLocation = {
      streetName: "Hà Nội",
      gps: {
        latitude: 20.980906,
        longitude: 105.789665,
      },
    },
    total = "10.000",
    status = "Không xác định"
  } = route.params || {};


    setTotal(total)
    setStatus(status)

    const fromLoc = currentLocation.gps;
    const toLoc = restaurant.location;
    const street = currentLocation.streetName;

    const mapRegion = {
      latitude: (fromLoc.latitude + toLoc.latitude) / 2,
      longitude: (fromLoc.longitude + toLoc.longitude) / 2,
      latitudeDelta: Math.abs(fromLoc.latitude - toLoc.latitude) * 2,
      longitudeDelta: Math.abs(fromLoc.longitude - toLoc.longitude) * 2,
    };

    setRestaurant(restaurant);
    setStreetName(street);
    setFromLocation(fromLoc);
    setToLocation(toLoc);
    setRegion(mapRegion);

    fetchRoute(fromLoc, toLoc);
  }, []);

  const fetchRoute = async (fromLoc, toLoc) => {
    try {
      const response = await fetch(
        "https://api.openrouteservice.org/v2/directions/driving-car/geojson",
        {
          method: "POST",
          headers: {
            Authorization: ORS_API_KEY,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            coordinates: [
              [fromLoc.longitude, fromLoc.latitude],
              [toLoc.longitude, toLoc.latitude],
            ],
          }),
        }
      );

      const data = await response.json();
      // console.log('RESPONSE:', JSON.stringify(data, null, 2)); 
      const coords = data.features[0].geometry.coordinates.map(
        ([lng, lat]) => ({
          latitude: lat,
          longitude: lng,
        })
      );

      setRouteCoords(coords);

      const durationMinutes =
        data.features[0].properties.summary.duration / 60;
      setDuration(durationMinutes);

      // Cập nhật vị trí xe (tạm lấy điểm đầu)
      if (coords.length >= 2) {
        const angle = calculateAngle([coords[0], coords[1]]);
        setAngle(angle);
        setFromLocation(coords[0]);
      }

      // Fit map
      mapView.current?.fitToCoordinates(coords, {
        edgePadding: {
          right: SIZES.width / 20,
          bottom: SIZES.height / 4,
          left: SIZES.width / 20,
          top: SIZES.height / 8,
        },
      });
    } catch (error) {
      console.error("Lỗi lấy route từ ORS:", error);
    } finally {
      setLoadingRoute(false);
    }
  };

     const handleOrder = async () => {
      const totalNumber = Number(total.replace(/\./g, ''));
        if(totalNumber<=5000){
          navigation.navigate('FailScreen');
          return
        }
        try {
            const response = await fetch(`${API}/api/v1/payment/create_payment_url`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                amount: totalNumber
            }),
            });

            const data = await response.json();

            if (response.ok && data.paymentUrl) {
            navigation.navigate('VNPAYScreen', {
                paymentUrl: data.paymentUrl,
            });
            } else {
            console.error('Payment API error:', data);
            Alert.alert('Lỗi', 'Không tạo được link thanh toán');
            }
        } catch (error) {
            console.error('Fetch error:', error);
            Alert.alert('Lỗi', 'Không thể kết nối đến máy chủ');
        }
        };

  function calculateAngle(coordinates) {
    const [start, end] = coordinates;
    const dx = end.latitude - start.latitude;
    const dy = end.longitude - start.longitude;
    return (Math.atan2(dy, dx) * 180) / Math.PI;
  }

  function zoomIn() {
    const newRegion = {
      ...region,
      latitudeDelta: region.latitudeDelta / 2,
      longitudeDelta: region.longitudeDelta / 2,
    };
    setRegion(newRegion);
    mapView.current?.animateToRegion(newRegion, 200);
  }

  function zoomOut() {
    const newRegion = {
      ...region,
      latitudeDelta: region.latitudeDelta * 2,
      longitudeDelta: region.longitudeDelta * 2,
    };
    setRegion(newRegion);
    mapView.current?.animateToRegion(newRegion, 200);
  }

  function renderMap() {
    return (
      <View style={{ flex: 1 }}>
        <MapView
          ref={mapView}
          provider={PROVIDER_GOOGLE}
          initialRegion={region}
          style={{ flex: 1 }}
        >
          {fromLocation && (
            <Marker
              coordinate={fromLocation}
              anchor={{ x: 0.5, y: 0.5 }}
              flat
              rotation={angle}
            >
              <View
                style={{
                  height: 40,
                  width: 40,
                  borderRadius: 20,
                  backgroundColor: COLORS.white,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <View
                  style={{
                    height: 30,
                    width: 30,
                    borderRadius: 15,
                    backgroundColor: COLORS.primary,
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Image
                    source={icons.pin}
                    style={{
                      width: 25,
                      height: 25,
                      tintColor: COLORS.white,
                      transform: [{ rotate: '45deg' }],
                    }}
                  />
                </View>
              </View>
            </Marker>
          )}

          {toLocation && (
            <Marker coordinate={toLocation}>
    
              <Text  style={{ width: 40, height: 40 , color:'red', zIndex:1, fontWeight: 'bold'}}>
                {restaurant.name}
              </Text>
                <Image
                source={icons.car}
                style={{ width: 40, height: 40 }}
              />
            </Marker>
          )}

          {!loadingRoute && routeCoords.length > 0 && (
            <Polyline
              coordinates={routeCoords}
              strokeColor={COLORS.primary}
              strokeWidth={5}
            />
          )}
        </MapView>
      </View>
    );
  }

  function renderDestinationHeader() {
    return (
      <View
        style={{
          position: "absolute",
          top: 50,
          left: 0,
          right: 0,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            width: SIZES.width * 0.9,
            padding: SIZES.padding,
            borderRadius: SIZES.radius,
            backgroundColor: COLORS.white,
          }}
        >
          <Image
            source={icons.red_pin}
            style={{ width: 30, height: 30, marginRight: SIZES.padding }}
          />
          <View style={{ flex: 1 }}>
            <Text style={{ ...FONTS.body3 }}>{streetName}</Text>
          </View>
          <Text style={{ ...FONTS.body3 }}>{Math.ceil(duration)} mins</Text>
        </View>
      </View>
    );
  }

  function renderHistoryDeliveryInfo(staus) {
    return (
      <View
        style={{
          position: "absolute",
          bottom: 50,
          left: 0,
          right: 0,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <View
          style={{
            width: SIZES.width * 0.9,
            paddingVertical: SIZES.padding * 3,
            paddingHorizontal: SIZES.padding * 2,
            borderRadius: SIZES.radius,
            backgroundColor: COLORS.white,
          }}
        >
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Image
              source={restaurant?.courier.avatar}
              style={{ width: 50, height: 50, borderRadius: 25 }}
            />
            <View style={{ flex: 1, marginLeft: SIZES.padding }}>
              <View
                style={{ flexDirection: "row", justifyContent: "space-between" }}
              >
                <Text style={{ ...FONTS.h4 }}>{restaurant?.courier.name}</Text>
                <View style={{ flexDirection: "row" }}>
                  <Image
                    source={icons.star}
                    style={{
                      width: 18,
                      height: 18,
                      tintColor: COLORS.primary,
                      marginRight: SIZES.padding,
                    }}
                  />
                  <Text style={{ ...FONTS.body3 }}>{restaurant?.rating}</Text>
                </View>
              </View>
              <Text style={{ color: COLORS.darkgray, ...FONTS.body4 }}>
                {restaurant?.name}
              </Text>
            </View>
          </View>

          <View
            style={{
              flexDirection: "row",
              marginTop: SIZES.padding * 2,
              justifyContent: "space-between",
            }}
          >
            <TouchableOpacity
              style={{
                flex: 1,
                height: 50,
                marginRight: 10,
                backgroundColor: COLORS.primary,
                alignItems: "center",
                justifyContent: "center",
                borderRadius: 10,
              }}
            // onPress={handleOrder}
            >
              <Text style={{ ...FONTS.h4, color: COLORS.white }}>{status}</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={{
                flex: 1,
                height: 50,
                backgroundColor: COLORS.secondary,
                alignItems: "center",
                justifyContent: "center",
                borderRadius: 10,
              }}
              onPress={() => navigation.goBack()}
            >
              <Text style={{ ...FONTS.h4, color: COLORS.white }}>Hủy</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }
    function renderDeliveryInfo() {
    return (
      <View
        style={{
          position: "absolute",
          bottom: 50,
          left: 0,
          right: 0,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <View
          style={{
            width: SIZES.width * 0.9,
            paddingVertical: SIZES.padding * 3,
            paddingHorizontal: SIZES.padding * 2,
            borderRadius: SIZES.radius,
            backgroundColor: COLORS.white,
          }}
        >
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Image
              source={restaurant?.courier.avatar}
              style={{ width: 50, height: 50, borderRadius: 25 }}
            />
            <View style={{ flex: 1, marginLeft: SIZES.padding }}>
              <View
                style={{ flexDirection: "row", justifyContent: "space-between" }}
              >
                <Text style={{ ...FONTS.h4 }}>{restaurant?.courier.name}</Text>
                <View style={{ flexDirection: "row" }}>
                  <Image
                    source={icons.star}
                    style={{
                      width: 18,
                      height: 18,
                      tintColor: COLORS.primary,
                      marginRight: SIZES.padding,
                    }}
                  />
                  <Text style={{ ...FONTS.body3 }}>{restaurant?.rating}</Text>
                </View>
              </View>
              <Text style={{ color: COLORS.darkgray, ...FONTS.body4 }}>
                {restaurant?.name}
              </Text>
            </View>
          </View>

          <View
            style={{
              flexDirection: "row",
              marginTop: SIZES.padding * 2,
              justifyContent: "space-between",
            }}
          >
            <TouchableOpacity
              style={{
                flex: 1,
                height: 50,
                marginRight: 10,
                backgroundColor: COLORS.primary,
                alignItems: "center",
                justifyContent: "center",
                borderRadius: 10,
              }}
            onPress={handleOrder}
            >
              <Text style={{ ...FONTS.h4, color: COLORS.white }}>Thanh toán</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={{
                flex: 1,
                height: 50,
                backgroundColor: COLORS.secondary,
                alignItems: "center",
                justifyContent: "center",
                borderRadius: 10,
              }}
              onPress={() => navigation.goBack()}
            >
              <Text style={{ ...FONTS.h4, color: COLORS.white }}>Hủy</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }

  function renderButtons() {
    return (
      <View
        style={{
          position: "absolute",
          bottom: SIZES.height * 0.35,
          right: SIZES.padding * 2,
          width: 60,
          height: 130,
          justifyContent: "space-between",
        }}
      >
        <TouchableOpacity
          style={{
            width: 60,
            height: 60,
            borderRadius: 30,
            backgroundColor: COLORS.white,
            alignItems: "center",
            justifyContent: "center",
          }}
          onPress={() => zoomIn()}
        >
          <Text style={{ ...FONTS.body1 }}>+</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={{
            width: 60,
            height: 60,
            borderRadius: 30,
            backgroundColor: COLORS.white,
            alignItems: "center",
            justifyContent: "center",
          }}
          onPress={() => zoomOut()}
        >
          <Text style={{ ...FONTS.body1 }}>-</Text>
        </TouchableOpacity>
      </View>
    );
  }

 return (
  <View style={{ flex: 1 }}>
    {renderMap()}
    {renderDestinationHeader()}

    {status === "Không xác định"
      ? renderDeliveryInfo()
      : renderHistoryDeliveryInfo(status)
    }

    {renderButtons()}
  </View>
);

};

export default OrderDelivery;
