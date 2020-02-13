import React, { Component } from "react";
import {
    View,
    StyleSheet,
    TouchableOpacity,
    Text,
} from "react-native";
class ConfirmationModal extends Component {
    constructor() {
        super();
        this.state = {
            isCheckBoxSelected: {},
            SelectedAns: [],

        };
    }

    render() {
        const { } = this.props
        return (
            <Modal transparent={true}
                animationType={"slide"}
                visible={visible} onRequestClose={() => props.CloseModal()}
            >
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)' }}>
                    <View style={styles.ModalContainerStyle}>
                        <View style={{ width: 150, height: 150 }}>
                            <Text>Do you want to submit the mcq test?</Text>
                        </View>
                        <View style={{ padding: 5, marginBottom: 20 }}>
                            <Text style={{ textAlign: 'center', fontSize: 16 }}>ccac a c a c a c a c
                            </Text>
                        </View>
                        <View style={{ flexDirection: 'row' }}>
                            {/* <ButtonField {...rest} style={{ ...BankIDButtonStyle, backgroundColor: colors.primary }} textStyle={{ fontSize: 16, fontWeight: '500' }} text={'OK'} /> */}
                        </View>
                    </View>
                </View>
            </Modal>
        );
    }
}
export default ConfirmationModal;

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
    ModalContainerStyle: {
        justifyContent: 'center', 
        alignItems: 'center', 
        backgroundColor: '#FFF', 
        width: '80%', 
        borderRadius: 5,
    }


});
