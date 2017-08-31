package org.jchien.twitchbrowser;

import org.springframework.boot.autoconfigure.EnableAutoConfiguration;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**
 * @author jchien
 */
@Configuration
@EnableAutoConfiguration
public class TwitchBrowserConfig {
    @Bean
    public TwitchBrowserClient getClient() {
        return new TwitchBrowserClient("localhost", 62898);
    }
}
