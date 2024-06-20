const initialState = {
    token: null,
    email: null,
    firstName: null,
    lastName: null,
    dob: null,
    role: null
}

const AuthReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'SET_TOKEN':
            return {
                ...state,
                token: action.payload
            }
        case 'SET_EMAIL':
            return {
                ...state,
                email: action.payload
            }
        case 'SET_FIRST_NAME':
            return {
                ...state,
                firstName: action.payload
            }
        case 'SET_LAST_NAME':
            return {
                ...state,
                lastName: action.payload
            }
        case 'SET_DOB':
            return {
                ...state,
                dob: action.payload
            }
        case 'SET_ROLE':
            return {
                ...state,
                role: action.payload
            }
        default:
            return state;
    }
}

export default AuthReducer;