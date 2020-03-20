import React, { Component } from "react";
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Dimensions,
    ImageBackground
} from "react-native";

import Swiper from 'react-native-swiper';
import { withNavigation } from 'react-navigation'
const width = Dimensions.get('window').width
class HomeTrendingSlider extends Component {
    renderDots() {
        return (
            <View style={{ backgroundColor: 'gray', width: 15, height: 5, borderRadius: 5, marginLeft: 3, marginRight: 3, marginTop: 3, marginBottom: 3, }} />
        )
    }
    renderActiveDots() {
        return (
            <View style={{ backgroundColor: '#1A5566', width: 20, height: 5, borderRadius: 5, marginLeft: 3, marginRight: 3, marginTop: 3, marginBottom: 3, }} />
        )
    }
    goToPortal(v) {
        this.props.navigation.navigate('PortalWebView',
            { portalParams: 'courseDetail/' + v.courseCode }
        );
    }
    render() {
        let sliderView = null
        if (this.props.TrendingCourses.length > 0) {
            sliderView = this.props.TrendingCourses.map((v, i) => {
                return (
                    <View key={i} style={{ width: '100%', height: width / 2, paddingRight: 2, paddingLeft: 2, borderRadius: 10, overflow: 'hidden' }}>
                        <ImageBackground onPress={() => this.goToPortal(v)} source={v.courseImage ? { uri: v.courseImage } : null}
                            style={{ flex: 1, width: null, height: width / 2, resizeMode: 'cover', borderRadius: 5 }}
                        >
                            <TouchableOpacity onPress={() => this.goToPortal(v)} style={styles.overlay}>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => this.goToPortal(v)} style={{ position: 'absolute', bottom: 5, left: 0, right: 0, zIndex: 1000 }}>
                                <Text style={styles.textStyle}>{v.courseName}</Text>
                            </TouchableOpacity>
                        </ImageBackground>
                    </View>
                )
            })
        }
        return (
            <View style={{ flex: 1, height: (width / 2) + 20, margin: 10, backgroundColor: 'tranparent', overflow: 'hidden', borderRadius: 5 }}>
                <Swiper containerStyle={styles.wrapper}
                    horizontal={true}
                    autoplayDirection={true}
                    removeClippedSubviews={true}
                    autoplayTimeout={5}
                    showsButtons={false}
                    showsPagination={true}
                    paginationStyle={{ position: 'absolute', bottom: 5 }}
                    dot={this.renderDots()}
                    activeDot={this.renderActiveDots()}
                    autoplay={true}>
                    {sliderView}
                </Swiper>
            </View>
        );
    }
}
export default withNavigation(HomeTrendingSlider);

const styles = StyleSheet.create({
    wrapper: {
        height: width / 2
    },
    text: {
        color: '#fff',
        fontSize: 30,
        fontWeight: 'bold',
    },
    overlay: {
        backgroundColor: '#000',
        opacity: 0.4,
        flex: 1
    },
    textStyle: {
        fontSize: 12,
        color: "#FFF",
        fontWeight: 'bold',
        textAlign: 'center'
    },
    balanceContainer: {
        padding: 10,
    }
})
