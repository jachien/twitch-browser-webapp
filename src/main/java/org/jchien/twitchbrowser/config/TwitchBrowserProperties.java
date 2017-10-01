package org.jchien.twitchbrowser.config;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

/**
 * @author jchien
 */
@Component
@ConfigurationProperties(prefix="twibro")
public class TwitchBrowserProperties {

    private String serviceHost;

    private int servicePort;

    private String twitchApiClientId;

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

    public String getTwitchApiClientId() {
        return twitchApiClientId;
    }

    public void setTwitchApiClientId(String twitchApiClientId) {
        this.twitchApiClientId = twitchApiClientId;
    }
}
