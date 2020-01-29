import React, { Component } from 'react'
import {
    createStackNavigator,
} from 'react-navigation-stack'
import { Animated, Easing, Platform } from 'react-native';
import MyCourses from './courses'
import ViewCourseDetails from './viewCourseDetails'
import TestVideo from './testVideo'
import MCQTest from '../mcq/mcq'
import StartMCQ from '../mcq/mcqStart'
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
const CourseStack = createStackNavigator(
    {
        StudentCourses: { screen: MyCourses },
        ViewCourseDetails: { screen: ViewCourseDetails },
        StudentMCQTest: { screen: MCQTest },
        StartMCQ: { screen: StartMCQ }
    },
    {
        initialRouteName: 'StudentCourses',
        headerMode: 'none',
        navigationOptions: {
            headerVisible: false,
        },
        transitionConfig: TransitionConfiguration,
    })
export default CourseStack;