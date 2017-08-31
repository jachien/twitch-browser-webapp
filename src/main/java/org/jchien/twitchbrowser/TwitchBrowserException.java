package org.jchien.twitchbrowser;

/**
 * @author jchien
 */
public class TwitchBrowserException extends Exception {
    public TwitchBrowserException() {
    }

    public TwitchBrowserException(String message) {
        super(message);
    }

    public TwitchBrowserException(String message, Throwable cause) {
        super(message, cause);
    }

    public TwitchBrowserException(Throwable cause) {
        super(cause);
    }

    public TwitchBrowserException(String message, Throwable cause, boolean enableSuppression, boolean writableStackTrace) {
        super(message, cause, enableSuppression, writableStackTrace);
    }
}
