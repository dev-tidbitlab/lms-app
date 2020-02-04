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
        if (nextProps.questionNo && this.props.questionNo) {
            if (nextProps.questionNo != this.props.questionNo && nextProps.data != this.props.data) {
                this.setState({ isCheckBoxSelected: {}, SelectedAns: [] })
                return true
            }
        }
        return true
    }
    onChnageCheckBox(item, option) {
        let { SelectedAns } = this.state
        let index = SelectedAns.indexOf(option)
        let UpdateAns = SelectedAns
        let isCheckBoxSelected = this.state.isCheckBoxSelected
        if (index == -1) {
            UpdateAns.push(option)
            isCheckBoxSelected[option] = option
        } else {
            UpdateAns.splice(index, 1);
            isCheckBoxSelected[option] = null
        }
        console.log('UpdateAns', UpdateAns)
        this.setState({ isCheckBoxSelected: isCheckBoxSelected, SelectedAns: UpdateAns })
        this.props.onChangeOptions(UpdateAns)
    }
    RenderCheckBox(item, option, value) {
        let ans = this.state.isCheckBoxSelected
        return (
            <CheckBox
                containerStyle={{
                    backgroundColor: '#FFF',
                    borderWidth: 0
                }}
                checkedColor={'#1A5566'}
                title={value}
                size={24}
                checked={ans[option] == option}
                onPress={() => this.onChnageCheckBox(item, option)}
            />
        )
    }
    RenderMCQ(item, questionNo) {
        return (
            <View style={{ borderRadius: 5, marginTop: 15, flex: 1, backgroundColor: '#FFF' }}>
                <View style={{ padding: 5 }}>
                    {item.optiona ? <View>
                        {this.RenderCheckBox(item, 'optiona', item.optiona)}
                    </View> : null}
                    {item.optionb ? <View>
                        {this.RenderCheckBox(item, 'optionb', item.optionb)}
                    </View> : null}
                    {item.optionc ? <View>
                        {this.RenderCheckBox(item, 'optionc', item.optionc)}
                    </View> : null}
                    {item.optiond ? <View>
                        {this.RenderCheckBox(item, 'optiond', item.optiond)}
                    </View> : null}
                    {item.optione ? <View>
                        {this.RenderCheckBox(item, 'optione', item.optione)}
                    </View> : null}

                </View>
            </View>
        )
    }
    render() {
        const { data, questionNo } = this.props
        return (
            <View style={{ margin: 10 }}>
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
