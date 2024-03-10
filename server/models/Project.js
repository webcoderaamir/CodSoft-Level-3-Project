const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
    projectName: {
        type : String,
    },
    projectMembers: [{
        type : String,
    }],
    projectLeader: {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'user',
    }
})

module.exports = mongoose.model('Project', projectSchema);