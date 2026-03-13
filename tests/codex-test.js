const addNumbers = (a, b) => {
    const result = a + b;
    return result;
};

const greetUser = (name) => {
    const greeting = `Hello ${name}!`;
    console.log(greeting);
};

module.exports = {
    addNumbers,
    greetUser
};