function previewMultiple(event) {
    const images = document.getElementById("image");
    const number = images.files.length;
    document.getElementById("formFile").innerHTML = '';
    for (i = 0; i < number; i++) {
        const urls = URL.createObjectURL(event.target.files[i]);
        document.getElementById("formFile").innerHTML += `<img crossorigin="anonymous" src="${urls}">`;
    }
}
