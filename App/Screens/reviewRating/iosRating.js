import React, { Component } from "react";
import {
    View,
    StyleSheet,
    TouchableOpacity,
    Text,
    TextInput,
    KeyboardAvoidingView,
    Animated,
} from "react-native";
import { withNavigationFocus } from 'react-navigation';
import Feather from 'react-native-vector-icons/Feather'
import { Rating, AirbnbRating } from 'react-native-ratings';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
class ReviewRating extends Component {
    constructor() {
        super();
        this.state = {
            isFocused: true,
            yPosition: new Animated.Value(-500),
        };
        this.rating = ''
        this.review = ''

    }
    componentDidMount() {
        const { duration } = this.props;
        Animated.timing(this.state.yPosition, {
            toValue: 0,
            duration: 500,
        }).start();
        console.log('duration--', duration)
        if (duration > 0)
            setTimeout(() => this.close(), duration);
    }
    close = () => {
        Animated.timing(this.state.yPosition, {
            toValue: -500,
            duration: 500,
        }).start();
    }

    onPress = () => {
        this.props.onPress();
        this.close();
    }
    _toggleBottomNavigationView() {
        let app = this
        const { isFocused } = this.state
        if (!isFocused) {
            this.props.SaveReviewAndRating({ rating: this.rating, review: this.review })
        }
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
            <KeyboardAvoidingView style={styles.container} behavior="padding" enabled>
                <Animated.View style={{ ...styles.bottomNavigationView, bottom: this.state.yPosition }}>
                    <TouchableOpacity
                        onPress={() => this.onPress()}
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
                        <Feather style={{ position: 'absolute', right: 10, top: 8 }} name="chevron-down" size={32} color={"gray"} />
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
                </Animated.View>
            </KeyboardAvoidingView>
        );
    }
}
export default withNavigationFocus(ReviewRating);

const styles = StyleSheet.create({
    bottomNavigationView: {
        backgroundColor: '#FFF',
        width: '100%',
        height: 260,
        bottom: 200,
        justifyContent: 'center',
        alignItems: 'center',
    },
});
