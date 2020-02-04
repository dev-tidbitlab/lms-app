import React, { Component } from "react";
import {
    View,
    Platform,
    StyleSheet,
    TouchableOpacity,
    ActivityIndicator,
    Text,
    Image,
    ScrollView,
    StatusBar,
    Dimensions,
    FlatList,
    RefreshControl
} from "react-native";
import { Container, Card, CardItem, Header, Thumbnail, Left, Body, Right, Button, Title } from 'native-base';
import { withNavigation, withNavigationFocus } from 'react-navigation';
import Ionicons from "react-native-vector-icons/Ionicons";
import { GET } from '../../service/index'
class StartMCQ extends Component {
    constructor() {
        super();
        this.state = {
            loading: true,
            NoOfQuestions: 0
        };
    }

    GoBack() {
        this.props.navigation.goBack();
    }
    getInitialMCQs(course_id) {
        GET('coursejourney/student/mcq/' + course_id + '/loadMcq').then(response => {
            console.log('response==>> mcq', response)
            if (response.success) {
                // this.setState({ MCQList: response.data })
                if (response.data.mcq) {
                    this.setState({ NoOfQuestions: response.data.count })
                } else {
                    this.setState({ NoOfQuestions: 0 })
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
        this.getInitialMCQs(course_id)
    }
    StartMyTest() {
        this.props.navigation.navigate('StartMyTestAndGiveANS')
    }
    render() {
        const { NoOfQuestions } = this.state
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
                            <View style={{ marginTop: 20, marginBottom: 20 }}>
                                <Text style={{ fontSize: 16, fontWeight: '500', color: '#222' }}>The test contains {NoOfQuestions} questions</Text>
                            </View>
                            <View>
                                <TouchableOpacity onPress={() => this.StartMyTest()} style={{ bottom: 5, paddingTop: 6, paddingBottom: 6, paddingLeft: 10, paddingRight: 10, backgroundColor: '#1A5566', alignItems: 'center', justifyContent: 'center', borderRadius: 5 }}>
                                    <Text style={{ fontSize: 12, color: '#FFF' }}>Start Test</Text>
                                </TouchableOpacity>
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
