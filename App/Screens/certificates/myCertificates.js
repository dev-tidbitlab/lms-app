import React, { Component } from "react";
import {
    View,
    Platform,
    StyleSheet,
    TouchableOpacity,
    Image,
    Text,
    ScrollView,
    TextInput,
    StatusBar,
    Dimensions,
    ActivityIndicator,
    RefreshControl
} from "react-native";
import { Container, Card, CardItem, Header, Thumbnail, Left, Body, Right, Button, Title } from 'native-base';
import { withNavigation } from 'react-navigation';
import Ionicons from "react-native-vector-icons/Ionicons";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { MyCertificates } from '../../Reducers/actions'
import RNFetchBlob from 'rn-fetch-blob'
import SnackBar from '../../Components/snackBar/index'
import { connect } from 'react-redux';
import { GET } from '../../service/index'

import moment from 'moment'
class StudentCertificates extends Component {
    state = {
        CourseArray: [{}, {}, {}, {}, {}, {}, {}, {}, {}],
        FilterModal: false,
        search: '',
        loading: true,
        isDownloaded: 0,
        MyCourseCertificates: []
    };
    GoBack() {
        this.props.navigation.goBack();
    }
    componentDidMount() {
        // this.setState({ MyCourseCertificates: this.props.StudentCertificates.certificates })
        this.MyCertificatesListMethod()
    }
    _onRefresh() {
        this.MyCertificatesListMethod()
    }
    MyCertificatesListMethod() {
        this.setState({ loading: true })
        GET('studentdashboard/student/listCertificates').then(response => {
            console.log('response==>> mcq==', response)
            if (response.success) {
                this.setState({ MyCourseCertificates: response.data })
            }
            this.setState({ loading: false })
        }).catch(function (error) {
            if (error) {
                this.setState({ loading: false })
            }
        })
    }
    DatedFormatting(date) {
        return moment(date).format("DD") + '-' + moment(date).format("MMM") + '-' + moment(date).format("YYYY")
    }
    DownloadMyCertificates(file) {
        let app = this
        app.setState({ isDownloaded: 0 }, () => {
            app.setState({ isDownloaded: 1 })
            const { config, fs } = RNFetchBlob
            let DownloadDir = fs.dirs.DownloadDir // this is the pictures directory. You can check the available directories in the wiki.
            let str = file.courseName
            let fileName = str.replace(/^"(.*)"$/, '$1');
            fileName = fileName + '.pdf'
            console.log('fileName', fileName)
            RNFetchBlob
                .config({
                    addAndroidDownloads: {
                        useDownloadManager: true, // <-- this is the only thing required
                        notification: false,
                        path: DownloadDir + "/lms/" + fileName,
                        description: 'Certificate File',
                        mediaScannable: true,
                        notification: true,
                        title: fileName
                    }
                })
                .fetch('GET', file.certificateUrl)
                .then((resp) => {
                    console.log(resp)
                    resp.path()
                    app.setState({ isDownloaded: 2 })
                })
        })

    }
    render() {
        const { MyCourseCertificates, loading } = this.state
        console.log('MyCourseCertificates', MyCourseCertificates)
        return (
            <Container style={{ backgroundColor: '#F4F4F6' }}>
                <Header style={{ backgroundColor: '#1A5566' }}>
                    <Left style={{ flex: 0.5 }}>
                        <Button transparent onPress={() => this.GoBack()} >
                            <Ionicons name='md-arrow-back' size={24} color='#FFF' />
                        </Button>
                    </Left>
                    <Body style={{ flex: 2, alignItems: 'center', justifyContent: 'center' }}>
                        <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#FFF' }}>My Certificates</Text>
                    </Body>
                    <Right style={{ flex: 0.5 }}>

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
                            refreshing={loading}
                            onRefresh={() => this._onRefresh()}
                        />
                    }
                >
                    <View style={{ margin: 10 }}>
                        <View style={{ marginLeft: 10 }}>
                            <Text style={{ fontSize: 18, color: '#000', fontWeight: '600' }}>My Certificates</Text>
                        </View>
                        {MyCourseCertificates.length > 0 ? <View>
                            {MyCourseCertificates.map((v, i) => {
                                return (
                                    <View key={i} style={{ flexDirection: 'row', borderRadius: 5, marginRight: 10, marginLeft: 10, marginTop: 15, flex: 1, backgroundColor: '#FFF' }}>
                                        <View style={{ marginLeft: 5, marginTop: 5 }}>
                                            <Image style={{ width: 100, height: 100, borderRadius: 5 }} source={require('../../Images/certificateImg.png')} />
                                        </View>
                                        <View style={{ flex: 1, marginRight: 10, marginLeft: 10 }}>
                                            <Text style={{ fontSize: 14, color: '#000', paddingBottom: 10, paddingTop: 5, fontWeight: '400' }}>{v ? v.courseName : ''}</Text>
                                            <Text style={{ fontSize: 12, color: '#AAA', paddingBottom: 10 }}>Completion Date: {this.DatedFormatting(v.completionDate)}</Text>
                                            <TouchableOpacity onPress={() => this.DownloadMyCertificates(v)} style={{ width: 180, flexDirection: 'row', paddingTop: 6, paddingBottom: 6, paddingLeft: 10, paddingRight: 10, backgroundColor: '#1A5566', alignItems: 'center', justifyContent: 'center', borderRadius: 5, marginBottom: 5 }}>
                                                <MaterialIcons name="file-download" size={18} color={'#FFF'} />
                                                <Text style={{ color: 'white', fonSize: 12, }}>Download Certificate</Text>
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                )
                            })}
                        </View> : null
                        }
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
            </Container>
        );
    }
}
const mapStateToProps = (state) => {
    console.log(state, 'state MyCertificates===>>>>', state.authReducer.StudentRecentlyCourseList)
    return {
        loading: state.authReducer.loading,
        StudentCertificates: state.authReducer.StudentCertificatesList
    };
};
const mapDispatchToProps = (dispatch) => {
    return {
        MyCertificates: (payload) => dispatch(MyCertificates(payload)),
    };
};
export default withNavigation(connect(mapStateToProps, mapDispatchToProps)(StudentCertificates));

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
