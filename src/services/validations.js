export const EMAIL_VALIDATION = {

    required: "email is required",
    pattern: {
        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
        message: "Invalid mail",
    }

}

export const PASSWORD_VALIDATION = {

    required: "Password is required",
    pattern: {
        value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{6,}$/,
        message:
            "Password must include lowercase, uppercase, number, special character, and be at least 6 characters",
    }

}

export const PHONE_NUMBER_VALIDATION = {
    required: "Field is required",
    pattern: {
        value: /^[0-9]{10,15}$/,
        message: "Invalid phone number",
    }
}

export const USER_NAME_VALIDTION = {
    required: "userName is required",
    maxLength: {
        value: 8,
        message: "userName must not exceed 8 characters",
    },
    pattern: {
        value: /^[a-zA-Z]+\d+$/,
        message: "userName must have letters and end with numbers",
    },
}