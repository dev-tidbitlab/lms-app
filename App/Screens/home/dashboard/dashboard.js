import React, { Component } from "react";
import {
    View,
    Platform,
    StyleSheet,
    TouchableOpacity,
    Image,
    Text,
    ScrollView,
    StatusBar,
    Dimensions,
    ActivityIndicator
} from "react-native";
import { Avatar, ProgressBar } from 'react-native-paper';
import { Container, Card, CardItem, Header, Thumbnail, Left, Body, Right, Button, Title } from 'native-base';
import { withNavigation, withNavigationFocus } from 'react-navigation';
import { connect } from 'react-redux';
import { StudentRecentlyCoursesList, MyCertificates } from '../../../Reducers/actions'
// var ScreenWidth = Dimensions.get('window').width
class Dashboard extends Component {
    state = {
        ScreenWidth: Dimensions.get('window').width,
        CourseArray: [{}, {}, {}]
    };
    GoBack() {
        this.props.navigation.goBack();
    }
    componentDidMount() {
        Dimensions.addEventListener('change', () => {
            this.getOrientation();
        });
        this.props.MyCertificates(this.props)
        this.props.StudentRecentlyCoursesList(this.props)
    }
    componentDidUpdate(prevProps) {
        if (prevProps.isFocused !== this.props.isFocused) {
            this.props.MyCertificates(this.props)
            this.props.StudentRecentlyCoursesList(this.props)
        }
    }
    getOrientation() {
        this.setState({ ScreenWidth: Dimensions.get('window').width })
    }
    ViewCourseDetails(v) {
        this.props.navigation.navigate('ViewCourseDetails',
            { course_id: v.courseId._id, CourseData: v });
    }
    ViewMyCourses() {
        this.props.navigation.navigate('StudentCourses')
    }
    render() {
        let ScreenWidth = this.state.ScreenWidth
        console.log('fefwfwf', this.props.StudentRecentlyCourseList)
        const { progress } = this.props.StudentRecentlyCourseList
        return (
            <ScrollView
                contentContainerStyle={{ backgroundColor: '#F4F4F6' }}
                showsHorizontalScrollIndicator={false}
                showsVerticalScrollIndicator={false}
                horizontal={false}
            >
                <View style={{ margin: 10 }}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
                        <TouchableOpacity onPress={() => this.ViewMyCourses()} style={{ width: 150, height: 150, backgroundColor: '#FFF', marginLeft: 10, marginTop: 10, marginBottom: 15, marginRight: 1, justifyContent: 'center', alignItems: 'center', borderRadius: 5 }}>
                            <View style={{ backgroundColor: '#EEE', borderRadius: 100, width: 80, height: 80, justifyContent: "center", alignItems: 'center' }}>
                                <Image resizeMode={'stretch'} width={60} height={60} source={require('../../../Images/course64.png')} />
                            </View>
                            <Text style={{ fontSize: 16, fontWeight: '600', marginTop:5 }}>Total Courses</Text>
                            <Text style={{marginTop: 5}}>{this.props.StudentCertificates ? this.props.StudentCertificates.totalCourses : 0}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={{ width: 150, height: 150, backgroundColor: '#FFF', marginTop: 10, marginRight: 10, marginBottom: 15, marginLeft: 10, justifyContent: 'center', alignItems: 'center', borderRadius: 5 }}>
                            <View style={{ backgroundColor: '#EEE', borderRadius: 100, width: 80, height: 80, justifyContent: "center", alignItems: 'center' }}>
                                <Image resizeMode={'stretch'} source={require('../../../Images/certificate64.png')} />
                            </View>
                            <Text style={{ fontSize: 16, fontWeight: '600', marginTop:5 }}>Certifications</Text>
                            <Text style={{marginTop: 5}}>{this.props.StudentCertificates ? this.props.StudentCertificates.totalCertificates : 0}</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={{ marginLeft: 10 }}>
                        <Text style={{ fontSize: 18, color: '#000', fontWeight: '600' }}>My recently courses</Text>
                    </View>
                    {this.props.loading ?
                        <View style={{ marginTop: 10, position: 'absolute', left: 0, right: 0, zIndex: 100 }}>
                            <ActivityIndicator size="large" color="yellow" />
                        </View> : null}
                    {this.props.StudentRecentlyCourseList.length > 0 ? <View>
                        {this.props.StudentRecentlyCourseList.map((v, i) => {
                            return (
                                <View key={i} style={{ flexDirection: 'row', borderRadius: 5, marginRight: 10, marginLeft: 10, marginTop: 15, flex: 1, backgroundColor: '#FFF' }}>
                                    <TouchableOpacity onPress={() => this.ViewCourseDetails(v)} style={{ marginLeft: 5, marginTop: 5, marginBottom: 5 }}>
                                        <Image style={{ width: 100, height: 100, borderRadius: 5, resizeMode: 'cover' }} source={{ uri: v.courseId != undefined && v.courseId != null ? v.courseId.courseImage : null }} />
                                    </TouchableOpacity>
                                    <TouchableOpacity onPress={() => this.ViewCourseDetails(v)} style={{ flex: 1, marginRight: 10, marginLeft: 10, paddingBottom: 5 }}>
                                        <Text style={{ fontSize: 14, color: '#000', paddingBottom: 5, paddingTop: 5, fontWeight: '500' }}>{v.courseId.courseName}</Text>
                                        <Text numberOfLines={2} style={{ fontSize: 12, color: '#000', paddingBottom: 5 }}>{v.courseId.description}</Text>
                                        <ProgressBar style={{ backgroundColor: '#CCC', marginBottom: 5 }} progress={v.progress ? v.progress / 100 : 0} color={'#1A5566'} />
                                        <Text style={{ fontSize: 12, color: '#AAA' }}>{v.progress ? v.progress : 0}% complete</Text>
                                    </TouchableOpacity>
                                </View>
                            )
                        })}
                    </View> : null}
                </View>
            </ScrollView >
        );
    }
}
const mapStateToProps = (state) => {
    console.log(state, 'state dash===>>>>', state.authReducer.StudentRecentlyCourseList)
    return {
        loading: state.authReducer.loading,
        StudentRecentlyCourseList: state.authReducer.StudentRecentlyCourseList,
        StudentCertificates: state.authReducer.StudentCertificatesList
    };
};
const mapDispatchToProps = (dispatch) => {
    return {
        StudentRecentlyCoursesList: (payload) => dispatch(StudentRecentlyCoursesList(payload)),
        MyCertificates: (payload) => dispatch(MyCertificates(payload)),
    };
};
export default withNavigationFocus(connect(mapStateToProps, mapDispatchToProps)(Dashboard));

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    BackBottonBG: {
        height: 150,
        backgroundColor: '#ddd',
        // overflow: 'hidden',
    },
    BackBotton: {
        position: 'absolute',
        left: 20, top: 15
    },
    scene: {
        flex: 1,
    },

});
