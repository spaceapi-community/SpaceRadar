import React from 'react';
import { View } from 'react-native';
import {
  Text,
} from 'react-native-elements';
import PropTypes from "prop-types";

class LogoTitle extends React.Component {
  render() {
    return (
      <View style={{ width: 100, height: 50, backgroundColor: "darkblue", flex: 1, alignItems: "center", flexDirection: "row" }}>
        <View style={{marginLeft: 5}}>
          <Text h4 style={{color: "white",}}>
            {this.props.title}
          </Text>
        </View>
      </View>
    );
  }
}

LogoTitle.propTypes = {
  title: PropTypes.string,
};

LogoTitle.defaultProps = {};

export default LogoTitle;