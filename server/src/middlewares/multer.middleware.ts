import multer from 'multer';

const getUniqueFileName = (fileName: string) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    return fileName.replace(/\s+/g, '_') + "-" + uniqueSuffix
}

const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, "./src/public/temp")
    },
    filename: function(rq, file, cb) {
        cb(null, getUniqueFileName(file.originalname))
    }
})

export const upload = multer({ storage: storage })