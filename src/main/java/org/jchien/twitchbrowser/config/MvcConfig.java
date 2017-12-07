package org.jchien.twitchbrowser.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.http.CacheControl;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurerAdapter;
import org.springframework.web.servlet.resource.VersionResourceResolver;

import java.util.concurrent.TimeUnit;

/**
 * @author jchien
 */
@Configuration
public class MvcConfig extends WebMvcConfigurerAdapter {
    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        addResourceHandler(registry, "/js/**", "classpath:/static/js/");
        addResourceHandler(registry, "/css/**", "classpath:/static/css/");
        addResourceHandler(registry, "/html/**", "classpath:/static/html/");
    }

    private void addResourceHandler(ResourceHandlerRegistry registry, String pathPattern, String resourceLocation) {
        registry.addResourceHandler(pathPattern)
                .addResourceLocations(resourceLocation)
                .setCacheControl(CacheControl.maxAge(365, TimeUnit.DAYS))
                .resourceChain(true)
                .addResolver(new VersionResourceResolver().addContentVersionStrategy("/**"));
    }
}
