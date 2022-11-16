import React, {useState, useEffect} from 'react';
import {View, Text, StyleSheet, Platform, PermissionsAndroid, Dimensions} from 'react-native';
import MapView from 'react-native-maps';
import Geolocation from 'react-native-geolocation-service';

const {width, height} = Dimensions.get('screen');

export default function App(){
  const [region, setRegion] = useState(null);

  useEffect(() => {
    getMyLocation();
  }, [])

  function getMyLocation(){
    Geolocation.getCurrentPosition(data => {
      console.log("Lat.. "+ data.coords.latitude)
      console.log("Long.. "+ data.coords.longitude)

      setRegion({
        latitude: data.coords.latitude,
        longitude: data.coords.longitude,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421
      })
    },
    () => {console.log("Erro para localizar celular")}, {
      enableHighAccuracy: true,
      timeout: 25000
    })
  }

  return(
    <View style={StyleSheet.container}>
        <MapView
          onMapReady={() => {
            Platform.OS ==='android' ?
            PermissionsAndroid.request(
              PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION)
              .then(() => {
                console.log("Usuario Aceitou")
              })
            : ''
          }}
          style={{width: width, height: height}}

          region={region}
          zoomEnabled={true}
          minZoomLevel={15}
          showsUserLocation={true}
          loadingEnabled={true}

          // initialRegion={{
          //   latitude: 37.78825,
          //   longitude: -122.4324,
          //   latitudeDelta: 0.0922,
          //   longitudeDelta: 0.0421,
          // }}
        />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 400,
    width: 400,
    flex: 1,
    alignItems: 'center'
  },
})

