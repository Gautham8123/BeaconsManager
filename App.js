/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View, DeviceEventEmitter} from 'react-native';
import DeviceInfo from 'react-native-device-info';
import Beacons from 'react-native-beacons-manager';


type Props = {};
const uniqueId = DeviceInfo.getUniqueID();
const deviceName = DeviceInfo.getModel();
const IS_ANDROID = Platform.OS === 'android';

export default class App extends Component<Props> {
  constructor() {
    super ();
    this.state = {
      room: "",
      distance: "",
      counter: 0
    };
  }
  componentWillMount(): void {

    if (IS_ANDROID) {
      Beacons.detectEstimotes();
    } else {
      // Request for authorization while the app is open
      Beacons.requestWhenInUseAuthorization();
    }

    const region = {
      identifier: "Demo_region",
      uuid: "B9407F30-F5F8-466E-AFF9-25556B57FE6D",
      minor: 2461,
      major: 51260
    };

    Beacons.startMonitoringForRegion(region)
        .then(() => {
          console.log ("Region was set");
        })
        .catch(error =>
            console.log (`region monitoring not started, error: ${error}`)
        );



    Beacons.startRangingBeaconsInRegion(region)
        .then(() => {
          console.log ("Beacons were found");
        })
        .catch(error =>
            console.log(`Beacons monitoring not started, error: ${error}`)
        );

    if (!IS_ANDROID) Beacons.startUpdatingLocation();

  }

  componentDidMount(): void {
    // Listen for beacon changes
    this.beaconsDidRange = DeviceEventEmitter.addListener(
        'beaconsDidRange',
        (data) => {
          console.log("found beacons!", data);

          if (data.beacons.length > 0) {
            this.setState({ counter: 0 });
            if (data.beacons[0].minor === 42714 && data.beacons[0].major === 8817) {
              let currentRoom = "Room1";
              if (this.state.room !== currentRoom) {
                console.log("found beacons!", data.beacons, "Room 1");
                this.setState({ room: "Room1" });
              }
            } else if (
                data.beacons[0].minor === 49385 &&
                data.beacons[0].major === 30174
            ) {
              let currentRoom = "Room2";
              if (this.state.room !== currentRoom) {
                console.log("found beacons!", data.beacons, "Room 2");
                this.setState({ room: "Room2" });

              }
            } else if (
                data.beacons[0].minor === 15000 &&
                data.beacons[0].major === 11000
            ) {
              let currentRoom = "Room3";
              if (this.state.room !== currentRoom) {
                console.log("found beacons!", data.beacons, "Room 3");
                this.setState({ room: "Room3" });

              }
            }
          } else {
            let newCounter = this.state.counter + 1;
            this.setState({ counter: newCounter });
            if (this.state.counter > 15) {
              let currentRoom = "No Room Assigned";
              if (this.state.room !== currentRoom) {
                console.log("Not in range of any room");
                this.setState({ room: "No Room Assigned" });

              }
            }
          }

        }
    );



  }

  componentWillUnmount(): void {
    this.beaconsDidRange = null;
  }

  render() {
    return (
        <View style={styles.container}>
          <Text style={styles.welcome}>Changes Welcome to React Native! Your Device Id is {uniqueId} and your Device Name is {deviceName} Your room is {this.state.room
          }</Text>
          <Text style={styles.instructions}>To get started, edit App.js</Text>

        </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});
