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
import { RadioGroup, RadioButton } from 'react-native-flexi-radio-button'
import { Container, Card, CardItem, Header, Thumbnail, Left, Body, Right, Button, Title } from 'native-base';
class RadioQuestion extends Component {
    constructor() {
        super();
        this.state = {
            loading: true,
        };
    }
    onSelect() {

    }
    renderRadioQ() {
        if (this.state.RadioQuestion.length > 0) {
            firstOptionQ = this.state.RadioQuestion.map((item, index) => {
                return (<RadioButton value={item.value} key={index}
                    style={{ padding: 5, margin: 0 }}
                >
                    <Text
                        style={[styles.customStyle, {
                            paddingLeft: 10,
                            paddingRight: 30,
                            color: '#000',
                        }]}
                    >{(item.label).trim()}</Text>
                </RadioButton>)
            })
        }
    }
    render() {
        return (
            <View style={{ margin: 10 }}>
                <RadioGroup
                    color='#62CC54'
                    onSelect={(index, value) => this.onSelect(index, value)}
                    style={{
                        width: '100%',
                        marginRight: 20,
                        paddingRight: 20
                    }}
                // selectedIndex={this.findIndex()}
                >
                    {this.renderRadioQ()}
                </RadioGroup>

            </View>
        );
    }
}
export default RadioQuestion;

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
