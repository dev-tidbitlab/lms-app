import React, { Component } from "react";
import {
    View,
    TouchableOpacity,
    Text,
    ScrollView,
    StatusBar,
    Dimensions,
} from "react-native";
import { Container, Header, Left, Body, Right, Button } from 'native-base';
import { withNavigation } from 'react-navigation';
import HomeTrendingSlider from './swiper'
import { connect } from 'react-redux';
import Ionicons from "react-native-vector-icons/Ionicons";
import BestSellingComponents from './bestSelling'

import { GET } from '../../service/index'
class EcommerceScreen extends Component {
    state = {
        ScreenWidth: Dimensions.get('window').width,
        CourseArray: [{}, {}, {}, {}, {}, {}, {}, {}, {}],
        FilterModal: false,
        search: '',
        query: '',
        TrendingCourses: [],
        BestSellingCourses: [],
        AllCourses: [],
        loading: true
    };
    GoToLogin() {
        this.props.navigation.navigate('AppLoginScreen')
    }
    GetTrendingCourses() {
        GET('e-commerce/visit/courses?trending=true&status=Active').then(res => {
            console.log('res tre', res)
            if (res.success) {
                if (res.count > 0) {
                    this.setState({ TrendingCourses: res.data })
                }
            }
            this.setState({ loading: false })
        })
    }
    GetBestSellingCourses() {
        GET('e-commerce/visit/courses?bs=true&status=Active').then(res => {
            console.log('res best', res)
            if (res.success) {
                if (res.count > 0) {
                    this.setState({ BestSellingCourses: res.data })
                }
            }
            this.setState({ loading: false })
        })
    }
    GetAllCourses() {
        GET('e-commerce/visit/courses?status=Active').then(res => {
            console.log('res AllCourses', res)
            if (res.success) {
                if (res.count > 0) {
                    this.setState({ AllCourses: res.data })
                }
            }
            this.setState({ loading: false })
        })
    }
    componentDidMount() {
        this.GetTrendingCourses()
        this.GetBestSellingCourses()
        this.GetAllCourses()
    }
    GoBack() {
        this.props.navigation.goBack();
    }
    goToPortal() {
        this.props.navigation.navigate('PortalWebView',
            { portalParams: '' }
        );
    }
    render() {
        const { TrendingCourses, BestSellingCourses, AllCourses, loading } = this.state
        const { profileImage, email } = this.props.UserInfo
        return (
            <Container style={{ backgroundColor: '#F4F4F6' }}>
                <Header style={{ backgroundColor: '#1A5566' }}>
                    <Left style={{ paddingLeft: 5, flex: 0.5 }}>
                        {email ? <Button transparent onPress={() => this.GoBack()} >
                            <Ionicons name='md-arrow-back' size={24} color='#FFF' />
                        </Button> : null}
                    </Left>
                    <Body style={{ flex: 2, alignItems: 'center', justifyContent: 'center' }}>
                        <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#FFF' }}>Ecommerce</Text>
                    </Body>
                    <Right style={{ flex: 0.5 }}>
                        {!email ? <TouchableOpacity onPress={() => this.GoToLogin()}>
                            <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#FFF' }}>Login</Text>
                        </TouchableOpacity> : null}
                    </Right>
                </Header>
                <StatusBar backgroundColor="#1A5566" barStyle="light-content" />
                <ScrollView
                    contentContainerStyle={{ backgroundColor: '#F4F4F6' }}
                    showsHorizontalScrollIndicator={false}
                    showsVerticalScrollIndicator={false}
                    horizontal={false}
                >
                    <View style={{ margin: 10 }}>
                        {TrendingCourses.length > 0 ? <View style={{ marginLeft: 10, flexDirection: 'row', alignItems: 'center' }}>
                            <Text style={{ fontSize: 18, color: '#000', fontWeight: '500' }}>Trending</Text>
                            <TouchableOpacity onPress={() => this.goToPortal()} style={{ position: 'absolute', right: 10 }}>
                                <Text style={{ fontSize: 14, color: '#AAA', fontWeight: '500' }}>View All</Text>
                            </TouchableOpacity>
                        </View> : null}
                        {TrendingCourses.length > 0 ? <HomeTrendingSlider TrendingCourses={TrendingCourses} /> : null}
                        {BestSellingCourses.length > 0 ? <View style={{ marginLeft: 10, flexDirection: 'row', alignItems: 'center' }}>
                            <Text style={{ fontSize: 18, color: '#000', fontWeight: '500' }}>Bestselling</Text>
                            <TouchableOpacity onPress={() => this.goToPortal()} style={{ position: 'absolute', right: 10 }}>
                                <Text style={{ fontSize: 14, color: '#AAA', fontWeight: '500' }}>View All</Text>
                            </TouchableOpacity>
                        </View> : null}
                        {BestSellingCourses.length > 0 ? <BestSellingComponents BestSellingCourses={BestSellingCourses} /> : null}
                        {AllCourses.length > 0 ? <View style={{ marginLeft: 10, flexDirection: 'row', alignItems: 'center' }}>
                            <Text style={{ fontSize: 18, color: '#000', fontWeight: '500' }}>All Courses</Text>
                            <TouchableOpacity onPress={() => this.goToPortal()} style={{ position: 'absolute', right: 10 }}>
                                <Text style={{ fontSize: 14, color: '#AAA', fontWeight: '500' }}>View All</Text>
                            </TouchableOpacity>
                        </View> : null}
                        {AllCourses.length > 0 ? <BestSellingComponents BestSellingCourses={AllCourses} /> : null}
                    </View>
                </ScrollView>
            </Container>
        );
    }
}
const mapStateToProps = (state) => {
    return {
        UserInfo: state.authReducer.UserInfo,
    };
};
export default withNavigation(connect(mapStateToProps)(EcommerceScreen))
