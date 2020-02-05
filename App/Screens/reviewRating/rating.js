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
    TextInput
} from "react-native";
import { BottomSheet } from 'react-native-btr';
import { Avatar, ProgressBar, Colors } from 'react-native-paper';
import { Container, Card, CardItem, Header, Thumbnail, Left, Body, Right, Button, Title } from 'native-base';
import { withNavigation, withNavigationFocus } from 'react-navigation';
import Ionicons from "react-native-vector-icons/Ionicons";
const ScreenWidth = Dimensions.get('window').width
import { CheckBox } from 'react-native-elements';
import { Rating, AirbnbRating } from 'react-native-ratings';
class ReviewRating extends Component {
    constructor() {
        super();
        this.state = {
            loading: true,
            MCQList: [],
            Rating: 0,
            CourseRating: 0
        };
        this.rating = ''
        this.review = ''
    }

    onFilterValueChange() {

    }
    _toggleBottomNavigationView() {
        console.log('22')
        let app = this
        this.props.SaveReviewAndRating({ rating: this.rating, review: this.review })
        // if (app.props.toggleBottomNavigationView(false)) {
        //     app.props.toggleBottomNavigationView(false)
        // }
    }
    ratingCompleted(rating) {
        this.rating = rating
    }
    render() {
        return (
            <BottomSheet
                visible={this.props.ReviewRatingModal}
                onBackButtonPress={() => this._toggleBottomNavigationView()}
                onBackdropPress={() => this._toggleBottomNavigationView()}
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
                            Review & Rating
                    </Text>
                    </View>
                    <View style={{ flex: 1, width: '100%' }}>
                        <View style={{ padding: 12 }}>
                            <AirbnbRating defaultRating={0} size={20} count={5} showRating={false} onFinishRating={rating => this.ratingCompleted(rating)} />
                        </View>
                        <View style={{ padding: 5, borderTopWidth: 1, borderColor: '#EEE', height: 100 }}>
                            <TextInput onChangeText={(v) => this.review = v} style={{ textAlignVertical: 'top' }} numberOfLines={10} multiline={true} placeholder="Write a review" />
                        </View>
                        <TouchableOpacity onPress={() => this._toggleBottomNavigationView()} style={{ height: 50, bottom: 0, left: 0, right: 0, position: 'absolute', alignItems: 'center', justifyContent: 'center', backgroundColor: '#1A5566' }}>
                            <Text style={{ color: '#FFF', fontSize: 16 }}>SAVE</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </BottomSheet>
        );
    }
}
export default withNavigationFocus(ReviewRating);

const styles = StyleSheet.create({
    bottomNavigationView: {
        backgroundColor: '#fff',
        width: '100%',
        height: 260,
        justifyContent: 'center',
        alignItems: 'center',
    },


});
