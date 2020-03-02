import React, { Component } from "react";
import {
    View,
    Text,
    StyleSheet,
    Platform,
    Dimensions,
    TouchableOpacity,
    ScrollView,
    StatusBar,
} from "react-native";
import { TextInput } from 'react-native-paper';
import { withNavigationFocus } from 'react-navigation'
import Icon from 'react-native-vector-icons/Ionicons'
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import { Container, Thumbnail, Header, Picker, Left, Body, Right, Button, Title } from 'native-base';
import { Avatar } from 'react-native-paper';
import ImagePicker from 'react-native-image-picker'
import { connect } from 'react-redux';
import { UploadUserPicAction, SaveUserInfoAction, Loading, LoadingStop, GetUserInfo } from '../../Reducers/actions'
const width = Dimensions.get('window').width
import { Progress } from '../ProgressDialog/index'
import ErrorToaster from '../../Components/alerts/error'
import { FormPostAPI } from '../../service/index'
class EditUserProfile extends Component {
    constructor() {
        super();
        this.state = {
            UserInfo: {
                firstName: '',
                lastName: "",
                email: '',
                phoneNumber: '',
                streetAddress: '',
                city: '',
                state: '',
                passcode: '',
                country: ''
            },
            Loader: false,
            ValidationArray: {
                firstName: false,
                lastName: false,
                email: false,
                phoneNumber: false,
                city: false,
                state: false,
                country: false
            }
        }
    }
    componentDidMount() {
        if (this.props.UserInfo) {
            this.setState({ UserInfo: this.props.UserInfo })
        }
    }
    GoBack() {
        this.props.navigation.goBack();
    }
    SaveUserDetails() {
        console.log(this.state)
        const { UserInfo, ValidationArray } = this.state
        let ob = {
            firstName: UserInfo.firstName,
            lastName: UserInfo.lastName,
            email: UserInfo.email,
            city: UserInfo.city,
            state: UserInfo.state,
            country: UserInfo.country,
            phoneNumber: UserInfo.phoneNumber
        }
        let Validations = ValidationArray
        let status = 0
        if (!ob.firstName) {
            Validations.firstName = true
            status = 1
        }
        if (!ob.lastName) {
            Validations.lastName = true
            status = 1
        }
        if (!ob.email) {
            Validations.email = true
            status = 1
        }
        if (!ob.city) {
            Validations.city = true
            status = 1
        }
        if (!ob.state) {
            Validations.state = true
            status = 1
        }
        if (!ob.country) {
            Validations.country = true
            status = 1
        }
        if (!ob.phoneNumber) {
            Validations.phoneNumber = true
            status = 1
        }
        if (status == 1) {
            this.setState({ ValidationArray: Validations })
            return 0;
        } else {
            this.props.SaveUserInfoAction({ data: ob, props: this.props })
        }

    }
    LoadImage() {
        const options = {
            noData: true,
        }
        ImagePicker.launchImageLibrary(options, response => {
            console.log(options, response, 'ffd==>>>>')
            if (response.didCancel == undefined) {
                var formData = new FormData();
                formData.append('profileImage', {
                    uri: response.uri,
                    name: response.fileName,
                    type: response.type
                })
                console.log('hh==>>', formData)
                this.setState({ Loader: true })
                FormPostAPI('auth/reguser/update', formData).then(response => {
                    console.log(response, 'ttt==>>')
                    if (response.success) {
                        this.props.navigation.navigate('StudentProfile')
                        this.props.GetUserInfo(this.props)
                        this.setState({ Loader: false })
                    } else {
                        this.setState({ Loader: false })
                    }
                }).catch(function (error) {
                    console.log('error', error)
                    this.setState({ Loader: false })
                })
            }
        })
    }
    shouldComponentUpdate(nextState, nextProps) {
        if (this.state.UserInfo != nextProps.UserInfo) {
            this.setState({ UserInfo: nextProps.UserInfo })
            return true
        }
        return true;
    }
    render() {
        const { UserInfo, ValidationArray } = this.state
        const { profileImage } = this.state.UserInfo
        return (
            <Container style={{ backgroundColor: '#F4F4F6' }}>
                <Header style={{ elevation: 0, backgroundColor: '#1A5566' }}>
                    <Left style={{ flex: 1 }}>
                        <Button transparent onPress={() => this.GoBack()} >
                            <Icon name='md-arrow-back' size={24} color='#FFF' />
                        </Button>
                    </Left>
                    <Body style={{ flex: 2, alignItems: 'center' }}>
                        <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#FFF' }}>Edit Profile</Text>
                    </Body>
                    <Right style={{ flex: 1 }}>
                        {/* <Button transparent >
                            <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#FFF' }}>Save</Text>
                        </Button> */}
                    </Right>
                </Header>
                <ScrollView
                    showsHorizontalScrollIndicator={false}
                    showsVerticalScrollIndicator={false}
                    horizontal={false}
                    contentContainerStyle={{ backgroundColor: '#F4F4F6' }}
                >
                    <StatusBar backgroundColor="#1A5566" barStyle="light-content" />
                    <View style={styles.container}>
                        <View>
                            <View style={{ marginTop: 50 }}>
                                <TouchableOpacity onPress={() => this.LoadImage()} style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                                    <Avatar.Image size={110} source={profileImage ? { uri: profileImage } : null} />
                                    <FontAwesome style={{ padding: 5, backgroundColor: 'transparent', position: 'absolute', top: (110 / 2) - 20, left: (width / 2) + (110 / 2) - 15 }} name="pencil" size={24} color="#1A5566" />
                                </TouchableOpacity>
                            </View>
                            <View style={{ paddingLeft: 30, marginRight: 30, marginBottom: 40, }}>
                                <View style={{ height: 30, marginBottom: 30 }}>
                                    <TextInput
                                        error={ValidationArray.firstName}
                                        style={styles.TextInputAll}
                                        label="First Name"
                                        onChangeText={(v) => this.setState({ UserInfo: { ...this.state.UserInfo, firstName: v }, ValidationArray: { ...this.state.ValidationArray, firstName: false } })}
                                        value={UserInfo.firstName}
                                        theme={{ colors: { lineHeight: 14, background: 'white', placeholder: '#888', text: '#000', primary: '#1A5566', underlineColor: 'transparent' } }}
                                    />
                                </View>


                                <TextInput
                                    error={ValidationArray.lastName}
                                    style={styles.TextInputAll}
                                    label="Last Name"
                                    onChangeText={(v) => this.setState({ UserInfo: { ...this.state.UserInfo, lastName: v }, ValidationArray: { ...this.state.ValidationArray, lastName: false } })}
                                    value={UserInfo.lastName}
                                    theme={{ colors: { background: 'white', placeholder: '#888', text: '#000', primary: '#1A5566', underlineColor: 'transparent' } }}
                                />
                                <TextInput
                                    error={ValidationArray.email}
                                    style={styles.TextInputAll}
                                    label="Email"
                                    onChangeText={(v) => this.setState({ UserInfo: { ...this.state.UserInfo, email: v }, ValidationArray: { ...this.state.ValidationArray, email: false } })}
                                    value={UserInfo.email}
                                    theme={{ colors: { background: 'white', placeholder: '#888', text: '#000', primary: '#1A5566', underlineColor: 'transparent' } }}
                                />

                                <TextInput
                                    error={ValidationArray.phoneNumber}
                                    style={styles.TextInputAll}
                                    label="Phone Number"
                                    onChangeText={(v) => this.setState({ UserInfo: { ...this.state.UserInfo, phoneNumber: v }, ValidationArray: { ...this.state.ValidationArray, phoneNumber: false } })}
                                    value={UserInfo.phoneNumber}
                                    theme={{ colors: { background: 'white', placeholder: '#888', text: '#000', primary: '#1A5566', underlineColor: 'transparent' } }}
                                />

                                {/* <TextInput
                                    style={styles.TextInputAll}
                                    label="Street Address"
                                    onChangeText={(v) => this.setState({ UserInfo: { ...this.state.UserInfo, streetAddress: v } })}
                                    value={UserInfo.streetAddress}
                                    theme={{ colors: { background: 'white', placeholder: '#888', text: '#000', primary: '#1A5566', underlineColor: 'transparent' } }}
                                /> */}

                                <TextInput
                                    error={ValidationArray.city}
                                    style={styles.TextInputAll}
                                    label="City"
                                    onChangeText={(v) => this.setState({ UserInfo: { ...this.state.UserInfo, city: v }, ValidationArray: { ...this.state.ValidationArray, city: false } })}
                                    value={UserInfo.city}
                                    theme={{ colors: { background: 'white', placeholder: '#888', text: '#000', primary: '#1A5566', underlineColor: 'transparent' } }}
                                />

                                <TextInput
                                    error={ValidationArray.state}
                                    style={styles.TextInputAll}
                                    label="State"
                                    onChangeText={(v) => this.setState({ UserInfo: { ...this.state.UserInfo, state: v }, ValidationArray: { ...this.state.ValidationArray, state: false } })}
                                    value={UserInfo.state}
                                    theme={{ colors: { background: 'white', placeholder: '#888', text: '#000', primary: '#1A5566', underlineColor: 'transparent' } }}
                                />

                                {/* <TextInput
                                    style={styles.TextInputAll}
                                    label="Pascode"
                                    onChangeText={(v) => this.setState({ UserInfo: { ...this.state.UserInfo, passcode: v } })}
                                    value={UserInfo.passcode}
                                    theme={{ colors: { background: 'white', placeholder: '#888', text: '#000', primary: '#1A5566', underlineColor: 'transparent' } }}
                                /> */}

                                <TextInput
                                    error={ValidationArray.country}
                                    style={styles.TextInputAll}
                                    label="Country"
                                    onChangeText={(v) => this.setState({ UserInfo: { ...this.state.UserInfo, country: v }, ValidationArray: { ...this.state.ValidationArray, country: false } })}
                                    value={UserInfo.country}
                                    theme={{ colors: { background: 'white', placeholder: '#888', text: '#000', primary: '#1A5566', underlineColor: 'transparent' } }}
                                />
                                <TouchableOpacity onPress={() => this.SaveUserDetails()} style={{ marginTop: 25, bottom: 5, padding: 6, backgroundColor: '#1A5566', alignItems: 'center', justifyContent: 'center', borderRadius: 5 }}>
                                    <Text style={{ fontSize: 16, fontWeight: '600', padding: 10, color: '#FFF' }}>Save</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                        <Progress DialogLoader={this.props.loading} title={'Please wait...'} />
                        <Progress DialogLoader={this.state.Loader} title={'Please wait...'} />
                    </View>
                </ScrollView>
                {this.props.ErrorToaster.toast ? <ErrorToaster message={this.props.ErrorToaster.message} /> : null}
            </Container>
        );
    }
}
const mapStateToProps = (state) => {
    console.log(state, 'state profile edit')
    return {
        UserInfo: state.authReducer.UserInfo,
        loading: state.authReducer.loading,
        ErrorToaster: state.authReducer.ErrorToaster,
    };
};
const mapDispatchToProps = (dispatch) => {
    return {
        UploadUserPicAction: (payload) => dispatch(UploadUserPicAction(payload)),
        SaveUserInfoAction: (payload) => dispatch(SaveUserInfoAction(payload)),
        Loading: (payload) => dispatch(Loading(payload)),
        LoadingStop: (payload) => dispatch(LoadingStop(payload)),
        GetUserInfo: (payload) => dispatch(GetUserInfo(payload)),

    };
};
export default withNavigationFocus(connect(mapStateToProps, mapDispatchToProps)(EditUserProfile))

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    searchSection: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderRadius: 50
    },
    searchIcon: {
        paddingLeft: 10,
    },
    input: {
        flex: 1,
        paddingTop: 10,
        paddingRight: 10,
        paddingBottom: 10,
        paddingLeft: 5,
        backgroundColor: '#000',
        color: '#424242',
        borderRadius: 50,
        lineHeight: 16
    },
    lineStyle: {
        borderWidth: 0.5,
        borderColor: '#BBB',
    },
    TextInputAll: {
        borderWidth: 0.5,
        borderColor: '#d6d7da',
        // marginTop: 15,
        backgroundColor: 'transparent',
        borderWidth: 0,
        paddingHorizontal: 0,
        lineHeight: 16
    },
    LoginBtn: {
        fontSize: 16,
        color: '#fff',
        paddingTop: 15,
        paddingBottom: 15,
        textAlign: 'center',
    },
    TouchableOpacityBtn: {
        backgroundColor: '#1A5566',
        marginTop: 30,
        marginBottom: 30
    }
});
