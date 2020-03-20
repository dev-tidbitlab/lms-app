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
    TextInput,
    RefreshControl
} from "react-native";
import { BottomSheet } from 'react-native-btr';
import { ProgressBar } from 'react-native-paper';
import { Container, Header, Left, Body, Right, Button } from 'native-base';
import { withNavigationFocus } from 'react-navigation';
import Ionicons from "react-native-vector-icons/Ionicons";
import AntDesign from "react-native-vector-icons/AntDesign";
import { connect } from 'react-redux';
import { StudentCoursesList } from '../../Reducers/actions'
import { fonts } from '../../Themes/style'
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
        if (v.isExpire == 'Yes') {
            return 0;
        }
        this.props.navigation.navigate('ViewCourseDetails',
            { course_id: v.courseId._id, CourseData: v }
        );
    }
    componentDidMount() {
        this.props.StudentCoursesList({ props: this.props })
    }
    onTextChange(v) {
        this.setState({ search: v })
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
            this.props.StudentCoursesList(this.props)
        }
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
            query = query + '?courseStarted=' + false + '&isExpire=No'
        } else {
            if (v == 2) {
                query = query + '?courseStarted=' + true + '&courseCompleted=' + false + '&isExpire=No'
            } else {
                query = query + '?courseCompleted=' + true
            }
        }
        this.props.StudentCoursesList({ props: this.props, query: query })
        this.setState({ visible: false });
    }
    render() {
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
                            <Text style={{ ...fonts.h6, color: '#000', fontWeight: '600' }}>My Courses</Text>
                        </View>
                        {this.props.StudentCourseList.length > 0 ? <View>
                            {this.props.StudentCourseList.map((v, i) => {
                                return (
                                    <View key={i} style={{ flexDirection: 'row', borderRadius: 5, marginRight: 10, marginLeft: 10, marginTop: 15, flex: 1, backgroundColor: '#FFF' }}>
                                        <TouchableOpacity disabled={v.isExpire == 'Yes' ? true : false} onPress={() => this.ViewCourseDetails(v)} style={{ marginLeft: 5, marginTop: 5 }}>
                                            <Image style={{ width: 100, height: 100, borderRadius: 5 }} source={v.courseId != undefined && v.courseId != null ? { uri: v.courseId.courseImage } : null} />
                                            <Button disabled={v.isExpire == 'Yes' ? true : false} onPress={() => this.ViewCourseDetails(v)} small full style={{ backgroundColor: '#1A5566', marginTop: 10, borderRadius: 5, marginBottom: 5 }}>
                                                {v.courseStarted == false && v.isExpire != 'Yes' ? <Text style={{ color: 'white', ...fonts.h8 }}>Start Course</Text> : null}
                                                {v.courseStarted == true && v.courseCompleted == false && v.isExpire != 'Yes' ? <Text style={{ color: 'white', ...fonts.h8 }}>Resume Course</Text> : null}
                                                {v.courseCompleted == true && v.courseStarted == true && v.isExpire != 'Yes' ? <Text style={{ color: 'white', ...fonts.h8 }}>Review Course</Text> : null}
                                                {v.isExpire == 'Yes' ? <Text style={{ color: 'white', ...fonts.h8 }}>Course Expired</Text> : null}
                                            </Button>
                                        </TouchableOpacity>
                                        <TouchableOpacity disabled={v.isExpire == 'Yes' ? true : false} onPress={() => this.ViewCourseDetails(v)} style={{ flex: 1, marginRight: 10, marginLeft: 10 }}>
                                            <Text style={{ ...fonts.h7, color: '#373737', paddingBottom: 5, paddingTop: 5, fontWeight: '600' }}>{v.courseId ? v.courseId.courseName : ''}</Text>
                                            <Text numberOfLines={2} style={{ ...fonts.h8, color: '#222', paddingBottom: 5 }}>{v.courseId ? v.courseId.description : ''}</Text>
                                            <Text style={{ ...fonts.h8, color: '#AAA', paddingBottom: 5 }}>Assigned Date: {this.DatedFormatting(v.coursePurchasedTimeStamp)}</Text>
                                            <Text style={{ ...fonts.h8, color: '#AAA', paddingBottom: 5 }}>Completion Date: {this.DatedFormatting(v.completionDate)}</Text>
                                            <Text style={{ ...fonts.h8, color: '#AAA', paddingBottom: 5 }}>Expiration Date: {this.DatedFormatting(v.courseExpiryTimeStamp)}</Text>
                                            <ProgressBar style={{ backgroundColor: '#CCC', marginBottom: 5 }} progress={v.progress ? v.progress / 100 : 0} color={'#1A5566'} />
                                            <Text style={{ ...fonts.h8, color: '#AAA', paddingBottom: 10 }}>{v.progress ? v.progress : 0}% complete</Text>
                                        </TouchableOpacity>
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
