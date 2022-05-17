function convertirAMoney (string) {
    string = string.replace('.', ',')
    return string;
}

export default convertirAMoney;