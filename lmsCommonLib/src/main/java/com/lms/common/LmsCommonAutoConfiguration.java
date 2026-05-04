package com.lms.common;

import com.lms.common.aop.LoggingAspect;
import com.lms.common.config.SecurityConfig;
import com.lms.common.exception.GlobalExceptionHandler;
import com.lms.common.security.JwtAuthenticationFilter;
import com.lms.common.security.JwtUtils;
import org.springframework.boot.autoconfigure.AutoConfiguration;
import org.springframework.context.annotation.Import;

/**
 * Auto-configuration entry point for lmsCommonLib.
 *
 * Any service that adds lmsCommonLib as a dependency will get all the shared beans
 * registered automatically — no need to add @ComponentScan or copy any class.
 *
 * If a service wants to OPT OUT of one of these (e.g. provide its own SecurityConfig),
 * just exclude it via:
 *     @SpringBootApplication(exclude = SecurityConfig.class)
 * or by simply not importing the bean inside @Import here in their own copy.
 */
@AutoConfiguration
@Import({
        JwtUtils.class,
        JwtAuthenticationFilter.class,
        SecurityConfig.class,
        LoggingAspect.class,
        GlobalExceptionHandler.class
})
public class LmsCommonAutoConfiguration {
}
