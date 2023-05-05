const mongoose = require('mongoose');

let msgSchema = mongoose.Schema(
    {
        content:{
            type:String,
            required:[true,"内容不能为空"]
        },
        createTime:{
            type:Number,
            default:Date.now
        },
        from:{
            type:mongoose.Schema.Types.ObjectId,
            ref:'user'
        },
        to:{
            type:mongoose.Schema.Types.ObjectId,
            ref:'user'
        },
        isGroup:{
            type:Boolean,
            default:false
        },
        isRead:{
            type:Boolean,
            default:false
        }
    
    },
    {
        versionKey:false
    }
)

let msgModel = mongoose.model('message',msgSchema)

module.exports = msgModel