package org.jchien.twitchbrowser.controller;

import com.google.protobuf.util.JsonFormat;
import org.jchien.twitchbrowser.StreamsRequest;
import org.jchien.twitchbrowser.StreamsResponse;
import org.jchien.twitchbrowser.TwitchBrowserClient;
import org.jchien.twitchbrowser.config.TwitchBrowserProperties;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.servlet.ModelAndView;

import java.util.HashMap;
import java.util.Map;

/**
 * @author jchien
 */
@Controller
public class BrowseController {
    private TwitchBrowserClient twibroClient;

    private String twitchApiClientId;

    @Autowired
    public BrowseController(TwitchBrowserClient twibroClient, TwitchBrowserProperties props) {
        this(twibroClient, props.getTwitchApiClientId());
    }

    private BrowseController(TwitchBrowserClient twibroClient, String twitchApiClientId) {
        this.twibroClient = twibroClient;
        this.twitchApiClientId = twitchApiClientId;
    }

    @RequestMapping(path = "/", method = RequestMethod.GET)
    public ModelAndView index() {
        final Map<String, Object> model = new HashMap<>();
        model.put("twitchApiClientId", twitchApiClientId);
        return new ModelAndView("main", model);
    }

    @RequestMapping(path = "/api/streams", method = RequestMethod.GET)
    public ResponseEntity<?> streams(@RequestParam(name="game") String game, @RequestParam(name="start") int start, @RequestParam(name="limit") int limit) {
        StreamsRequest request = StreamsRequest.newBuilder()
                .setGameName(game)
                .setStart(start)
                .setLimit(limit)
                .build();

        try {
            StreamsResponse response = twibroClient.getStreams(request);
            String json = JsonFormat.printer().includingDefaultValueFields().print(response);
            return ResponseEntity.ok(json);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}
