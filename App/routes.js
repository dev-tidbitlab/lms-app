import React, { Component } from 'react'
import {
    createAppContainer,
    createSwitchNavigator
} from 'react-navigation';
import { Dimensions } from 'react-native'
import {
    createStackNavigator
} from 'react-navigation-stack'
import { createDrawerNavigator } from 'react-navigation-drawer';
import { Animated, Easing, Platform } from 'react-native';
import SideDrawer from '../App/Screens/sideDrawer'
import HomeBottomTabBar from '../App/Screens/bottomTabNavigation/index'
import AppAuthScreen from '../App/Screens/Authentication/authRoutes'
import AppSplashScreen from '../App/Screens/Authentication/splash'
const width = Dimensions.get('window').width
let SlideFromRight = (index, position, width) => {
    const translateX = position.interpolate({
        inputRange: [index - 1, index],
        outputRange: [width, 0],
    })

    return { transform: [{ translateX }] }
};

// For Trabsition
const TransitionConfiguration = () => {
    return {
        transitionSpec: {
            duration: 750,
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
function TrackRoutesChange(previousRouteName, currentRouteName, action) {
    console.log(this, 'ErrorToaster', previousRouteName, currentRouteName, action)
}
function getActiveRouteName(navigationState) {
    if (!navigationState) {
        return null;
    }
    const route = navigationState.routes[navigationState.index];
    // dive into nested navigators
    if (route.routes) {
        return getActiveRouteName(route);
    }
    return route.routeName;
}
// DrawerNavigator
const AppDrawerNavigator = createDrawerNavigator({
    Home: { screen: HomeBottomTabBar }
}, {
    contentComponent: SideDrawer,
    drawerWidth: width - 80,
    headerMode: 'none',
    overlayColor: 'rgba(0, 0, 0, 0.7)',
    drawerType: 'front',
    gesturesEnabled: true,
    transitionConfig: TransitionConfiguration,
})
const AppSwitchNav = createSwitchNavigator({
    Home: { screen: AppDrawerNavigator },
    IsLoggedIn: { screen: AppAuthScreen },
    AppSplashScreen: { screen: AppSplashScreen }
},
    {
        initialRouteName: 'AppSplashScreen',
        transitionConfig: TransitionConfiguration,
    }
)
const AppContainer = createAppContainer(AppSwitchNav);
// export default createAppContainer(AppSwitchNav);
const AppRouterContainer = () => (
    <AppContainer />
);

export default AppRouterContainer