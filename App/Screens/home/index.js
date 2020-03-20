import React, { Component } from "react";
import {
  TouchableOpacity,
  Text,
  StatusBar
} from "react-native";
import { Container, Header, Left, Body, Right } from 'native-base';
import { withNavigationFocus } from 'react-navigation'
import { Avatar } from 'react-native-paper';
import { connect } from 'react-redux';
import UserDashboard from './dashboard/dashboard'
import {fonts} from '../../Themes/style'
class HomeScreen extends Component {
  GoToUserProfile() {
    this.props.navigation.openDrawer();
  }
  OpenDrawer() {
    this.props.navigation.openDrawer();
  }
  GoToUserInfo(v) {
    this.props.navigation.navigate('UserInfoScreen')

  }
  render() {
    const { profileImage } = this.props.UserInfo
    return (
      <Container style={{ backgroundColor: '#F4F4F6' }}>
        <Header style={{ backgroundColor: '#1A5566' }}>
          <Left style={{ paddingLeft: 5, flex: 1 }}>
            <TouchableOpacity onPress={() => this.OpenDrawer()} style={{ width: 32, height: 32 }}>
              <Avatar.Image style={{ backgroundColor: '#EEE' }} onPress={() => this.OpenDrawer()} size={32} source={profileImage ? { uri: profileImage } : null} />
            </TouchableOpacity>
          </Left>
          <Body style={{ flex: 2, alignItems: 'center' }}>
            <Text style={{ ...fonts.h5, fontWeight: '500', color: '#FFF' }}>Dashboard</Text>
          </Body>
          <Right>
          </Right>
        </Header>
        <StatusBar backgroundColor="#1A5566" barStyle="light-content" />
        <UserDashboard props={this} GoToUserInfo={(v) => this.GoToUserInfo(v)}></UserDashboard>
      </Container>
    );
  }
}
const mapStateToProps = (state) => {
  return {
    UserInfo: state.authReducer.UserInfo
  };
};
export default withNavigationFocus(connect(mapStateToProps)(HomeScreen))
