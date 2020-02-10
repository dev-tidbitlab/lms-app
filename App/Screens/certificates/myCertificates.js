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
import { MyCertificates } from '../../Reducers/actions'
import { connect } from 'react-redux';
import moment from 'moment'
class StudentCertificates extends Component {
    state = {
        CourseArray: [{}, {}, {}, {}, {}, {}, {}, {}, {}],
        FilterModal: false,
        search: '',
        loading: true
    };
    GoBack() {
        this.props.navigation.goBack();
    }
    _onRefresh() {
        this.props.StudentOrderList(this.props)
    }
    MyCertificatesList(course_id) {
        this.props.MyCertificates(this.props)
    }
    componentDidMount() {
        this.MyCertificatesList()
    }
    DatedFormatting(date) {
        return moment(date).format("DD") + '-' + moment(date).format("MMM") + '-' + moment(date).format("YYYY")
    }
    render() {
        console.log('StudentCertificates==>>', this.props.StudentCertificates)
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
                            refreshing={this.props.loading}
                            onRefresh={() => this._onRefresh()}
                        />
                    }
                >
                    <View style={{ margin: 10 }}>
                        <View style={{ marginLeft: 10 }}>
                            <Text style={{ fontSize: 18, color: '#000', fontWeight: '600' }}>My Orders List</Text>
                        </View>
                    </View>
                </ScrollView>
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
