package org.jchien.twitchbrowser;

import io.grpc.ManagedChannel;
import io.grpc.ManagedChannelBuilder;
import io.grpc.StatusRuntimeException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import org.jchien.twitchbrowser.TwitchBrowserServiceGrpc.TwitchBrowserServiceBlockingStub;
import org.jchien.twitchbrowser.TwitchBrowserServiceGrpc.TwitchBrowserServiceStub;

import java.util.concurrent.TimeUnit;

/**
 * @author jchien
 */
public class TwitchBrowserClient {
    private static final Logger LOG = LoggerFactory.getLogger(TwitchBrowserClient.class);

    private final ManagedChannel channel;
    private final TwitchBrowserServiceBlockingStub blockingStub;
    private final TwitchBrowserServiceStub asyncStub;

    public TwitchBrowserClient(String host, int port) {
        this(ManagedChannelBuilder.forAddress(host, port).usePlaintext(true));
    }

    public TwitchBrowserClient(ManagedChannelBuilder<?> channelBuilder) {
        channel = channelBuilder.build();
        blockingStub = TwitchBrowserServiceGrpc.newBlockingStub(channel);
        asyncStub = TwitchBrowserServiceGrpc.newStub(channel);
    }

    public void shutdown() throws InterruptedException {
        channel.shutdown().awaitTermination(5, TimeUnit.SECONDS);
    }

    public StreamsResponse getStreams(StreamsRequest request) throws TwitchBrowserException {
        try {
            return blockingStub.getStreams(request);
        } catch (StatusRuntimeException e) {
            throw new TwitchBrowserException("RPC failed: " + e.getStatus(), e);
        }
    }

    public PopularGamesResponse getPopularGames(PopularGamesRequest request) throws TwitchBrowserException {
        try {
            return blockingStub.getPopularGames(request);
        } catch (StatusRuntimeException e) {
            throw new TwitchBrowserException("RPC failed: " + e.getStatus(), e);
        }
    }

    public static void main(String[] args) throws InterruptedException {
        TwitchBrowserClient client = new TwitchBrowserClient("localhost", 62898);
        System.out.println("starting request");
        try {
            StreamsRequest request = StreamsRequest.newBuilder()
                    .setGameName("PLAYERUNKNOWN'S BATTLEGROUNDS")
                    .setLimit(25)
                    .build();
            StreamsResponse response = client.getStreams(request);
            System.out.println(response);
        } catch (TwitchBrowserException e) {
            e.printStackTrace();
        } finally {
            client.shutdown();
        }
    }
}
