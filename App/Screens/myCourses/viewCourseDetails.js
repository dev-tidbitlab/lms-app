import React, { Component } from 'react';
import {
    TouchableOpacity, Slider, StyleSheet, TouchableNativeFeedback,
    TouchableWithoutFeedback,
    BackHandler,
    Image,
    AppState,
    ActivityIndicator, Text, StatusBar, View, ScrollView, Dimensions, PermissionsAndroid, Platform
} from 'react-native';
import { Button } from 'native-base'
import Video from 'react-native-video';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import Orientation from 'react-native-orientation';
import { withNavigation } from 'react-navigation';
import { connect } from 'react-redux';
import { StudentCoursesDetails } from '../../Reducers/actions'
import { GET } from '../../service/index'
import RNFetchBlob from 'rn-fetch-blob'
import Collapsible from 'react-native-collapsible';
const { width, height } = Dimensions.get('window');
import SnackBar from '../../Components/snackBar/index'
import Icon from 'react-native-vector-icons/FontAwesome5'; // and this
import NetInfo from "@react-native-community/netinfo";
import Ripple from 'react-native-material-ripple';
const AppWidth = width > height ? height : width
const AppHieght = width > height ? width : height
class ViewCourseDetails extends Component {
    constructor(props) {
        super(props);
        this.state = {
            currentTime: 0,
            duration: 0.1,
            paused: false,
            overlay: false,
            fullscreen: false,
            Height: width * .6,
            VideoLoading: true,
            isLoading: true,
            CourseArray: [{}, {}, {}, {}, {}, {}, {}, {}, {}],
            course_id: '',
            CurrentVideo: {},
            StudentCourseDetails: [],
            isDownloaded: 0,
            CurrentVideoDetail: { videoName: '', videoUrl: null, description: '', attachedFiles: [], courseId: null },
            collapsed: true,
            CourseData: {},
            CurrentVideoIndex: 0,
            CurrentHieght: AppWidth * 0.6,
            CurrentWidth: AppWidth,
            isFullScreen: false,
            appState: AppState.currentState,
            screenLoader: 1,
            isCourseCompleted: false,
            MyCourseCompleted: false
        };
        this.ScreenState = 0
    }
    componentWillUnmount() {
        // NetInfo.removeEventListener(
        //     'connectionChange',
        //     this._handleConnectivityChange
        // );
        AppState.removeEventListener('change', this._handleAppStateChange);
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackButtonClick);
    }
    UpdateLastPlayedVideo(course_id, video_id) {
        console.log(this.state.course_id, video_id)
        GET('coursejourney/student/' + course_id + '/' + video_id).then(response => {
            console.log('coursejourney==>>', response)
            if (response.success) {
                if (response.data) {
                    if (response.data.progress >= 100) {
                        this.setState({ isCourseCompleted: true })
                    } else {
                        this.setState({ isCourseCompleted: false })
                    }
                }
            }
            // this.GetCourseDEtails(course_id)()
        }).catch(function (error) {
        })
    }
    GetCourseDEtails(course_id) {
        GET('studentdashboard/student/listCourseDetails/' + course_id).then(response => {
            console.log('GetCourseDEtails==>>===========', response)
            if (response.success) {
                if (response.courseDetails) {
                    if (response.courseDetails.progress >= 100) {
                        this.setState({ isCourseCompleted: true })
                    } else {
                        this.setState({ isCourseCompleted: false })
                    }
                }
            }
        }).catch(function (error) {
        })
    }
    _handleConnectivityChange = (isConnected) => {
        console.log('isConnected==>>', isConnected)
        if (isConnected == true) {
            // this.setState({ connection_Status: "Online" })
        }
        else {
            // this.setState({ connection_Status: "Offline" })
        }
    }
    _handleAppStateChange = (nextAppState) => {
        if (
            this.state.appState.match(/inactive|background/) &&
            nextAppState === 'active'
        ) {
            console.log('App has come to the foreground!');
        } else {
            this.setState({ isDownloaded: false })
            console.log('App has come to the bcklllll!');
        }
        this.setState({ appState: nextAppState });
    };
    getCourseDetailsVideo(course_id, CourseData) {
        GET('studentdashboard/student/listVideo/' + course_id).then(response => {
            console.log('response==>>', response, CourseData)
            if (response.success == true) {
                if (response.data.length > 0) {
                    this.setState({ StudentCourseDetails: response.data })
                    let data = response.data
                    console.log('1')
                    if (CourseData) {
                        console.log('2')
                        if (CourseData.lastVideoPlayed) {
                            console.log('3')
                            if (data.length > 0) {
                                console.log('4')
                                data.map((v, i) => {
                                    console.log('7==', v._id, CourseData.lastVideoPlayed, v._id == CourseData.lastVideoPlayed)
                                    if (v._id == CourseData.lastVideoPlayed) {
                                        console.log('5')
                                        this.setState({ CurrentVideoDetail: v, CurrentVideoIndex: i })
                                        this.UpdateLastPlayedVideo(course_id, v._id)
                                    }
                                })
                            }
                        } else {
                            console.log('6')
                            this.setState({ CurrentVideoDetail: response.data[0], CurrentVideoIndex: 0, MyCourseCompleted: false })
                            this.UpdateLastPlayedVideo(course_id, response.data[0]._id)
                        }
                    }
                    this.setState({ screenLoader: 0 })
                } else {
                    console.log('puuuu')
                    this.setState({ paused: true, VideoLoading: false })
                    this.setState({ screenLoader: 2 })
                }
            } else {
                this.setState({ screenLoader: 2 })
            }
            this.setState({ isLoading: false })
        }).catch(function (error) {
            this.setState({ isLoading: false })
            this.setState({ screenLoader: 2 })
            this.setState({ VideoLoading: false })
        })
    }
    toggleExpanded = () => {
        this.setState({ collapsed: !this.state.collapsed });
    };
    DownloadResourses(file) {
        let app = this
        const { config, fs } = RNFetchBlob
        app.setState({ isDownloaded: 1 })
        console.log('res=====>>>>>, res', config, fs, file)
        let DownloadDir = fs.dirs.DownloadDir // this is the pictures directory. You can check the available directories in the wiki.
        let fileName = Math.floor(new Date().getTime() + new Date().getSeconds())
        if (file.includes('.pdf') || file.includes('.PDF')) {
            fileName = JSON.stringify(fileName) + '.pdf'
        } else {
            if (file.includes('.png') || file.includes('.PNG')) {
                fileName = JSON.stringify(fileName) + '.png'
            } else {
                if (file.includes('.jpg') || file.includes('.JPG')) {
                    fileName = JSON.stringify(fileName) + '.jpg'
                } else {
                    if (file.includes('.jpeg') || file.includes('.JPEG')) {
                        fileName = JSON.stringify(fileName) + '.jpeg'
                    } else {
                        if (file.includes('.zip') || file.includes('.ZIP')) {
                            fileName = JSON.stringify(fileName) + '.zip'
                        }
                    }
                }
            }
        }
        RNFetchBlob
            .config({
                addAndroidDownloads: {
                    useDownloadManager: true, // <-- this is the only thing required
                    notification: false,
                    path: DownloadDir + "/lms/" + 'lms_' + fileName,
                    description: 'Resourse File',
                    mediaScannable: true,
                    notification: true,
                    title: 'lms_' + fileName
                }
            })
            .fetch('GET', file)
            .then((resp) => {
                resp.path()
                app.setState({ isDownloaded: 2 })
            })
    }
    _orientationDidChange = (orientation) => {
        console.log(orientation, 'orientation')

        if (orientation === 'LANDSCAPE') {
            this.setState({ CurrentHieght: AppWidth, CurrentWidth: AppHieght, isFullScreen: true })
        } else {
            this.setState({ CurrentHieght: AppWidth * 0.6, CurrentWidth: AppWidth, isFullScreen: false })
        }
        this.setState({ overlay: true });
        this.overlayTimer = setTimeout(() => {
            this.ScreenState = 0
            this.setState({ overlay: false })
        }, 3000);
    }
    GetAndSetOrientation() {
        Orientation.getOrientation((err, orientation) => {
            console.log(err, orientation)
            if (orientation === 'PORTRAIT') {
                // this.setState({ CurrentHieght: width, CurrentWidth: height, isFullScreen: true })
            } else {
                this.ScreenState = 1
                // console.log('w - h', width, height)
                Orientation.unlockAllOrientations()
                this.setState({ CurrentHieght: AppWidth, CurrentWidth: AppHieght, isFullScreen: true })
                // this.setState({ CurrentHieght: width * 0.6, CurrentWidth: width, isFullScreen: false })
            }
            this.setState({ overlay: true });
            this.overlayTimer = setTimeout(() => this.setState({ overlay: false }), 3000);
        })
    }
    handleBackButtonClick() {
        Orientation.unlockAllOrientations()
        console.log(this.props)
        return false;
    }
    checkInternetConneectivity() {

    }
    componentDidMount() {
        console.log('4444444444444========>>>>>>>>>>')
        this.GetAndSetOrientation()
        // NetInfo.addEventListener(
        //     'connectionChange',
        //     this._handleConnectivityChange
        // );

        this.checkInternetConneectivity()
        AppState.addEventListener('change', this._handleAppStateChange);
        Orientation.addOrientationListener(this._orientationDidChange);
        BackHandler.addEventListener('hardwareBackPress', this.handleBackButtonClick);
        console.log('ffff===')
        if (Platform.OS == 'android') {
            let saveFile = async () => {
                try {
                    const granted = await PermissionsAndroid.request(
                        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE
                    );
                    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                        console.log("Permission granted");
                    } else {
                        console.log('Permission denied');
                    }
                } catch (err) {
                    console.warn(err);
                }
            }
            saveFile()
        }
        const { navigation } = this.props;
        const course_id = navigation.getParam('course_id', '');
        const CourseData = navigation.getParam('CourseData', '');
        this.setState({ course_id: course_id, CourseData: CourseData })
        console.log('course_id====>>>>>>>>>', course_id)
        this.getCourseDetailsVideo(course_id, CourseData)
        // this.GetCourseDEtails(course_id)
    }

    GoBack() {
        Orientation.unlockAllOrientations()
        this.props.navigation.navigate('StudentCourses');
    }
    StartMCQ() {
        this.setState({ paused: true, VideoLoading: false })
        this.props.navigation.navigate('StartMCQ', {
            course_id: this.state.course_id
        })
    }
    FilterCourseVideo(Videos, index) {
        clearTimeout(this.overlayTimer);
        this.setState({
            overlay: false,
            CurrentVideoDetail: Videos,
            currentTime: 0,
            duration: 0.1,
            VideoLoading: true,
            CurrentVideoIndex: index
        })
        this.UpdateLastPlayedVideo(this.state.course_id, Videos._id)
        // this.GetCourseDEtails(this.state.course_id)
    }
    lastTap = null;
    handleDoubleTap = (doubleTapCallback, singleTapCallback) => {
        const now = Date.now();
        const DOUBLE_PRESS_DELAY = 300;
        if (this.lastTap && (now - this.lastTap) < DOUBLE_PRESS_DELAY) {
            clearTimeout(this.timer);
            doubleTapCallback();
        } else {
            this.lastTap = now;
            this.timer = setTimeout(() => {
                singleTapCallback();
            }, DOUBLE_PRESS_DELAY);
        }
    }

    getTime = t => {
        const digit = n => n < 10 ? `0${n}` : `${n}`;
        const sec = digit(Math.floor(t % 60));
        const min = digit(Math.floor((t / 60) % 60));
        const hr = digit(Math.floor((t / 3600) % 60));
        return hr + ':' + min + ':' + sec; // this will convert sec to timer string
    }

    load = ({ duration }) => {
        console.log('load', duration)
        this.setState({ duration })
    }
    progress = ({ currentTime }) => this.setState({ currentTime }) // here the current time is upated

    backward = () => {
        const { CurrentVideoIndex, StudentCourseDetails } = this.state
        if (CurrentVideoIndex > 0) {
            this.FilterCourseVideo(StudentCourseDetails[CurrentVideoIndex - 1], CurrentVideoIndex - 1)
        } else {
            this.FilterCourseVideo(StudentCourseDetails[StudentCourseDetails.length - 1], StudentCourseDetails.length - 1)
        }
    }
    forward = () => {
        const { CurrentVideoIndex, StudentCourseDetails } = this.state
        if (CurrentVideoIndex < StudentCourseDetails.length - 1) {
            this.FilterCourseVideo(StudentCourseDetails[CurrentVideoIndex + 1], CurrentVideoIndex + 1)
        } else {
            this.FilterCourseVideo(StudentCourseDetails[0], 0)
        }
    }

    onslide = slide => {
        this.video.seek(slide * this.state.duration); // here the upation is maked for video seeking
        console.log(slide, this.state.duration)
        clearTimeout(this.overlayTimer);
        this.overlayTimer = setTimeout(() => this.setState({ overlay: false }), 3000);
    }

    youtubeSeekLeft = () => {
        this.setState({ overlay: true });
        this.overlayTimer = setTimeout(() => this.setState({ overlay: false }), 3000);
    }
    onEndVideo() {
        this.setState({ overlay: true })
    }
    FullScreenMethod = () => {
        // return 0;
        const { fullscreen } = this.state;
        Orientation.getOrientation((err, orientation) => {
            console.log(err, orientation)
            if (orientation === 'PORTRAIT') {
                Orientation.lockToLandscape();
                this.setState({ CurrentHieght: AppWidth, CurrentWidth: AppHieght, isFullScreen: true })
            } else {
                Orientation.lockToPortrait();
                // Orientation.unlockAllOrientations()
                this.setState({ CurrentHieght: AppWidth * 0.6, CurrentWidth: AppWidth, isFullScreen: false })
            }
            this.setState({ overlay: true });
            this.overlayTimer = setTimeout(() => this.setState({ overlay: false }), 3000);
        })
    }

    onLoadStart() {
        console.log('onLoadStart')
    }
    onEnd() {
        console.log(this.state.CurrentVideoIndex, this.state.StudentCourseDetails.length)
        if ((this.state.CurrentVideoIndex == this.state.StudentCourseDetails.length - 1) && this.state.isCourseCompleted) {
            this.setState({ MyCourseCompleted: true, paused: true, VideoLoading: false })
        } else {
            this.forward()
        }
        console.log('onEnd')
    }
    onReadyForDisplay() {
        this.setState({ VideoLoading: false })
        console.log('onReadyForDisplay')
    }
    onError(error) {
        console.log(error, this.state.currentTime, this.state.duration, 'fnfwfjwefwfnj========')
    }
    lastTap = null;
    handleDoubleTap = (doubleTapCallback, singleTapCallback) => {
        const now = Date.now();
        const DOUBLE_PRESS_DELAY = 300;
        if (this.lastTap && (now - this.lastTap) < DOUBLE_PRESS_DELAY) {
            clearTimeout(this.timer);
            doubleTapCallback();
        } else {
            this.lastTap = now;
            this.timer = setTimeout(() => {
                singleTapCallback();
            }, DOUBLE_PRESS_DELAY);
        }
    }
    PlayAgain() {
        const { StudentCourseDetails, course_id } = this.state
        this.setState({ CurrentVideoDetail: StudentCourseDetails[0], CurrentVideoIndex: 0, MyCourseCompleted: false, MyCourseCompleted: false, paused: false })
        this.FilterCourseVideo(StudentCourseDetails[0], 0)
        this.UpdateLastPlayedVideo(course_id, StudentCourseDetails[0]._id)
    }
    render() {

        const { MyCourseCompleted, isCourseCompleted, screenLoader, isFullScreen, CurrentWidth, CurrentHieght, currentTime, isLoading, duration, paused, overlay, fullscreen, CurrentVideoIndex, VideoLoading, CurrentVideoDetail } = this.state;
        console.log('CurrentWidth, CurrentHieght', CurrentWidth, CurrentHieght, AppWidth, AppHieght)

        if (screenLoader == 2) {
            return (<View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F4F4F6' }}>
                <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                    <Image width='100' height="100" resizeMode={'stretch'} source={require('../../Images/video100.png')} />
                    <Text style={{ fontSize: 16, color: '#222', fontWeight: '500', paddingTop: 10 }}>There no video to play for this course!</Text>
                </View>
                <View style={{ position: 'absolute', left: 5, top: 5, background: 'transparent', backgroundColor: "transparent" }}>
                    <Ripple onPress={() => this.GoBack()} rippleCentered={true} rippleOpacity={1} rippleSize={100} rippleDuration={600} rippleContainerBorderRadius={100} rippleColor={'#1A5566'}>
                        <MaterialIcons style={{ padding: 10, background: 'transparent', backgroundColor: "transparent" }} name="arrow-back" size={24} color="#1A5566" />
                    </Ripple>
                </View>
            </View>)
        }
        if (screenLoader == 1) {
            return (<View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F4F4F6' }}>
                <View>
                    <ActivityIndicator size="large" color="#1A5566" />
                </View>
            </View>)
        } else {
            return (
                <View style={{ flex: 1 }}>
                    {/* <StatusBar hidden={true} /> */}
                    <View style={[fullscreen ? style.fullscreenVideo : style.video, { width: CurrentWidth, height: CurrentHieght, }]}>
                        <Video
                            fullscreen={fullscreen}
                            paused={paused} // this will manage the pause and play
                            ref={ref => this.video = ref}
                            source={{ uri: CurrentVideoDetail.videoUrl }}
                            style={{ ...StyleSheet.absoluteFill }}
                            resizeMode='cover'
                            rate={1}
                            maxBitRate={200000}
                            minLoadRetryCount={3}
                            bufferConfig={{
                                minBufferMs: 5000,
                                maxBufferMs: 10000,
                                bufferForPlaybackMs: 2000,
                                bufferForPlaybackAfterRebufferMs: 5000
                            }}
                            onLoad={this.load}
                            onLoadStart={() => this.onLoadStart()}
                            onEnd={() => this.onEnd()}
                            onProgress={this.progress}
                            onReadyForDisplay={() => this.onReadyForDisplay()}
                            onVideoEnd={this.onEndVideo}
                        // onError={(error) => this.onError(error)}
                        />
                        {VideoLoading ? <View style={{ alignItems: 'center', justifyContent: 'center', width: CurrentWidth, height: CurrentHieght }}>
                            <ActivityIndicator size={64} color="yellow" />
                        </View> : null}
                        {MyCourseCompleted ? <View style={{ zIndex: 1000, alignItems: 'center', justifyContent: 'center', width: CurrentWidth, height: CurrentHieght, backgroundColor: '#222' }}>
                            <View style={{ zIndex: 1300, position: 'absolute', left: 5, top: 5, background: 'transparent', backgroundColor: "transparent" }}>
                                <Ripple onPress={() => this.GoBack()} rippleCentered={true} rippleOpacity={1} rippleSize={100} rippleDuration={600} rippleContainerBorderRadius={100} rippleColor={'#1A5566'}>
                                    <MaterialIcons style={{ padding: 10, background: 'transparent', backgroundColor: "transparent" }} name="arrow-back" size={24} color="#FFF" />
                                </Ripple>
                            </View>
                            <Text style={{ color: '#FFF', fontWeight: '600', fontSize: 16 }}>Course Completed!</Text>
                            <TouchableOpacity onPress={() => this.PlayAgain()} style={{ backgroundColor: '#1A5566', marginTop: 10, borderRadius: 5 }}>
                                <Text style={{ color: '#FFF', fontWeight: '600', fontSize: 14, padding: 5 }}>Play Again</Text>
                            </TouchableOpacity>
                        </View> : null}
                        <View style={style.overlay}>
                            {overlay ? <View style={{ ...style.overlaySet, backgroundColor: '#0006' }}>

                                <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1, justifyContent: 'space-around' }}>
                                    <View style={{ position: 'absolute', left: 5, top: 5, background: 'transparent', backgroundColor: "transparent" }}>
                                        <Ripple onPress={() => this.GoBack()} rippleCentered={true} rippleOpacity={1} rippleSize={100} rippleDuration={600} rippleContainerBorderRadius={100} rippleColor={'#1A5566'}>
                                            <MaterialIcons style={{ padding: 10, background: 'transparent', backgroundColor: "transparent" }} name="arrow-back" size={24} color="#FFF" />
                                        </Ripple>
                                    </View>
                                    <Icon name='backward' style={style.icon} onPress={() => this.backward()} />
                                    <Icon name={paused ? 'play' : 'pause'} style={style.icon} onPress={() => this.setState({ paused: !paused })} />
                                    <Icon name='forward' style={style.icon} onPress={() => this.forward()} />
                                </View>
                                <View style={[style.sliderCont, { bottom: isFullScreen ? 30 : 0 }]}>
                                    <View style={style.timer}>
                                        <View>
                                            <Text style={{ color: 'white' }}>{this.getTime(currentTime)}</Text>
                                        </View>
                                        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                                            <Text style={{ color: 'white' }}>{this.getTime(duration)}</Text>
                                            <Ripple onPress={() => this.FullScreenMethod()} rippleCentered={true} rippleOpacity={1} rippleSize={100} rippleDuration={600} rippleContainerBorderRadius={100} rippleColor={'#1A5566'}>
                                                <Icon color={'#FFF'} size={24} name={isFullScreen ? 'compress' : 'expand'} style={{ paddingLeft: 10, paddingRight: 5 }} />
                                            </Ripple>
                                        </View>

                                    </View>
                                    <Slider
                                        style={{ width: '100%' }}
                                        maximumTrackTintColor='white'
                                        minimumTrackTintColor='white'
                                        thumbTintColor='white' // now the slider and the time will work
                                        value={currentTime / duration} // slier input is 0 - 1 only so we want to convert sec to 0 - 1
                                        onValueChange={this.onslide}
                                    />
                                </View>
                            </View> : <View style={style.overlaySet}>
                                    <TouchableWithoutFeedback onPress={() => this.youtubeSeekLeft()}><View style={{ flex: 1 }} /></TouchableWithoutFeedback>
                                </View>}
                        </View>
                    </View>
                    <View style={{ marginLeft: 10, marginRight: 10, marginBottom: 5 }}>
                        <View style={{ marginLeft: 10 }}>
                            <TouchableOpacity onPress={() => this.toggleExpanded()}>
                                <Text style={{ fontSize: 14, color: '#000', paddingTop: 5, marginTop: 10, fontWeight: '600' }}>{CurrentVideoDetail ? CurrentVideoDetail.videoName : null}</Text>
                                {CurrentVideoDetail.courseId ? <View style={{ flexDirection: 'row', marginBottom: 5 }}>
                                    <Text style={{ fontSize: 12, color: '#AAA', fontWeight: '400' }}>{CurrentVideoDetail.courseId ? (CurrentVideoDetail.courseId.instructor ? CurrentVideoDetail.courseId.instructor + (CurrentVideoDetail.courseId.coInstructor ? ' || ' : null) : null) : null}</Text>
                                    <Text style={{ fontSize: 12, color: '#AAA', fontWeight: '400' }}>{CurrentVideoDetail.courseId ? (CurrentVideoDetail.courseId.coInstructor ? CurrentVideoDetail.courseId.coInstructor : null) : null}</Text>
                                </View> : null}
                            </TouchableOpacity>
                            <TouchableOpacity style={{ position: 'absolute', right: 2, paddingTop: 5 }} onPress={() => this.toggleExpanded()}>
                                <MaterialIcons color="#AAA" name={!this.state.collapsed ? "arrow-drop-up" : 'arrow-drop-down'} size={36} />
                            </TouchableOpacity>
                            <Collapsible collapsed={this.state.collapsed} align="center">
                                <Text style={{ fontSize: 12, color: '#222', paddingBottom: 5, fontWeight: '500' }}>{CurrentVideoDetail ? CurrentVideoDetail.description : null}</Text>
                                <View>
                                    {CurrentVideoDetail.attachedFiles.length > 0 ?
                                        CurrentVideoDetail.attachedFiles.map((val, j) => {
                                            return (
                                                <TouchableOpacity key={j} style={{ flexDirection: 'row', alignItems: 'center' }} onPress={() => this.DownloadResourses(val)}>
                                                    <MaterialIcons name="file-download" size={14} color={'#222'} />
                                                    <Text style={{ textDecorationLine: 'underline', paddingLeft: 5 }}>Download {j + 1}</Text>
                                                </TouchableOpacity>
                                            )
                                        }) : null}
                                </View>
                            </Collapsible>
                        </View>
                    </View>
                    <View style={{ margin: 10 }}>
                        <View style={{ marginLeft: 10, flexDirection: 'row' }}>
                            <Text style={{ fontSize: 18, color: '#000', fontWeight: '600' }}>Course Videos</Text>
                            {isCourseCompleted == true ? <Button onPress={() => this.StartMCQ()} small full style={{ position: 'absolute', right: 10, padding: 6, backgroundColor: '#1A5566', alignItems: 'center', justifyContent: 'center', borderRadius: 5 }}>
                                <Text style={{ color: 'white', fontSize: 12 }}>Take MCQ Test</Text>
                            </Button> : null}
                        </View>
                    </View>
                    <ScrollView
                        contentContainerStyle={{ backgroundColor: '#F4F4F6' }}
                        showsHorizontalScrollIndicator={false}
                        showsVerticalScrollIndicator={false}
                        horizontal={false}
                    >
                        <View style={{ marginLeft: 10, marginRight: 10, marginTop: 5, marginBottom: 20 }}>
                            {isLoading ? <View style={{ marginTop: 10 }}>
                                <ActivityIndicator size="large" color="#1A5566" />
                            </View> : null}
                            {this.state.StudentCourseDetails.length > 0 ? <View>
                                {this.state.StudentCourseDetails.map((v, i) => {
                                    return (
                                        <TouchableOpacity key={i} onPress={() => this.FilterCourseVideo(v, i)} key={i} style={{ flexDirection: 'row', borderRadius: 5, marginRight: 10, marginLeft: 10, marginTop: 10, flex: 1, backgroundColor: CurrentVideoIndex == i ? '#1A5566' : '#FFF' }}>
                                            <View style={{ marginLeft: 5, marginTop: 5, marginBottom: 5 }}>
                                                <Image style={{ width: 60, height: 60, borderRadius: 5 }} source={v.thumbnailUrl != undefined && v.thumbnailUrl != null ? { uri: v.thumbnailUrl } : null} />
                                            </View>
                                            <View style={{ flex: 1, marginRight: 10, marginLeft: 10, padding: 5 }}>
                                                <Text style={{ fontSize: 14, color: CurrentVideoIndex == i ? '#FFF' : '#000', paddingBottom: 5, paddingTop: 5, fontWeight: '600' }}>{v.videoName}</Text>
                                                <Text numberOfLines={2} style={{ fontSize: 12, color: CurrentVideoIndex == i ? '#FFF' : '#AAA', fontWeight: '500', paddingBottom: 5 }}>{v.description}</Text>
                                            </View>
                                        </TouchableOpacity>
                                    )
                                })}
                            </View> : null}
                        </View>
                    </ScrollView>
                    {this.state.isDownloaded != 0 ? <SnackBar
                        style={{ backgroundColor: this.state.isDownloaded == 2 ? '#4FAE62' : '#222' }}
                        numberOfLines={2}
                        duration={0}
                        actionTextStyle={{ color: '#FFF' }}
                        actionText={'OK'}
                        text={this.state.isDownloaded == 1 ? 'Download Started!' : 'Download Completed!'}
                    /> : null}
                </View>
            );
        }
    }
}
const mapDispatchToProps = (dispatch) => {
    return {
        StudentCoursesDetails: (payload) => dispatch(StudentCoursesDetails(payload)),
    };
};
export default withNavigation(connect(mapDispatchToProps)(ViewCourseDetails));
const style = StyleSheet.create({
    container: {
        flex: 1,
    },
    overlay: {
        ...StyleSheet.absoluteFillObject,
        // paddingBottom: 30,
        width: '100%',
        height: '100%'
    },
    overlaySet: {
        flex: 1,
        flexDirection: 'row',

    },
    icon: {
        color: 'white',
        flex: 1,
        textAlign: 'center',
        textAlignVertical: 'center',
        fontSize: 25
    },
    sliderCont: {
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 0
    },
    timer: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 5
    },
    video: { backgroundColor: 'black' },
    fullscreenVideo: {
        backgroundColor: 'black',
        ...StyleSheet.absoluteFill,
        elevation: 1
    }
});
