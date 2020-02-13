import React, { Component } from "react";
import {
    View,
    Platform,
    StyleSheet,
    TouchableOpacity,
    Modal,
    TouchableHighlight,
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
            QuestionID: '',
            MCQCompleted: false,
            ConfirmationModal: false
        };
    }

    GoBack() {
        this.props.navigation.goBack();
    }
    GoBackToStartTest() {
        this.setState({ ConfirmationModal: false }, () => {
            this.props.navigation.goBack();
        })
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
                this.setState({ConfirmationModal: false})
                if (response.data.mcq) {
                    this.setState({ questionNo: response.data.questionNo })
                    this.FilterRadioMCQs(response.data.mcq)
                } else {
                    if (response.data.latestOn == "result") {
                        this.props.navigation.navigate('TestResult', {
                            course_id: this.state.course_id
                        })
                    }
                }
                if (response.data.count == response.data.questionNo) {
                    this.setState({ MCQCompleted: true })
                } else {
                    this.setState({ MCQCompleted: false })
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
    componentDidUpdate(prevProps) {
        if (prevProps.isFocused !== this.props.isFocused) {
            const { course_id } = this.state
            this.setState({ loading: true })
            this.getInitialMCQs(course_id)
        }
    }
    _onRefresh() {
        const { course_id } = this.state
        this.setState({ loading: true })
        this.getInitialMCQs(course_id)
    }
    GoToNextMCQQuestion() {
        const { MCQCompleted } = this.state
        console.log(MCQCompleted)
        if (MCQCompleted) {
            this.setState({ ConfirmationModal: true })
        } else {
            this.getNextQuestion()
        }
    }
    SubmitTest() {
        this.getNextQuestion()
    }
    getNextQuestion() {
        const { course_id, MCQData, Answers } = this.state
        this.setState({ loading: true, isActiveButton: true })
        POST('coursejourney/student/mcq/' + course_id + '/' + MCQData._id, JSON.stringify({ submittedAnswers: Answers })).then(response => {
            console.log(response, 'res')
            if (response.success) {
                this.setState({ QuestionType: null }, () => {
                    this.getInitialMCQs(course_id)
                })
                if (response.data.count == response.data.questionNo) {
                    this.setState({ MCQCompleted: true })
                } else {
                    this.setState({ MCQCompleted: false })
                }
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
    CloseModal() {

    }
    render() {
        const { QuestionType, MCQData, questionNo, isActiveButton, ConfirmationModal } = this.state
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
                    <View style={{ padding: 10 }}>
                        <View style={{ margin: 10 }}>
                            <Text style={{ fontSize: 16, color: '#D54534', fontWeight: '400', paddingBottom: 10 }}>Note: Answer once submitted will not be changed later.</Text>
                        </View>
                        {QuestionType ? <View style={{ flexDirection: 'row', paddingLeft: 10, paddingRight: 10 }}>
                            <View style={{ width: 25, height: 25, marginLeft: 5, marginTop: 5, marginRight: 10, backgroundColor: '#4FAE62', borderRadius: 100, justifyContent: 'center', alignItems: 'center' }}>
                                <Text style={{ color: '#FFF', textAlign: 'center' }}>{questionNo}</Text>
                            </View>
                            <Text style={{ fontSize: 14, color: '#000', paddingBottom: 5, paddingTop: 5, fontWeight: '500' }}>{MCQData.question}</Text>
                        </View> : null}
                        {QuestionType == 'radio' ? <RadioQuestionComponenets onChangeRadio={(v) => this.onChangeRadio(v)} data={MCQData} questionNo={questionNo} /> : null}
                        {QuestionType == 'checkbox' ? <CheckBoxQuestionComponenets onChangeOptions={(v) => this.onChangeOptions(v)} data={MCQData} questionNo={questionNo} /> : null}
                        <View style={{ alignItems: 'flex-end' }}>
                            <TouchableHighlight style={{ width: 60, height: 60 }}>
                                <Ionicons disabled={isActiveButton} onPress={() => isActiveButton ? {} : this.GoToNextMCQQuestion()} color={isActiveButton ? "#BBB" : "#1A5566"} name="ios-arrow-dropright-circle" size={56} />
                            </TouchableHighlight>
                        </View>
                    </View>
                </ScrollView>
                <ReviewRatingModalComponent toggleBottomNavigationView={() => this.toggleBottomNavigationView()} ReviewRatingModal={this.state.ReviewRatingModal} />
                <Modal transparent={true}
                    animationType={"slide"}
                    visible={ConfirmationModal}
                    onRequestClose={() => this.CloseModal()}
                >
                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)' }}>
                        <View style={styles.ModalContainerStyle}>
                            <View style={{ flexDirection: 'row', padding: 20 }}>
                                <Text style={{ fontSize: 16, color: '#222', fontWeight: '500', textAlign: 'center' }}>Do you want to submit the mcq test?</Text>
                            </View>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-around', marginBottom: 15 }}>
                                <Button onPress={() => this.GoBackToStartTest()} small full style={{ backgroundColor: '#AAA', marginTop: 10, borderRadius: 5, marginBottom: 5, marginRight: 15, padding: 10 }}>
                                    <Text style={{ color: 'white', fontSize: 12 }}>Cancel</Text>
                                </Button>
                                <Button onPress={() => this.SubmitTest()} small full style={{ backgroundColor: '#1A5566', marginTop: 10, borderRadius: 5, marginBottom: 5, marginLeft: 15, padding: 10 }}>
                                    <Text style={{ color: 'white', fontSize: 12 }}>Submit</Text>
                                </Button>
                            </View>
                        </View>
                    </View>
                </Modal>
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
    ModalContainerStyle: {
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#FFF',
        width: '80%',
        borderRadius: 5,
    }

});
