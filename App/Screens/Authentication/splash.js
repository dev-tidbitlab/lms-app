import React, { Component } from "react";
import {
    View,
    StyleSheet,
    StatusBar,
    Image
} from "react-native";
import { withNavigation } from 'react-navigation'
import { connect } from 'react-redux';
import { IsUserLoggedIn } from '../../Reducers/actions'
class AppSplash extends Component {
    constructor() {
        super();
        this.state = {
            onTab: 1,
        }
    }
    RedirectUser() {
        this.props.IsUserLoggedIn(this.props)
    }
    componentDidMount() {
        this.SplashTimer()
    }
    SplashTimer() {
        let app = this
        setTimeout(function () {
            app.RedirectUser()
        }, 4000);
    }
    render() {
        return (
            <View style={styles.linearGradient}>
                <StatusBar translucent backgroundColor="transparent" />
                <View style={{ backgroundColor: '#f1f2f7', flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                    <Image width="200" height="300" source={require('../../Images/logo.png')} />
                </View>
            </View>
        );
    }
}
const mapDispatchToProps = (dispatch) => {
    return {
        IsUserLoggedIn: (payload) => dispatch(IsUserLoggedIn(payload)),
    };
};
export default withNavigation(connect(null, mapDispatchToProps)(AppSplash))
const styles = StyleSheet.create({
    linearGradient: {
        flex: 1
    },
    buttonText: {
        fontSize: 18,
        fontFamily: 'Gill Sans',
        textAlign: 'center',
        margin: 10,
        color: '#ffffff',
        backgroundColor: 'transparent',
    },
});
