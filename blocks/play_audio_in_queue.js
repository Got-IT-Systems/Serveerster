module.exports = {
    name: "Play Music",

    description: "Plays Music of Any Type (e.g. YouTube, Spotify, SoundCloud, Files, Radio Stations, ...)",

    category: "Music V2",

    inputs: [
        {
            "id": "action",
            "name": "Action",
            "description": "Acceptable Types: Action\n\nDescription: Executes this block.",
            "types": ["action"]
        },
        {
            "id": "voicechannel",
            "name": "Voice Channel",
            "description": "Acceptable Types: Object, Unspecified\n\nDescription: The Voice Channel to join...",
            "types": ["object", "unspecified"],
            "required": true
        },
        {
            "id": "song",
            "name": "Song Name/URL",
            "description": "Acceptable Types: Text, Unspecified\n\nDescription: The Song URL/Name you want to Play.",
            "types": ["text", "unspecified"],
            "required": true
        },
        {
            "id": "emptycooldown",
            "name": "Empty VC Cooldown",
            "description": "Acceptable Types: Text, Unspecified\n\nDescription: If you set the bot to leave on Empty VC, then you can set a cooldown when he should leave",
            "types": ["number", "unspecified"]
        },
        {
            "id": "endcooldown",
            "name": "Queue End Cooldown",
            "description": "Acceptable Types: Text, Unspecified\n\nDescription: If you set the bot to leave on End, then you can set a cooldown when he should leave.",
            "types": ["number", "unspecified"]
        }
    ],

    options: [
        {
            "id": "leaveonempty",
            "name": "Leave on Empty VC?",
            "description": "Description: Leave on Empty Queue?",
            "type": "CHECKBOX",
            "defaultValue": false
        },
        {
            "id": "autoselfdeaf",
            "name": "Deaf Bot?",
            "description": "Description: Deaf Bot? (More Privacy)",
            "type": "SELECT",
            "type": "CHECKBOX",
            "defaultValue": true
        },
        {
            "id": "leaveonened",
            "name": "Leave on End?",
            "description": "Description: Leave on End?",
            "type": "CHECKBOX",
            "defaultValue": false
        },
        {
            "id": "initialvolume",
            "name": "Initial Volume",
            "description": "Description: The Volume the bot should have! Default: 10",
            "type": "NUMBER",
            "defaultValue": 10
        },
        {
            "id": "source",
            "name": "Audio Source",
            "description": "Description: The Songs Origin (Global / Radio Station / File).",
            "type": "SELECT",
            "options": {
                "global": "Global",
                "radio": "Radio",
                "file": "File"
            }
        },
        {
            "id": "action",
            "name": "Action",
            "description": "Description: If the Song should play instantly or be added to the queue!",
            "type": "SELECT",
            "options": {
                "add": "Add to Queue",
                "play": "Play Now"
            }
        }
    ],

    outputs: [
        {
            "id": "action",
            "name": "Action",
            "description": "Type: Action\n\nDescription: Executes the following blocks when this block finishes its task.",
            "types": ["action"]
        },
        {
            "id": "actionerr",
            "name": "Action (Error)",
            "description": "Type: Action\n\nDescription: Executes the following blocks if this Block has an error.",
            "types": ["action"]
        },
        {
            "id": "track",
            "name": "Track",
            "description": "Type: Object, List, Unspecified\n\nDescription: The Track Object/List",
            "types": ["object", "list", "unspecified"]
        },
        {
            "id": "err",
            "name": "Error Message",
            "description": "Type: Text, Unspecified\n\nDescription: The Error Message, if an error was thrown!",
            "types": ["text", "unspecified"]
        }
    ],

    async code(cache) {
        const { get } = require("axios")
        let song = this.GetInputValue("song", cache);
        const vc = this.GetInputValue("voicechannel", cache);
        const source = this.GetOptionValue("source", cache);

        const emptycooldown = this.GetInputValue("emptycooldown", cache) || 0;
        const endcooldown = this.GetInputValue("endcooldown", cache) || 0;

        const leaveonempty = this.GetOptionValue("leaveonempty", cache);
        const autoselfdeaf = this.GetOptionValue("autoselfdeaf", cache);
        const leaveonend = this.GetOptionValue("leaveonened", cache);
        const initialvolume = parseInt(this.GetOptionValue("initialvolume", cache)) || 10;

        const { useMainPlayer, QueryType, useQueue } = require("discord-player");
        const action = this.GetOptionValue("action", cache);

        let querytype;
        if (source == "radio") {
            querytype = undefined
            try {
                const { status, data } = await get(`http://de1.api.radio-browser.info/json/stations/search?&name=${song}`)
                if (status === 200 && data.length > 0) {
                    song = data[0].url
                } else throw new Error("Not able to find any Stations to use!")
            } catch (err) {
                // You can uncomment this for debugging incase of issues
                //console.error(err);
                this.StoreOutputValue(err.message, "err", cache);
                this.RunNextBlock("actionerr", cache);
                return;
            }
        } else if (source == "file") {
            querytype = QueryType.ARBITRARY
        } else {
            querytype = undefined
        }

        const player = useMainPlayer();
        try {
            let queue = useQueue(vc.guild.id);
            if (queue) if (source == "radio" && queue.isPlaying() && action !== "play") queue.node.skip()
            const res = await player.play(vc, song, {
                searchEngine: querytype,
                nodeOptions: {
                    metadata: vc,
                    selfDeaf: autoselfdeaf,
                    volume: initialvolume,
                    leaveOnEmpty: leaveonempty,
                    leaveOnEmptyCooldown: emptycooldown,
                    leaveOnEnd: leaveonend,
                    leaveOnEndCooldown: endcooldown,
                    connectionTimeout: 999999999
                }
            })
            if (action === "play") {
                if (res.queue.isPlaying()) {
                    res.queue.node.skipTo(res.track);
                }
            }
            if (!res.queue.isPlaying()) await res.queue.node.play();
            this.StoreOutputValue(res.track, "track", cache);
            this.RunNextBlock("action", cache);
        } catch (err) {
            // You can uncomment this for debugging incase of issues
            //console.error(err);
            this.StoreOutputValue(err.message, "err", cache);
            this.RunNextBlock("actionerr", cache);
            return;
        }
    }
}