import React, { Component } from "react";
import {
    View,
    ScrollView,
    StyleSheet,
    TouchableOpacity,
    Text,
    Alert,
    Image,
    StatusBar
} from "react-native";
import { TextInput } from 'react-native-paper';
import AsyncStorage from '@react-native-community/async-storage';
import { Container, Header, Left, Body, Right, Button } from 'native-base';
import { withNavigation } from 'react-navigation'
import { connect } from 'react-redux';
import { loginAction } from '../../Reducers/actions'
import firebase from 'react-native-firebase';
import Ionicons from "react-native-vector-icons/Ionicons";
import { Progress } from '../ProgressDialog/index'
import ErrorToaster from '../../Components/alerts/error'
import CustomSnackBar from '../../Components/alerts/snackbar'
class LoginScreen extends Component {
    state = {
        Password: '',
        Email: '',
        ValidationArray: { email: false, password: false }
    }
    GoToUserProfile() {
        this.props.navigation.openDrawer();
    }
    OpenDrawer() {
        this.props.navigation.openDrawer();
    }
    async getFCMToken() {
        let fcmToken = await AsyncStorage.getItem('worddiagnostics_fcm_token');
        if (!fcmToken) {
            fcmToken = await firebase.messaging().getToken();
            if (fcmToken) {
            }
        }
    }
    async checkPermission() {
        firebase.messaging().hasPermission()
            .then(enabled => {
                if (enabled) {
                    this.getFCMToken();
                } else {
                    this.requestPermission();
                }
            });
    }

    //2
    async requestPermission(auth_token) {
        firebase.messaging().requestPermission()
            .then(() => {
                this.getFCMToken();
            })
            .catch(error => {
            });
    }
    async createNotificationListeners() {
        /*
        * Triggered when a particular notification has been received in foreground
        * */
        // trigger whe app is closed
        firebase.notifications().getInitialNotification()
            .then((notificationOpen) => {
                console.log(notificationOpen, 'notificationOpen11')
                if (notificationOpen) {
                    // App was opened by a notification
                    // Get the action triggered by the notification being opened
                    const action = notificationOpen.action;
                    // Get information about the notification that was opened
                    const notification = notificationOpen.notification;
                }
            });
        // trigger when app is open
        this.notificationListener = firebase.notifications().onNotification((notification) => {
            const { title, body } = notification;

            const localNotification = new firebase.notifications.Notification({
                sound: 'sampleaudio',
                show_in_foreground: true,
            })
                .setSound('sampleaudio.wav')
                .setNotificationId(notification.notificationId)
                .setTitle(notification.title)
                .setBody(notification.body)
                .android.setChannelId('fcm_FirebaseNotifiction_default_channel') // e.g. the id you chose above
                .android.setSmallIcon('@drawable/ic_launcher') // create this icon in Android Studio
                .android.setColor('#000000') // you can set a color here
                .android.setPriority(firebase.notifications.Android.Priority.High);

            firebase.notifications()
                .displayNotification(localNotification)
                .catch(err => console.error(err));
        });

        const channel = new firebase.notifications.Android.Channel('fcm_FirebaseNotifiction_default_channel', 'Demo app name', firebase.notifications.Android.Importance.High)
            .setDescription('Demo app description')
            .setSound('sampleaudio.wav');
        firebase.notifications().android.createChannel(channel);

        /*
        * If your app is in background, you can listen for when a notification is clicked / tapped / opened as follows:
        * */
        //trigged when click on notifications
        this.notificationOpenedListener = firebase.notifications().onNotificationOpened((notificationOpen) => {
            const { title, body } = notificationOpen.notification;
            console.log(notificationOpen.notification, 'notificationOpen.notification;====')
            console.log('onNotificationOpened:');
            Alert.alert(title, body)
        });

        /*
        * If your app is closed, you can check if it was opened by a notification being clicked / tapped / opened as follows:
        * */
        const notificationOpen = await firebase.notifications().getInitialNotification();
        if (notificationOpen) {
            const { title, body } = notificationOpen.notification;
            console.log('getInitialNotification:======1', notificationOpen);
            Alert.alert(title, body)
        }
        /*
        * Triggered for data only payload in foreground
        * */
        this.messageListener = firebase.messaging().onMessage((message) => {
            //process data message
            console.log("JSON.stringify:", JSON.stringify(message));
        });
    }
    componentDidMount() {
        this.checkPermission()
        this.createNotificationListeners();
    }
    MakeLogin() {
        const { Email, Password } = this.state
        let ValidationArray = this.state.ValidationArray
        let status = false
        if (!Email) {
            status = true
            ValidationArray.email = true
        }
        if (!Password) {
            status = true
            ValidationArray.password = true
        }
        let bodyData = {
            email: Email,
            password: Password
        }
        this.setState({ ValidationArray: ValidationArray })
        if (status) {
            return 0;
        }
        this.props.loginAction({ data: JSON.stringify(bodyData), props: this.props })
    }
    componentWillUnmount() {
        this.notificationListener;
        this.notificationOpenedListener;
    }
    ForgotPasswordMethod() {
        this.props.navigation.navigate('ForgotPassword')
    }
    SignUpScreen() {
        this.props.navigation.navigate('AppRegisterScreen')
    }
    onChangeEmail(v) {
        let ValidationArray = this.state.ValidationArray
        ValidationArray.email = false
        this.setState({ Email: v, ValidationArray: ValidationArray })
    }
    onChangePassword(v) {
        let ValidationArray = this.state.ValidationArray
        ValidationArray.password = false
        this.setState({ Password: v, ValidationArray: ValidationArray })
    }
    GoBackToHome() {
        this.props.navigation.goBack()
    }

    render() {
        let ValidationArray = this.state.ValidationArray
        return (
            <Container style={{ backgroundColor: '#F4F4F6' }}>
                <Header style={{ backgroundColor: '#1A5566' }}>
                    <Left style={{ paddingLeft: 5, flex: 0.5 }}>
                        <Button transparent onPress={() => this.GoBackToHome()} >
                            <Ionicons name='md-arrow-back' size={24} color='#FFF' />
                        </Button>
                    </Left>
                    <Body style={{ flex: 2, alignItems: 'center', justifyContent: 'center' }}>
                        <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#FFF' }}>Login</Text>
                    </Body>
                    <Right style={{ flex: 0.5 }}>
                    </Right>
                </Header>
                <StatusBar backgroundColor="#1A5566" barStyle="light-content" />
                <ScrollView contentContainerStyle={{ flex: 1, height: '100%', backgroundColor: '#f1f2f7' }}>
                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                        <View style={{ justifyContent: 'center', alignItems: 'center', alignContent: 'center', }}>
                            <Image style={{ height: 150, width: 150, justifyContent: 'center', alignItems: 'center', alignContent: 'center', resizeMode: 'contain', }} source={require('../../Images/logo.png')} />
                        </View>
                        <View style={styles.MainView3}>
                            <TextInput
                                error={ValidationArray.email}
                                style={styles.TextInputAll}
                                onChangeText={(v) => this.onChangeEmail(v)}
                                label="Email"
                                value={this.state.Email}
                                onSubmitEditing={() => this.MakeLogin()}
                                theme={{ colors: { background: 'white', placeholder: '#888', text: '#000', primary: '#1A5566', underlineColor: 'transparent' } }}
                            />
                            <TextInput
                                error={ValidationArray.password}
                                style={styles.TextInputAll}
                                label="Password"
                                onChangeText={(v) => this.onChangePassword(v)}
                                secureTextEntry={true}
                                value={this.state.Password}
                                onSubmitEditing={() => this.MakeLogin()}
                                theme={{ colors: { background: 'white', placeholder: '#888', text: '#000', primary: '#1A5566', underlineColor: 'transparent' } }}
                            />
                            <View style={styles.LoginBtnView}>
                                <TouchableOpacity onPress={() => this.MakeLogin()} style={styles.TouchableOpacityBtn}>
                                    <Text style={styles.LoginBtn}>Login</Text>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => this.ForgotPasswordMethod()} style={styles.TouchableOpacityBtn}>
                                    <Text style={styles.LoginBtnPSWD}>Forgot Password?</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                        {/* <View style={{ position: 'absolute', width: '100%', alignItems: 'center', justifyContent: 'center', bottom: 10 }}>
                        <TouchableOpacity onPress={() => this.SignUpScreen()} style={{ padding: 10 }}>
                            <Text>Don't have account? Sign up now</Text>
                        </TouchableOpacity>
                    </View> */}
                        <Progress DialogLoader={this.props.loading} title={'Authenticating'} />
                        {this.props.ErrorToaster.toast ? <ErrorToaster message={this.props.ErrorToaster.message} /> : null}
                    </View>
                    {/* <CustomSnackBar duration={0} visible={true} text={'fvd v d  fwfwe  ge g e  g e g e g eg  '}/> */}
                </ScrollView>
            </Container>

        );
    }
}
const mapStateToProps = (state) => {
    console.log(state, 'state')
    return {
        loading: state.authReducer.loading,
        ErrorToaster: state.authReducer.ErrorToaster,
    };
};
const mapDispatchToProps = (dispatch) => {
    return {
        loginAction: (payload) => dispatch(loginAction(payload)),
    };
};
export default withNavigation(connect(mapStateToProps, mapDispatchToProps)(LoginScreen))

const styles = StyleSheet.create({
    loginText: {
        fontSize: 20, fontWeight: '700',
        color: '#1A5566'
    },
    ScrollView1: {
        flex: 1,
        backgroundColor: '#EEE'
    },
    MainView2: {
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#AAA',
        height: 233
    },
    MainView3: {
        width: '80%',
        margin: 20
    },
    TextInputAll: {
        borderColor: '#d6d7da',
        marginTop: 5,
        backgroundColor: 'transparent',
        padding: 0,
        margin: 0,
        paddingHorizontal: 0
    },
    LoginBtnView: {
        marginTop: 30,
    },
    TouchableOpacityBtn: {
    },
    LoginBtn: {
        fontSize: 16,
        color: '#fff',
        borderRadius: 5,
        backgroundColor: '#1A5566',
        paddingTop: 10,
        paddingBottom: 10,
        textAlign: 'center',
    },
    LoginBtnPSWD: {
        fontSize: 16,
        color: '#888',
        backgroundColor: 'transparent',
        paddingTop: 5,
        paddingBottom: 5,
        textAlign: 'center',
        marginTop: 30,
        textDecorationLine: 'underline',
    },

});
