import { put, takeLatest, call, all } from 'redux-saga/effects';
import { GET, POST, FormPostAPI, GETAPI, GETRCENTAPI } from './service'
import { logout, goHomeScreen, ViewUserProfile } from './auth'
function* CheckUserLoggedIn(props) {
    console.log('params==>>>0000', props)
    try {
        const json = yield GET('isLoggedIn')
        console.log('josin===>>>>>', json)
        if (json.success) {
            yield put({ type: "SAVE_USER_INFO", payload: json });
            goHomeScreen(props.payload)
        } else {
            yield put({ type: "SAVE_USER_INFO", payload: {} });
            if (json.status == 1002) {
                logout(props.payload)
            } else {
                logout(props.payload)
            }
        }
    }
    catch (error) {
        yield put({ type: "SAVE_USER_INFO", payload: {} });
        logout(props.payload)
    }
}
function* fetchNews(props) {
    try {
        const json = yield GET('isLoggedIn')
        if (json.status == 1001) {
            logout(props.payload)
        } else {
            yield put({ type: "CURRENT_USER", payload: json, });
            yield put({ type: "LOADER_STOP", payload: false });
        }
    }
    catch (error) {
        yield put({ type: "LOADER_STOP", payload: false });
    }
}
function* MakeUserLogin(props) {
    console.log('params==>>>POST', props)
    try {
        yield put({ type: "LOADER_START", payload: true });
        const json = yield POST('login', props.payload.data)
        console.log('login -user', json)
        if (json.success) {
            yield put({
                type: "ERROR_TOAST_HIDE", payload: {
                    message: '',
                    toast: false
                }
            });
            yield put({ type: "SAVE_USER_INFO", payload: json, });
            yield goHomeScreen(props.payload.props)
            yield put({ type: "LOADER_STOP", payload: false });
        } else {
            yield put({
                type: "ERROR_TOAST_SHOW", payload: {
                    message: json.message,
                    toast: true
                }
            });
            yield put({ type: "LOADER_STOP", payload: false });
        }
    }
    catch (error) {
        console.log('error===', error)
        yield put({ type: "LOADER_STOP", payload: false });
        yield put({
            type: "ERROR_TOAST_SHOW", payload: {
                message: 'Oops! Internal server error!',
                toast: true
            }
        });
    }
}

function* HideToaster() {
    yield put({
        type: "ERROR_TOAST_HIDE", payload: {
            message: '',
            toast: false
        }
    });
}

function* HideSuccessToast() {
    yield put({
        type: "SUCCESS_TOAST_HIDE", payload: {
            message: '',
            toast: false
        }
    });
}


function* LogoutThisUser(props) {
    console.log('logout', props)
    yield put({
        type: "ERROR_TOAST_HIDE", payload: {
            message: '',
            toast: false
        }
    });
    yield put({ type: "LOADER_START", payload: false });
    try {
        const json = yield GET(props.payload.API)
        console.log('josin logout', json)
        yield put({ type: "SAVE_USER_INFO", payload: {} });
        logout(props.payload.props)
        
        yield put({ type: "LOADER_STOP", payload: false });
    }
    catch (error) {
        yield put({ type: "SAVE_USER_INFO", payload: {} });
        logout(props.payload.props)
        yield put({ type: "LOADER_STOP", payload: false });
    }
}

function* ForgotPasswordMethod(props) {
    console.log('params==>>>forgot', props)
    try {
        yield put({ type: "LOADER_START", payload: true });
        const json = yield POST('forgotPass', JSON.stringify(props.payload))
        console.log('login -user', json)
        if (json.success == false) {
            yield put({
                type: "ERROR_TOAST_SHOW", payload: {
                    message: json.message,
                    toast: true
                }
            });
        } else {
            yield put({
                type: "SUCCESS_TOAST_SHOW", payload: {
                    message: json.message,
                    toast: true
                }
            });
        }
        yield put({ type: "LOADER_STOP", payload: false });
    }
    catch (error) {
        console.log('error===', error)
        yield put({ type: "LOADER_STOP", payload: false });
        yield put({
            type: "ERROR_TOAST_SHOW", payload: {
                message: 'Oops! Internal server error!',
                toast: true
            }
        });
    }
}

function* UploadUserPic(props) {
    console.log('params==>>>forgot', props)
    try {
        yield put({ type: "LOADER_START", payload: true });
        const json = yield FormPostAPI('auth/reguser/update', props.payload.data)
        console.log('login -user', json)
        try {
            if (json.status == 1001) {
                yield put({ type: "SAVE_USER_INFO", payload: {} });
                logout(props.payload.props)
            } else {
                yield put({ type: "SAVE_USER_INFO", payload: json.userData });
                ViewUserProfile(props.payload.props)
            }
            yield put({ type: "LOADER_STOP", payload: false });
        }
        catch (error) {
            yield put({ type: "LOADER_STOP", payload: false });
            // logout(props.payload)
        }
    }
    catch (error) {
        console.log('rrr', error)
    }
}

function* UpdateUserInfo(props) {
    console.log('params==>>>update', props.payload.data)
    try {
        yield put({ type: "LOADER_START", payload: true });
        const json = yield POST('auth/reguser/update', JSON.stringify(props.payload.data))
        yield put({ type: "LOADER_STOP", payload: false });
        console.log('login -user updated', json)
        console.log('josin===>>>>>', json)
        if (json.success) {
            yield put({ type: "SAVE_USER_INFO", payload: json.userData });
            ViewUserProfile(props.payload.props)
        } else {
            yield put({
                type: "ERROR_TOAST_SHOW", payload: {
                    message: json.message,
                    toast: true
                }
            });
        }
        // if (json.status == 1001) {
        //     logout(props.payload.props)
        // } else {
        // }
    }
    catch (error) {
        yield put({ type: "LOADER_STOP", payload: false });
        console.log(error, '==>>errorerror')
        // logout(props.payload.props)
    }
}
function* StudentCoursesListAPICall(props) {
    console.log('StudentCoursesListAPICall', props)
    yield put({ type: "LOADER_START", payload: true });
    console.log('1', props.payload.search)
    let query = '?'
    if (props.payload.search) {
        query = query + '?search=' + props.payload.search
    }
    if (props.payload.query) {
        query = query + props.payload.query
    }
    console.log('query', query)
    try {
        const json = yield GETAPI('studentdashboard/student/listCourse' + query)
        console.log('12', json)
        yield put({ type: "LOADER_STOP", payload: false });
        console.log('user/reguser/listCourse   queryqueryquery', json)
        yield put({ type: "STUDENT_COURSES_LIST_DATA", payload: json.data });
    }
    catch (error) {
        console.log('rrr', error.response, error)
        yield put({ type: "LOADER_STOP", payload: false });
    }
}
function* StudentRecentlyCoursesListAPICall(props) {
    console.log('StudentRecentlyCoursesListAPICall', props)

    yield put({ type: "LOADER_START", payload: true });
    console.log('1')
    try {
        const json = yield GETRCENTAPI('studentdashboard/student/listRecentCourse')
        console.log('12', json)
        yield put({ type: "LOADER_STOP", payload: false });
        console.log('user/reguser/listRecentCourse', json)
        yield put({ type: "STUDENT_RECENTLY_COURSES_LIST_DATA", payload: json.data });
    }
    catch (error) {
        console.log('rrr', error.response, error)
        yield put({ type: "LOADER_STOP", payload: false });
    }
}

function* StudentCoursesDetailsAPICall(props) {
    console.log('StudentCoursesDetailsAPICall====>>>>>', props)

    yield put({ type: "LOADER_START", payload: true });
    console.log('1')
    try {
        const json = yield GETAPI('studentdashboard/student/listVideo/' + props.payload.data)
        console.log('12', json)
        yield put({ type: "LOADER_STOP", payload: false });
        console.log('user/reguser/listCourse', json)
        yield put({ type: "STUDENT_COURSES_DETAILS_DATA", payload: json.data });
    }
    catch (error) {
        console.log('rrr', error.response, error)
        yield put({ type: "LOADER_STOP", payload: false });
    }
}
function* StudentOrdersListAPICall(props) {
    console.log('StudentOrdersListAPICall', props)

    yield put({ type: "LOADER_START", payload: true });
    console.log('1', props.payload.search)
    let query = '?'
    if (props.payload.search) {
        query = query + '&search=' + props.payload.search
    }
    if (props.payload.query) {
        query = query + props.payload.query
    }
    console.log('query==>>', query)
    try {
        const json = yield GETAPI('studentdashboard/student/listOrder' + query)
        console.log('12', json)
        yield put({ type: "LOADER_STOP", payload: false });
        console.log('user/reguser/STUDENT_ORDERS_LIST_DATA', json)
        yield put({ type: "STUDENT_ORDERS_LIST_DATA", payload: json.data });
    }
    catch (error) {
        console.log('rrr', error.response, error)
        yield put({ type: "LOADER_STOP", payload: false });
    }
}
function* StudentCertificatesListAPICall(props) {
    console.log('StudentCertificatesListAPICall', props)
    // yield put({ type: "LOADER_START", payload: true });
    try {
        const json = yield GETAPI('studentdashboard/student/listCertificates')
        console.log('listCertificates', json)
        if (json.success) {
            yield put({ type: "STUDENT_CERTIFICATES_LIST", payload: { totalCertificates: json.totalCertificates, totalCourses: json.totalCourses, certificates: json.data } });
        }
    }
    catch (error) {
        console.log('rrr', error.response, error)
    }
}

function* GetUserInfoOf(props) {
    console.log('GetUserInfoOf')
    try {
        const json = yield GET('isLoggedIn')
        console.log('josin===>>>>>', json)
        if (json.success) {
            yield put({ type: "SAVE_USER_INFO", payload: json });
        } else {
            yield put({ type: "SAVE_USER_INFO", payload: {} });
            if (json.status == 1002) {
                logout(props.payload)
            } else {
                logout(props.payload)
            }
        }
    }
    catch (error) {
        logout(props.payload)
    }
}
function* GetUserInfo() {
    yield takeLatest("GET_USER_INFO", GetUserInfoOf);
}
function* SaveUserDetails(props) {
    yield put({ type: "SAVE_USER_INFO", payload: props.payload });
}
// function* SaveUserInfo() {
//     yield takeLatest("SAVE_USER", SaveUserDetails);
// }
function* isUserLoggedIn() {
    yield takeLatest('IS_USER_LOGGED_IN', CheckUserLoggedIn)
}
function* userInfo() {
    yield takeLatest('LOADER_START', fetchNews)
}
function* loginAction() {
    yield takeLatest('USER_LOGIN_ACTION', MakeUserLogin)
}
function* HideErrorToaster() {
    yield takeLatest('ERROR_TOASTER', HideToaster)
}
function* HideSuccessToaster() {
    yield takeLatest('SUCCESS_TOASTER', HideSuccessToast)
}

function* LogoutUser() {
    yield takeLatest('LOGOUT_USER', LogoutThisUser)
}
function* ForgotPassword() {
    yield takeLatest('FORGOT_PASSWORD_ACTION', ForgotPasswordMethod)
}
function* UserPicAction() {
    yield takeLatest('USER_PIC_ACTION', UploadUserPic)
}

function* UserSaveInfoAction() {
    yield takeLatest('USER_SAVE_INFO_ACTION', UpdateUserInfo)
}
function* StudentRecentlyCoursesList() {
    yield takeLatest('STUDENT_RECENTLY_COURSES_LIST', StudentRecentlyCoursesListAPICall)
}
function* StudentCoursesList() {
    yield takeLatest('STUDENT_COURSES_LIST', StudentCoursesListAPICall)
}
function* StudentCoursesDetails() {
    yield takeLatest('STUDENT_COURSES_DETAILS', StudentCoursesDetailsAPICall)
}
function* StudentOrdersList() {
    yield takeLatest('STUDENT_ORDERS_LIST', StudentOrdersListAPICall)
}
function* StudentCertificates() {
    yield takeLatest('STUDENT_CERTIFICATES', StudentCertificatesListAPICall)
}

function* LoaderStart() {
    yield put({ type: "LOADER_START", payload: true });
}
function* LoaderStop() {
    yield put({ type: "LOADER_STOP", payload: false });
}

export default function* rootSaga() {
    yield all([
        userInfo(),
        isUserLoggedIn(),
        loginAction(),
        HideErrorToaster(),
        HideSuccessToaster(),
        LogoutUser(),
        // SaveUserInfo(),
        ForgotPassword(),
        UserPicAction(),
        UserSaveInfoAction(),
        StudentCoursesList(),
        StudentRecentlyCoursesList(),
        StudentCoursesDetails(),
        StudentOrdersList(),
        StudentCertificates(),
        GetUserInfo(),
        LoaderStart(),
        LoaderStop(),
    ]);
}