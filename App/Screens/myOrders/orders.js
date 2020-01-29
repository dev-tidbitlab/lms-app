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
import { Avatar, ProgressBar, Colors } from 'react-native-paper';
import { Container, Card, CardItem, Header, Thumbnail, Left, Body, Right, Button, Title } from 'native-base';
import { withNavigation } from 'react-navigation';
import Ionicons from "react-native-vector-icons/Ionicons";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import FontAwesome from "react-native-vector-icons/FontAwesome"
import { StudentOrdersList } from '../../Reducers/actions'
import { connect } from 'react-redux';
import AntDesign from "react-native-vector-icons/AntDesign";
import OrdersFilter from './filter'
import moment from 'moment'
const ScreenWidth = Dimensions.get('window').width
class MyOrders extends Component {
    state = {
        ScreenWidth: Dimensions.get('window').width,
        CourseArray: [{}, {}, {}, {}, {}, {}, {}, {}, {}],
        FilterModal: false,
        search: '',
        query: ''
    };
    GoBack() {
        this.props.navigation.navigate('UserListScreen');
    }
    ViewCourseDetails() {
        this.props.navigation.navigate('ViewCourseDetails');
    }
    _onRefresh(){
        this.props.StudentOrderList(this.props)
    }
    componentDidMount() {
        Dimensions.addEventListener('change', () => {
            this.getOrientation();
        });
        this.props.StudentOrderList(this.props)
    }
    getOrientation() {
        this.setState({ ScreenWidth: Dimensions.get('window').width })
    }
    DisplayFilter() {
        this.setState({ FilterModal: true });
    }
    toggleBottomNavigationView() {
        this.setState({ FilterModal: false });
    }
    onTextChange(v) {
        console.log('vvv', v)
        const { query } = this.state
        this.setState({ search: v })
        this.props.StudentOrderList({ props: this.props, search: v, query: query })
    }
    ApplyFilter(v) {
        console.log(v, 'vvv')
        this.setState({ query: v })
        this.props.StudentOrderList({ props: this.props, query: v })
    }
    DatedFormatting(date) {
        return moment(date).format("DD") + '-' + moment(date).format("MMM") + '-' + moment(date).format("YYYY")
    }
    render() {
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
                        <TextInput placeholder="Search..."
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
                            <Text style={{ fontSize: 18, color: '#000', fontWeight: '600' }}>My Orders List</Text>
                        </View>
                        {/* {this.props.loading ? <View style={{ marginTop: 10, position: 'absolute', zIndex: 1000, left: 0, right: 0 }}>
                            <ActivityIndicator size="large" color="yellow" />
                        </View> : null} */}
                        {this.props.StudentOrdersList.length > 0 ? <View>
                            {this.props.StudentOrdersList.map((v, i) => {
                                return (
                                    <TouchableOpacity key={i} style={{ flexDirection: 'row', borderRadius: 5, marginRight: 10, marginLeft: 10, marginTop: 15, flex: 1, backgroundColor: '#FFF', padding:5 }}>
                                        <View>
                                            <View style={{ width: 50, height: 50, marginLeft: 5, marginTop: 5, backgroundColor: '#0AC4BA', borderRadius: 100, justifyContent: 'center', alignItems: 'center' }}>
                                                <MaterialIcons name="payment" size={32} color="#FFF" />
                                            </View>
                                            <Text style={{ fontSize: 12, color: '#AAA', paddingTop: 5, paddingLeft: 5, paddingBottom: 5 }}>{this.DatedFormatting(v.actionTimestamp)}</Text>
                                        </View>
                                        <View style={{ flex: 1, marginRight: 10, marginLeft: 5 }}>
                                            <View style={{ flexDirection: 'row', width: '100%' }}>
                                                <Text style={{ fontSize: 14, color: '#000', paddingBottom: 5, paddingTop: 5, fontWeight: '600', marginRight: 60 }}>{v.course.courseName}</Text>
                                                <View style={{ position: 'absolute', flexDirection: 'row', right: 5, top: 5, alignItems: 'center', justifyContent: 'center' }}>
                                                    <FontAwesome name="rupee" size={16} color="#AAA" />
                                                    <Text style={{ fontSize: 14, color: '#AAA' }}>{v.amount}</Text>
                                                </View>
                                            </View>
                                            <Text style={{ fontSize: 12, color: '#AAA', paddingBottom: 5, marginBottom: 15 }}>Transaction No. {v.transactionId}</Text>
                                        </View>
                                        <Text style={{ fontSize: 12, color: '#AAA', position: 'absolute', bottom: 5, right: 15 }}>Payment mode: {v.modeOfPayment}</Text>
                                    </TouchableOpacity>
                                )
                            })}
                        </View> : null}
                    </View>
                </ScrollView>
                <OrdersFilter ApplyFilter={(v) => this.ApplyFilter(v)} toggleBottomNavigationView={() => this.toggleBottomNavigationView()} FilterModal={this.state.FilterModal} />
            </Container>
        );
    }
}
const mapStateToProps = (state) => {
    console.log(state, 'state StudentOrdersList')
    return {
        loading: state.authReducer.loading,
        StudentOrdersList: state.authReducer.StudentOrdersList
    };
};
const mapDispatchToProps = (dispatch) => {
    return {
        StudentOrderList: (payload) => dispatch(StudentOrdersList(payload)),
    };
};
export default withNavigation(connect(mapStateToProps, mapDispatchToProps)(MyOrders));

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
