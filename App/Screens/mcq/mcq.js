import React, { Component } from "react";
import {
    View,
    Platform,
    StyleSheet,
    TouchableOpacity,
    ActivityIndicator,
    Text,
    ScrollView,
    StatusBar,
    Dimensions,
    RefreshControl
} from "react-native";
import { Avatar, ProgressBar, Colors } from 'react-native-paper';
import { Container, Card, CardItem, Header, Thumbnail, Left, Body, Right, Button, Title } from 'native-base';
import { withNavigation, withNavigationFocus } from 'react-navigation';
import Ionicons from "react-native-vector-icons/Ionicons";
const ScreenWidth = Dimensions.get('window').width
import { GET, POST } from '../../service/index'
import { CheckBox } from 'react-native-elements';
import ReviewRatingModalComponent from '../reviewRating/rating'
import RadioQuestionComponenets from './radio'
import CheckBoxQuestionComponenets from './checkbox'
class MCQs extends Component {
    constructor() {
        super();
        this.state = {
            loading: true,
            MCQList: [],
            ReviewRatingModal: false,
            course_id: '',
            QuestionType: null,
            MCQData: {},
            questionNo: 0,
            isActiveButton: true,
            Answers: [],
            QuestionID: ''
        };
    }

    GoBack() {
        this.props.navigation.goBack();
    }
    FilterRadioMCQs(MCQ) {
        if (MCQ.isMultiSelect) {
            this.setState({ QuestionType: 'checkbox' })
        } else {
            this.setState({ QuestionType: 'radio' })
        }
        this.setState({ MCQData: MCQ })
    }
    getInitialMCQs(course_id) {
        GET('coursejourney/student/mcq/' + course_id + '/loadMcq').then(response => {
            console.log('response==>> mcq==', response)
            if (response.success) {
                if (response.data.mcq) {
                    this.setState({ questionNo: response.data.questionNo })
                    this.FilterRadioMCQs(response.data.mcq)
                } else {
                    if (response.data.latestOn == "result") {
                        this.props.navigation.navigate('TestResult')
                    }
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
    _onRefresh() {
        const { course_id } = this.state
        this.setState({ loading: true })
        this.getInitialMCQs(course_id)
    }
    getNextQuestion() {
        const { course_id, MCQData, Answers } = this.state
        this.setState({ loading: true, isActiveButton: true })
        POST('coursejourney/student/mcq/' + course_id + '/' + MCQData._id, JSON.stringify({ submittedAnswers: Answers })).then(response => {
            console.log(response, 'res')
            if (response.success) {
                this.getInitialMCQs(course_id)
            }
        }).catch(function (error) {
            if (error) {
                console.log('error==>>', error)
                this.setState({ loading: false, isActiveButton: false })
            }
        })
    }
    ReviewRatingModalView() {
        this.setState({ ReviewRatingModal: true })
    }
    toggleBottomNavigationView() {
        this.setState({ ReviewRatingModal: false })
    }
    onChangeOptions(v) {
        console.log(v)
        if (v) {
            if (v.length > 0) {
                this.setState({ isActiveButton: false })
            } else {
                this.setState({ isActiveButton: true })
            }
        }
        this.setState({ Answers: v })
    }
    onChangeRadio(v) {
        if (v) {
            this.setState({ isActiveButton: false })
            this.setState({ Answers: [v] })
        }
    }
    render() {
        const { QuestionType, MCQData, questionNo, isActiveButton } = this.state
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
                        <View>
                            <Text style={{ fontSize: 18, color: '#000', fontWeight: '900' }}>Note: Answer once submitted will not be changed later.</Text>
                        </View>
                        <View style={{ flexDirection: 'row' }}>
                            <View style={{ width: 25, height: 25, marginLeft: 5, marginTop: 5, marginRight: 10, backgroundColor: '#0AC4BA', borderRadius: 100, justifyContent: 'center', alignItems: 'center' }}>
                                <Text style={{ color: '#FFF', textAlign: 'center' }}>{questionNo}</Text>
                            </View>
                            <Text style={{ fontSize: 14, color: '#000', paddingBottom: 5, paddingTop: 5, fontWeight: '800' }}>{MCQData.question}</Text>
                        </View>
                        {QuestionType == 'radio' ? <RadioQuestionComponenets onChangeRadio={(v) => this.onChangeRadio(v)} data={MCQData} questionNo={questionNo} /> : null}
                        {QuestionType == 'checkbox' ? <CheckBoxQuestionComponenets onChangeOptions={(v) => this.onChangeOptions(v)} data={MCQData} questionNo={questionNo} /> : null}
                        <View disabled={isActiveButton} style={{ alignItems: 'flex-end', padding: 20 }}>
                            <Ionicons onPress={() => this.getNextQuestion()} color={isActiveButton ? "#BBB" : "#1A5566"} name="ios-arrow-dropright-circle" size={48} />
                        </View>
                    </View>
                </ScrollView>
                <ReviewRatingModalComponent toggleBottomNavigationView={() => this.toggleBottomNavigationView()} ReviewRatingModal={this.state.ReviewRatingModal} />
            </Container>
        );
    }
}
export default withNavigationFocus(MCQs);

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
