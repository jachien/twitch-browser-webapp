package org.jchien.twitchbrowser.controller;

import org.jchien.twitchbrowser.config.TwitchBrowserProperties;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.servlet.ModelAndView;

import javax.servlet.http.HttpServletRequest;
import java.util.Collection;
import java.util.HashMap;
import java.util.Map;

/**
 * @author jchien
 */
@Controller
public class FallbackController {
    private static final Logger LOG = LoggerFactory.getLogger(FallbackController.class);

    private Collection<String> externalScripts;

    private Collection<String> externalCss;

    @Autowired
    public FallbackController(TwitchBrowserProperties props) {
        this(props.getExternalScripts(), props.getExternalCss());
    }

    public FallbackController(Collection<String> externalScripts, Collection<String> externalCss) {
        this.externalScripts = externalScripts;
        this.externalCss = externalCss;
    }

    // 404 everything not handled elsewhere
    @RequestMapping("*")
    public ModelAndView fallbackHandler(HttpServletRequest request) throws Exception {
        LOG.warn("404: " + request.getRequestURI());
        final Map<String, Object> model = new HashMap<>();
        model.put("externalScripts", externalScripts);
        model.put("externalCss", externalCss);
        return new ModelAndView("404", model, HttpStatus.NOT_FOUND);
    }
}
