import React, {useState, useEffect} from 'react';
import {View, Text, StyleSheet, Button, Platform, PermissionsAndroid, Dimensions, Alert} from 'react-native';
import MapView from 'react-native-maps';
import Geolocation from 'react-native-geolocation-service';

const {width, height} = Dimensions.get('screen');

export default function App(){
  const [region, setRegion] = useState(null);
  const [km, setKm] = useState(0);

  useEffect(() => {
    getMyLocation();
  }, [])

  function getMyLocation(){
    Geolocation.getCurrentPosition(data => {
      alert("Lat.. "+ data.coords.latitude)
      alert("Long.. "+ data.coords.longitude)

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
    <View style={styles.container}>
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
          style={{width: width, height: height/2}}

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

        <View style={{padding: 30}}>
          <Text>
            Aplicação para corridas
          </Text>
          <View style={styles.botoes}>
            <Button              
              title="Iniciar treino"
              onPress={() => {
                Alert.alert('Iniciado!')
                getMyLocation();
              }}
            />

            <Button
              title="Finalizar treino"
              onPress={() => {
                Alert.alert('Finalizado!')
                getMyLocation();
              }}
            />
          </View>
          <Text>
            Distancia percorrida:  {km}
          </Text>        
        </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: height,
    width: width,
    flex: 1,
    alignItems: 'center',
    marginBottom: 20,
    fontSize: 16,
  },
  title: {
    textAlign: 'center',
    marginVertical: 8,
  },
  fixToText: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  separator: {
    marginVertical: 8,
    borderBottomColor: '#737373',
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  botoes: {
    margin: 50,
    elevation: 1,
    padding: 10
  }
})

