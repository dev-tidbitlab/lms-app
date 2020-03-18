import React, { Component } from 'react'
import {
    createStackNavigator,
} from 'react-navigation-stack'
import { Animated, Easing, Platform } from 'react-native';

import CourseScreen from '../myCourses/courseRoutes'
import StudentProfile from '../profile/index'
import UserListScreen from './index'
import ResetPassword from '../sideDrawer/resetPassword'
import StudentOrders from '../myOrders/orderRoutes'
import StudentCertificates from '../certificates/myCertificates'
import AllCourses from '../ecommerce/ecommerceScreen'
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
const HomeStack = createStackNavigator(
    {
        StudentCourses: { screen: CourseScreen },
        UserListScreen: { screen: UserListScreen },
        ResetPassword: { screen: ResetPassword },
        StudentProfile: { screen: StudentProfile },
        StudentOrders: { screen: StudentOrders },
        StudentCertificates: { screen: StudentCertificates },
        LMSAllCourses:{screen: AllCourses}
    },
    {
        initialRouteName: 'UserListScreen',
        headerMode: 'none',
        navigationOptions: {
            headerVisible: false,
        },
        transitionConfig: TransitionConfiguration,
    })
HomeStack.navigationOptions = ({ navigation }) => {
    let tabBarVisible = true;
    if (navigation.state.routes.length > 1) {
        navigation.state.routes.map(route => {
            if (route.routeName === "UserInfoScreen" || route.routeName == 'ResetPassword') {
                tabBarVisible = false;
            } else {
                tabBarVisible = true;
            }
        });
    }
    return {
        tabBarVisible
    };
};
export default HomeStack;