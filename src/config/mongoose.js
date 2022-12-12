import mongoose from 'mongoose'
import config from "./index"

export default () => {
    mongoose.connect(config.test, { useNewUrlParser: true, useFindAndModify: false, useUnifiedTopology: true, useCreateIndex: true }).then(() => {
        console.log('Database is connected');
    })
}