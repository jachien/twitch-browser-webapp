<html>
<head>
    <meta charset="UTF-8"/>
    <title>Twitch Browser</title>

    <#list externalCss as item>
    <link href='${item}' rel="stylesheet">
    </#list>

    <#list externalScripts as item>
    <script src="${item}"></script>
    </#list>

    <#--
        hide content before vue renders it
        http://vuetips.com/v-cloak-directive-hides-html-on-startup
    -->
    <style>
        [v-cloak] {
            display: none;
        }

        .container {
            height: 400px;
            display: flex;
            flex-flow: column wrap;
            justify-content: center;
            align-items: center;
        }

        .item {
            text-align: center;
        }

        main {
            background: #303030;
        }
    </style>
</head>
<body>
    <div id="app" v-cloak>
        <v-app dark>
            <v-toolbar app>
                <v-icon>ondemand_video</v-icon>
                <v-toolbar-title>Twitch Browser</v-toolbar-title>
            </v-toolbar>
            <v-content>
                <#-- todo: recreate this using vuetify -->
                <div class="container">
                    <div class="item"><h1>404 Not Found :(</h1></div>
                    <#-- todo: make host configurable -->
                    <div class="item"><a href="https://streams.jchien.org">streams.jchien.org</a></div>
                </div>
            </v-content>
            <v-footer app>
                <span class="white--text"></span>
            </v-footer>
        </v-app>
    </div>

    <script type="text/javascript">
        var app = new Vue({
            el: '#app',
            data: {}
        });
    </script>
</body>
</html>
