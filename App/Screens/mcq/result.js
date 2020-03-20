import React, { Component } from "react";
import {
    View,
    StyleSheet,
    TouchableOpacity,
    Text,
    ScrollView,
    StatusBar,
    RefreshControl,
    Platform
} from "react-native";
import { Container, Header, Left, Body, Right, Button } from 'native-base';
import { withNavigationFocus } from 'react-navigation';
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import SnackBar from '../../Components/snackBar/index'
import ReviewRatingModalComponent from '../reviewRating/rating'
import Ionicons from "react-native-vector-icons/Ionicons";
import RNFetchBlob from 'rn-fetch-blob'
import { GET, POST } from '../../service/index'
import LottieView from 'lottie-react-native';
import IOSRating from '../reviewRating/iosRating'
import moment from 'moment'
import { fonts } from '../../Themes/style'
class TestResult extends Component {
    constructor() {
        super();
        this.state = {
            loading: true,
            course_id: '',
            Result: { isPass: true },
            CourseDetails: {},
            ReviewRatingModal: false,
            isDownloaded: 0,
            isCompleted: 0,
            MyResult: 0,
            BodyColor: '#F4F4F6'
        };
    }
    getInitialMCQs(course_id) {
        GET('coursejourney/student/mcq/' + course_id + '/loadMcq').then(response => {
            console.log('response==>> mcq==re', response)
            if (response.success) {
                if (response.data.latestOn == "result") {
                    if (response.data.testResult.isPass) {
                        this.setState({ MyResult: 1 })
                        if (!response.data.courseDetail.courseCompleted) {
                            this.setState({ isCompleted: 1 })
                        } else {
                            this.setState({ isCompleted: 2 })
                        }
                    } else {
                        this.setState({ MyResult: 2 })
                    }
                    this.setState({ Result: response.data.testResult, CourseDetails: response.data.courseDetail })
                }
            }
            this.setState({ loading: false })
        }).catch(function (error) {
            if (error) {
                this.setState({ loading: false })
            }
        })
    }
    componentDidMount() {
        const { navigation } = this.props;
        const course_id = navigation.getParam('course_id', '');
        this.setState({ course_id: course_id })
        this.getInitialMCQs(course_id)
    }
    GoBack() {
        this.props.navigation.navigate('StartMCQ', {
            course_id: this.state.course_id
        })
    }
    RetryAgain() {
        this.setState({ loading: true })
        GET('coursejourney/student/mcq/retake/' + this.state.course_id).then(response => {
            console.log('response==>> mcq==retake', response)
            if (response.success) {
                this.props.navigation.navigate('StartMCQ', {
                    course_id: this.state.course_id
                })
            }
            this.setState({ loading: false })
        }).catch(function (error) {
            if (error) {
                this.setState({ loading: false })
            }
        })
    }
    ReviewAndRatingModal() {
        if (Platform.OS == 'android') {
            this.setState({ ReviewRatingModal: true })
        } else {
            this.setState({ ReviewRatingModal: true, BodyColor: '#DDD' })
        }
    }
    toggleBottomNavigationView() {
        this.setState({ ReviewRatingModal: false, BodyColor: '#F4F4F6' })
    }
    SubmitRating(DataObject) {
        this.setState({ loading: true })
        POST('coursejourney/student/submitreview', JSON.stringify(DataObject)).then(response => {
            console.log('response==>> mcq==retake', response)
            this.toggleBottomNavigationView()
            this.getInitialMCQs(this.state.course_id)
            this.setState({ loading: false })
        }).catch(function (error) {
            if (error) {
                this.toggleBottomNavigationView()
                this.setState({ loading: false })
            }
        })
    }
    _toggleBottomNavigationViewClose() {
        this.toggleBottomNavigationView()
    }
    SaveReviewAndRating(v) {
        let DataObject = v
        DataObject.courseId = this.state.course_id
        this.SubmitRating(DataObject)
    }
    DownloadResourses(file) {
        let app = this
        const { config, fs } = RNFetchBlob
        app.setState({ isDownloaded: 1 })
        let DownloadDir = Platform.OS == 'android' ? fs.dirs.DownloadDir : fs.dirs.DocumentDir
        let str = file.courseId.courseName
        let fileName = str.replace(/^"(.*)"$/, '$1');
        fileName = fileName + '.pdf'
        RNFetchBlob
            .config({
                addAndroidDownloads: {
                    useDownloadManager: true, // <-- this is the only thing required
                    notification: false,
                    path: DownloadDir + "/lms/" + fileName,
                    description: 'Resourse File',
                    mediaScannable: true,
                    notification: true,
                    title: fileName
                }
            })
            .fetch('GET', file.certificateUrl)
            .then((resp) => {
                resp.path()
                app.setState({ isDownloaded: 2 })
            })
    }
    ReviewTest() {
        this.props.navigation.navigate('ReviewTest', {
            course_id: this.state.course_id
        })
    }
    _onRefresh() {
        this.setState({ loading: true })
        this.getInitialMCQs(this.state.course_id)
    }
    CloseIOSRating() {
        this.setState({ ReviewRatingModal: false })
    }
    render() {
        const { Result, CourseDetails, isCompleted, MyResult, BodyColor } = this.state
        return (
            <Container onPress={() => this.CloseIOSRating()} style={{ backgroundColor: BodyColor }}>
                <Header style={{ backgroundColor: '#1A5566' }}>
                    <Left style={{ flex: 1 }}>
                        <Button transparent onPress={() => this.GoBack()} >
                            <Ionicons name='md-arrow-back' size={24} color='#FFF' />
                        </Button>
                    </Left>
                    <Body style={{ flex: 2, alignItems: 'center' }}>
                        <Text style={{ ...fonts.h5, fontWeight: '500', color: '#FFF' }}>MCQ Test Result</Text>
                    </Body>
                    <Right>
                    </Right>
                </Header>
                <StatusBar backgroundColor="#1A5566" barStyle="light-content" />
                <ScrollView
                    contentContainerStyle={{ backgroundColor: BodyColor }}
                    showsHorizontalScrollIndicator={false}
                    showsVerticalScrollIndicator={false}
                    horizontal={false}
                    refreshControl={
                        <RefreshControl
                            colors={['#1A5566']}
                            progressBackgroundColor="#FFF"
                            refreshing={this.state.loading}
                            onRefresh={() => this._onRefresh()}
                        />
                    }
                >
                    <View onPress={() => this.CloseIOSRating()} style={{ margin: 10 }}>
                        <View style={{ width: '100%', alignItems: 'center' }}>
                            <View style={{ width: 200, height: 200 }}>
                                {MyResult == 1 ? <LottieView source={require('./433-checked-done.json')} autoPlay loop={false} /> : null}
                                {MyResult == 2 ? <LottieView style={{ width: 200, height: 200 }} source={require('./14651-error-animation.json')} autoPlay loop={false} /> : null}
                            </View>
                            <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                                {MyResult == 1 ? <Text style={{ ...fonts.h2, color: '#4FAE62', fontWeight: '600' }}>Congratulations!</Text> : null}
                                {MyResult == 2 ? <Text style={{ ...fonts.h2, color: '#D54534', fontWeight: '600' }}>Oops! You failed!</Text> : null}
                                <View style={{ justifyContent: 'center', alignItems: 'center', paddingTop: 10, marginLeft: 20, marginRight: 20 }}>
                                    {MyResult == 1 ? <Text style={{ ...fonts.h7, color: '#4FAE62', fontWeight: '500', textAlign: 'center' }}>You completed this test on date {moment(CourseDetails.completionDate).format('DD-MM-YYYY, h:mm A')}</Text> : null}
                                    {MyResult == 2 ? <Text style={{ ...fonts.h7, color: '#D54534', fontWeight: '500', marginBottom: 5, textAlign: 'center' }}>You completed this test on date {moment(CourseDetails.completionDate).format('DD-MM-YYYY, h:mm A')} </Text> : null}
                                    {MyResult == 1 ? <Text style={{ ...fonts.h5, color: '#4FAE62', fontWeight: '600' }}>Your score is {Result.percentage}%</Text> : null}
                                    {MyResult == 2 ? <Text style={{ ...fonts.h5, color: '#D54534', fontWeight: '600' }}>Your score is {Result.percentage}%</Text> : null}
                                </View>
                            </View>
                        </View>
                        {MyResult == 2 ?
                            <View style={{ alignItems: 'center', marginTop: 20 }}><TouchableOpacity onPress={() => this.RetryAgain()} style={{ width: 130, paddingTop: 6, paddingBottom: 6, paddingLeft: 10, paddingRight: 10, backgroundColor: '#1A5566', alignItems: 'center', justifyContent: 'center', borderRadius: 5 }}>
                                <Text style={{ ...fonts.h8, color: '#FFF' }}>Take Test Again</Text>
                            </TouchableOpacity></View> : null}

                        {isCompleted == 2 && MyResult == 1 ? <View style={{ alignItems: 'center', marginTop: 20 }}><TouchableOpacity onPress={() => this.DownloadResourses(CourseDetails)} style={{ width: 180, flexDirection: 'row', paddingTop: 6, paddingBottom: 6, paddingLeft: 10, paddingRight: 10, backgroundColor: '#1A5566', alignItems: 'center', justifyContent: 'center', borderRadius: 5 }}>
                            <MaterialIcons name="file-download" size={18} color={'#FFF'} />
                            <Text style={{ color: 'white', ...fonts.h8, }}>Download Certificate</Text>
                        </TouchableOpacity></View> : null}
                        {isCompleted == 1 && MyResult == 1 ? <View style={{ alignItems: 'center', marginTop: 20 }}><TouchableOpacity onPress={() => this.ReviewAndRatingModal()} style={{ width: 180, flexDirection: 'row', paddingTop: 6, paddingBottom: 6, paddingLeft: 10, paddingRight: 10, backgroundColor: '#1A5566', alignItems: 'center', justifyContent: 'center', borderRadius: 5 }}>
                            <Text style={{ color: 'white', ...fonts.h8, }}>Share Review & Rating</Text>
                        </TouchableOpacity></View> : null}
                        {MyResult == 2 ? <View style={{ alignItems: 'center', marginTop: 20 }}><TouchableOpacity onPress={() => this.ReviewTest()} style={{ width: 100, paddingTop: 6, paddingBottom: 6, paddingLeft: 10, paddingRight: 10, backgroundColor: '#1A5566', alignItems: 'center', justifyContent: 'center', borderRadius: 5 }}>
                            <Text style={{ ...fonts.h8, color: '#FFF' }}>Review Test</Text>
                        </TouchableOpacity></View> : null}
                    </View>
                </ScrollView>
                {Platform.OS == 'android' ? <ReviewRatingModalComponent SaveReviewAndRating={(v) => this.SaveReviewAndRating(v)} _toggleBottomNavigationViewClose={() => this._toggleBottomNavigationViewClose()} ReviewRatingModal={this.state.ReviewRatingModal} />
                    : (this.state.ReviewRatingModal ? <IOSRating onPress={() => this._toggleBottomNavigationViewClose()} SaveReviewAndRating={(v) => this.SaveReviewAndRating(v)} _toggleBottomNavigationViewClose={() => this._toggleBottomNavigationViewClose()} ReviewRatingModal={this.state.ReviewRatingModal} duration={0} /> : null)}
                {this.state.isDownloaded != 0 ? <SnackBar
                    style={{ backgroundColor: this.state.isDownloaded == 2 ? '#4FAE62' : '#222' }}
                    numberOfLines={2}
                    duration={0}
                    actionTextStyle={{ color: '#FFF' }}
                    actionText={'OK'}
                    text={this.state.isDownloaded == 1 ? 'Download Started!' : 'Download Completed!'}
                /> : null}
            </Container>


        );
    }
}
export default withNavigationFocus(TestResult);

const styles = StyleSheet.create({
    container: {
        flex: 1
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
