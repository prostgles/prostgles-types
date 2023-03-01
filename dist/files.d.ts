import { FieldFilter } from ".";
export declare const CONTENT_TYPE_TO_EXT: {
    readonly "text/html": readonly ["html", "htm", "shtml"];
    readonly "text/css": readonly ["css"];
    readonly "text/csv": readonly ["csv"];
    readonly "text/tsv": readonly ["tsv"];
    readonly "text/xml": readonly ["xml"];
    readonly "text/mathml": readonly ["mml"];
    readonly "text/plain": readonly ["txt"];
    readonly "text/vnd.sun.j2me.app-descriptor": readonly ["jad"];
    readonly "text/vnd.wap.wml": readonly ["wml"];
    readonly "text/x-component": readonly ["htc"];
    readonly "image/gif": readonly ["gif"];
    readonly "image/jpeg": readonly ["jpeg", "jpg"];
    readonly "image/png": readonly ["png"];
    readonly "image/tiff": readonly ["tif", "tiff"];
    readonly "image/vnd.wap.wbmp": readonly ["wbmp"];
    readonly "image/x-icon": readonly ["ico"];
    readonly "image/x-jng": readonly ["jng"];
    readonly "image/x-ms-bmp": readonly ["bmp"];
    readonly "image/svg+xml": readonly ["svg"];
    readonly "image/webp": readonly ["webp"];
    readonly "application/sql": readonly ["sql"];
    readonly "application/x-javascript": readonly ["js"];
    readonly "application/atom+xml": readonly ["atom"];
    readonly "application/rss+xml": readonly ["rss"];
    readonly "application/java-archive": readonly ["jar", "war", "ear"];
    readonly "application/mac-binhex40": readonly ["hqx"];
    readonly "application/msword": readonly ["doc", "docx"];
    readonly "application/pdf": readonly ["pdf"];
    readonly "application/postscript": readonly ["ps", "eps", "ai"];
    readonly "application/rtf": readonly ["rtf"];
    readonly "application/vnd.ms-excel": readonly ["xls", "xlsx"];
    readonly "application/vnd.ms-powerpoint": readonly ["ppt", "pptx"];
    readonly "application/vnd.wap.wmlc": readonly ["wmlc"];
    readonly "application/vnd.google-earth.kml+xml": readonly ["kml"];
    readonly "application/vnd.google-earth.kmz": readonly ["kmz"];
    readonly "application/x-7z-compressed": readonly ["7z"];
    readonly "application/x-cocoa": readonly ["cco"];
    readonly "application/x-java-archive-diff": readonly ["jardiff"];
    readonly "application/x-java-jnlp-file": readonly ["jnlp"];
    readonly "application/x-makeself": readonly ["run"];
    readonly "application/x-perl": readonly ["pl", "pm"];
    readonly "application/x-pilot": readonly ["prc", "pdb"];
    readonly "application/x-rar-compressed": readonly ["rar"];
    readonly "application/x-redhat-package-manager": readonly ["rpm"];
    readonly "application/x-sea": readonly ["sea"];
    readonly "application/x-shockwave-flash": readonly ["swf"];
    readonly "application/x-stuffit": readonly ["sit"];
    readonly "application/x-tcl": readonly ["tcl", "tk"];
    readonly "application/x-x509-ca-cert": readonly ["der", "pem", "crt"];
    readonly "application/x-xpinstall": readonly ["xpi"];
    readonly "application/xhtml+xml": readonly ["xhtml"];
    readonly "application/zip": readonly ["zip"];
    readonly "application/octet-stream": readonly ["bin", "exe", "dll", "deb", "dmg", "eot", "iso", "img", "msi", "msp", "msm"];
    readonly "audio/midi": readonly ["mid", "midi", "kar"];
    readonly "audio/mpeg": readonly ["mp3"];
    readonly "audio/ogg": readonly ["ogg"];
    readonly "audio/x-realaudio": readonly ["ra"];
    readonly "video/3gpp": readonly ["3gpp", "3gp"];
    readonly "video/mpeg": readonly ["mpeg", "mpg"];
    readonly "video/quicktime": readonly ["mov"];
    readonly "video/x-flv": readonly ["flv"];
    readonly "video/x-mng": readonly ["mng"];
    readonly "video/x-ms-asf": readonly ["asx", "asf"];
    readonly "video/x-ms-wmv": readonly ["wmv"];
    readonly "video/x-msvideo": readonly ["avi"];
    readonly "video/mp4": readonly ["m4v", "mp4"];
    readonly "video/webm": readonly ["webm"];
};
export type ALLOWED_CONTENT_TYPE = keyof typeof CONTENT_TYPE_TO_EXT;
export type ALLOWED_EXTENSION = (typeof CONTENT_TYPE_TO_EXT)[ALLOWED_CONTENT_TYPE][number];
export type FileType = {
    acceptedContent: FieldFilter<{
        "image": 1;
        "audio": 1;
        "video": 1;
        "text": 1;
        "application": 1;
    }>;
} | {
    acceptedContentType: FieldFilter<typeof CONTENT_TYPE_TO_EXT>;
} | {
    acceptedFileTypes: FieldFilter<Record<ALLOWED_EXTENSION, 1>>;
} | never;
export type FileColumnConfig = FileType & {
    maxFileSizeMB?: number;
};
//# sourceMappingURL=files.d.ts.map