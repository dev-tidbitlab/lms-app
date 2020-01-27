export const IsUserLoggedIn = (payload) => ({
    type: 'IS_USER_LOGGED_IN',
    payload: payload
});
export const CurrentUser = (payload) => ({
    type: 'CURRENT_USER',
    payload: payload
});
// export const SaveUserInfo = (payload) => ({
//     type: 'SAVE_USER',
//     payload: payload
// });
export const Loading = (payload) => ({
    type: 'LOADER_START',
    payload: payload
});
export const logoutUser = (payload) => ({
    type: 'LOGOUT_USER',
    payload: payload
});
export const loginAction = (payload) => ({
    type: 'USER_LOGIN_ACTION',
    payload: payload
});
export const ErrorToasterHide = () => ({
    type: 'ERROR_TOASTER'
});
export const ForgotPasswordAction = (payload) => ({
    type: 'FORGOT_PASSWORD_ACTION',
    payload: payload
});
export const UploadUserPicAction = (payload) => ({
    type: 'USER_PIC_ACTION',
    payload: payload
});
export const SaveUserInfoAction = (payload) => ({
    type: 'USER_SAVE_INFO_ACTION',
    payload: payload
});
export const GetUserInfo = (payload) => ({
    type: 'GET_USER_INFO',
    payload: payload
});

/// ***** Student dashboard Actions

export const StudentRecentlyCoursesList = (payload) => ({
    type: 'STUDENT_RECENTLY_COURSES_LIST',
    payload: payload
});
export const StudentCoursesList = (payload) => ({
    type: 'STUDENT_COURSES_LIST',
    payload: payload
});
export const StudentCoursesDetails = (payload) => ({
    type: 'STUDENT_COURSES_DETAILS',
    payload: payload
});
export const StudentOrdersList = (payload) => ({
    type: 'STUDENT_ORDERS_LIST',
    payload: payload
});
export const MyCertificates = (payload) => ({
    type: 'STUDENT_CERTIFICATES',
    payload: payload
});
