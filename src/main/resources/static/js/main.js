function loadAllStreams() {
    games = readGames()
    for (var i=0; i < games.length; i++) {
        loadStreams(games[i], 0, 25);
    }
}

function loadStreams(game, start, limit) {
    console.log(game + " " + start + " " + limit)
    config = {
        params: {
            game: game,
            start: start,
            limit: limit
        }
    }
    console.log(config);
    axios.get('/api', config)
        .then(
            function (response) {
                console.log(response);
                app.content = response;
            }
        ).catch(
            function (error) {
                console.log(error);
            }
        );
}