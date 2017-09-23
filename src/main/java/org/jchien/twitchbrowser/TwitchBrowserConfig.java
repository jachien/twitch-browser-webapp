package org.jchien.twitchbrowser;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**
 * @author jchien
 */
@Configuration
@ConfigurationProperties(prefix="twibro")
public class TwitchBrowserConfig {

    private String serviceHost;

    private int servicePort;

    public String getServiceHost() {
        return serviceHost;
    }

    public void setServiceHost(String serviceHost) {
        this.serviceHost = serviceHost;
    }

    public int getServicePort() {
        return servicePort;
    }

    public void setServicePort(int servicePort) {
        this.servicePort = servicePort;
    }

    @Bean(name="twitchBrowserClient")
    public TwitchBrowserClient getClient() {
        return new TwitchBrowserClient(serviceHost, servicePort);
    }
}
