var mongoose = require("mongoose");
// var passportLocalMongoose = require("passport-local-mongoose");

var WebFolioSchema = new mongoose.Schema({
    info: {
        user_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        objective: String,
        title: String,
        gitLink: String,
        lnLink: String
    },
    education: [mongoose.Schema.Types.Mixed],
    workExp: [mongoose.Schema.Types.Mixed],
    projects: [mongoose.Schema.Types.Mixed],
    tSkills: [{
        skillName: String,
        level: { type: Number, min: 0, max: 10 }
    }]
});

module.exports = mongoose.model("Webfolio", WebFolioSchema);