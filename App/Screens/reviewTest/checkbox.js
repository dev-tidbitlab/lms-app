import React, { Component } from "react";
import {
    View,
    StyleSheet,
    TouchableOpacity,
    Text,
} from "react-native";
import { CheckBox } from 'react-native-elements';
class CheckBoxQuestion extends Component {
    constructor() {
        super();
        this.state = {
            isCheckBoxSelected: {},
            SelectedAns: [],

        };
    }
    componentDidMount() {
        this.setState({ isCheckBoxSelected: {}, SelectedAns: [] })
    }
    shouldComponentUpdate(nextState, nextProps) {
        if ((nextProps.questionNo && this.props.questionNo) || (nextProps.data && this.props.data)) {
            if (nextProps.questionNo != this.props.questionNo || nextProps.data != this.props.data) {
                this.setState({ isCheckBoxSelected: {}, SelectedAns: [] })
                console.log('45')
                return true
            }
            console.log('456')
            return true
        }
        return true
    }


    RenderCheckBox(item, option, value) {
        let ans = this.state.isCheckBoxSelected
        return (
            <CheckBox
                disabled={true}
                containerStyle={{
                    backgroundColor: 'transparent',
                    borderWidth: 0
                }}
                checkedColor={'#1A5566'}
                title={value}
                size={24}
                checked={item.submittedAnswers.includes(option)}
            />
        )
    }
    RenderMCQ(item, questionNo) {
        return (
            <View style={{ borderRadius: 5, flex: 1 }}>
                <View>
                    {item.questionData.optiona ? <View>
                        {this.RenderCheckBox(item, 'optiona', item.questionData.optiona)}
                    </View> : null}
                    {item.questionData.optionb ? <View>
                        {this.RenderCheckBox(item, 'optionb', item.questionData.optionb)}
                    </View> : null}
                    {item.questionData.optionc ? <View>
                        {this.RenderCheckBox(item, 'optionc', item.questionData.optionc)}
                    </View> : null}
                    {item.questionData.optiond ? <View>
                        {this.RenderCheckBox(item, 'optiond', item.questionData.optiond)}
                    </View> : null}
                    {item.questionData.optione ? <View>
                        {this.RenderCheckBox(item, 'optione', item.questionData.optione)}
                    </View> : null}
                </View>
            </View>
        )
    }
    render() {
        const { data, questionNo } = this.props
        return (
            <View>
                {this.RenderMCQ(data, questionNo)}
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
