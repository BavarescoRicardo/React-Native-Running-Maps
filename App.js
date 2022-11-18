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
        latitude: (data.coords.latitude),
        longitude: (data.coords.longitude),
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
    setfimK(0);
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
    console.log(setfimK(Math.abs(region.latitude - km.x) + Math.abs(region.longitude - km.y)));
    setfimK(distFinal({latitude: km.x, longitude: km.y}, {latitude: region.latitude, longitude: region.longitude}));

    alert('Final.. Total corrida: '+ fimKm)
    

    let agora = new Date();
    
    alert(calcularDuracao(agora))
    depur();


  }

  function distFinal(mk1, mk2) {
    var R = 3958.8; // Radius of the Earth in miles
    var rlat1 = mk1.latitude * (Math.PI/180); // Convert degrees to radians
    var rlat2 = mk2.latitude * (Math.PI/180); // Convert degrees to radians
    var difflat = rlat2-rlat1; // Radian difference (latitudes)
    var difflon = (mk2.longitude-mk1.longitude) * (Math.PI/180); // Radian difference (longitudes)

    var d = 2 * R * Math.asin(Math.sqrt(Math.sin(difflat/2)*Math.sin(difflat/2)+Math.cos(rlat1)*Math.cos(rlat2)*Math.sin(difflon/2)*Math.sin(difflon/2)));
    console.log("Distancia nova funcao")
    console.log(d)
    return d*2;
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

