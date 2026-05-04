package com.lms.common.aop;

import lombok.extern.slf4j.Slf4j;
import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.*;
import org.springframework.stereotype.Component;

@Aspect
@Component
@Slf4j
public class LoggingAspect {

    /**
     * Pointcut covers BOTH naming conventions used across services:
     *  - assessmentService / authService / certificateService / enrollmentService / userService -> "Services" (capital S)
     *  - courseService -> "service" (lowercase)
     * This way the same library works for every service without any change.
     */
    @Pointcut("execution(* com.lms.lms.Services..*(..)) || execution(* com.lms.lms.service..*(..))")
    public void serviceLayer() {}


    @Before("serviceLayer()")
    public void logBefore(org.aspectj.lang.JoinPoint joinPoint) {

        log.info(" Entering: {}",
                joinPoint.getSignature());

        log.info(" Arguments: {}",
                java.util.Arrays.toString(joinPoint.getArgs()));
    }

    @AfterReturning(pointcut = "serviceLayer()", returning = "result")
    public void logAfterReturning(org.aspectj.lang.JoinPoint joinPoint, Object result) {

        log.info(" Completed: {}", joinPoint.getSignature());

        log.info(" Response: {}", result);
    }


    @Around("serviceLayer()")
    public Object logExecutionTime(ProceedingJoinPoint joinPoint) throws Throwable {

        long start = System.currentTimeMillis();

        Object result = joinPoint.proceed();

        long time = System.currentTimeMillis() - start;

        log.info(" Execution time of {} :: {} ms",
                joinPoint.getSignature(),
                time);

        return result;
    }


    @AfterThrowing(pointcut = "serviceLayer()", throwing = "ex")
    public void logException(org.aspectj.lang.JoinPoint joinPoint, Exception ex) {

        log.error("Exception in {}",
                joinPoint.getSignature());

        log.error(" Message: {}", ex.getMessage());
    }
}
