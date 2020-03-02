import React, { Component } from "react";
import {
    View,
    Text,
    StyleSheet,
    Platform,
    TouchableOpacity,
    ScrollView,
    StatusBar,
    Dimensions,
    RefreshControl
} from "react-native";
import { withNavigation, withNavigationFocus } from 'react-navigation'
import Icon from 'react-native-vector-icons/Ionicons'
import Entypo from 'react-native-vector-icons/Entypo'
import { Container, Thumbnail, Header, Picker, Left, Body, Right, Button, Title } from 'native-base';
import { Avatar } from 'react-native-paper';
import { connect } from 'react-redux';
import Menu, { MenuItem, MenuDivider } from 'react-native-material-menu';
import ImagePicker from 'react-native-image-picker'
import { UploadUserPicAction, GetUserInfo } from '../../Reducers/actions'
const width = Dimensions.get('window').width

class UserProfile extends Component {
    state = {
        EditProfile: false
    }
    _menu = null;

    setMenuRef = ref => {
        this._menu = ref;
    };

    hideMenu = () => {
        this._menu.hide();
    };

    showMenu = () => {
        this._menu.show();
    };
    GoBack() {
        this.props.navigation.navigate('UserListScreen');
    }
    LoadImage() {
        return 0;
    }
    ChangePassword() {
        this.hideMenu()
        this.props.navigation.navigate('ChangePassword')
    }
    ToggleEditProfile() {
        this.hideMenu()
        this.props.navigation.navigate('EditUserProfile', {
            UserInfo: this.props.UserInfo
        });
    }
    _onRefresh() {
        this.props.GetUserInfo(this.props)
    }
    componentDidUpdate(prevProps) {
        console.log(prevProps.isFocused, this.props.isFocused, 'fwffwfwfwf===>>>')
        if (prevProps.isFocused !== this.props.isFocused) {
            console.log('12345')
            this.props.GetUserInfo(this.props)
        }
    }
    render() {
        let EditProfile = this.state.EditProfile
        const { email, firstName, lastName, state, city, country, phoneNumber, profileImage } = this.props.UserInfo
        console.log(this.props.UserInfo, '00000000000')
        return (
            <Container style={{ backgroundColor: '#F4F4F6' }}>
                <Header style={{ backgroundColor: '#1A5566' }}>
                    <Left style={{ flex: 1 }}>
                        <Button transparent onPress={() => this.GoBack()} >
                            <Icon name='md-arrow-back' size={24} color='#FFF' />
                        </Button>
                    </Left>
                    <Body style={{ flex: 2, alignItems: 'center' }}>
                        <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#FFF' }}>Profile</Text>
                    </Body>
                    {/* <Right style={{ flex: 1 }}>
                        <Button transparent onPress={() => this.ToggleEditProfile()} >
                            <FontAwesome name='edit' size={24} color='#FFF' />
                        </Button>
                    </Right> */}
                    <Right style={{ flex: 1 }}>
                        <Menu
                            ref={this.setMenuRef}
                            button={<TouchableOpacity onPress={this.showMenu}><Entypo name="dots-three-vertical" size={20} color="#FFF" /></TouchableOpacity>}
                        >
                            <MenuItem onPress={() => this.ToggleEditProfile()}>Edit Profile</MenuItem>
                            <MenuDivider />
                            <MenuItem onPress={() => this.ChangePassword()}>Change Password</MenuItem>
                        </Menu>
                    </Right>
                </Header>
                <StatusBar backgroundColor="#1A5566" barStyle="light-content" />
                <ScrollView
                contentContainerStyle={{backgroundColor: '#F4F4F6'}}
                    showsHorizontalScrollIndicator={false}
                    showsVerticalScrollIndicator={false}
                    horizontal={false}
                    refreshControl={
                        <RefreshControl
                            colors={['#1A5566']}
                            progressBackgroundColor="#FFF"
                            refreshing={this.props.loading}
                            onRefresh={() => this._onRefresh()}
                        />
                    }
                >
                    <View style={styles.container}>
                        <View style={{ marginTop: 50 }}>
                            <TouchableOpacity onPress={() => this.LoadImage()} style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                                <Avatar.Image style={{ backgroundColor: '#EEE' }} size={110} source={profileImage ? { uri: profileImage } : null} />
                            </TouchableOpacity>
                        </View>
                        <View style={{ paddingLeft: 20, paddingRight: 20, justifyContent: 'flex-start', alignItems: 'flex-start', marginTop: 30, marginLeft: 20, marginRight: 20 }}>
                            <View style={{ marginBottom: 20 }}>
                                <Text style={{ fontSize: 10, color: '#888', }} >Name</Text>
                                <Text style={{ fontSize: 16, lineHeight: 16, fontWeight: '500', lineHeight: 16, marginTop: 0, }}>{firstName ? firstName + ' ' + lastName : null}</Text>
                            </View>

                            <View style={{ marginBottom: 20 }}>
                                <Text style={{ fontSize: 10, color: '#888', }}>Email</Text>
                                <Text style={{ fontSize: 16, lineHeight: 16, fontWeight: '500', color: '#000', }}>{email ? email : null}</Text>
                            </View>

                            <View style={{ marginBottom: 20 }}>
                                <Text style={{ fontSize: 10, color: '#888', }}>Phone Number</Text>
                                <Text style={{ fontSize: 16, lineHeight: 20, color: '#000', fontWeight: '500' }}>{phoneNumber ? phoneNumber : null}</Text>
                            </View>

                            {/* <View style={{ marginBottom: 20 }}>
                                <Text style={{ fontSize: 10, color: '#888', }}>Street Address</Text>
                                <Text style={{ fontSize: 16, lineHeight: 20, color: '#000', fontWeight: '500' }}>407 iscon plaza Opp. start bazaar iscon road scon plaza Opp. start bazaar iscon road</Text>
                            </View> */}

                            <View style={{ marginBottom: 20 }}>
                                <Text style={{ fontSize: 10, color: '#888', }}>City</Text>
                                <Text style={{ fontSize: 16, lineHeight: 20, color: '#000', fontWeight: '500' }}>{city ? city : null}</Text>
                            </View>

                            <View style={{ marginBottom: 20 }}>
                                <Text style={{ fontSize: 10, color: '#888', }}>State</Text>
                                <Text style={{ fontSize: 16, lineHeight: 20, color: '#000', fontWeight: '500' }}>{state ? state : null}</Text>
                            </View>

                            {/* <View style={{ marginBottom: 20 }}>
                                <Text style={{ fontSize: 10, color: '#888', }}>Pascode</Text>
                                <Text style={{ fontSize: 16, lineHeight: 20, color: '#000', fontWeight: '500' }}>380015</Text>
                            </View> */}

                            <View style={{ marginBottom: 20 }}>
                                <Text style={{ fontSize: 10, color: '#888', }}>Country</Text>
                                <Text style={{ fontSize: 16, lineHeight: 20, color: '#000', fontWeight: '500' }}>{country ? country : null}</Text>
                            </View>
                        </View>
                    </View>
                </ScrollView>
            </Container>
        );
    }
}
const mapStateToProps = (state) => {
    console.log(state, 'state profile==>>')
    return {
        loading: state.authReducer.loading,
        ErrorToaster: state.authReducer.ErrorToaster,
        UserInfo: state.authReducer.UserInfo
    };
};
const mapDispatchToProps = (dispatch) => {
    return {
        UploadUserPicAction: (payload) => dispatch(UploadUserPicAction(payload)),
        GetUserInfo: (payload) => dispatch(GetUserInfo(payload)),
    };
};
export default withNavigationFocus(connect(mapStateToProps, mapDispatchToProps)(UserProfile))

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
});
