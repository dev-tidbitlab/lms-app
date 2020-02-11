const INITIAL_STATE = {
    currentUser: {},
    UserInfo: {},
    isLoggingIn: false,
    loading: false,
    ErrorToaster: {
        message: '',
        toast: false
    },
    SuccessToaster: {
        message: '',
        toast: false
    },
    StudentCourseList: [],
    StudentRecentlyCourseList: [],
    StudentCourseDetails: {},
    StudentOrdersList: [],
    StudentCertificatesList: { totalCertificates: 0, totalCourses: 0, certificates:[] }
};

const AuthReducer = (state = INITIAL_STATE, action) => {
    console.log(action.type, action, 'ppppp')
    switch (action.type) {
        case 'LOGGED_IN':
            return {
                ...state,
                isLoggingIn: action.payload
            };
        case 'CURRENT_USER':
            return {
                ...state,
                currentUser: action.payload
            };
        case 'SAVE_USER_INFO':
            return {
                ...state,
                UserInfo: action.payload
            };
        case 'LOADER_START':
            return {
                ...state,
                loading: true
            };
        case 'LOADER_STOP':
            return {
                ...state,
                loading: false
            };
        case 'SUCCESS_TOAST_SHOW':
            return {
                ...state,
                SuccessToaster: action.payload
            };
        case 'SUCCESS_TOAST_HIDE':
            return {
                ...state,
                SuccessToaster: action.payload
            };
        case 'ERROR_TOAST_SHOW':
            return {
                ...state,
                ErrorToaster: action.payload
            };
        case 'ERROR_TOAST_HIDE':
            return {
                ...state,
                ErrorToaster: action.payload
            };

        case 'STUDENT_COURSES_LIST_DATA':
            return {
                ...state,
                StudentCourseList: action.payload
            };
        case 'STUDENT_COURSES_DETAILS_DATA':
            return {
                ...state,
                StudentCourseDetails: action.payload
            };
        case 'STUDENT_ORDERS_LIST_DATA':
            return {
                ...state,
                StudentOrdersList: action.payload
            };
        case 'STUDENT_CERTIFICATES_LIST':
            return {
                ...state,
                StudentCertificatesList: action.payload
            };
        case 'STUDENT_RECENTLY_COURSES_LIST_DATA':
            return {
                ...state,
                StudentRecentlyCourseList: action.payload
            };

        default:
            return state;
    };
}
export default AuthReducer;