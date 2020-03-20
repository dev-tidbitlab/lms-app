import {
    createStackNavigator,
} from 'react-navigation-stack'
import { Animated, Easing, Platform } from 'react-native';

import AppLoginScreen from './login'
import AppRegisterScreen from './register'
import ForgotPassword from './forgotPassword'
import EcommerceScreen from '../ecommerce/ecommerceScreen'
import PortalWebView from '../ecommerce/webView'
let SlideFromRight = (index, position, width) => {
    const translateX = position.interpolate({
        inputRange: [index - 1, index],
        outputRange: [width, 0],
    })

    return { transform: [{ translateX }] }
};

const TransitionConfiguration = () => {
    return {
        transitionSpec: {
            duration: 500,
            easing: Easing.out(Easing.poly(4)),
            timing: Animated.timing,
            useNativeDriver: true,
        },
        screenInterpolator: (sceneProps) => {
            const { layout, position, scene } = sceneProps;
            const width = layout.initWidth;
            const height = layout.initHeight;
            const { index, route } = scene
            const params = route.params || {}; // <- That's new
            const transition = params.transition || 'default'; // <- That's new
            return {
                default: SlideFromRight(index, position, width),
            }[transition];
        },
    }
}
const AuthStack = createStackNavigator(
    {
        EcommerceScreen: { screen: EcommerceScreen },
        AppLoginScreen: { screen: AppLoginScreen },
        ForgotPassword: { screen: ForgotPassword },
        AppRegisterScreen: { screen: AppRegisterScreen },
        PortalWebView: { screen: PortalWebView }
    },
    {
        initialRouteName: 'EcommerceScreen',
        headerMode: 'none',
        navigationOptions: {
            headerVisible: false,
        },
        transitionConfig: TransitionConfiguration,
    })
export default AuthStack;