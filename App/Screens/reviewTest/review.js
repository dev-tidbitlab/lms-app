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
import { Container, Card, CardItem, Header, Thumbnail, Left, Body, Right, Button, Title } from 'native-base';
import { withNavigation, withNavigationFocus } from 'react-navigation';
import Ionicons from "react-native-vector-icons/Ionicons";
import { GET, POST } from '../../service/index'
import RadioQuestionComponenets from './radio'
import CheckBoxQuestionComponenets from './checkbox'
class ReviewTestScreen extends Component {
    constructor() {
        super();
        this.state = {
            loading: true,
            MCQList: [],
            course_id: '',
            QuestionType: null,
            ResultData: [],
            questionNo: 0,
        };
    }

    GoBack() {
        this.props.navigation.goBack();
    }

    getInitialMCQs(course_id) {
        GET('coursejourney/student/mcq/' + course_id + '/loadMcq').then(response => {
            console.log('response==>> mcq==', response)
            if (response.success) {
                if (response.data.mcqResponseOfUser.length > 0) {
                    this.setState({ ResultData: response.data.mcqResponseOfUser })
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
    renderResult(ResultData) {
        return ResultData.map((v, i) => {
            return (
                <View key={i}>
                    {v.questionData ? <View style={{ flexDirection: 'row', marginLeft: 5, marginRight: 10 }}>
                        <View style={{ width: 25, height: 25, marginLeft: 5, marginTop: 5, marginRight: 10, backgroundColor: '#4FAE62', borderRadius: 100, justifyContent: 'center', alignItems: 'center' }}>
                            <Text style={{ color: '#FFF', textAlign: 'center' }}>{i + 1}</Text>
                        </View>
                        <Text style={{ fontSize: 14, color: '#000', paddingBottom: 5, paddingTop: 5, fontWeight: '500' }}>{v.questionData.question}</Text>
                    </View> : null}
                    {v.questionData.isMultiSelect == false ? <RadioQuestionComponenets data={v} questionNo={i + 1} /> : null}
                    {v.questionData.isMultiSelect == true ? <CheckBoxQuestionComponenets data={v} questionNo={i + 1} /> : null}
                </View>
            )
        })
    }
    render() {
        const { QuestionType, ResultData, questionNo } = this.state
        return (
            <Container style={{ backgroundColor: '#F4F4F6' }}>
                <Header style={{ backgroundColor: '#1A5566' }}>
                    <Left style={{ flex: 1 }}>
                        <Button transparent onPress={() => this.GoBack()} >
                            <Ionicons name='md-arrow-back' size={24} color='#FFF' />
                        </Button>
                    </Left>
                    <Body style={{ flex: 2, alignItems: 'center' }}>
                        <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#FFF' }}>Review Test</Text>
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
                    <View style={{padding: 20 }}>
                        {this.renderResult(ResultData)}
                    </View>
                </ScrollView>
            </Container>
        );
    }
}
export default withNavigationFocus(ReviewTestScreen);

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
