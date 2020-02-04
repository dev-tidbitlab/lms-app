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
    FlatList
} from "react-native";
import { Avatar, ProgressBar, Colors } from 'react-native-paper';
import { Container, Card, CardItem, Header, Thumbnail, Left, Body, Right, Button, Title } from 'native-base';
import { withNavigation, withNavigationFocus } from 'react-navigation';
import Ionicons from "react-native-vector-icons/Ionicons";
const ScreenWidth = Dimensions.get('window').width
import { GET } from '../../service/index'
import { CheckBox } from 'react-native-elements';
import ReviewRatingModalComponent from '../reviewRating/rating'
class CheckBoxQuestion extends Component {
    constructor() {
        super();
        this.state = {
            loading: true,
            MCQList: [],
            ReviewRatingModal: false
        };
    }
    RenderCheckBox(item) {
        return (
            <CheckBox
                containerStyle={{
                    backgroundColor: '#FFF',
                    borderWidth: 0
                }}
                checkedColor={'#1A5566'}
                title={'options'}
                size={24}
                checked={true}
            />
        )
    }
    RenderMCQ(item) {
        console.log('ite', item)
        return (
            <TouchableOpacity key={item.index} style={{ borderRadius: 5, marginTop: 15, flex: 1, backgroundColor: '#FFF' }}>
                <View style={{ flexDirection: 'row' }}>
                    <View style={{ width: 25, height: 25, marginLeft: 5, marginTop: 5, backgroundColor: '#0AC4BA', borderRadius: 100, justifyContent: 'center', alignItems: 'center' }}>
                        <Text style={{ color: '#FFF' }}>1</Text>
                    </View>
                    <Text style={{ fontSize: 14, color: '#000', paddingBottom: 5, paddingTop: 5, fontWeight: '800' }}>{item.item.question}</Text>
                </View>
                <View>

                    {item.item.optiona ? <View>
                        {this.RenderCheckBox(item.item)}
                    </View> : null}
                    {item.item.optionb ? <View>
                        {this.RenderCheckBox(item.item)}
                    </View> : null}
                    {item.item.optionc ? <View>
                        {this.RenderCheckBox(item.item)}
                    </View> : null}
                    {item.item.optiond ? <View>
                        {this.RenderCheckBox(item.item)}
                    </View> : null}
                    {item.item.optione ? <View>
                        {this.RenderCheckBox(item.item)}
                    </View> : null}

                </View>
            </TouchableOpacity>
        )
    }
    render() {
        return (
                    <View style={{ margin: 10 }}>
                    </View>
        );
    }
}
export default CheckBoxQuestion;

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
