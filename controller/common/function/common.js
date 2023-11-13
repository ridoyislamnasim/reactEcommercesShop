const bcrypt = require("bcrypt");
const hashPassword = async (password) => {
    console.log("password", password)
    try {
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        return hashedPassword
    } catch (error) {
        console.log(error)
    }
}
const createSlug = async (inputString) => {
    console.log("slug", inputString)
    const slug = inputString.trim().replace(/\s+/g, '-');
    return slug;
}
function removeSlug(slug) {
    // Replace hyphens with spaces
    const stringWithSpaces = slug.replace(/-/g, ' ');
    return stringWithSpaces;
}
module.exports = {
    hashPassword,
    createSlug,
    removeSlug
};