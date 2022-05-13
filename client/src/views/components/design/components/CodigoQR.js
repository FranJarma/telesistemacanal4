const getBase64Image = (qr) => {
    let base64Image = qr.toDataURL();
    return base64Image;
};

export default getBase64Image;
