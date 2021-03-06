<html>
<head>
    <meta charset="UTF-8"/>
    <title>Twitch Browser</title>

    <#list externalCss as item>
    <link type="text/css" href="${item}" rel="stylesheet">
    </#list>
    <link type="text/css" href="${resourceUrlProvider.getForLookupPath('/css/twitchbrowser.css')}" rel="stylesheet"/>

    <script type="text/javascript">
        <#--
            set twitch api client id for main.js
            is there a better way to pass this?
        -->
        var clientId = "${twitchApiClientId}";
    </script>

    <#list externalScripts as item>
    <script src="${item}"></script>
    </#list>
    <script src="https://unpkg.com/axios/dist/axios.min.js"></script>
    <script src="${resourceUrlProvider.getForLookupPath('/js/preferences.js')}"></script>
    <script src="${resourceUrlProvider.getForLookupPath('/js/state.js')}"></script>

    <#--
        hide content before vue renders it
        http://vuetips.com/v-cloak-directive-hides-html-on-startup
    -->
    <style>
        [v-cloak] {
            display: none;
        }
    </style>
</head>
<body>
    <div id="app" v-cloak>
        <v-app id="browser-app" dark>
            <v-navigation-drawer
                app
                fixed
                persistent
                clipped
                v-model="drawer"
            >
                <v-list dense>
                    <v-list-tile avatar @click="showAllStreams()">
                        <v-list-tile-avatar>
                            <v-icon>remove_red_eye</v-icon>
                        </v-list-tile-avatar>
                        <v-list-tile-content>
                            <v-list-tile-title>Show all streams</v-list-tile-title>
                        </v-list-tile-content>
                    </v-list-tile>

                    <v-divider></v-divider>

                    <v-subheader>Games</v-subheader>

                    <#-- games list -->
                    <game-component
                        v-for="game in gameProps"
                        :key="game.name + '-' + game.createTime"
                        :game-prop="state.gamePropMap[game.name]"
                        :aux-prop="state.auxData[game.name]"
                        v-on:filter-streams="filterStreams(game.name)"
                        v-on:remove-game="removeGame(game.name)"
                    ></game-component>
                </v-list>
            </v-navigation-drawer>
            <v-toolbar app fixed clipped-left>
                <v-toolbar-side-icon @click.stop="drawer = !drawer"></v-toolbar-side-icon>
                <v-toolbar-title>Twitch Browser</v-toolbar-title>
                <v-spacer></v-spacer>
                <v-spacer></v-spacer>
                <v-btn color="primary" @click="addGame()">Add game</v-btn>
                <v-select
                    placeholder="Find game"
                    autocomplete
                    :async-loading="agLoading"
                    clearable
                    :items="agItems"
                    :search-input.sync="agSearch"
                    :no-data-text="`No matching games available`"
                    v-model="agSelect"
                ></v-select>
            </v-toolbar>
            <v-content>
                <v-container fluid>
                    <div id="stream_container">
                        <stream-component
                            v-for="stream in streams"
                            :key="stream.channelId"
                            v-bind:stream="stream"
                            v-bind:game-prop-map="state.gamePropMap"
                            v-bind:game-color-map="state.gameColorMap"
                            v-on:filter-streams="filterStreams(stream.gameName)"
                        ></stream-component>
                    </div>
                </v-container>
            </v-content>
            <v-footer app fixed>
                <span class="white--text"></span>
            </v-footer>
        </v-app>
    </div>

    <script src="${resourceUrlProvider.getForLookupPath('/js/main.js')}"></script>
</body>
</html>
