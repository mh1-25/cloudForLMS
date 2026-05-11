package com.lms.lms.routes;

import org.springframework.cloud.gateway.server.mvc.filter.BeforeFilterFunctions;
import org.springframework.cloud.gateway.server.mvc.handler.GatewayRouterFunctions;
import org.springframework.cloud.gateway.server.mvc.handler.HandlerFunctions;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.function.RequestPredicates;
import org.springframework.web.servlet.function.RouterFunction;
import org.springframework.web.servlet.function.ServerResponse;

@Configuration
public class Routes {

    @Bean
    public RouterFunction<ServerResponse> authServiceRoute() {
        return GatewayRouterFunctions.route("auth-service")
                .route(
                        RequestPredicates.path("/api/auth/**"),
                        HandlerFunctions.http()
                )
                .before(BeforeFilterFunctions.uri("http://auth-service:8080"))
                .build();
    }

    @Bean
    public RouterFunction<ServerResponse> userServiceRoute() {
        return GatewayRouterFunctions.route("user-service")
                .route(
                        RequestPredicates.path("/api/admin/**")
                                .or(RequestPredicates.path("/api/internal/users/**")),
                        HandlerFunctions.http()
                )
                .before(BeforeFilterFunctions.uri("http://user-service:8081"))
                .build();
    }

    @Bean
    public RouterFunction<ServerResponse> courseServiceRoute() {
        return GatewayRouterFunctions.route("course-service")
                .route(
                        RequestPredicates.path("/api/courses/**")
                                .or(RequestPredicates.path("/api/lessons/**"))
                                .or(RequestPredicates.path("/api/categories/**")),
                        HandlerFunctions.http()
                )
                .before(BeforeFilterFunctions.uri("http://course-service:8082"))
                .build();
    }

    @Bean
    public RouterFunction<ServerResponse> assessmentServiceRoute() {
        return GatewayRouterFunctions.route("assessment-service")
                .route(
                        RequestPredicates.path("/api/quizzes/**")
                                .or(RequestPredicates.path("/api/quizzes-exams/**"))
                                .or(RequestPredicates.path("/api/questions/**")),
                        HandlerFunctions.http()
                )
                .before(BeforeFilterFunctions.uri("http://assessment-service:8083"))
                .build();
    }

    @Bean
    public RouterFunction<ServerResponse> enrollmentServiceRoute() {
        return GatewayRouterFunctions.route("enrollment-service")
                .route(
                        RequestPredicates.path("/api/enrollments/**"),
                        HandlerFunctions.http()
                )
                .before(BeforeFilterFunctions.uri("http://enrollment-service:8084"))
                .build();
    }

    @Bean
    public RouterFunction<ServerResponse> certificateServiceRoute() {
        return GatewayRouterFunctions.route("certificate-service")
                .route(
                        RequestPredicates.path("/api/certificates/**"),
                        HandlerFunctions.http()
                )
                .before(BeforeFilterFunctions.uri("http://certificate-service:8085"))
                .build();
    }
}