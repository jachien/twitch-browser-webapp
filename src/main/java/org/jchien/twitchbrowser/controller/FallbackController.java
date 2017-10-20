package org.jchien.twitchbrowser.controller;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.servlet.ModelAndView;

import javax.servlet.http.HttpServletRequest;

/**
 * @author jchien
 */
@Controller
public class FallbackController {
    private static final Logger LOG = LoggerFactory.getLogger(FallbackController.class);

    // 404 everything not handled elsewhere
    @RequestMapping("*")
    public ModelAndView fallbackHandler(HttpServletRequest request) throws Exception {
        LOG.warn("404: " + request.getRequestURI());
        return new ModelAndView("404", HttpStatus.NOT_FOUND);
    }
}
