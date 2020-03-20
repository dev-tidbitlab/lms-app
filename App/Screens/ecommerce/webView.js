import React, { Component } from "react";
import { WebView } from 'react-native-webview';
import { withNavigation } from 'react-navigation'
import { portalURL } from '../../../env'
class WebViewScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            portalParams: ''
        }
    }
    componentDidMount() {
        const { navigation } = this.props;
        const params = navigation.getParam('portalParams', '');
        this.setState({ portalParams: params })
    }
    render() {
        const { portalParams } = this.state
        return (
            <WebView source={{ uri: portalURL + portalParams }} />
        );
    }
}
export default withNavigation(WebViewScreen);