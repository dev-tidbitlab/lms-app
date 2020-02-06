import React, { Component } from "react";
import {
    View,
    StyleSheet,
    TouchableOpacity,
    Text,
    ScrollView,
    StatusBar,
    RefreshControl
} from "react-native";
import { Container, Header, Left, Body, Right, Button } from 'native-base';
import { withNavigationFocus } from 'react-navigation';
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import SnackBar from '../../Components/snackBar/index'
import ReviewRatingModalComponent from '../reviewRating/rating'
import Ionicons from "react-native-vector-icons/Ionicons";
import RNFetchBlob from 'rn-fetch-blob'
import { GET, POST } from '../../service/index'
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
            isCompleted: 0
        };
    }
    getInitialMCQs(course_id) {
        GET('coursejourney/student/mcq/' + course_id + '/loadMcq').then(response => {
            console.log('response==>> mcq==re', response)
            if (response.success) {
                if (response.data.latestOn == "result") {
                    this.setState({ Result: response.data.testResult, CourseDetails: response.data.courseDetail })
                }
                if (!response.data.courseDetail.courseCompleted) {
                    this.setState({ isCompleted: 1 })
                } else {
                    this.setState({ isCompleted: 2 })
                }
            } else {

            }
            this.setState({ loading: false })
        }).catch(function (error) {
            if (error) {
                console.log('error==>>', error)
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
        this.props.navigation.navigate('StudentCourses');
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
                console.log('error==>>', error)
                this.setState({ loading: false })
            }
        })
    }
    ReviewAndRatingModal() {
        const { CourseDetails } = this.state
        this.setState({ ReviewRatingModal: true })
    }
    toggleBottomNavigationView() {
        this.setState({ ReviewRatingModal: false })
    }
    SubmitRating(DataObject) {
        this.setState({ loading: true })
        POST('coursejourney/student/submitreview', JSON.stringify(DataObject)).then(response => {
            console.log('response==>> mcq==retake', response)
            if (response.success) {
                this.toggleBottomNavigationView()
            }
            this.getInitialMCQs(this.state.course_id)
            this.setState({ loading: false })
        }).catch(function (error) {
            if (error) {
                this.toggleBottomNavigationView()
                console.log('error==>>', error)
                this.setState({ loading: false })
            }
        })
    }
    SaveReviewAndRating(v) {
        let DataObject = v
        DataObject.courseId = this.state.course_id
        console.log(DataObject)
        this.SubmitRating(DataObject)
    }
    DownloadResourses(file) {
        let app = this
        const { config, fs } = RNFetchBlob
        app.setState({ isDownloaded: 1 })
        let DownloadDir = fs.dirs.DownloadDir // this is the pictures directory. You can check the available directories in the wiki.
        let fileName = Math.floor(new Date().getTime() + new Date().getSeconds())
        fileName = JSON.stringify(fileName) + '.pdf'
        RNFetchBlob
            .config({
                addAndroidDownloads: {
                    useDownloadManager: true, // <-- this is the only thing required
                    notification: false,
                    path: DownloadDir + "/lms/" + 'certificate_' + fileName,
                    description: 'Resourse File',
                    mediaScannable: true,
                    notification: true,
                    title: 'certificate_' + fileName
                }
            })
            .fetch('GET', file)
            .then((resp) => {

                resp.path()
                app.setState({ isDownloaded: 2 })
            })
    }
    render() {
        const { Result, CourseDetails, isCompleted } = this.state
        return (
            <Container style={{ backgroundColor: '#F4F4F6' }}>
                <Header style={{ backgroundColor: '#1A5566' }}>
                    <Left style={{ flex: 1 }}>
                        <Button transparent onPress={() => this.GoBack()} >
                            <Ionicons name='md-arrow-back' size={24} color='#FFF' />
                        </Button>
                    </Left>
                    <Body style={{ flex: 2, alignItems: 'center' }}>
                        <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#FFF' }}>MCQ Test</Text>
                    </Body>
                    <Right>
                    </Right>
                </Header>
                <StatusBar backgroundColor="#1A5566" barStyle="light-content" />
                <ScrollView
                    contentContainerStyle={{ backgroundColor: '#F4F4F6' }}
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
                    <View style={{ margin: 10 }}>
                        <Text>Test result</Text>
                        <Text>{Result.percentage}</Text>
                        <Text>{Result.isPass ? 'PassedI' : 'Failed'}</Text>
                        {Result.isPass == false ? <TouchableOpacity onPress={() => this.RetryAgain()} style={{ bottom: 5, paddingTop: 6, paddingBottom: 6, paddingLeft: 10, paddingRight: 10, backgroundColor: '#1A5566', alignItems: 'center', justifyContent: 'center', borderRadius: 5 }}>
                            <Text style={{ fonSize: 12, color: '#FFF' }}>ReTake Test Again</Text>
                        </TouchableOpacity> : null}
                        {Result.isPass == true ? <TouchableOpacity onPress={() => this.RetryAgain()} style={{ bottom: 5, paddingTop: 6, paddingBottom: 6, paddingLeft: 10, paddingRight: 10, backgroundColor: '#1A5566', alignItems: 'center', justifyContent: 'center', borderRadius: 5 }}>
                            <Text style={{ fonSize: 12, color: '#FFF' }}>Review Test</Text>
                        </TouchableOpacity> : null}
                        {isCompleted == 2 && Result.isPass == true ? <TouchableOpacity onPress={() => this.DownloadResourses(CourseDetails.certificateUrl)} style={{ flexDirection: 'row', alignItems: 'center', padding: 5, backgroundColor: '#BBB' }}>
                            <MaterialIcons name="file-download" size={36} />
                            <Text>Download Certificate</Text>
                        </TouchableOpacity> : null}
                        {isCompleted == 1 && Result.isPass == true ? <TouchableOpacity onPress={() => this.ReviewAndRatingModal()} style={{ flexDirection: 'row', alignItems: 'center', padding: 5, backgroundColor: '#BBB' }}>
                            <Text>Give Review & Rating</Text>
                        </TouchableOpacity> : null}
                    </View>
                </ScrollView>
                <ReviewRatingModalComponent SaveReviewAndRating={(v) => this.SaveReviewAndRating(v)} toggleBottomNavigationView={() => this.toggleBottomNavigationView()} ReviewRatingModal={this.state.ReviewRatingModal} />
                {this.state.isDownloaded != 0 ? <SnackBar
                    style={{ backgroundColor: this.state.isDownloaded == 2 ? 'green' : '#222' }}
                    numberOfLines={2}
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
