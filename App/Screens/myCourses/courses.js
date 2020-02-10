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
    ActivityIndicator,
    TextInput,
    Picker,
    RefreshControl
} from "react-native";
import { BottomSheet } from 'react-native-btr';
import { Avatar, ProgressBar, Colors } from 'react-native-paper';
import { Container, Card, CardItem, Header, Icon, Form, Left, Body, Right, Button, Title } from 'native-base';
import { withNavigation, withNavigationFocus } from 'react-navigation';
import Ionicons from "react-native-vector-icons/Ionicons";
import AntDesign from "react-native-vector-icons/AntDesign";

const ScreenWidth = Dimensions.get('window').width
import { connect } from 'react-redux';
import { StudentCoursesList } from '../../Reducers/actions'
import moment from 'moment'
class MyCourses extends Component {
    state = {
        ScreenWidth: Dimensions.get('window').width,
        CourseArray: [{}, {}, {}, {}, {}, {}, {}, {}, {}],
        selected: "",
        visible: false,
        search: null
    };
    GoBack() {
        this.props.navigation.navigate('UserListScreen');
    }
    ViewCourseDetails(v) {
        console.log('ttt')
        this.props.navigation.navigate('ViewCourseDetails',
            { course_id: v.courseId._id, CourseData: v }
        );
    }
    componentDidMount() {
        Dimensions.addEventListener('change', () => {
            this.getOrientation();
        });
        this.props.StudentCoursesList({ props: this.props })
    }
    onTextChange(v) {
        console.log('vvv', v)
        this.setState({ search: v })
        // this.props.StudentCoursesList({ props: this.props, search: v })
    }
    onSubmitSearch() {
        const { search } = this.state
        this.props.StudentCoursesList({ props: this.props, search: search })
    }
    _onRefresh() {
        this.props.StudentCoursesList(this.props)
    }
    componentDidUpdate(prevProps) {
        if (prevProps.isFocused !== this.props.isFocused) {
            console.log(prevProps.isFocused, this.props.isFocused)
            this.props.StudentCoursesList(this.props)
        }
    }
    getOrientation() {
        this.setState({ ScreenWidth: Dimensions.get('window').width })
    }
    DatedFormatting(date) {
        return moment(date).format("DD") + '-' + moment(date).format("MMM") + '-' + moment(date).format("YYYY")
    }
    onValueChange() {

    }
    _toggleBottomNavigationView = () => {
        this.setState({ visible: !this.state.visible });
    }
    DisplayFilter() {
        this.setState({ visible: true });
    }
    onFilterValueChange(v) {
        let query = ''
        if (v == 1) {
            query = query + '?courseStarted=' + false
        } else {
            if (v == 2) {
                query = query + '?courseStarted=' + true
            } else {
                query = query + '?courseCompleted=' + true
            }
        }
        this.props.StudentCoursesList({ props: this.props, query: query })
        this.setState({ visible: false });
    }
    render() {
        console.log('mooo===>>>', this.props.StudentCourseList)
        const { courseStarted, courseCompleted } = this.props.StudentCourseList
        let ScreenWidth = this.state.ScreenWidth
        return (
            <Container style={{ backgroundColor: '#F4F4F6' }}>
                <Header style={{ backgroundColor: '#1A5566' }}>
                    <Left style={{ flex: 0.5 }}>
                        <Button transparent onPress={() => this.GoBack()} >
                            <Ionicons name='md-arrow-back' size={24} color='#FFF' />
                        </Button>
                    </Left>
                    <Body style={{ flex: 2, alignItems: 'center', justifyContent: 'center' }}>
                        <TextInput placeholder="Search by name"
                            style={{
                                color: '#1A5566',
                                placeholderTextColor: "#F00",
                                padding: Platform.OS == "ios" ? 5 : 2,
                                paddingLeft: 10,
                                paddingRight: 10,
                                underlineColorAndroid: 'transparent',
                                borderRadius: 10,
                                borderWidth: 1,
                                borderColor: '#EEE',
                                width: '100%',
                                backgroundColor: '#FFF'
                            }}
                            onSubmitEditing={() => this.onSubmitSearch()}
                            onChangeText={v => this.onTextChange(v)}
                        />
                    </Body>
                    <Right style={{ flex: 0.5 }}>
                        <TouchableOpacity onPress={() => this.DisplayFilter()}>
                            <AntDesign name="filter" style={{ color: "#FFF", fontSize: 25 }} />
                        </TouchableOpacity>
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
                            refreshing={this.props.loading}
                            onRefresh={() => this._onRefresh()}
                        />
                    }
                >
                    <View style={{ margin: 10 }}>
                        <View style={{ marginLeft: 10 }}>
                            <Text style={{ fontSize: 18, color: '#000', fontWeight: '600' }}>My Courses</Text>
                        </View>
                        {this.props.StudentCourseList.length > 0 ? <View>
                            {this.props.StudentCourseList.map((v, i) => {
                                return (
                                    <View key={i} style={{ flexDirection: 'row', borderRadius: 5, marginRight: 10, marginLeft: 10, marginTop: 15, flex: 1, backgroundColor: '#FFF' }}>
                                        <View onPress={() => this.ViewCourseDetails(v)} style={{ marginLeft: 5, marginTop: 5 }}>
                                            <Image style={{ width: 100, height: 100, borderRadius: 5 }} source={{ uri: v.courseId != undefined && v.courseId != null ? v.courseId.courseImage : null }} />
                                            <Button onPress={() => this.ViewCourseDetails(v)} small full style={{ backgroundColor: '#1A5566', marginTop: 10, borderRadius: 5, marginBottom: 5 }}>
                                                {v.courseStarted == false ? <Text style={{ color: 'white', fontSize: 12 }}>Start Course</Text> : null}
                                                {v.courseStarted == true && v.courseCompleted == false ? <Text style={{ color: 'white', fontSize: 12 }}>Resume Course</Text> : null}
                                                {v.courseCompleted == true && v.courseStarted == true ? <Text style={{ color: 'white', fontSize: 12 }}>Review Course</Text> : null}
                                            </Button>
                                        </View>
                                        <View style={{ flex: 1, marginRight: 10, marginLeft: 10 }}>
                                            <Text style={{ fontSize: 14, color: '#000', paddingBottom: 5, paddingTop: 5, fontWeight: '400' }}>{v.courseId ? v.courseId.courseName : ''}</Text>
                                            <Text numberOfLines={2} style={{ fontSize: 12, color: '#000', paddingBottom: 5 }}>{v.courseId ? v.courseId.description : ''}</Text>
                                            <Text style={{ fontSize: 12, color: '#AAA', paddingBottom: 5 }}>Assigned Date: {this.DatedFormatting(v.coursePurchasedTimeStamp)}</Text>
                                            {/* <Text style={{ fontSize: 12, color: '#AAA', paddingBottom: 5 }}>Completion Date: </Text> */}
                                            <Text style={{ fontSize: 12, color: '#AAA', paddingBottom: 5 }}>Expiration Date: {this.DatedFormatting(v.courseExpiryTimeStamp)}</Text>
                                            <ProgressBar style={{ backgroundColor: '#CCC', marginBottom: 5 }} progress={v.progress ? v.progress / 100 : 0} color={'#1A5566'} />
                                            <Text style={{ fontSize: 12, color: '#AAA', paddingBottom: 10 }}>{v.progress ? v.progress : 0}% complete</Text>
                                        </View>
                                    </View>
                                )
                            })}
                        </View> : null
                        }
                    </View>
                </ScrollView >
                <BottomSheet
                    visible={this.state.visible}
                    onBackButtonPress={this._toggleBottomNavigationView}
                    onBackdropPress={this._toggleBottomNavigationView}
                >
                    <View style={styles.bottomNavigationView}>
                        <View
                            style={{
                                width: '100%',
                                flexDirection: 'row',
                                justifyContent: 'center',
                                borderBottomWidth: 1,
                                borderBottomColor: '#AAA'
                            }}>

                            <Text style={{ textAlign: 'center', fontSize: 20, padding: 10 }}>
                                Select Course Filter
                            </Text>
                        </View>
                        <View style={{ flex: 1, width: '100%' }}>
                            <TouchableOpacity onPress={() => this.onFilterValueChange(1)} style={{
                                padding: 15, borderBottomWidth: 1,
                                borderBottomColor: '#EEE'
                            }}>
                                <Text style={{ textAlign: 'center' }}>Not Started</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => this.onFilterValueChange(2)} style={{
                                padding: 15, borderBottomWidth: 1,
                                borderBottomColor: '#EEE'
                            }}>
                                <Text style={{ textAlign: 'center' }}>In Progress</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => this.onFilterValueChange(3)} style={{
                                padding: 15
                            }}>
                                <Text style={{ textAlign: 'center' }}>Completed</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </BottomSheet>
            </Container >
        );
    }
}
const mapStateToProps = (state) => {
    console.log(state, 'state dash', state.authReducer.StudentCourseList)
    return {
        loading: state.authReducer.loading,
        StudentCourseList: state.authReducer.StudentCourseList
    };
};
const mapDispatchToProps = (dispatch) => {
    return {
        StudentCoursesList: (payload) => dispatch(StudentCoursesList(payload)),
    };
};
export default withNavigationFocus(connect(mapStateToProps, mapDispatchToProps)(MyCourses));

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
    MainContainer: {
        flex: 1,
        margin: 2,
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: Platform.OS === 'ios' ? 20 : 0,
        backgroundColor: '#E0F7FA',
    },
    bottomNavigationView: {
        backgroundColor: '#fff',
        width: '100%',
        height: 200,
        justifyContent: 'center',
        alignItems: 'center',
    },

});
