package org.jchien.twitchbrowser.controller;

import com.google.protobuf.util.JsonFormat;
import org.jchien.twitchbrowser.StreamsRequest;
import org.jchien.twitchbrowser.StreamsResponse;
import org.jchien.twitchbrowser.TwitchBrowserClient;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;

import java.io.PrintWriter;
import java.io.StringWriter;

/**
 * @author jchien
 */
@Controller
public class BrowseController {
    @Autowired
    private TwitchBrowserClient twibroClient;

    @RequestMapping(path = "/", method = RequestMethod.GET)
    String index() {
        return "main";
    }

    @RequestMapping(path = "/api", method = RequestMethod.GET)
    ResponseEntity<?> api(@RequestParam(name="game") String game, @RequestParam(name="start") int start, @RequestParam(name="limit") int limit) {
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

    private String getStackTraceAsString(Throwable t) {
        StringWriter w = new StringWriter();
        t.printStackTrace(new PrintWriter(w));
        return w.toString();
    }

    public TwitchBrowserClient getTwibroClient() {
        return twibroClient;
    }

    public void setTwibroClient(TwitchBrowserClient twibroClient) {
        this.twibroClient = twibroClient;
    }
}
