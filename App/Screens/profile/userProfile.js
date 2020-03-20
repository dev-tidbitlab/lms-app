import React, { Component } from "react";
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    StatusBar,
    RefreshControl
} from "react-native";
import { withNavigationFocus } from 'react-navigation'
import Icon from 'react-native-vector-icons/Ionicons'
import Entypo from 'react-native-vector-icons/Entypo'
import { Container, Header, Left, Body, Right, Button } from 'native-base';
import { Avatar } from 'react-native-paper';
import { connect } from 'react-redux';
import Menu, { MenuItem, MenuDivider } from 'react-native-material-menu';
import { UploadUserPicAction, GetUserInfo } from '../../Reducers/actions'
import { fonts } from '../../Themes/style'
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
        if (prevProps.isFocused !== this.props.isFocused) {
            this.props.GetUserInfo(this.props)
        }
    }
    render() {
        const { email, firstName, lastName, state, city, country, phoneNumber, profileImage } = this.props.UserInfo
        return (
            <Container style={{ backgroundColor: '#F4F4F6' }}>
                <Header style={{ backgroundColor: '#1A5566' }}>
                    <Left style={{ flex: 1 }}>
                        <Button transparent onPress={() => this.GoBack()} >
                            <Icon name='md-arrow-back' size={24} color='#FFF' />
                        </Button>
                    </Left>
                    <Body style={{ flex: 2, alignItems: 'center' }}>
                        <Text style={{ ...fonts.h5, fontWeight: '500', color: '#FFF' }}>Profile</Text>
                    </Body>
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
                    contentContainerStyle={{ backgroundColor: '#F4F4F6' }}
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
                                <Text style={styles.dataTestStyle} >Name</Text>
                                <Text style={styles.nameStyle}>{firstName ? firstName + ' ' + lastName : null}</Text>
                            </View>

                            <View style={{ marginBottom: 20 }}>
                                <Text style={styles.dataTestStyle}>Email</Text>
                                <Text style={styles.textStyles}>{email ? email : null}</Text>
                            </View>

                            <View style={{ marginBottom: 20 }}>
                                <Text style={styles.dataTestStyle}>Phone Number</Text>
                                <Text style={styles.textStyles}>{phoneNumber ? phoneNumber : null}</Text>
                            </View>

                            <View style={{ marginBottom: 20 }}>
                                <Text style={styles.dataTestStyle}>City</Text>
                                <Text style={styles.textStyles}>{city ? city : null}</Text>
                            </View>

                            <View style={{ marginBottom: 20 }}>
                                <Text style={styles.dataTestStyle}>State</Text>
                                <Text style={styles.textStyles}>{state ? state : null}</Text>
                            </View>

                            <View style={{ marginBottom: 20 }}>
                                <Text style={styles.dataTestStyle}>Country</Text>
                                <Text style={styles.textStyles}>{country ? country : null}</Text>
                            </View>
                        </View>
                    </View>
                </ScrollView>
            </Container>
        );
    }
}
const mapStateToProps = (state) => {
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
    dataTestStyle: {
        ...fonts.h8, color: '#888', fontWeight: '500'
    },
    textStyles: { ...fonts.h6, lineHeight: 20, color: '#000', fontWeight: '500' },
    nameStyle: { ...fonts.h6, lineHeight: 20, fontWeight: '500', lineHeight: 16, marginTop: 0, }
});
