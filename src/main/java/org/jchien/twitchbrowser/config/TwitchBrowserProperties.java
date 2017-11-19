package org.jchien.twitchbrowser.config;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

import java.util.List;

/**
 * @author jchien
 */
@Component
@ConfigurationProperties(prefix="twibro")
public class TwitchBrowserProperties {

    private String serviceHost;

    private int servicePort;

    private String twitchApiClientId;

    private List<String> externalScripts;

    private List<String> externalCss;

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

    public List<String> getExternalScripts() {
        return externalScripts;
    }

    public void setExternalScripts(List<String> externalScripts) {
        this.externalScripts = externalScripts;
    }

    public List<String> getExternalCss() {
        return externalCss;
    }

    public void setExternalCss(List<String> externalCss) {
        this.externalCss = externalCss;
    }
}
