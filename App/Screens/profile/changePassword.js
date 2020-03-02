import React, { Component } from "react";
import {
    View,
    ScrollView,
    StyleSheet,
    TouchableOpacity,
    Text,
    Platform,
    Image,
    StatusBar
} from "react-native";
import { TextInput } from 'react-native-paper';
import { Container, Card, CardItem, Header, Thumbnail, Left, Body, Right, Button, Title } from 'native-base';
import { withNavigation } from 'react-navigation'
import { Formik } from 'formik';
import { Progress } from '../ProgressDialog/index'
import Ionicons from "react-native-vector-icons/Ionicons";
import SnackBar from '../../Components/snackBar'
import { POST } from '../../service/index'
import * as yup from 'yup'
var validationSchema = yup.object().shape({
    currentPassword: yup.string()
        .required(),
    newPassword: yup.string()
        .required(),
    confirmPassword: yup.string()
        .oneOf([yup.ref('newPassword'), null])
        .required()
})

class UserChangePasswordScreen extends Component {
    state = {
        status: false,
        message: '',
        Errorcode: 0,
        loading: false
    }
    GoBackToHome() {
        this.props.navigation.goBack()
    }
    ChangePassword(values) {
        let app = this
        this.setState({ loading: true, Errorcode: 0, status: false, message: ''})
        POST('auth/reguser/changePass', JSON.stringify(values)).then(res => {
            console.log('res', res)
            if (res.success) {
                this.setState({ status: true, message: res.message, Errorcode: 1 })
                setTimeout(function(){
                    app.GoBackToHome()
                }, 10000);
            } else {
                this.setState({ status: true, message: res.message, Errorcode: 2 })
            }
            this.setState({ loading: false })
        })
    }
    render() {
        const { loading, status, message, Errorcode } = this.state
        return (
            <Container style={{ backgroundColor: '#F4F4F6' }}>
                <Header style={{ backgroundColor: '#1A5566' }}>
                    <Left style={{ flex: 1 }}>
                        <Button transparent onPress={() => this.GoBackToHome()} >
                            <Ionicons name='md-arrow-back' size={24} color='#FFF' />
                        </Button>
                    </Left>
                    <Body style={{ flex: 2, alignItems: 'center' }}>
                        <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#FFF' }}>Change Password</Text>
                    </Body>
                    <Right style={{ flex: 1 }}>
                    </Right>
                </Header>
                <StatusBar backgroundColor="#1A5566" barStyle="light-content" />
                <ScrollView contentContainerStyle={{ flex: 1, height: '100%', backgroundColor: '#F4F4F6' }}>
                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                        <Formik initialValues={{ newPassword: '', currentPassword: '', confirmPassword: '' }}
                            onSubmit={values => this.ChangePassword(values)}
                            validationSchema={validationSchema}
                        >
                            {({ values, handleChange, errors, handleSubmit }) => (
                                <View style={styles.MainView3}>
                                    <TextInput
                                        value={values.currentPassword}
                                        secureTextEntry={true}
                                        error={errors.currentPassword ? true : false}
                                        onChangeText={handleChange('currentPassword')}
                                        style={styles.TextInputAll}
                                        label="Old Passsword"
                                        theme={{ colors: { background: 'white', placeholder: '#888', text: '#000', primary: '#1A5566', underlineColor: 'transparent' } }}
                                    />
                                    <TextInput
                                        value={values.newPassword}
                                        secureTextEntry={true}
                                        error={errors.newPassword ? true : false}
                                        onChangeText={handleChange('newPassword')}
                                        style={styles.TextInputAll}
                                        label="New Password"
                                        theme={{ colors: { background: 'white', placeholder: '#888', text: '#000', primary: '#1A5566', underlineColor: 'transparent' } }}
                                    />
                                    <TextInput
                                        value={values.confirmPassword}
                                        secureTextEntry={true}
                                        error={errors.confirmPassword ? true : false}
                                        onChangeText={handleChange('confirmPassword')}
                                        style={styles.TextInputAll}
                                        label="Re-type password"
                                        theme={{ colors: { background: 'white', placeholder: '#888', text: '#000', primary: '#1A5566', underlineColor: 'transparent' } }}
                                    />
                                    <View style={styles.LoginBtnView}>
                                        <TouchableOpacity onPress={handleSubmit} style={styles.TouchableOpacityBtn}>
                                            <Text style={styles.LoginBtn}>Submit</Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            )}
                        </Formik>
                        {status ? <SnackBar
                            style={{ backgroundColor: Errorcode == 1 ? '#4FAE62' : '#F00' }}
                            numberOfLines={3}
                            duration={0}
                            actionTextStyle={{ color: '#FFF' }}
                            actionText={'OK'}
                            text={message}
                        /> : null}
                        <Progress DialogLoader={loading} title={'Please wait...'} />
                    </View>
                </ScrollView>
            </Container>
        );
    }
}

export default withNavigation(UserChangePasswordScreen)

const styles = StyleSheet.create({
    loginText: {
        fontSize: 20, fontWeight: '700', textAlign: 'left', marginLeft: 20,
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
        borderRadius: 4,
        borderWidth: 0.5,
        borderColor: '#d6d7da',
        marginTop: 15,
        backgroundColor: 'transparent',
        borderWidth: 0,
        padding: 0,
        margin: 0,
        paddingHorizontal: 0
    },
    LoginBtnView: {
        marginTop: 30
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
