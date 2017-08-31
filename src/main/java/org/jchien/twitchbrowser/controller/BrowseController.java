package org.jchien.twitchbrowser.controller;

import com.google.protobuf.InvalidProtocolBufferException;
import com.google.protobuf.util.JsonFormat;
import org.jchien.twitchbrowser.StreamsRequest;
import org.jchien.twitchbrowser.StreamsResponse;
import org.jchien.twitchbrowser.TwitchBrowserClient;
import org.jchien.twitchbrowser.TwitchBrowserException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.*;
import org.springframework.web.bind.annotation.*;

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
    @ResponseBody
    String api(@RequestParam(name="game") String game, @RequestParam(name="start") int start, @RequestParam(name="limit") int limit) {
        StreamsRequest request = StreamsRequest.newBuilder()
                .setGameName(game)
                .setStart(start)
                .setLimit(limit)
                .build();

        try {
            StreamsResponse response = twibroClient.getStreams(request);
            return JsonFormat.printer().includingDefaultValueFields().print(response);
        } catch (TwitchBrowserException e) {
            return getStackTraceAsString(e);
        } catch (InvalidProtocolBufferException e) {
            return getStackTraceAsString(e);
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
