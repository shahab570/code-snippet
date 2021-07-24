const express = require('express');
const app = express();
const multer = require('multer');
const path = require('path');
const uploads_folder = './uploads/';
const storage = multer.diskStorage({
    destination: ((req, file, cb) => {
        cb(null,uploads_folder)
    }),
    filename: ((req, file, cb) => {
        const filext = path.extname(file.originalname);
        const filename = file.originalname.replace(filext, '').toLocaleLowerCase().split(' ').join('-') + "-" + Date.now();
        cb(null,filename+ filext)
    })
})
const upload = multer({
    storage: storage,
    limits: {
        fileSize: 1000000
    },
    fileFilter: ((req, file, cb) => {
        if (file.fieldname == 'avatar') {
            if (file.mimetype == 'image/png' || file.mimetype == 'image/jpg' || file.mimetype == 'image/jpeg') {
                cb(null, true)
            } else {
                cb(new Error('only jpg allowed'))
            }
        } else if (file.fieldname == 'doc') {
            if (file.mimetype == 'application/pdf') {
                cb(null, true)
            } else {
                cb(new Error('Only pdf allowed'))
            }
        } else {
            cb(new Error("unknown Error"))
        }

    })
})

app.set('view engine', 'ejs');

app.get('/', (req, res) => {
    res.render('index')
})
app.post('/', upload.fields([{
    name: "avatar",
    maxCount: 1
}, {
    name: "doc",
    maxCount: 1
    }]), function (req, res) {
    console.log(req.files)
    res.send("Hello world");
})
app.use((err, req, res, next) => {
    if (err) {
        if (err instanceof multer.MulterError) {
            res.status(500).send(err.message)
        }
    } else {
        res.send('Success')
    }
    next()
})
app.listen(3000, () => {
    console.log("Server started")
});