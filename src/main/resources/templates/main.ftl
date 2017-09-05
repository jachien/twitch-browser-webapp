<html>
<head>
    <meta charset="UTF-8"/>
    <title>Twitch Browser</title>
    <link rel="stylesheet" type="text/css" href="/css/twitchbrowser.css"/>

    <script src="https://cdnjs.cloudflare.com/ajax/libs/vue/2.4.2/vue.js"></script>
    <script src="https://unpkg.com/axios/dist/axios.min.js"></script>
    <script src="/js/preferences.js"></script>
    <script src="/js/main.js"></script>
</head>
<body>
    <div id="app">
        <!-- <pre>
{{ content }}
        </pre> -->

        <stream-component v-for="stream in streams" v-bind:stream="stream"></stream-component>

    </div>

    <script type="text/javascript">
        var streamComponent = {
            props: ['stream'],
            template: 
                '<div class="stream_item">' +
                    '<div><a v-bind:href="stream.channelUrl"><img v-bind:src="stream.previewUrl"/></a></div>' +
                    '<div>{{stream.status}}</div>' +
                    '<div><strong>{{stream.displayName}}</strong> playing <strong>{{stream.gameName}}</strong></div>' +
                    '<div>{{stream.numViewers}} viewers</div>' +
                '</div>'
        }


        var app = new Vue({
            el: '#app',
            data: {
                content: 'Loading streams...',
                streams: []
            },
            components: {
                'stream-component': streamComponent
            },
            methods: {
                loadAllStreams: function() {
                    games = readGames()
                    for (var i=0; i < games.length; i++) {
                        this.loadStreams(games[i], 0, 25);
                    }
                },
                loadStreams: function(game, start, limit) {
                    console.log(game + " " + start + " " + limit)
                    config = {
                        params: {
                            game: game,
                            start: start,
                            limit: limit
                        }
                    };
                    
                    console.log(config);
                    axios.get('/api', config)
                        .then(
                            function (response) {
                                console.log(response);
                                //app.content = response;
                                this.appendStreams(response.data.streams);
                                
                            }.bind(this)
                        ).catch(
                            function (error) {
                                console.log(error);
                            }
                        );
                },
                appendStreams: function(newStreams) {
                    var mergedStreams = this.streams.concat(newStreams);
                    mergedStreams.sort(function(a, b) {
                        return b.numViewers - a.numViewers;
                    });
                    this.streams = mergedStreams;

                }
            },
            created: function() {
                this.loadAllStreams();
            }
        })
    </script>
</body>
</html>