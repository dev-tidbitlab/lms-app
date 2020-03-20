import React, { Component } from "react";
import {
    View,
    StyleSheet,
    Text,
    Image,
    ScrollView,
    StatusBar,
    RefreshControl
} from "react-native";
import { Container, Header, Left, Body, Right, Button } from 'native-base';
import { withNavigationFocus } from 'react-navigation';
import Ionicons from "react-native-vector-icons/Ionicons";
import { GET } from '../../service/index'
import { fonts } from '../../Themes/style'
class StartMCQ extends Component {
    constructor() {
        super();
        this.state = {
            loading: true,
            NoOfQuestions: 0,
            CourseTestCompleted: 0
        };
    }

    GoBack() {
        this.props.navigation.goBack();
    }
    getInitialMCQs(course_id) {
        GET('coursejourney/student/mcq/' + course_id + '/loadMcq').then(response => {
            console.log('response==>> mcq', response)
            if (response.success) {
                if (response.data.mcq) {
                    this.setState({ NoOfQuestions: response.data.count, CourseTestCompleted: 2 })
                } else {
                    this.setState({ NoOfQuestions: 0 })
                    if (response.data.latestOn == "result") {
                        this.setState({ CourseTestCompleted: 1 })
                    } else {
                        this.setState({ CourseTestCompleted: 3 })
                    }
                }
            } else {

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
    _onRefresh() {
        const { course_id } = this.state
        this.getInitialMCQs(course_id)
    }
    StartMyTest() {
        this.props.navigation.navigate('StartMyTestAndGiveANS', {
            course_id: this.state.course_id
        })
    }
    SeeYourResult() {
        this.props.navigation.navigate('TestResult', {
            course_id: this.state.course_id
        })
    }
    componentDidUpdate(prevProps) {
        if (prevProps.isFocused !== this.props.isFocused) {
            const { course_id } = this.state
            this.setState({ loading: true })
            this.getInitialMCQs(course_id)
        }
    }
    render() {
        const { NoOfQuestions, CourseTestCompleted } = this.state
        return (
            <Container style={{ backgroundColor: '#F4F4F6' }}>
                <Header style={{ backgroundColor: '#1A5566' }}>
                    <Left style={{ flex: 1 }}>
                        <Button transparent onPress={() => this.GoBack()} >
                            <Ionicons name='md-arrow-back' size={24} color='#FFF' />
                        </Button>
                    </Left>
                    <Body style={{ flex: 2, alignItems: 'center' }}>
                        <Text style={{ ...fonts.h5, fontWeight: '500', color: '#FFF' }}>MCQ Test</Text>
                    </Body>
                    <Right>
                    </Right>
                </Header>
                <StatusBar backgroundColor="#1A5566" barStyle="light-content" />
                <ScrollView
                    contentContainerStyle={{ backgroundColor: '#F4F4F6', flex: 1 }}
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
                    <View style={{ margin: 10, flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                        <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                            <Image width="80" height="80" source={require('../../Images/empty_tests.png')} />
                            {CourseTestCompleted == 2 ? <View style={{ marginTop: 15, marginLeft: 10, marginRight: 10 }}>
                                <Text style={{ ...fonts.h6, textAlign: 'center', color: '#D54534', fontWeight: '400', paddingBottom: 10 }}>Note: Answer once submitted will not be changed later.</Text>
                            </View> : null}
                            {CourseTestCompleted == 3 ? <View style={{ marginTop: 15 }}>
                                <Text style={{ ...fonts.h6, textAlign: 'center', color: '#D54534', fontWeight: '400', paddingBottom: 10 }}>There is no MCQ test for this course.</Text>
                            </View> : null}
                            <View style={{ marginTop: 10, marginBottom: 20 }}>
                                {CourseTestCompleted == 2 ? <Text style={{ ...fonts.h6, fontWeight: '500', color: '#222' }}>The test contains {NoOfQuestions} questions</Text> : null}
                                {CourseTestCompleted == 1 ? <Text style={{ ...fonts.h6, fontWeight: '500', color: '#222' }}>You have completed mcq test.</Text> : null}
                            </View>
                            <View>
                                {CourseTestCompleted == 2 ? <Button onPress={() => this.StartMyTest()} small full style={{ marginBottom: 10, backgroundColor: '#1A5566', paddingLeft: 10, paddingRight: 10, borderRadius: 5 }}>
                                    <Text style={{ color: 'white', ...fonts.h8 }}>Start Test</Text>
                                </Button> : null}
                                {CourseTestCompleted == 1 ? <Button onPress={() => this.SeeYourResult()} small full style={{ marginBottom: 10, backgroundColor: '#1A5566', paddingLeft: 10, paddingRight: 10, borderRadius: 5 }}>
                                    <Text style={{ color: 'white', ...fonts.h8 }}>View Test Result</Text>
                                </Button> : null}
                            </View>
                        </View>
                    </View>
                </ScrollView>
            </Container>
        );
    }
}
export default withNavigationFocus(StartMCQ);

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
