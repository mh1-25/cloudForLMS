# lmsCommonLib

Shared library for the LMS microservices. Centralizes everything that was duplicated across
`assessmentService`, `authService`, `certificateService`, `courseService`, `enrollmentService`,
and `userService`.

## What's inside

| Package                          | Class                       | Replaces in services                                 |
|----------------------------------|-----------------------------|------------------------------------------------------|
| `com.lms.common.security`        | `JwtUtils`                  | `com.lms.lms.security.JwtUtils`                      |
| `com.lms.common.security`        | `JwtAuthenticationFilter`   | `com.lms.lms.security.JwtAuthenticationFilter`       |
| `com.lms.common.aop`             | `LoggingAspect`             | `com.lms.lms.AOP.LoggingAspect`                      |
| `com.lms.common.config`          | `SecurityConfig`            | `com.lms.lms.conig.SecurityConfig` / `com.lms.lms.config.SecurityConfig` |
| `com.lms.common.exception`       | `GlobalExceptionHandler`    | `com.lms.lms.Exception.GlobalExceptionHandler`       |
| `com.lms.common.dto`             | `ErrorResponse`             | `com.lms.lms.DTOS.ErrorResponse` / `com.lms.lms.DTO.ErrorResponse` |
| `com.lms.common.dto`             | `ValidationErrorResponse`   | `com.lms.lms.DTOS.ValidationErrorResponse` / `com.lms.lms.DTO.ValidationErrorResponse` |

## Build & install

From the `lmsCommonLib` directory:

```bash
mvn clean install
```

This installs `com.lms:lmsCommonLib:0.0.1-SNAPSHOT` into your local Maven repo (`~/.m2`)
so every service can pick it up.

## How services use it

Services don't need to add `@ComponentScan` or any extra config — `lmsCommonLib` ships an
`@AutoConfiguration` class registered through
`META-INF/spring/org.springframework.boot.autoconfigure.AutoConfiguration.imports`,
so Spring Boot picks up `JwtUtils`, `JwtAuthenticationFilter`, `SecurityConfig`,
`LoggingAspect`, and `GlobalExceptionHandler` automatically as soon as the JAR is on the
classpath.

Each service just adds the dependency and deletes its local duplicates.

## Notes on the consolidation

- **`LoggingAspect` pointcut** — handles BOTH naming conventions found across services
  (`com.lms.lms.Services..*` for most services, `com.lms.lms.service..*` for `courseService`).
  No service-side change needed.
- **`JwtAuthenticationFilter`** — added a defensive null-check around the
  `System.out.println` of authorities so it doesn't NPE when the request is unauthenticated.
  Behavior on the auth path is identical to the originals.
- **`SecurityConfig`** — fixes the `conig` typo from the original packages by using
  `com.lms.common.config`.
- **`ErrorResponse` / `ValidationErrorResponse`** — single canonical location at
  `com.lms.common.dto`, replacing the `DTOS` vs `DTO` inconsistency.
