import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    Dimensions,
    Slider,
    Platform,
    TouchableNativeFeedback,
    TouchableWithoutFeedback,
    BackHandler,
    ActivityIndicator
} from 'react-native';
import Video from 'react-native-video'; /// alreadyimported this
import Icon from 'react-native-vector-icons/FontAwesome5'; // and this
import Orientation from 'react-native-orientation';

const { width, height } = Dimensions.get('window');
export default class VideoPlayer extends React.Component {
    constructor(p) {
        super(p);
        this.state = {
            currentTime: 0,
            duration: 0.1,
            paused: false,
            overlay: false,
            fullscreen: false,
            Height: width * .6,
            VideoLoading: true
        };
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
    HandleBackButton() {
        console.log('back press==>>')
        Orientation.lockToPortrait();
        return true;
    }
    componentDidMount() {
        BackHandler.addEventListener('hardwareBackPress', this.HandleBackButton)
    }
    getTime = t => {
        const digit = n => n < 10 ? `0${n}` : `${n}`;
        // const t = Math.round(time);
        const sec = digit(Math.floor(t % 60));
        const min = digit(Math.floor((t / 60) % 60));
        const hr = digit(Math.floor((t / 3600) % 60));
        return hr + ':' + min + ':' + sec; // this will convert sec to timer string
        // 33 -> 00:00:33
        // this is done here
        // ok now the theme is good to look
    }

    load = ({ duration }) => {
        console.log('load', duration)
        this.setState({ duration })
    }
    // now here the duration is update on load video
    progress = ({ currentTime }) => this.setState({ currentTime }) // here the current time is upated

    backward = () => {
        this.video.seek(this.state.currentTime - 5);
        clearTimeout(this.overlayTimer);
        this.overlayTimer = setTimeout(() => this.setState({ overlay: false }), 3000);
    }
    forward = () => {
        this.video.seek(this.state.currentTime + 5); // here the video is seek to 5 sec forward
        clearTimeout(this.overlayTimer);
        this.overlayTimer = setTimeout(() => this.setState({ overlay: false }), 3000);
    }

    onslide = slide => {
        this.video.seek(slide * this.state.duration); // here the upation is maked for video seeking
        clearTimeout(this.overlayTimer);
        this.overlayTimer = setTimeout(() => this.setState({ overlay: false }), 3000);
    }

    youtubeSeekLeft = () => {
        const { currentTime } = this.state;
        this.handleDoubleTap(() => {
            this.video.seek(currentTime - 5);
        }, () => {
            this.setState({ overlay: true });
            this.overlayTimer = setTimeout(() => this.setState({ overlay: false }), 3000);
        })
    }
    youtubeSeekRight = () => {
        const { currentTime } = this.state;
        this.handleDoubleTap(() => { // this fn is used to detect the double tap first callback
            this.video.seek(currentTime + 5);
        }, () => {
            this.setState({ overlay: true });
            this.overlayTimer = setTimeout(() => this.setState({ overlay: false }), 3000);
        })
    }

    fullscreen = () => {
        const { fullscreen } = this.state;
        if (fullscreen) {
            // Orientation.lockToPortrait();
            // this.setState({ Height: width * .6 })
        } else {
            // Orientation.lockToLandscape();
            // this.setState({ Height: width-20 })
        }
        // this.setState({ fullscreen: !fullscreen });
    }

    onLoadStart() {
        console.log('onLoadStart')
    }
    onEnd() {
        console.log('onEnd')
    }
    onReadyForDisplay() {
        this.setState({VideoLoading: false})
        console.log('onReadyForDisplay')
    }
    render = () => {
        const { currentTime, duration, paused, overlay, fullscreen, Height, VideoLoading } = this.state;
        return (
            <View style={{ flex: 1, width: '100%', height: width * 0.6 }}>
                <View style={fullscreen ? style.fullscreenVideo : style.video}>
                    <Video
                        fullscreen={fullscreen}
                        paused={paused} // this will manage the pause and play
                        ref={ref => this.video = ref}
                        source={{ uri: 'https://lms-tidbit.s3.amazonaws.com/1579343291346.mp4' }}
                        style={{ ...StyleSheet.absoluteFill }}
                        resizeMode='cover'
                        onLoad={this.load}
                        onLoadStart={() => this.onLoadStart()}
                        onEnd={() => this.onEnd()}
                        onProgress={this.progress}
                        onReadyForDisplay={() => this.onReadyForDisplay()}
                    // onVideoEnd={this.onEndVideo}
                    />
                    {VideoLoading?<View style={{alignItems:'center', justifyContent:'center', width: '100%', height: width * 0.6}}>
                        <ActivityIndicator size="large" color="#F00" />
                    </View>:null}
                    <View style={style.overlay}>
                        {/* now we can remove this not */}
                        {overlay ? <View style={{ ...style.overlaySet, backgroundColor: '#0006' }}>
                            <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1, justifyContent: 'space-around' }}>
                                <Icon name='backward' style={style.icon} onPress={this.backward} />
                                <Icon name={paused ? 'play' : 'pause'} style={style.icon} onPress={() => this.setState({ paused: !paused })} />
                                <Icon name='forward' style={style.icon} onPress={this.forward} />
                            </View>
                            <View style={style.sliderCont}>
                                <View style={style.timer}>
                                    <Text style={{ color: 'white' }}>{this.getTime(currentTime)}</Text>
                                    <Text style={{ color: 'white' }}>{this.getTime(duration)}   <Icon onPress={this.fullscreen} name={fullscreen ? 'compress' : 'expand'} style={{ fontSize: 15 }} /></Text>
                                </View>
                                <Slider
                                    // we want to add some param here
                                    maximumTrackTintColor='white'
                                    minimumTrackTintColor='white'
                                    thumbTintColor='white' // now the slider and the time will work
                                    value={currentTime / duration} // slier input is 0 - 1 only so we want to convert sec to 0 - 1
                                    onValueChange={this.onslide}
                                />
                            </View>
                        </View> : <View style={style.overlaySet}>
                                {Platform.OS == 'android' ? <TouchableNativeFeedback onPress={this.youtubeSeekLeft}><View style={{ flex: 1 }} /></TouchableNativeFeedback> :
                                    <TouchableWithoutFeedback onPress={this.youtubeSeekLeft}><View style={{ flex: 1 }} /></TouchableWithoutFeedback>}
                                {/* <TouchableNativeFeedback onPress={this.youtubeSeekRight}><View style={{ flex: 1 }} /></TouchableNativeFeedback> */}
                            </View>}
                    </View>
                </View>
            </View>
        );
    }
}

const style = StyleSheet.create({
    container: {
        // flex: 1,
        // height: width * .6,
        width: '100%'
    },
    overlay: {
        ...StyleSheet.absoluteFillObject
    },
    overlaySet: {
        flex: 1,
        flexDirection: 'row'
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
    video: { width, height: width * .6, backgroundColor: 'black' },
    fullscreenVideo: {
        backgroundColor: 'black',
        ...StyleSheet.absoluteFill,
        elevation: 1
    }
});