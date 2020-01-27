import React, { Component } from "react";
import {
    View,
    StyleSheet,
    ScrollView,
    Text,
    Platform,
    Dimensions,
    TouchableOpacity
} from "react-native";
import { withNavigation } from 'react-navigation'
import Ionicons from "react-native-vector-icons/Ionicons";
import { TextInput } from 'react-native-paper';

class NewUserSignUpScreen extends Component {
    constructor() {
        super();
        this.state = {
            name: '',
            email: '',
            mobile: ''
        }
    }
    GoBackToHome() {
        this.props.navigation.goBack()
    }
    SignInScreen() {
        this.props.navigation.goBack()
    }
    render() {
        return (
            <ScrollView contentContainerStyle={{ flex: 1, height: '100%' }}>
                <View>
                    <View style={{ position: 'absolute', top: 10 }}>
                        <Ionicons
                            onPress={() => this.GoBackToHome()}
                            name={Platform.OS === 'android' ? "md-arrow-back" : "ios-arrow-round-back"}
                            color='#1A5566'
                            size={32}
                            style={{ backgroundColor: 'transparent', padding: 10, left: 10, top: 10 }}
                        />
                    </View>
                    <View style={{ alignItems: 'center', width: '100%', height: '100%', justifyContent:'center' }}>
                        <View style={styles.MainView3}>
                            <TextInput
                                style={styles.TextInputAll}
                                onChangeText={(v) => this.setState({ name: v })}
                                label="Name"
                                value={this.state.name}
                                theme={{ colors: { background: 'white', placeholder: '#888', text: '#000', primary: '#1A5566', underlineColor: 'transparent' } }}
                            />
                            <TextInput
                                style={styles.TextInputAll}
                                onChangeText={(v) => this.setState({ email: v })}
                                label="Email"
                                value={this.state.email}
                                theme={{ colors: { background: 'white', placeholder: '#888', text: '#000', primary: '#1A5566', underlineColor: 'transparent' } }}
                            />
                            <TextInput
                                style={styles.TextInputAll}
                                onChangeText={(v) => this.setState({ mobile: v })}
                                label="Mobile No."
                                value={this.state.mobile}
                                theme={{ colors: { background: 'white', placeholder: '#888', text: '#000', primary: '#1A5566', underlineColor: 'transparent' } }}
                            />
                            <View style={styles.LoginBtnView}>
                                <TouchableOpacity onPress={() => this.SubmitMethod()} style={styles.TouchableOpacityBtn}>
                                    <Text style={styles.LoginBtn}>Sign up</Text>
                                </TouchableOpacity>
                            </View>
                            <View style={{ width: '100%', marginTop: 20, alignItems: 'center', justifyContent: 'center' }}>
                                <TouchableOpacity onPress={() => this.SignInScreen()} style={{ padding: 10 }}>
                                    <Text>Have account? Sign in</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </View>
            </ScrollView>
        );
    }
}
export default withNavigation(NewUserSignUpScreen);
const styles = StyleSheet.create({
    MainView3: {
        backgroundColor: '#fff',
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
        marginTop: 30
    },
    TouchableOpacityBtn: {
        borderRadius: 5,
        backgroundColor: '#1A5566',
        justifyContent: 'center',
        alignItems: 'center',
    },
    LoginBtn: {
        fontSize: 16,
        color: '#fff',
        paddingTop: 10,
        paddingBottom: 10,
    }
});
