package com.lms.common.aop;

import org.aspectj.lang.JoinPoint;
import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.AfterReturning;
import org.aspectj.lang.annotation.AfterThrowing;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Before;
import org.aspectj.lang.annotation.Pointcut;
import org.aspectj.lang.reflect.MethodSignature;
import org.springframework.stereotype.Component;

import lombok.extern.slf4j.Slf4j;

@Aspect
@Component
@Slf4j
public class LoggingAspect {

    // ─── Pointcuts ────────────────────────────────────────────────────────────
    /**
     * Service layer – capital-S convention (auth, assessment, certificate,
     * enrollment, user)
     */
    @Pointcut("execution(* com.lms.lms.Services..*(..))")
    public void capitalSServices() {
    }

    /**
     * Service layer – lowercase-s convention (courseService)
     */
    @Pointcut("execution(* com.lms.lms.service..*(..))")
    public void lowercaseSServices() {
    }

    /**
     * Controller layer – covers all services
     */
    @Pointcut("execution(* com.lms.lms.Controller..*(..))")
    public void controllerLayer() {
    }

    /**
     * Repository layer
     */
    @Pointcut("execution(* com.lms.lms.Repo..*(..))")
    public void repoLayer() {
    }

    /**
     * Combined service pointcut
     */
    @Pointcut("capitalSServices() || lowercaseSServices()")
    public void serviceLayer() {
    }

    /**
     * All monitored layers
     */
    @Pointcut("serviceLayer() || controllerLayer()")
    public void allMonitored() {
    }

    @Pointcut("execution(* com.lms.lms.conig..*(..)) || execution(* com.lms.lms.config..*(..))")
    public void configLayer() {
    }

    // ─── Controller logging ───────────────────────────────────────────────────
    @Before("controllerLayer()")
    public void logControllerEntry(JoinPoint joinPoint) {
        MethodSignature sig = (MethodSignature) joinPoint.getSignature();
        String className = sig.getDeclaringType().getSimpleName();
        String methodName = sig.getName();
        String params = buildParamString(sig.getParameterNames(), joinPoint.getArgs());

        log.info("[CONTROLLER] --> {}.{}({})", className, methodName, params);
    }

    @AfterReturning(pointcut = "controllerLayer()", returning = "result")
    public void logControllerReturn(JoinPoint joinPoint, Object result) {
        MethodSignature sig = (MethodSignature) joinPoint.getSignature();
        String className = sig.getDeclaringType().getSimpleName();
        String methodName = sig.getName();

        log.info("[CONTROLLER] <-- {}.{} returned: {}",
                className, methodName, sanitize(result));
    }

    @AfterThrowing(pointcut = "controllerLayer()", throwing = "ex")
    public void logControllerException(JoinPoint joinPoint, Exception ex) {
        MethodSignature sig = (MethodSignature) joinPoint.getSignature();
        String className = sig.getDeclaringType().getSimpleName();
        String methodName = sig.getName();

        log.error("[CONTROLLER] !! {}.{} threw {}: {}",
                className, methodName,
                ex.getClass().getSimpleName(),
                ex.getMessage());
    }

    // ─── Service logging ──────────────────────────────────────────────────────
    @Around("serviceLayer()")
    public Object logServiceExecution(ProceedingJoinPoint pjp) throws Throwable {
        MethodSignature sig = (MethodSignature) pjp.getSignature();
        String className = sig.getDeclaringType().getSimpleName();
        String methodName = sig.getName();
        String params = buildParamString(sig.getParameterNames(), pjp.getArgs());

        log.info("[SERVICE] --> {}.{}({})", className, methodName, params);

        long start = System.currentTimeMillis();
        Object result;
        try {
            result = pjp.proceed();
        } catch (Throwable ex) {
            long elapsed = System.currentTimeMillis() - start;
            log.error("[SERVICE] !! {}.{} failed after {} ms – {}: {}",
                    className, methodName, elapsed,
                    ex.getClass().getSimpleName(), ex.getMessage());
            throw ex;
        }

        long elapsed = System.currentTimeMillis() - start;
        log.info("[SERVICE] <-- {}.{} completed in {} ms, returned: {}",
                className, methodName, elapsed, sanitize(result));

        return result;
    }

    // ─── Helpers ──────────────────────────────────────────────────────────────
    /**
     * Builds a readable "name=value, name=value" string from parameter names
     * and values. Masks sensitive fields like password.
     */
    private String buildParamString(String[] names, Object[] values) {
        if (names == null || names.length == 0) {
            return "";
        }
        StringBuilder sb = new StringBuilder();
        for (int i = 0; i < names.length; i++) {
            if (i > 0) {
                sb.append(", ");
            }
            String name = names[i] != null ? names[i] : "arg" + i;
            if (isSensitive(name)) {
                sb.append(name).append("=***");
            } else {
                sb.append(name).append("=").append(sanitize(values[i]));
            }
        }
        return sb.toString();
    }

    /**
     * Truncate long toString() values to keep logs readable.
     */
    private String sanitize(Object value) {
        if (value == null) {
            return "null";
        }
        String str = value.toString();
        return str.length() > 200 ? str.substring(0, 200) + "…" : str;
    }

    private boolean isSensitive(String name) {
        String lower = name.toLowerCase();
        return lower.contains("password") || lower.contains("secret")
                || lower.contains("token") || lower.contains("credential");
    }

    @Around("configLayer()")
    public Object logConfigExecution(ProceedingJoinPoint pjp) throws Throwable {
        MethodSignature sig = (MethodSignature) pjp.getSignature();
        String className = sig.getDeclaringType().getSimpleName();
        String methodName = sig.getName();

        log.info("[CONFIG] --> {}.{}() starting", className, methodName);

        long start = System.currentTimeMillis();
        Object result;
        try {
            result = pjp.proceed();
        } catch (Throwable ex) {
            log.error("[CONFIG] !! {}.{}() failed – {}: {}",
                    className, methodName,
                    ex.getClass().getSimpleName(), ex.getMessage());
            throw ex;
        }

        long elapsed = System.currentTimeMillis() - start;
        log.info("[CONFIG] <-- {}.{}() completed in {} ms", className, methodName, elapsed);
        return result;
    }
}
