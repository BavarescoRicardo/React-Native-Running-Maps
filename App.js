import React, {useState, useEffect} from 'react';
import {View, Text, StyleSheet, Button, Platform, PermissionsAndroid, Dimensions, Alert} from 'react-native';
import MapView from 'react-native-maps';
import Geolocation from 'react-native-geolocation-service';

const {width, height} = Dimensions.get('screen');

export default function App(){
  const [region, setRegion] = useState(null);
  const [km, setKm] = useState(null);
  const [fimKm, setfimK] = useState(0);
  const [duracao, setDuracao] = useState(null);
  const [duracaoFim, setDuracaoFim] = useState([0]);

  useEffect(() => {
    getMyLocation();
  }, [])

  function getMyLocation(){
    Geolocation.getCurrentPosition(data => {
      // console.log("Lat.. "+ data.coords.latitude)
      // console.log("Long.. "+ data.coords.longitude)

      setRegion({
        latitude: (data.coords.latitude * 111.1),
        longitude: (data.coords.longitude * 111.3),
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421
      })
    },
    () => {console.log("Erro para localizar celular")}, {
      enableHighAccuracy: true,
      timeout: 5000
    })
  }

  function calcularDistanciaI(){
    getMyLocation();
    let agora = new Date();
    
    alert("Iniciado: " + getCurrentTime(agora))

    setKm({
      x: region.latitude,
      y: region.longitude
    })    

  }

  function calcularDistanciaF(){
    getMyLocation();
    
    // calcular variacao de kms
    setfimK(Math.abs(region.latitude - km.x) + Math.abs(region.longitude - km.y))
    distance(km.x, km.y, region.latitude, region.longitude);

    alert('Final.. Total corrida: '+ fimKm)
    

    let agora = new Date();
    
    alert(calcularDuracao(agora))
    depur();


  }

  function distance(lat1, lon1, lat2, lon2) {
    if ((lat1 == lat2) && (lon1 == lon2)) {
      return 0;
    }
    else {
      var radlat1 = Math.PI * lat1/180;
      var radlat2 = Math.PI * lat2/180;
      var theta = lon1-lon2;
      var radtheta = Math.PI * theta/180;
      var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
      if (dist > 1) {
        dist = 1;
      }
      dist = Math.acos(dist);
      dist = dist * 180/Math.PI;
      dist = dist * 60 * 1.1515;
      dist = dist * 1.609344;
      alert("Distancia funcao dist..  " + dist);
      return dist;
    }
  }

  function depur(){
    
    console.log(Math.abs(region.latitude))
    console.log(Math.abs(region.longitude))
    console.log(Math.abs(km.x))
    console.log(Math.abs(km.y))

  }

  const getCurrentTime = (today) => {

    var hours = today.getHours();

    var minutes = today.getMinutes();

    var seconds = today.getSeconds();

    setDuracao({hours, minutes, seconds})
    return hours + ':' + minutes + ':' + seconds;

  }

  const calcularDuracao = (today) => {

    var hours = today.getHours();
     hours -= duracao.hours;

    var minutes = today.getMinutes();
    minutes -= duracao.minutes;

    var seconds = today.getSeconds();
    seconds -= duracao.seconds;

    setDuracaoFim({hours, minutes, seconds})
    return (hours)+ ':' + (minutes) + ':' + (seconds);

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
                calcularDistanciaI();
              }}
            />

            <Button
              title="Finalizar treino"
              onPress={() => {
                Alert.alert('Finalizado!')
                calcularDistanciaF();
              }}
            />
          </View>
          <Text>
            Distancia percorrida:  {fimKm}
          </Text>

          <Text>
            Duração da atividade:  {(duracaoFim.hours >= 0)? ((duracaoFim.hours)+ ':' + (duracaoFim.minutes) + ':' + (duracaoFim.seconds)) : 0} 
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
    marginVertical: 4,
  },
  fixToText: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  separator: {
    marginVertical: 4,
    borderBottomColor: '#737373',
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  botoes: {
    margin: 20,
    elevation: 1,
    padding: 10
  }
})

