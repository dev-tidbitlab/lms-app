import React, { Component } from "react";
import {
    View,
    Platform,
    StyleSheet,
    TouchableOpacity,
    Text,
    ScrollView,
    TextInput,
    StatusBar,
    RefreshControl
} from "react-native";
import { Container, Header, Left, Body, Right, Button } from 'native-base';
import { withNavigation } from 'react-navigation';
import Ionicons from "react-native-vector-icons/Ionicons";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import FontAwesome from "react-native-vector-icons/FontAwesome"
import { StudentOrdersList } from '../../Reducers/actions'
import { connect } from 'react-redux';
import AntDesign from "react-native-vector-icons/AntDesign";
import OrdersFilter from './filter'
import moment from 'moment'
import { fonts } from '../../Themes/style'
class MyOrders extends Component {
    state = {
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
    _onRefresh() {
        this.props.StudentOrderList({ props: this.props, query: '&sort=updatedAt' })
    }
    componentDidMount() {
        this.props.StudentOrderList({ props: this.props, query: '&sort=updatedAt' })
    }
    DisplayFilter() {
        this.setState({ FilterModal: true });
    }
    toggleBottomNavigationView() {
        this.setState({ FilterModal: false });
    }
    onTextChange(v) {
        this.setState({ search: v })
    }
    onSubmitEditing() {
        const { query, search } = this.state
        this.props.StudentOrderList({ props: this.props, search: search, query: query })
    }
    ApplyFilter(v) {
        this.setState({ query: v })
        const { search } = this.state
        this.props.StudentOrderList({ props: this.props, search: search, query: v })
    }
    DatedFormatting(date) {
        return moment(date).format("DD") + '-' + moment(date).format("MMM") + '-' + moment(date).format("YYYY")
    }
    render() {
        const { FilterModal } = this.state
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
                            onSubmitEditing={() => this.onSubmitEditing()}
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
                            <Text style={{ ...fonts.h5, color: '#000', fontWeight: '500' }}>My Orders List</Text>
                        </View>
                        {this.props.StudentOrdersList.length > 0 ? <View>
                            {this.props.StudentOrdersList.map((v, i) => {
                                return (
                                    <View key={i} style={{ borderRadius: 5, marginRight: 10, marginLeft: 10, marginTop: 15, flex: 1, backgroundColor: '#FFF', padding: 5 }}>
                                        <View style={{ flex: 1, flexDirection: 'row' }}>
                                            <View style={{ width: 50, height: 50, marginLeft: 5, marginTop: 5, backgroundColor: '#0AC4BA', borderRadius: 100, justifyContent: 'center', alignItems: 'center' }}>
                                                <MaterialIcons name="payment" size={32} color="#FFF" />
                                            </View>
                                            <View style={{ flex: 1, marginRight: 10, marginLeft: 10 }}>
                                                <View style={{ flexDirection: 'row', width: '100%' }}>
                                                    <Text style={{ ...fonts.h7, color: '#000', paddingBottom: 5, paddingTop: 5, fontWeight: '500', marginRight: 60 }}>{v.course.courseName}</Text>
                                                    <View style={{ position: 'absolute', flexDirection: 'row', right: 5, top: 5, alignItems: 'center', justifyContent: 'center' }}>
                                                        <FontAwesome name="rupee" size={16} color="#AAA" />
                                                        <Text style={{ ...fonts.h7, color: '#AAA' }}>{v.amount}</Text>
                                                    </View>
                                                </View>
                                                <Text style={{ ...fonts.h8, color: '#AAA', paddingBottom: 5, marginBottom: 5 }}>Transaction No. {v.transactionId}</Text>
                                            </View>
                                        </View>
                                        <View style={{ flex: 1 }}>
                                            <View style={{ justifyContent: 'space-between', flexDirection: 'row', padding: 5 }}>
                                                <Text style={{ ...fonts.h8, color: '#AAA' }}>{this.DatedFormatting(v.actionTimestamp)}</Text>
                                                <Text style={{ ...fonts.h8, color: '#AAA' }}>Payment mode: {v.modeOfPayment}</Text>
                                            </View>
                                        </View>
                                    </View>
                                )
                            })}
                        </View> : null}
                    </View>
                </ScrollView>
                {FilterModal ? <OrdersFilter ApplyFilter={(v) => this.ApplyFilter(v)} toggleBottomNavigationView={() => this.toggleBottomNavigationView()} FilterModal={FilterModal} /> : null}
            </Container>
        );
    }
}
const mapStateToProps = (state) => {
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
