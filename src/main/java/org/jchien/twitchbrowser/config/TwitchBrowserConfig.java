package org.jchien.twitchbrowser.config;

import org.jchien.twitchbrowser.TwitchBrowserClient;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**
 * @author jchien
 */
@Configuration
public class TwitchBrowserConfig {

    private TwitchBrowserProperties props;

    @Autowired
    public TwitchBrowserConfig(TwitchBrowserProperties props) {
        this.props = props;
    }

    @Bean
    public TwitchBrowserClient getTwitchBrowserClient() {
        return new TwitchBrowserClient(props.getServiceHost(), props.getServicePort());
    }
}
