import React, { Component } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
  Text,
  StatusBar
} from "react-native";
import { Container, Header, Left, Body, Right, Button, Title } from 'native-base';
import { withNavigationFocus } from 'react-navigation'
import { Avatar } from 'react-native-paper';
import { connect } from 'react-redux';
import UserDashboard from './dashboard/dashboard'
class HomeScreen extends Component {
  GoToUserProfile() {
    this.props.navigation.openDrawer();
  }
  OpenDrawer() {
    this.props.navigation.openDrawer();
  }
  componentDidUpdate(prevProps) {
    if (prevProps.isFocused !== this.props.isFocused) {
    }
  }
  Logout() {
    let app = this
  }
  GoToUserInfo(v) {
    console.log(v, 'v')
    this.props.navigation.navigate('UserInfoScreen')

  }
  render() {
    return (
      <Container style={{ backgroundColor: '#F4F4F6' }}>
        <Header style={{ backgroundColor: '#1A5566' }}>
          <Left style={{ paddingLeft: 5, flex: 1 }}>
            <TouchableOpacity onPress={() => this.OpenDrawer()} style={{ width: 32, height: 32 }}>
              {/* this.props.UserInfo.success ? this.props.UserInfo.userPic : */}
              {/* <Avatar.Image onPress={() => this.OpenDrawer()} size={32} source={{ uri:  null }} /> */}
              <Avatar.Image style={{backgroundColor:'#EEE'}} onPress={() => this.OpenDrawer()} size={32} source={{ uri: this.props.UserInfo.success ? (this.props.UserInfo.profileImage ? this.props.UserInfo.profileImage : null) : null }} />
            </TouchableOpacity>
          </Left>
          <Body style={{ flex: 2, alignItems: 'center' }}>
            <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#FFF' }}>Dashboard</Text>
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
  console.log(state, 'state profile==>>')
  return {
    UserInfo: state.authReducer.UserInfo
  };
};
export default withNavigationFocus(connect(mapStateToProps)(HomeScreen))
