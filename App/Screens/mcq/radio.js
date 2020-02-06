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
            selectedRadio: '',
            selectedIndex: -1
        };
    }
    onSelect(index, value) {
        console.log(index, value)
        this.setState({ selectedIndex: index })
        this.props.onChangeRadio(value)
    }
    componentDidMount() {
        console.log('11')
        this.setState({ selectedIndex: -1 })
    }
    shouldComponentUpdate(nextState, nextProps) {
        if (nextProps.questionNo && this.props.questionNo) {
            this.setState({ selectedIndex: -1 })
            if (nextProps.questionNo != this.props.questionNo || nextProps.data != this.props.data) {
                this.setState({ selectedIndex: -1 })
                console.log('122')
                return true
            }
            console.log('155')
            return true;
        }
        return true
    }
    // componentWillReceiveProps(nextProps){
    //     this.setState({ selectedIndex: -1 })
    //     console.log(nextProps.questionNo,this.props.questionNo)
    // }
    RenderRadio(item, option, label) {
        return (
            <RadioButton value={option}
                style={{ padding: 5, margin: 0 }}
            >
                <Text
                    style={[styles.customStyle, {
                        paddingLeft: 10,
                        paddingRight: 30,
                        color: '#000',
                    }]}
                >{label.trim()}</Text>
            </RadioButton>
        )
    }
    renderRadioQ(item, questionNo) {
        let radioButton = []
        if (item.optiona) {
            radioButton.push(this.RenderRadio(item, 'optiona', item.optiona))
        }
        if (item.optionb) {
            radioButton.push(this.RenderRadio(item, 'optionb', item.optionb))
        }
        if (item.optionc) {
            radioButton.push(this.RenderRadio(item, 'optionc', item.optionc))
        }
        if (item.optiond) {
            radioButton.push(this.RenderRadio(item, 'optiond', item.optiond))
        }
        if (item.optione) {
            radioButton.push(this.RenderRadio(item, 'optione', item.optione))
        }
        return radioButton;
    }
    render() {
        const { data, questionNo } = this.props
        const { selectedIndex } = this.state
        return (
            <View style={{ margin: 10 }}>
                <RadioGroup
                    color='#1A5566'
                    onSelect={(index, value) => this.onSelect(index, value)}
                    style={{
                        width: '100%',
                        marginRight: 20,
                        paddingRight: 20
                    }}
                    selectedIndex={selectedIndex}
                >
                    {this.renderRadioQ(data, questionNo)}
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
