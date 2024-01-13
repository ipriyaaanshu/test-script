function isValidName(name) {
    // Example: Check if the name is not empty and is at least 2 characters
    return name.length > 1;
}

function isValidEmail(email) {
    // Regular expression for basic email validation
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

