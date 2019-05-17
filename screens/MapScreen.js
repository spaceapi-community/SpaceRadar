import React from 'react';
import MapView, { Marker } from 'react-native-maps';
import PropTypes from "prop-types";
import {connect} from "react-redux";
import { Location, Permissions } from 'expo';
import { actions } from '../store/spaces';

const mapStateToProps = (state) => ({
  directory: state.spaces.directory,
});

const mapDispatchToProps = {
  ...actions,
};

class Map extends React.Component {
  static navigationOptions = {
    title: 'Map',
  };

  constructor(props) {
    super(props);
    this.state = {
      position: {
        coords: {
          "accuracy": 1,
          "altitude": 0,
          "heading": 0,
          "latitude": 0,
          "longitude": 0,
          "speed": 0,
        },
        "mocked": true,
        "timestamp": 0,
      }
    };
  }

  componentDidMount() {
    this.props.fetchSpaces();
    Permissions.askAsync(Permissions.LOCATION).then(({ status, permissions }) => {
      if (status === 'granted') {
        return Location.getCurrentPositionAsync({enableHighAccuracy: true});
      }
    }).then(position => {
      if (Object.prototype.hasOwnProperty.call(position, "coords")) {
        this.setState({ position });
      }
    });
  }

  render() {
    return (
      <MapView
        style={{ flex: 1 }}
        showsUserLocation={true}
        showsMyLocationButton={true}
        loadingEnabled={true}
        initialRegion={{
          latitude: this.state.position.coords.latitude,
          longitude: this.state.position.coords.longitude,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
        region={{
          latitude: this.state.position.coords.latitude,
          longitude: this.state.position.coords.longitude,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
      >
        {Object.values(this.props.directory).map(space => {
          if(space.data && space.data.location && space.data.location.lat && space.data.location.lon) {
            return (
              <Marker
                coordinate={{
                  latitude: space.data.location.lat,
                  longitude: space.data.location.lon,
                }}
                key={space.data.space}
                onCalloutPress={() => this.props.navigation.navigate('SpaceDetails', space)}
                title={space.data.space}
                description={space.data.url}
              />
            );
          }
        })}
      </MapView>
    );
  }
}

Map.propTypes = {
  fetchSpaces: PropTypes.func,
  directory: PropTypes.object,
};

Map.defaultProps = {
  directory: {},
};

export default connect(mapStateToProps, mapDispatchToProps)(Map)