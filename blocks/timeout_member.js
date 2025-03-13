module.exports = {
    name: "Timeout Member",

    description: "Timeouts a member for a certain amount of time with a reason for the Audit Log.",

    category: "Server Stuff",

    inputs: [
        {
            "id": "action",
            "name": "Action",
            "description": "Acceptable Types: Action\n\nDescription: Executes this block.",
            "types": ["action"]
        },
        {
            "id": "member",
            "name": "Member",
            "description": "Acceptable Types: Object, Unspecified\n\nDescription: Member to timeout",
            "types": ["object", "unspecified"],
            "required": true
        },
        {
            "id": "time",
            "name": "Time",
            "description": "Acceptable Types: Object, Unspecified\n\nDescription: the amount of time to timeout the member for",
            "types": ["number", "unspecified"],
            "required": true
        },
        {
            "id": "reason",
            "name": "Reason",
            "description": "Acceptable Types: Object, Unspecified\n\nDescription: the reason for the timeout (leave blank for nothing!)",
            "types": ["text", "unspecified"],
            "required": false
        }
        
    ],

    options: [
        {
            "id": "number",
            "name": "unit of time",
            "description": "Description: the time to use for timing out users",
            "type": "SELECT",
            "options": {
                "minute": "Minutes",
                "hour": "Hours",
                "miliseconds": "Miliseconds",
                "removetimeout": "Remove Timeout"
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
            "id": "member",
            "name": "Member",
            "description": "Type: Object, Unspecified\n\nDescription: The Member which was timeouted!",
            "types": ["object", "unspecified"]
        }
    ],

    async code(cache) {
        const member = this.GetInputValue("member", cache);
        const time = this.GetInputValue("time", cache);
        const reason = this.GetInputValue("reason", cache);
        const unit = this.GetOptionValue("number", cache);

        let timeOut = 0;
        if(unit === "removetimeout") timeOut = null;
        
        if(unit === "minute") timeOut = time * 60000;
        if(unit === "hour") timeOut = time * 3600000;
        if(unit === "miliseconds") timeOut = time;

        member.timeout(timeOut, reason).then((nmember) => {
            this.StoreOutputValue(nmember, "member", cache);
            this.RunNextBlock("action", cache);
        }).catch((err) => {
            console.log(err);
            this.RunNextBlock("action", cache);
        });
    }
}