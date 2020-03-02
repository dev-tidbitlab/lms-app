import React, { Component } from "react";
import {
    View,
    StyleSheet,
    TouchableOpacity,
    Text,
    TextInput,
    KeyboardAvoidingView
} from "react-native";
import { BottomSheet } from 'react-native-btr';
import { withNavigationFocus } from 'react-navigation';
import { Rating, AirbnbRating } from 'react-native-ratings';
import Feather from 'react-native-vector-icons/Feather'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
class ReviewRating extends Component {
    constructor() {
        super();
        this.state = {
            isFocused: true
        };
        this.rating = ''
        this.review = ''
    }

    _toggleBottomNavigationView() {
        let app = this
        this.props.SaveReviewAndRating({ rating: this.rating, review: this.review })
    }
    _toggleBottomNavigationViewClose() {
        this.props._toggleBottomNavigationViewClose()
    }
    ratingCompleted(rating) {
        this.rating = rating
        this.setState({ isFocused: false })
    }
    render() {
        const { isFocused } = this.state
        return (
            <BottomSheet
                visible={this.props.ReviewRatingModal}
                onBackButtonPress={() => this._toggleBottomNavigationViewClose()}
                onBackdropPress={() => this._toggleBottomNavigationViewClose()}
            >
                <View style={styles.bottomNavigationView}>
                <TouchableOpacity
                    onPress={()=>this._toggleBottomNavigationViewClose()}
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
                    <Feather style={{position:'absolute', right: 10, top:8}} name="chevron-down" size={32} color={'gray'}/>
                    </TouchableOpacity>
                    <View style={{ flex: 1, width: '100%' }}>
                        <View style={{ padding: 12 }}>
                            <AirbnbRating defaultRating={0} size={20} count={5} showRating={false} onFinishRating={rating => this.ratingCompleted(rating)} />
                        </View>
                        <View style={{ padding: 5, borderTopWidth: 1, borderColor: '#EEE', height: 100 }}>
                            <TextInput onSubmitEditing={() => this._toggleBottomNavigationView()} onChangeText={(v) => this.review = v} style={{ textAlignVertical: 'top' }} numberOfLines={10} multiline={true} placeholder="Write a review" />
                        </View>
                        <TouchableOpacity disabled={isFocused} onPress={() => this._toggleBottomNavigationView()} style={{ height: 50, bottom: 0, left: 0, right: 0, position: 'absolute', alignItems: 'center', justifyContent: 'center', backgroundColor: isFocused ? '#BBB' : '#1A5566' }}>
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
