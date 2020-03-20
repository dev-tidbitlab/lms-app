import React, { Component } from "react";
import {
    View,
    ScrollView,
    StyleSheet,
    TouchableOpacity,
    Text,
    Image,
    StatusBar
} from "react-native";
import { TextInput } from 'react-native-paper';
import { Container, Header, Left, Body, Right, Button } from 'native-base';
import { withNavigation } from 'react-navigation'
import { connect } from 'react-redux';
import { Progress } from '../ProgressDialog/index'
import Ionicons from "react-native-vector-icons/Ionicons";
import ErrorToaster from '../../Components/alerts/error'
import SuccessToaster from '../../Components/alerts/success'
import { ForgotPasswordAction } from '../../Reducers/actions'
import CustomSnackBar from '../../Components/alerts/snackbar'
class ForgotPasswordScreen extends Component {
    state = {
        Email: '',
        EmailValidation: false
    }
    GoBackToHome() {
        this.props.navigation.goBack()
    }
    SubmitMethod() {
        const { Email } = this.state
        let EmailValidation = this.state.EmailValidation
        let status = false
        if (!Email) {
            status = true
            EmailValidation = true
        }
        this.setState({ EmailValidation: EmailValidation })
        if (status) {
            return 0;
        }
        this.props.ForgotPasswordAction({ email: Email })
    }
    render() {
        let EmailValidation = this.state.EmailValidation
        return (
            <Container style={{ backgroundColor: '#F4F4F6' }}>
                <Header style={{ backgroundColor: '#1A5566' }}>
                    <Left style={{ paddingLeft: 5, flex: 0.5 }}>
                        <Button transparent onPress={() => this.GoBackToHome()} >
                            <Ionicons name='md-arrow-back' size={24} color='#FFF' />
                        </Button>
                    </Left>
                    <Body style={{ flex: 2, alignItems: 'center', justifyContent: 'center' }}>
                        <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#FFF' }}>Forgot Password</Text>
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
                            error={EmailValidation}
                            style={styles.TextInputAll}
                            onChangeText={(v) => this.setState({ Email: v })}
                            label="Email"
                            value={this.state.Email}
                            theme={{ colors: { background: 'white', placeholder: '#888', text: '#000', primary: '#1A5566', underlineColor: 'transparent' } }}
                        />
                        <View style={styles.LoginBtnView}>
                            <TouchableOpacity onPress={() => this.SubmitMethod()} style={styles.TouchableOpacityBtn}>
                                <Text style={styles.LoginBtn}>Submit</Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                    <Progress DialogLoader={this.props.loading} title={'Please wait...'} />
                    {this.props.ErrorToaster.toast ? <ErrorToaster message={this.props.ErrorToaster.message} /> : null}
                    {this.props.SuccessToaster.toast?<SuccessToaster message={this.props.SuccessToaster.message}/>:null}
                    {/* <CustomSnackBar duration={0} visible={true} style={{backgroundColor:'#D54534'}} text={'fvd v d  fwfwe  ge g e  g e g e g eg  '}/> */}
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
        SuccessToaster: state.authReducer.SuccessToaster
    };
};
const mapDispatchToProps = (dispatch) => {
    return {
        ForgotPasswordAction: (payload) => dispatch(ForgotPasswordAction(payload)),
    };
};
export default withNavigation(connect(mapStateToProps, mapDispatchToProps)(ForgotPasswordScreen))

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
