export const extractImageData = uri => {
    const partList = uri.split("/");

    const name = partList[partList.length - 1];

    const extensionParts = name.split(".");

    const extension = extensionParts[extensionParts.length - 1];

    let type;

    switch (extension.toLowerCase()) {
        case "jpg":
        case "jpeg":
            type = "image/jpeg";
            break;
        case "png":
            type = "image/png";
            break;
        case "gif":
            type = "image/gif";
            break;
        case "mp4":
            type = "video/mp4";
            break;
        case "avi":
            type = "video/x-msvideo";
            break;
        case "mp3":
            type = "audio/mpeg";
            break;
        case "wav":
            type = "audio/wav";
            break;
        case "aac":
            type = "audio/aac";
            break;
    }

    return { uri, name, type };
};
