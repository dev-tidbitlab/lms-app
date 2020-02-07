import React, { Component } from "react";
import {
    View,
    StyleSheet,
    Text,
} from "react-native";
import { RadioGroup, RadioButton } from 'react-native-flexi-radio-button'
// import { Radio } from 'native-base'
// import { RadioButton } from 'react-native-paper'
const Options = ['optiona', 'optionb', 'optionc', 'optiond', 'optione']
class RadioQuestion extends Component {
    constructor() {
        super();
        this.state = {
            selectedRadio: '',
            selectedIndex: -1
        };
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

    RenderRadio(item, option, label, index, optionIndex, submitIndex) {
        return (
            <RadioButton value={option}
                disabled={true}
                style={{ padding: 5, margin: 0 }}
            >
                <Text
                    style={[styles.customStyle, {
                        paddingLeft: 10,
                        paddingRight: 30,
                        color: submitIndex == optionIndex ? (index == submitIndex ? 'green' : 'red') : '#000',
                    }]}
                >{label.trim()}</Text>
            </RadioButton>
        )
    }
    renderRadioQ(item, questionNo, index, submitIndex) {
        let radioButton = []
        if (item.optiona) {
            radioButton.push(this.RenderRadio(item, 'optiona', item.optiona, index, 0, submitIndex))
        }
        if (item.optionb) {
            radioButton.push(this.RenderRadio(item, 'optionb', item.optionb, index, 1, submitIndex))
        }
        if (item.optionc) {
            radioButton.push(this.RenderRadio(item, 'optionc', item.optionc, index, 2, submitIndex))
        }
        if (item.optiond) {
            radioButton.push(this.RenderRadio(item, 'optiond', item.optiond, index, 3, submitIndex))
        }
        if (item.optione) {
            radioButton.push(this.RenderRadio(item, 'optione', item.optione, index, 4, submitIndex))
        }
        return radioButton;
    }
    getIndex(val) {
        return Options.indexOf(val);
    }
    getWrongIndex(data) {
        let index = -1
        if (data.questionData.correctOption[0] !== data.submittedAnswers[0]) {
            index = Options.indexOf(data.questionData.correctOption[0]);
        }
        console.log('index', index)
        return index
    }
    render() {
        const { data, questionNo } = this.props
        const { selectedIndex } = this.state
        return (
            <View style={{ margin: 10 }}>
                <RadioGroup
                    color='#1A5566'
                    activeColor={this.getWrongIndex(data) == -1 ? 'green' : 'red'}
                    style={{
                        width: '100%',
                        marginRight: 20,
                        paddingRight: 20
                    }}
                    selectedIndex={this.getIndex(data.submittedAnswers[0])}
                >
                    {this.renderRadioQ(data.questionData, questionNo, this.getWrongIndex(data), this.getIndex(data.submittedAnswers[0]))}
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
