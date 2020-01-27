import React from 'react'
import { ProgressDialog } from 'react-native-simple-dialogs';

export const Progress = (props) => {
    return (
        <ProgressDialog
            // overlayStyle={{backgroundColor:'transparent'}}
            animationType='fade'
            visible={props.DialogLoader}
            title='Please wait...'
            message="Loading"
        />
    )
}