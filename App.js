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
        latitude: (data.coords.latitude * - 1000),
        longitude: (data.coords.longitude * - 1000),
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421
      })
    },
    () => {console.log("Erro para localizar celular")}, {
      enableHighAccuracy: true,
      timeout: 25000
    })
  }

  function calcularDistanciaI(){    
    let agora = new Date();
    
    alert(getCurrentTime(agora))

    setKm({
      x: region.latitude,
      y: region.longitude
    })    

  }

  function calcularDistanciaF(){
    alert('Final da atividade')
    // calcular variacao de kms
    setfimK((region.latitude - km.x) + (region.longitude - km.y))

    alert('Total corrida: '+ fimKm)
    depur(false);

    let agora = new Date();
    
    alert(calcularDuracao(agora))


  }

  function depur(fim){
    
    console.log(region.latitude)
    console.log(region.longitude)
    console.log(km.x)
    console.log(km.y)

    console.log("Duração..")
    console.log(duracao.hours)
    console.log(duracao.minutes)
    console.log(duracao.seconds)

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
                Alert.alert('Iniciado!')
                getMyLocation();
                calcularDistanciaI();
              }}
            />

            <Button
              title="Finalizar treino"
              onPress={() => {
                Alert.alert('Finalizado!')
                getMyLocation();
                calcularDistanciaF();
              }}
            />
          </View>
          <Text>
            Distancia percorrida:  {fimKm}
          </Text>

          <Text>
            Duração da atividade:  {} 
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

