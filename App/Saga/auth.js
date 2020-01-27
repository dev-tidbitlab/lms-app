export const logout = (props) => {
    props.navigation.navigate('AppLoginScreen')
};

export const goHomeScreen = (props) => {
    props.navigation.navigate('Home')
};
export const ViewUserProfile = (props) => {
    props.navigation.replace('StudentProfile')
};
