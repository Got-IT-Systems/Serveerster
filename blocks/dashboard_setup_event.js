module.exports = {
    name: "Discord Dashboard Setup [Event]",

    description: "Sets up the discord-dashboard. Makes it possible to run a web dashboard for your bot! Action output runs when options in dashboard are changed!",

    category: "Internet Stuff",

    auto_execute: true,

    inputs: [],

    options: [
        {
            id: "client_id",
            name: "Client ID",
            description: "The Discord Application Client ID for the dashboard.",
            type: "TEXT"
        },
        {
            id: "client_secret",
            name: "Client Secret",
            description: "The Discord Application Client Secret for the dashboard.",
            type: "TEXT"
        },
        {
            id: "license",
            name: "License Key",
            description: "The license key for the discord-dashboard package.",
            type: "TEXT"
        },
        {
            id: "port",
            name: "Port",
            description: "The port on which the dashboard will be hosted.",
            type: "NUMBER",
            defaultValue: 3000
        },
        {
            id: "redirect_uri",
            name: "Redirect URI",
            description: "The redirect URI for OAuth2 authentication.",
            type: "TEXT"
        },
        {
            id: "domain",
            name: "Domain",
            description: "The domain name where the dashboard will be accessible.",
            type: "TEXT",
            defaultValue: "http://localhost"
        },
    ],

    outputs: [
        {
            id: "action",
            name: "Action",
            description: "Executes after an option is changed.",
            types: ["action"]
        },
        {
            id: "option_name",
            name: "Option Name",
            description: "The name of the option that was changed.",
            types: ["text"]
        },
        {
            id: "new_value",
            name: "New Value",
            description: "The new value of the option.",
            types: ["text", "number", "boolean", "object", "unspecified"]
        },
        {
            id: "server",
            name: "Server",
            description: "The server (guild) where the option was changed.",
            types: ["object"]
        }
    ],

    async code(cache) {

        //No no touching
        const { ChannelType } = require('discord.js')
        const clientId = this.GetOptionValue("client_id", cache);
        const clientSecret = this.GetOptionValue("client_secret", cache);
        const botToken = this.client.token;
        const licenseKey = this.GetOptionValue("license", cache);
        const port = this.GetOptionValue("port", cache);
        const redirectUri = this.GetOptionValue("redirect_uri", cache);
        const domain = this.GetOptionValue("domain", cache);

        // Installing modules, still no touch no touch
        const { execSync } = require('child_process');
        function isModuleInstalled(name) {
            try {
                require.resolve(name);
                return true;
            } catch (e) {
                return false;
            }
        }
        function installModule(name) {
            execSync(`npm install ${name}`, { stdio: 'inherit' });
        }
        if (!isModuleInstalled('discord-dashboard')) installModule('discord-dashboard');
        if (!isModuleInstalled('dbd-soft-ui')) installModule('dbd-soft-ui');
        if (!isModuleInstalled('keyv')) installModule('keyv');

        const { Client, GatewayIntentBits } = require('discord.js');
        const SoftUI = require('dbd-soft-ui');
        const DBD = require('discord-dashboard');
        const Keyv = require('keyv');
        // End of no no touch

         //SQLITE STORAGE HERE !!!! :P
         // Here you store every Data you want to save between sessions, so it doesnt refresh to defaults every time
         // Right now, by default it saves everything in yourbot/sqdata/ folder - You can change it by adjusting 'sqlite://./sqdata/settings.sqlite'
         // "./" - Refers to the current folder the application is running in
         // Remember, YOU HAVE TO CREATE A CONST HERE, OTHERWISE AN ERROR WILL OCCUR 😲
        const langsSettings = new Keyv('sqlite://./sqdata/langs.sqlite');         
        const AdminRoles = new Keyv('sqlite://./sqdata/GNAdminRoles.sqlite');  
        const Example1 = new Keyv('sqlite://./sqdata/Example1.sqlite');  
        const Example2 = new Keyv('sqlite://./sqdata/Example2.sqlite');  
        const Example3 = new Keyv('sqlite://./sqdata/Example3.sqlite');  
        const Example4 = new Keyv('sqlite://./sqdata/Example4.sqlite');  
        const Example5 = new Keyv('sqlite://./sqdata/Example5.sqlite');  
        const Example6 = new Keyv('sqlite://./sqdata/Example6.sqlite');  
        const Example7 = new Keyv('sqlite://./sqdata/Example7.sqlite');  
        const Example8 = new Keyv('sqlite://./sqdata/Example8.sqlite');  

        
        // no no touch zone starts again
        const client = new Client({ intents: [GatewayIntentBits.Guilds] });
        client.login(botToken);

        const Handler = new DBD.Handler({});

        await DBD.useLicense(licenseKey);
        DBD.Dashboard = DBD.UpdatedClass();

        //Initializing new dashboard instance
        const Dashboard = new DBD.Dashboard({
            //This is where you setup your /invite endpoint!
            port: port,
            invite: {
                clientId: "yourclientID", // Remember to change!
                scopes: ["bot", "applications.commands"],
                permissions: "8", // 8 = Administrator
                redirectUri: "https://localhost/discord/callback", // Remember to change!
              },
              //Auto accept of the discord-dasboard Privacy Policy, please read it anyway
            acceptPrivacyPolicy: true,
            client: { id: clientId, secret: clientSecret },
            redirectUri: `${domain}${redirectUri}`,
            domain: domain,
            ownerIDs: ["469086493919674370"], // Remember to change! This will allow the logged user to see the admin tab!
            // If you want to use Theme 404 and Maintance pages. You should probably just leave it as it is.
            useThemeMaintenance: true,
            useTheme404: true,
            bot: client,
            theme: SoftUI({
                error: {
                    error404: {
                      title: "Error 404",
                      subtitle: "Page Not Found",
                      description:
                        "Page doesn't exists, click the button bellow to return to the main page.",
                    },
                  },
                footer: {
                    replaceDefault: true,
                    text: "Bot developed by Kaayoos" //Footer that will appear at the bottom of the main page
                },
                storage: Handler,
                locales: {
                    //Locales! It's for creating multiple languages, for users to select from, by default it's english so you can edit every message as you wish here!
                    enUS: {
                        name: "English",
                        index: {
                            feeds: ["Current Users", "CPU", "System Platform", "Server Count"],
                            card: {
                                image: "your path or url", //Remember to change!
                                category: "Soft UI",
                                title: "Freaky Dashboard",
                                description:
                                    "Kayos is a cool guy! (Or is he???) </i></b>",
                                footer: "another footer, woohoo!"
                            },
                            feedsTitle: "Feeds",
                            graphTitle: "Graphs"
                        },
                        manage: {
                            settings: {
                                memberCount: "Members", 
                                info: {
                                    info: "Info",
                                    server: "Server Information"
                                }
                            },
                            title: "Your Servers",
                            description: "Manage your guilds",
                        },
                        admin: {
                            feeds: {
                                feedBuilder: "Feed Builder",
                                feedIcon: "Feed Icon",
                                feedDescription: "Feed Description",
                                feedColour: "Feed Color",
                                colors: {
                                    pink: "Pink",
                                    red: "Red",
                                    orange: "Orange",
                                    green: "Green",
                                    gray: "Gray",
                                    blue: "Blue",
                                    dark: "Dark",
                                },
                                feedSubmit: "Submit",
                                feedFeedPreview: "Feed Preview",
                                feedPreview: "Preview",
                                feedCurrent: "Current Feeds",
                                feedShowIcons: "Show Icons",
                            },
                            admin: {
                                title: "Admin Controls",
                                adminUpdates: "Check for Updates",
                            },
                        },
                        guild: {
                            home: "Home",
                            settingsCategory: "Settings",
                            updates: {
                                title: "Changes seen!",
                                reset: "Reset",
                                save: "Save",
                            }
                        },
                        partials: {
                            sidebar: {
                                dash: "Dashboard",
                                manage: "Your Servers!",
                                commands: "Commands",
                                pp: "Privacy Policy",
                                admin: "Admin",
                                account: "Account Pages",
                                login: "Sign In",
                                logout: "Sign Out"
                            },
                            navbar: {
                                home: "Home",
                                pages: {
                                    manage: "Manage Guilds",
                                    settings: "Manage Guilds",
                                    commands: "Commands",
                                    pp: "Privacy Policy",
                                    admin: "Admin Panel",
                                    error: "Error",
                                    credits: "Credits",
                                    debug: "Debug",
                                    leaderboard: "Leaderboard",
                                    profile: "Profile",
                                    maintenance: "Under Maintenance",
                                    pages: "Pages",
                                    dashboard: "Settings",
                                }
                            },
                            title: {
                                pages: {
                                    manage: "Manage Guilds",
                                    settings: "Manage Guilds",
                                    commands: "Commands",
                                    pp: "Privacy Policy",
                                    admin: "Admin Panel",
                                    error: "Error",
                                    credits: "Credits",
                                    debug: "Debug",
                                    leaderboard: "Leaderboard",
                                    profile: "Profile",
                                    maintenance: "Under Maintenance"
                                }
                            },
                            preloader: {
                                text: "woah woah woah..." //Remember to change this, im sorry for making your life harder
                            },
                            premium: {
                                title: "Want more from bot?",
                                description: "Check out premium features below!",  //Remember, you can only use this, if you paid for the commercial license!
                                buttonText: "Become Premium"
                            },
                            settings: {
                                title: "Site Configuration",
                                description: "Configurable Viewing Options",
                                theme: {
                                    title: "Site Theme",
                                    description: "Make the site more appealing for your eyes!(But please don't use light mode)",
                                    dark: "Dark",
                                    light: "Light",
                                    auto: "Auto"
                                },
                                language: {
                                    title: "Site Language",
                                    description: "Select your preffered language!"
                                }
                            }
                        }
                    }
                },

                customThemeOptions: {
                    index: async ({ req, res, config }) => {
                        return {
                            values: [],
                            graph: {},
                            cards: [],
                        };
                    },
                },
                websiteName: "SentinelAI", //Remember to change all of this!
                colorScheme: "blue", // Can be: Dark, Pink, Orange, Green, Gray, Blue
                supporteMail: "Your Mail",
                icons: {
                    favicon: 'https://static-00.iconduck.com/assets.00/discord-icon-2048x2048-nnt62s2u.png',
                    noGuildIcon: "https://static-00.iconduck.com/assets.00/discord-icon-2048x2048-nnt62s2u.png",
                    sidebar: {
                        darkUrl: 'https://static-00.iconduck.com/assets.00/discord-icon-2048x2048-nnt62s2u.png',
                        lightUrl: 'https://static-00.iconduck.com/assets.00/discord-icon-2048x2048-nnt62s2u.png',
                        hideName: true,
                        borderRadius: false,
                        alignCenter: true
                    },
                },
                index: {
                    graph: {
                        enabled: false, //Graphs, you can enable if you want people to see your bot's memory usage, but tbh looks kinda mid.
                        lineGraph: true,
                        title: 'Memory Usage',
                        tag: 'Memory (MB)',
                        max: 100
                    },
                },
                sweetalert: {
                    errors: {},
                    success: {
                        login: "You logged in!",
                    }
                },
                preloader: {
                    image: "/img/soft-ui.webp", 
                    spinner: true,
                    text: "Loading...",
                },
                admin: {
                    pterodactyl: {
                        enabled: false, // If you want, you can connect your pterodactyl panel here!
                        apiKey: "apiKey",
                        panelLink: "https://panel.website.com",
                        serverUUIDs: []
                    }
                }
            }),
            settings: [ // Here starts the fun part! Settings! Settings are where a user can edit a value on a dasbhoard! Every setting, must belong to some category.
                        // So first you always have to start with creating your own category, like here: 
                {
                    categoryId: 'General',
                    categoryName: "General Settings",
                    categoryDescription: "General settings about the bot",
                    categoryOptionsList: [ 
                        // Then you open the category like here! You now can put any type of option you like here!
                        // Some options are Select, checkbox, multiselect, select channel, select role etc. You can find every type here: https://docs.assistantscenter.com/essentials/formtypes
                        {
                            optionId: 'lang', // Here you set the option ID, doesn't really mattter whats here, but it should be unique! It can't be the same as any other or it will break your dashboard!
                            optionName: "Language", //Option name to show up dashboard
                            optionDescription: "Change bot's language easily",
                            optionType: DBD.formTypes.select({"English": 'en', "French": 'fr'}), // Select option in format "Name": 'value'
                            getActualSet: async ({ guild }) => {
                                const value = await langsSettings.get(guild.id); // This is where you choose, what value should show up when you load this page, right now it loads the saved info from langsSettings for guild.id
                                return value || "en";  //If data doesn't exists, it returns the default value, here "en"
                            }, 

                            // Now here is an important part, setNew is called everytime a value is updated on the dashboard, you have to copy it like in this example to make it work in dbb!
                            setNew: async ({ guild, user, newData }) => {  
                                await langsSettings.set(guild.id, newData); 
                                this.StoreOutputValue("lang", "option_name", cache); // Here is the bad part of this, you have to manually set, what shows up in DBB in option_name output! Remember to change it!
                                this.StoreOutputValue(newData, "new_value", cache); //This saves new Data value to New Value Output
                                this.StoreOutputValue(guild, "server", cache); //And this stores the server this value was changed for

                                this.RunNextBlock("action", cache); // Runs next block
                                return;
                            }
                        },

                        // This is pretty much the end of my comments on options, i will comment occasionally from now on to explain some mechanics, but the rest is pretty similar
                        {
                            optionId: 'roles_whitelist',
                            optionName: "Admin Roles",
                            optionDescription: "Select multiple roles, which should be immune to punishments by the bot",
                            optionType: DBD.formTypes.rolesMultiSelect(false, true),
                            getActualSet: async ({ guild }) => {
                                const value = await AdminRoles.get(guild.id); 
                                return value || []; 
                            },
                            setNew: async ({ guild, user, newData }) => {
                                await AdminRoles.set(guild.id, newData); 
                                this.StoreOutputValue("admin_roles", "option_name", cache);
                                this.StoreOutputValue(newData, "new_value", cache);
                                this.StoreOutputValue(guild, "server", cache);

                                this.RunNextBlock("action", cache);
                                return;
                            }
                        },
                    ]
                },
                // End of this category, creating another one!
                {
                categoryId: 'Modules',
                categoryName: "Example category1",
                categoryDescription: "Some category",
                categoryOptionsList: [
                    {
                        optionType: SoftUI.formTypes.spacer(),
                        title: 'Spacer example',
                        description: "A spacer! Does nothing but looks cool 😎"
                    },
                    {
                        optionId: 'chat_module_switch',
                        optionName: "Example Module",
                        optionDescription: "Do you want to enable Example Module?",
                        optionType: DBD.formTypes.switch(false),
                        getActualSet: async ({guild}) => {
                            const SAVED_STATE = await Example1.get(guild.id);
                            const DEFAULT_STATE = false;
                            return (SAVED_STATE == null || SAVED_STATE == undefined) ? DEFAULT_STATE : SAVED_STATE;
                        },
                        setNew: async ({guild, user, newData}) => {
                            await Example1.set(guild.id, newData);
                            this.StoreOutputValue("example1", "option_name", cache);
                            this.StoreOutputValue(newData, "new_value", cache);
                            this.StoreOutputValue(guild, "server", cache);
                            this.StoreOutputValue(user, "user", cache);

                            this.RunNextBlock("action", cache);
                            return;
                        },
                    },
                    // Start of connected options 🎉
                    // MultiRow is just a way to display some options toghether! Only visual 
                    {
                        optionId: 'input',
                            optionName: 'Connected options!',
                            optionDescription: 'Cool!',
                            optionType: SoftUI.formTypes.multiRow([
                    {
                        optionId: 'example2',
                        optionName: "Channels!",
                        optionDescription: "Select multiple channels! For something! Returns a list of id's",
                        optionType: DBD.formTypes.channelsMultiSelect(false, false, [ChannelType.GuildText]),
                        getActualSet: async ({ guild }) => {
                            const value = await Example2.get(guild.id); 
                            return value || []; 
                        },
                        setNew: async ({ guild, user, newData }) => {
                            await Example2.set(guild.id, newData); 
                            this.StoreOutputValue("Example2", "option_name", cache);
                            this.StoreOutputValue(newData, "new_value", cache);
                            this.StoreOutputValue(guild, "server", cache);
                            this.StoreOutputValue(user, "user", cache);

                            this.RunNextBlock("action", cache);
                            return;
                        }
                    },

                    {
                        optionId: 'example3',
                        optionName: "Punishment",
                        optionDescription: "Example punishment option!",
                        optionType: DBD.formTypes.select({"Nothing": 'nothing', "Timeout User": 'timeout', "Kick User": 'kick', "Ban": 'ban',}),
                        getActualSet: async ({ guild }) => {
                            const value = await Example3.get(guild.id); 
                            return value || "nothing"; 
                        },
                        setNew: async ({ guild, user, newData }) => {
                            await Example3.set(guild.id, newData); 
                            this.StoreOutputValue("example3", "option_name", cache);
                            this.StoreOutputValue(newData, "new_value", cache);
                            this.StoreOutputValue(guild, "server", cache);
                            this.StoreOutputValue(user, "user", cache);

                            this.RunNextBlock("action", cache);
                            return;
                        }
                    },
                    {
                        optionId: "amount_of_warns",
                        optionName: "Warning Amount",
                        optionDescription: "After how many warns should the user get Punished?",
                        optionType: SoftUI.formTypes.numberPicker(1, 30, false),
                        getActualSet: async ({ guild }) => {
                            const value = await Example4.get(guild.id); 
                            return value || 3; 
                        },
                        setNew: async ({ guild, user, newData }) => {
                            await Example4.set(guild.id, newData); 
                            this.StoreOutputValue("Example4", "option_name", cache);
                            this.StoreOutputValue(newData, "new_value", cache);
                            this.StoreOutputValue(guild, "server", cache);
                            this.StoreOutputValue(user, "user", cache);

                            this.RunNextBlock("action", cache);
                            return;
                        },
                    },


                    // Here ends a connected category!
                ])
                },
                    {
                        optionType: SoftUI.formTypes.spacer(),
                        title: 'Another spacer!',
                        description: "wabadaba"
                    },
                    {
                        optionId: 'example5',
                        optionName: "Another Switch!",
                        optionDescription: "Switch something!",
                        optionType: DBD.formTypes.switch(false),
                        getActualSet: async ({guild}) => {
                            const SAVED_STATE = await Example5.get(guild.id);
                            const DEFAULT_STATE = false;
                            return (SAVED_STATE == null || SAVED_STATE == undefined) ? DEFAULT_STATE : SAVED_STATE;
                        },
                        setNew: async ({guild, user, newData}) => {
                            await Example5.set(guild.id, newData);
                            this.StoreOutputValue("Example5", "option_name", cache);
                            this.StoreOutputValue(newData, "new_value", cache);
                            this.StoreOutputValue(guild, "server", cache);
                            this.StoreOutputValue(user, "user", cache);

                            this.RunNextBlock("action", cache);
                            return;
                        },
                    },
                ]
                },

                //Here another category ends! You can add it here!
            ]
        });
        // And we start the dasbhoard! Wohoo! Don't remove it or no dasbhoard :(
        Dashboard.init();
    }
};